const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Please add a name"] 
    },
    email: { 
        type: String, 
        required: [true, "Please add an email"], 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: [true, "Please add a password"], 
        select: false 
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user" 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
}, { 
    timestamps: true 
});

// NO pre-save hook here - password hashing will be done in controller

module.exports = mongoose.model("User", userSchema);
