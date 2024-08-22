const router = express.Router();
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getActivity,
    getCoachActivities,
    markAttendance,
    createActivity,
    updateActivity,
    deleteActivity,
    registerUser,
    getUnregisterdActivites,
    getRegisteredActivities
} from '../controllers/activityController.js';



router.post('/create', protect, createActivity);
router.post('/registerUser', protect, registerUser);
router.post('/markAttendance', protect, markAttendance);
router.get('/getCoachActivities/:id', getCoachActivities);
router.post('/getUnregisterdActivites', protect, getUnregisterdActivites);
router.post('/getRegisteredActivities', protect, getRegisteredActivities);
router.put('/update/:id', protect, updateActivity);
router.delete('/delete/:id', protect, deleteActivity);



export default router;
