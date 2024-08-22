const router = express.Router();
import express from 'express';
import { adminProtect } from '../middleware/auth.js';
import {
    clearPoints,
    makeCoach
} from '../controllers/adminContoller.js';


router.post('/clearPoints', adminProtect, clearPoints);
router.post('/makeCoach', adminProtect, makeCoach);


export default router;
