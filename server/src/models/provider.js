const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

const providerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 8 // correct field validator
    },
    address:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,  // using string to enforce digit count
        required:true,
        minlength:10,
        maxlength:10 // ensures exactly 10 digits
    },
    rating:{
        type:String,
        default: "0"
    },
    isAuthorized:{
        type:Boolean,
        default:true
    },
    providerLogo:{
        type:String
    }
})

// Pre-save hook to hash the password if modified
providerSchema.pre("save", async function(next){
    const provider = this;
    if(!provider.isModified("password")){
        return next();
    }
    provider.password = await bcrypt.hash(provider.password, 10);
    next();
});

// Method to generate JWT token for a provider
providerSchema.methods.generateJwtToken = function(){
    console.log("here")
    return jwt.sign({id: this._id}, "1234", {expiresIn: '5d'});
}

module.exports = mongoose.model('providers', providerSchema)
