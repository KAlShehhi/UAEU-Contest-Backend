import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModle.js';


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

const adminProtect = asyncHandler(async (req, res, next) => {
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
    if(user.role != 'ADMIN'){
        return res.status(401).json({
            message: 'Not an admin'
        });
    }
    next();
});

export {
    protect,
    adminProtect
};
