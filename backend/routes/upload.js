const express = require("express");
const multer = require("multer");
const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.status(200).json({ message: "File uploaded successfully!", filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file" });
  }
});

module.exports = router; 
