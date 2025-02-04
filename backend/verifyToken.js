const jwt = require('jsonwebtoken');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    // Get the token from cookies
    const token = req.cookies.token; // Or use the correct token name

    // Check if token is present
    if (!token) {
        return res.status(401).json("You are not authenticated!"); // Return error if no token
    }

    // Verify token
    jwt.verify(token, process.env.SECRET, (err, data) => {
        if (err) {
            // Handle token errors (expired, invalid)
            return res.status(403).json("Token is not valid or has expired!");
        }

        // Check if the token contains a valid userId
        if (!data._id) {
            return res.status(400).json("Invalid token data!");
        }

        // Attach userId to the request for downstream use
        req.userId = data._id;
        console.log("Token verified successfully:", data);

        // Continue with the request handling
        next();
    });
};

module.exports = verifyToken;
