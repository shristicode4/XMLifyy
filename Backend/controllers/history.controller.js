const History = require("../models/history.model");

// Save conversion to DB
exports.saveHistory = async (req, res) => {
  try {
    const fileName = req.file.originalname;
    const convertedPath = `/uploads/${req.convertedFileName}`;

    const history = new History({
      originalFileName: fileName,
      convertedFilePath: convertedPath,
    });

    await history.save();
    res.status(201).json({ message: "Saved to history" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save history" });
  }
};

// Return all conversion history
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
