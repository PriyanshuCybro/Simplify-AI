import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // Password Reset Token generate karne ke liye built-in node module

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    // Hum 'name' field bhi rakh rahe hain for Profile Display
    name: {
        type: String,
        required: [true, 'Please provide your full name'],
    },
    email: {
        type: String,
        required:[true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/ , 'Please provide a valid email']
    },
    password: {
        type: String,
        required:[true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    profileImage : {
        type: String,
        default: null
    },

    // 🚀 NEW: Personal & Professional Details (As per your request)
    age: {
        type: Number,
        min: [10, 'Minimum age should be 10'],
        max: [100, 'Maximum age limit exceeded']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    location: {
        type: String,
        trim: true
    },
    contact: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit contact number']
    },
    profession: {
        type: String,
        enum: ['Student', 'Employee', 'Freelancer', 'Educator'],
        default: 'Student'
    },
    purpose: {
        type: String,
        enum: ['Personal', 'Organization', 'Academic'],
        default: 'Personal'
    },

    // 🔐 Security: Password Reset Fields
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, {
    timestamps: true
});

// Hash Password before saving (Unchanged logic, just keeping it clean)
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

// 🛡️ NEW: Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
    // 1. Generate raw token (Ye email mein jayega)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash token and set to resetPasswordToken field (Ye DB mein jayega)
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 3. Set expire time (10 minutes)
    // ⚠️ Dhyan dein: Agar controller mein 'resetPasswordExpire' use kiya hai, 
    // toh yahan bhi wahi naam rakhein.
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

    return resetToken;
};
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;