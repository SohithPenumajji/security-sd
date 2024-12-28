const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  // Ensures unique username
    },
    password: {
        type: String,
        required: true,
    },
    failedAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model('User', UserSchema);
