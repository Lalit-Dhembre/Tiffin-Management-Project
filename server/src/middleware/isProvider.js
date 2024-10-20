const jwt = require('jsonwebtoken');
const providerModel = require("../models/provider")

exports.isProvider = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            const decodeData = jwt.verify(token, "1234");
            
            console.log("Auth header:", req.headers.authorization)
            console.log("Token:", token)
            console.log("Decoded:", decodeData)

            const provider = await providerModel.findById(decodeData.id);
            
            if (provider) {
                req.provider = provider;
                next();
            } else {
                return res.status(400).json({ message: "Provider not found. Invalid request." });
            }
        } else {
            return res.status(401).json({ message: "No token provided. Authorization denied." });
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token. Authorization denied." });
        } else {
            console.log("isProvider", error)
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};