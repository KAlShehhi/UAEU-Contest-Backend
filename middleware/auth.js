const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModle');

const protect = asyncHandler(async (req, res, next) => {
    const {userId, token} = req.body;
    if(!token){
        return res.status(400).json({
            message: 'No token'
        });
    }
    if(!userId){
        return res.status(400).json({
            message: 'No user ID'
        });
    }
    //Check user
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message: 'User does not exist'
        })
    }
    //Check token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
    });
    next();
});

module.exports = {
    protect
}