const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
const fs = require('fs');
const path = require('path');
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({origin: "http://localhost:5173", credentials: true }));

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/bloggerdb", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database is connected successfully!");
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comment', commentRouter);


app.use('/images', express.static(path.join(__dirname, 'images')));
// Define the uploads directory path
const uploadDir = path.join(__dirname, 'images');

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the 'images' directory

// Define the multer storage engine
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, uploadDir); // Use the dynamically created 'images' directory
    },
    filename: (req, file, fn) => {
        // Ensure we have a valid filename (use a timestamp if `req.body.img` is not provided)
        const filename = req.body.img || Date.now() + '-' + file.originalname;
        fn(null, filename);
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Define the route for uploading the file
app.post("/api/uploads", upload.single("file"), (req, res) => {
    // Log the received data to verify
    console.log(req.body, req.file);

    // Check if the file was uploaded successfully
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({ message: "Image has been uploaded successfully!", imageUrl: `http://localhost:3000/images/${req.file.filename}` });
});

// Start the server
const startServer = async () => {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`App is running on port ${PORT}`);
    });
};

// Graceful Shutdown
process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    await mongoose.connection.close();
    process.exit(0);
});

startServer();
