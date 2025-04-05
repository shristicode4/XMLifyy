const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const xmlbuilder = require("xmlbuilder");
const authRoutes = require("./routes/auth.route.js");
const connectDB = require("./lib/db.js");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });

// ✅ History schema and model
const historySchema = new mongoose.Schema({
  originalFileName: String,
  xmlContent: String,
  convertedAt: { type: Date, default: Date.now },
});
const History = mongoose.model("History", historySchema);

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:10000",
  "https://xmlifyy-2.onrender.com", // Frontend Render domain
];

// ✅ CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// ✅ Middlewares
app.use(cors(corsOptions)); // Enable CORS
app.options("*", cors(corsOptions)); // Handle preflight OPTIONS
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data

// ✅ Routes
app.use("/auth", authRoutes);

// ✅ Ensure folders exist
const uploadDir = path.join(__dirname, "uploads");
const filesDir = path.join(__dirname, "files");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(filesDir)) fs.mkdirSync(filesDir, { recursive: true });

// Serves the 'uploads' folder so PDFs are publicly accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// ✅ PDF to XML conversion
app.post("/convertFile", upload.single("file"), async (req, res) => {
  console.log("📩 Request received!");

  if (!req.file) {
    console.log("❌ No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(pdfBuffer);
    const text = data.text.trim();

    const xml = xmlbuilder.create("document");
    xml.ele("content", text);
    const xmlString = xml.end({ pretty: true });

    const xmlOutPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname.replace(/\.pdf$/i, ".xml")}`
    );
    fs.writeFileSync(xmlOutPath, xmlString, "utf8");

    // ✅ Save to DB history
    await History.create({
      originalFileName: req.file.originalname,
      xmlContent: xmlString,
      //pdfUrl: `/uploads/${req.file.filename}`,
    });

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

// ✅ Download route
app.get("/download/:filename", (req, res) => {
  const xmlOutPath = path.join(__dirname, "files", req.params.filename);

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

// ✅ History route
app.get("/history", async (req, res) => {
  try {
    const allHistory = await History.find().sort({ convertedAt: -1 });
    res.json(allHistory);
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    res.status(500).json({ error: "Error fetching history" });
  }
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at port ${PORT}`);
});
