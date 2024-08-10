const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name']
    },
    email: {
        type: String,
        required: [true, 'Please add a email']
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    points: {
        type: Number,
        required: false
    },
    validated: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum : ['USER', 'COACH', 'ADMIN'],
        required: true
    },
},{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);