import asyncHandler from 'express-async-handler';
import User from '../models/userModle.js';
import Activity from '../models/activityModle.js';
import UserRegisterActivity from '../models/userRegisterActivityModel.js';
import UserAttendance from '../models/userAttendanceModel.js';
import moment from 'moment';


//  @desc   Create activity
//  @route  POST /api/activity/create/
//  @access Private
const createActivity = asyncHandler(async(req, res) => {
    const {userId, name, type, building, room, campus, time, date, expectedAttendees } = req.body;
    if(!name || !type || !building || !room || !campus || !time || !date || !expectedAttendees){
        return res.status(400).json({
            message: 'Fill in all fields'
        });
    }
    try {
        const [month, day, year] =  date.split('/');
        const formattedMonth = month.padStart(2, '0');
        const formattedDay = day.padStart(2, '0');
        const formattedDateString = `${formattedMonth}/${formattedDay}/${year}`;
        const dateTimeString = `${formattedDateString}`;
        const dateObject = moment(dateTimeString, "DD/MM/YYYY hh:mm A").toDate();
        const user = await User.findById(userId);
        if(user.role != 'COACH'){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const getPonints = (type) => {
            let points = 0;
            switch(type){
                case 'Class':
                    points = 100
                    break;
                case 'Event':
                    points = 100
                    break;
                case 'Workshop':
                    points = 50
                    break;
                case 'Relaxation session':
                    points = 50
                    break;
            }
            return points
        }
        const activity = await Activity.create({
            name,
            type,
            building,
            room,
            campus: campus.toUpperCase(),
            time, 
            date: dateTimeString,
            dateObject: dateObject,
            coachId: userId,
            expectedAttendees,
            points: getPonints(type)
        })
        if(!activity){
            return res.status(500).json({
                message: "Error creating activity"
            });
        }
        return res.status(201).json({
            message: 'Activity created'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
});

//  @desc   Update activity
//  @route  PUT /api/activity/updateActivity/:id
//  @access Private
const updateActivity = asyncHandler(async(req, res) => {
    if(!req.params.id){ 
        return res.status(400).json({
            msg: 'No activity ID provided'
        });
    }
    const activityId = req.params.id
    const {userId, name, type, building, room, campus, time, date, expectedAttendees} = req.body;
    if(!name || !type || !building || !room || !campus || !time || !date || !expectedAttendees){
        return res.status(400).json({
            message: 'Fill in all fields'
        });
    }
    try {

        const activity = await Activity.findById(activityId);
        if(!activity){
            return res.status(404).json({
                message: 'Activity not found'
            });
        }
        if(activity.coachId != userId){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const user = await User.findById(userId);
        if(user.role != 'COACH'){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const [month, day, year] =  date.split('/');
        const formattedMonth = month.padStart(2, '0');
        const formattedDay = day.padStart(2, '0');
        const formattedDateString = `${formattedMonth}/${formattedDay}/${year}`;
        const dateTimeString = `${formattedDateString}`;
        const dateObject = moment(dateTimeString, "DD/MM/YYYY hh:mm A").toDate();
        const getPonints = (type) => {
            let points = 0;
            switch(type){
                case 'Class':
                    points = 100
                    break;
                case 'Event':
                    points = 100
                    break;
                case 'Workshop':
                    points = 50
                    break;
                case 'Relaxation session':
                    points = 50
                    break;
            }
            return points
        }
        const updatedActivity = await Activity.findByIdAndUpdate(activityId, {
            name,
            type,
            building,
            room,
            campus: campus.toUpperCase(),
            time, 
            date: dateTimeString,
            dateObject: dateObject,
            expectedAttendees,
            points: getPonints(type)
        })
        if(!updatedActivity){
            return res.status(500).json({
                message: "Error updating activity"
            });
        }
        return res.status(200).json({
            message: 'Activity updated'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
});

//  @desc   Delete activity
//  @route  DELETE /api/activity/delete/:id/
//  @access Private
const deleteActivity = asyncHandler(async(req, res) => {
    try {
        const { userId } = req.body;
        if(!req.params.id){ 
            return res.status(400).json({
                msg: 'No activity ID provided'
            });
        }
        const user = await User.findById(userId);
        if(user.role != 'COACH'){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const activity = await Activity.findById(req.params.id);
        if(!activity){
            return res.status(404).json({
                message: 'Activity not found'
            });
        }
        if(activity.coachId != userId){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const deletedActivity = await Activity.findByIdAndDelete(req.params.id);
        if(!deletedActivity){
            return res.status(500).json({
                message: 'Server error'
            });
        }
        return res.status(200).json({
            message: 'Activity deleted'
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
});

//  @desc   Get activity
//  @route  GET /api/activity/get/:id
//  @access Public
const getActivity = asyncHandler(async(req, res) => {
    if(!req.params.id){ 
        return res.status(400).json({
            msg: 'No activity ID provided'
        });
    }
    try {
        const activityId = req.params.id
        const activity = await Activity.findById(activityId);
        if(!activity){
            return res.status(400).json({
                message: 'Activity does not exist'
            });
        }
        return res.status(200).json({
            activity
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
});

//  @desc   Get all activities for coach
//  @route  GET /api/activity/get/:id
//  @access Public
const getCoachActivities = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            msg: 'No user ID provided'
        });
    }
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: 'User does not exist'
            });
        }
        if (user.role !== 'COACH') {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        const activities = await Activity.find({ coachId: userId });
        // Get today's date and set the time to 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const now = new Date(); // current time
        const completed = [];
        const upcoming = [];
        activities.forEach(activity => {
            const activityDate = new Date(activity.dateObject);
            const activityObject = activity.toObject();
            // Convert campus enum to readable format
            if (activityObject.campus === 'MALE') {
                activityObject.campus = 'Male';
            } else if (activityObject.campus === 'FEMALE') {
                activityObject.campus = 'Female';
            }
            // Check if the activity date is today or in the future
            if (activityDate < today) {
                completed.push(activityObject);
            } else {
                const daysUntil = Math.ceil((activityDate - now) / (1000 * 60 * 60 * 24));
                activityObject.when = `In ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;
                upcoming.push(activityObject);
            }
        });

        return res.status(200).json({
            completed,
            upcoming
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
});

//  @desc   Mark a user's attendance
//  @route  POST /api/activity/markAttendance/
//  @access Private
const markAttendance = asyncHandler(async (req, res) => {
    const { scannedVale, userId } = req.body;
    console.log(123);
    try {
        // Check user role
        const user = await User.findById(userId);
        if (user.role !== 'COACH') {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        // Split scanned value
        const [scannedUserId, activityId] = scannedVale.split("-");
        // Check if user already scanned
        const alreadyScanned = await UserAttendance.find({ userId: scannedUserId, activityId: activityId });
        if (alreadyScanned.length > 0) {
            return res.status(403).json({
                message: 'User already scanned'
            });
        }

        // Check if activity exists
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(400).json({
                message: 'Activity does not exist'
            });
        }

        // Check if scanned user exists
        const scannedUser = await User.findById(scannedUserId);
        if (!scannedUser) {
            return res.status(400).json({
                message: 'User does not exist'
            });
        }

        // Update coach points
        const updatedUser = await User.findById(scannedUserId);
        if (!updatedUser) {
            return res.status(400).json({
                message: 'User does not exist'
            });
        }
        
        updatedUser.points += activity.points;
        await updatedUser.save();

        // Create new attendance record
        const newAttendance = await UserAttendance.create({
            userId: scannedUserId,
            activityId: activityId
        });

        if (!newAttendance) {
            return res.status(500).json({
                message: 'Failed to create attendance record'
            });
        }

        return res.status(200).json({
            message: 'Attendance marked successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});


//  @desc   Register a user to an activity
//  @route  POST /api/activity/registerUser/
//  @access Private
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { userId, activityId } = req.body;
        if (!activityId) {
            return res.status(400).json({
                message: 'No activity ID provided'
            });
        }
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(400).json({
                message: 'Activity does not exist'
            });
        }
        const alreadyRegistered = await UserRegisterActivity.findOne({ userId, activityId });
        if (alreadyRegistered) {
            return res.status(400).json({
                message: 'User already registered'
            });
        }
        if(activity.attendees + 1 > activity.expectedAttendees){
            return res.status(400).json({
                message: 'Full'
            });
        }
        const registerUser = await UserRegisterActivity.create({ userId, activityId });
        const updatedActivity = await Activity.findByIdAndUpdate(activityId, {
            attendees: activity.attendees+1
        })
        if (!registerUser) {
            return res.status(500).json({
                error: 'Failed to register user'
            });
        }

        if(!updatedActivity){
            return res.status(500).json({
                error: 'Failed to register user'
            });

        }
        return res.status(200).json({
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
});

//  @desc   Get all activities that the user has not registered for
//  @route  POST /api/activity/getUnregisterdActivites/
//  @access Private
const getUnregisterdActivites = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const registeredActivities = await UserRegisterActivity.find({ userId }).select('activityId');
        const registeredActivityIds = registeredActivities.map(ra => ra.activityId);
        const unregisteredActivities = await Activity.find({
            _id: { $nin: registeredActivityIds },
            dateObject: { $gte: today }
        }).populate('coachId', 'firstName lastName');
        const activitiesWithCoachName = unregisteredActivities.map(activity => {
            const coachName = `${activity.coachId.firstName} ${activity.coachId.lastName}`;
            return { ...activity._doc, coachName };
        });
        return res.status(200).json(activitiesWithCoachName);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
});


//  @desc   Get all activities that the user has registered for
//  @route  POST /api/activity/getRegisteredActivities/
//  @access Private
const getRegisteredActivities = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;

        // Find all activities the user has registered for
        const registeredActivities = await UserRegisterActivity.find({ userId }).populate({
            path: 'activityId',
            populate: {
                path: 'coachId',
                select: 'firstName lastName'
            }
        });

        // Check if the user has attended each activity
        const activitiesWithAttendance = await Promise.all(
            registeredActivities.map(async (ra) => {
                const activity = ra.activityId;

                // Check if the user has attended this activity
                const attendanceRecord = await UserAttendance.findOne({
                    userId,
                    activityId: activity._id
                });

                const coachName = `${activity.coachId.firstName} ${activity.coachId.lastName}`;
                return { 
                    ...activity._doc, 
                    coachName, 
                    attended: !!attendanceRecord // Set attended to true if a record exists, otherwise false
                };
            })
        );

        return res.status(200).json(activitiesWithAttendance);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message
        });
    }
});

export {
    getActivity,
    getCoachActivities,
    markAttendance,
    createActivity,
    updateActivity,
    deleteActivity,
    registerUser, 
    getUnregisterdActivites,
    getRegisteredActivities
};
