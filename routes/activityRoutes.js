const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth')
const {
    getActivity,
    getCoachActivities,
    getRegistered,
    createActivity,
    updateActivity,
    deleteActivity
} = require('../controllers/activityController');


router.post('/create', protect, createActivity);
router.get('/getCoachActivities/:id', getCoachActivities);
router.put('/update/:id', protect, updateActivity);
router.delete('/delete/:id', protect, deleteActivity);



module.exports = router;