const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth')
const {
    getActivity,
    getCoachActivities,
    markAttendance,
    createActivity,
    updateActivity,
    deleteActivity,
    registerUser,
    getUnregisterdActivites,
    getRegisteredActivities
} = require('../controllers/activityController');


router.post('/create', protect, createActivity);
router.post('/registerUser', protect, registerUser);
router.post('/markAttendance', protect, markAttendance);
router.get('/getCoachActivities/:id', getCoachActivities);
router.post('/getUnregisterdActivites', protect, getUnregisterdActivites);
router.post('/getRegisteredActivities', protect, getRegisteredActivities);
router.put('/update/:id', protect, updateActivity);
router.delete('/delete/:id', protect, deleteActivity);



module.exports = router;