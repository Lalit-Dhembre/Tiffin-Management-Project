const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isAuthorized: {
        type: Boolean,
        default: false
    },
    providerLogo: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

providerSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
})

providerSchema.methods.generateJwtToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET || "1234",
        { expiresIn: '5d' }
    );
}

providerSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('Provider', providerSchema)