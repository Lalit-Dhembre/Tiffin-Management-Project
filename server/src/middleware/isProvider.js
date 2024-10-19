const providerModel = require('../models/provider');
const jwt = require('jsonwebtoken');

exports.isProvider = async (req, res, next) => {
    try {
        // Check if the authorization header exists and starts with 'Bearer'
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Extract the token from the header
            const token = req.headers.authorization.split(" ")[1];

            // Verify the token
            const decodeData = jwt.verify(token, "1234");

            // Find the provider by the ID stored in the token
            const provider = await providerModel.findById(decodeData.id);
            
            // If provider is found, attach it to the request object
            if (provider) {
                req.provider = provider;
                next(); // Proceed to the next middleware or route handler
            } else {
                return res.status(400).json({ message: "Provider not found. Invalid request." });
            }
        } else {
            return res.status(401).json({ message: "No token provided. Authorization denied." });
        }
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token. Authorization denied." });
        } else {
            console.log("isProvider")
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
