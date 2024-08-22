import asyncHandler from 'express-async-handler';
import User from '../models/userModle.js';
import Activity from '../models/activityModle.js';
import UserRegisterActivity from '../models/userRegisterActivityModel.js';
import UserAttendance from '../models/userAttendanceModel.js';

//  @desc   Clear all points
//  @route  POST /api/admin/clearPoints/
//  @access Private
const clearPoints = asyncHandler(async (req, res) => {
    try {
        await User.updateMany({ role: 'USER' }, { $set: { points: 0 } });
        res.status(200).json({ message: 'Points cleared for all users with role USER' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


//  @desc   Change user role to COACH
//  @route  POST /api/admin/makeCoach/
//  @access Private
const makeCoach = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = 'COACH';
        await user.save();
        res.status(200).json({ message: `User role updated to COACH for ${email}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export {
    clearPoints,
    makeCoach
}