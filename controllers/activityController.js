const asyncHandler = require('express-async-handler');
const User = require('../models/userModle');
const Activity = require('../models/activityModle');
const mongoose = require('mongoose')
const moment = require('moment');

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
        const now = new Date();
        const completed = [];
        const upcoming = [];
        activities.forEach(activity => {
            const activityDate = new Date(activity.dateObject);
            const activityObject = activity.toObject(); 
            if (activityObject.campus === 'MALE') {
                activityObject.campus = 'Male';
            } else if (activityObject.campus === 'FEMALE') {
                activityObject.campus = 'Female';
            }
            if (activityDate <= now) {
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

//  @desc   Get all activities that a user has registered too
//  @route  GET /api/activity/getRegistered/:id
//  @access Public
const getRegistered = asyncHandler(async(req, res) => {

});

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

module.exports = {
    getActivity,
    getCoachActivities,
    getRegistered,
    createActivity,
    updateActivity,
    deleteActivity
}