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
    getUserRole
} from '../controllers/userController.js';

router.post('/verifyToken',verifyToken);
router.post('/register',registerUser);
router.post('/login',loginUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser)
router.get('/getUser/:id', getUser)
router.get('/getUserRole/:id', getUserRole)
router.get('/changeAvatar/:id', changeAvatar)


export default router;
