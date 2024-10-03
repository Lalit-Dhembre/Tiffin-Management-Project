const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

exports.isUser = async (req, res, next) => {    
    try {
        console.log("Checking authorization header..."); // Log the start of the middleware

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            console.warn("Unauthorized: No token provided or malformed header."); // Log warning for missing/malformed header
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token extracted:", token); // Log the extracted token

        // Verify the token
        let decodeData;
        try {
            decodeData = jwt.verify(token, process.env.JWT_SECRET || "1234"); // Use environment variable
            console.log("Token verified. Decoded data:", decodeData); // Log decoded data
        } catch (err) {
            console.error("Unauthorized: Invalid token", err); // Log error details for invalid token
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Find the user
        const user = await userModel.findById(decodeData.id);
        if (!user) {
            console.warn("User not found for ID:", decodeData.id); // Log warning if user not found
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user to the request object
        req.user = user;
        console.log("User authenticated:", user); // Log user information
        next();
    } catch (error) {
        console.error("Error in isUser middleware:", error); // Log error details
        return res.status(500).json({ success: false, message: error.message });
    }
};
