import mongoose from 'mongoose';

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
        default: 0,
    },
    resetCode: {
        type: Number,
        default: 0,
    },
    allowResetPassword: {
        type: Boolean,
        default: false,
    },
    validated: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum : ['USER', 'COACH', 'ADMIN'],
        required: true
    },
},{
    timestamps: true
});

export default mongoose.model('User', UserSchema);
