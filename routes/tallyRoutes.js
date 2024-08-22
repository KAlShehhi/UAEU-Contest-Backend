const router = express.Router();
import express from 'express';
import {
    getTop20,
} from '../controllers/tallyController.js';


router.get('/getTop20', getTop20);


export default router;
