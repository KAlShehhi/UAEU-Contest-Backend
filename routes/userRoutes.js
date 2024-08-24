import express from 'express';
const router = express.Router();
import {
    verifyToken,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    changeAvatar,
    getUser,
    getUserRole,
    forgetPassword,
    submitResetCode,
    resetPassword
} from '../controllers/userController.js';

router.post('/verifyToken',verifyToken);
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/submitResetCode',submitResetCode);
router.post('/resetPassword',resetPassword);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser)
router.get('/getUser/:id', getUser)
router.get('/getUserRole/:id', getUserRole)
router.get('/changeAvatar/:id', changeAvatar)
router.get('/forgetPassword/:email', forgetPassword)


export default router;
