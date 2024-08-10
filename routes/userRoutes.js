const express = require('express');
const router = express.Router();

const {
    verifyToken,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getUser,
    getUserRole
} = require('../controllers/userController');


router.post('/verifyToken',verifyToken);
router.post('/register',registerUser);
router.post('/login',loginUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser)
router.get('/getUser/:id', getUser)
router.get('/getUserRole/:id', getUserRole)


module.exports = router;