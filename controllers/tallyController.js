import asyncHandler from 'express-async-handler';
import User from '../models/userModle.js';
import Activity from '../models/activityModle.js';
import UserRegisterActivity from '../models/userRegisterActivityModel.js';
import UserAttendance from '../models/userAttendanceModel.js';


//  @desc   Get the top 20 users 
//  @route  GET /api/tally/getTop20/
//  @access Public
const getTop20 = asyncHandler(async (req, res) => {
    try {
        const topUsers = await User.find({role: 'USER'})
            .sort({ points: -1 }) 
            .limit(20) 
            .select('firstName lastName points');  
        const topUsersWithPlace = topUsers.map((user, index) => ({
            ...user.toObject(), 
            place: index + 1   
        }));

        res.status(200).json(topUsersWithPlace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export  {
    getTop20
}