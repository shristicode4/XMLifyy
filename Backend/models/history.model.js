const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  originalFileName: { type: String, required: true },
  convertedFilePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
