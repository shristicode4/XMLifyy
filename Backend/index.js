const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const xmlbuilder = require("xmlbuilder");
const authRoutes = require("./routes/auth.route.js");
const connectDB = require("./lib/db.js");
require("./lib/db");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const cors = require("cors");
//const port = 3000;

const port = process.env.PORT || 3000;
// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit the process if the database connection fails
  });

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/auth", authRoutes);

// Ensuring "uploads" and "files" folders exist
const uploadDir = path.join(__dirname, "uploads");
const filesDir = path.join(__dirname, "files");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir, { recursive: true });

//setting up of the file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/convertFile", upload.single("file"), async (req, res, next) => {
  console.log("📩 Request received!");

  if (!req.file) {
    console.log("❌ No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("✅ File received:");
  console.log("   - Original Name:", req.file.originalname);
  console.log("   - Saved As:", req.file.filename);
  console.log("   - Path:", req.file.path);
  console.log("   - MIME Type:", req.file.mimetype);
  try {
    // Read the saved PDF file
    const pdfBuffer = fs.readFileSync(req.file.path);

    //parse PDF Text
    const data = await pdfParse(pdfBuffer);
    const text = data.text.trim();

    // Convert text to XML
    const xml = xmlbuilder.create("document");
    xml.ele("content", text);

    // Convert XML to string
    const xmlString = xml.end({ pretty: true });

    // Define XML output file path
    let xmlOutPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname.replace(/\.pdf$/i, ".xml")}`
    );

    // Save XML to file
    fs.writeFileSync(xmlOutPath, xmlString, "utf8");

    console.log("✅ XML file saved at", xmlOutPath);

    // Respond with file download link
    res.json({
      message: "File converted successfully",
      downloadUrl: `/download/${path.basename(xmlOutPath)}`,
      xmlContent: xmlString,
    });
  } catch (error) {
    console.error("❌ Error processing PDF:", error);
    res.status(500).json({ error: "Error processing PDF" });
  }
});

// XML file download

app.get("/download/:filename", (req, res) => {
  const xmlOutPath = path.join(__dirname, "files", req.params.filename);

  // Check if file exists before download
  if (!fs.existsSync(xmlOutPath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(xmlOutPath, (err) => {
    if (err) {
      console.error("❌ Download error:", err);
      res.status(500).json({ message: "Error downloading file" });
    } else {
      console.log("✅ File downloaded:", xmlOutPath);
    }
  });
});

//server start
app.listen(port, () => {
  console.log(`🚀 server running on http://localhost:${port}`);
});
