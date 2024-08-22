import asyncHandler from 'express-async-handler';
import validator from 'email-validator';
import jwt from 'jsonwebtoken';
import User from '../models/userModle.js';
import bcryptjs from 'bcryptjs';
import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection'
import generateToken from '../utils/generateToken.js'
import avatarGenerator from '../utils/avatarGenerator.js'



//  @desc   Verifiy token
//  @route  POST /api/user/verifyToken
//  @access Private
const verifyToken = asyncHandler(async (req, res) => {
    const token = req.body.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
            message: 'Invalid token',
            });
        }
        return res.status(200).json({
            message: 'Token verified',
            decoded,
        });
    });
});

//  @desc   Register user
//  @route  POST /api/user/register
//  @access Public
const registerUser = asyncHandler(async(req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }
        if (!validator.validate(email)) {
            return res.status(400).json({ message: 'Please enter a valid email' });
        }

        // Check if user exists
        const userExist = await User.findOne({ email: email.toLowerCase() });
        if (userExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Generate avatar
        const profilePicture = avatarGenerator();

        // Create new user
        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'USER',
            profilePicture
        });

        if (newUser) {
            return res.status(201).json({
                token: generateToken(newUser._id),
                userId: newUser._id
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


//  @desc   Login user
//  @route  POST /api/user/login
//  @access Public
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const userExist = await User.findOne({email: email.toLowerCase()});
    if(userExist && (await bcryptjs.compare(password, userExist.password))){
        return res.status(200).json({
            token: generateToken(userExist._id),
            userId: userExist._id,
            role: userExist.role
        })
    }else{
        return res.status(401).json({
            message: 'Invalid email or password'
        })
    }
});



//  @desc   Generate a new profile pic
//  @route  POST /api/user/changeAvatar/:id
//  @access Private
const changeAvatar = asyncHandler(async(req, res) => {
    try {
        // Generate a new avatar
        const profilePicture = avatarGenerator();
        // Update the user's profile picture in the database
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { profilePicture },
            { new: true } // Return the updated user object
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Profile picture updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


//  @desc   Update user
//  @route  PUT /api/user/update/:id
//  @access Private
const updateUser = asyncHandler(async(req, res) => {

});

//  @desc   Delete user
//  @route  DELETE /api/user/delete/:id
//  @access Private
const deleteUser = asyncHandler(async(req, res) => {

});

//  @desc   Delete user
//  @route  GET /api/user/getUser/:id
//  @access Public
const getUser = asyncHandler(async(req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if(user){
            return res.status(200).json({
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            });
        }else{
            return res.status(404).json({
                message: 'User does not exist'
            });
        }
    }catch(error){
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }
});

//  @desc   Delete user
//  @route  GET /api/user/getUserRole/:id
//  @access Public
const getUserRole = asyncHandler(async(req, res) => {
    const userId = req.params.id;
    try{
        
        const user = await User.findById(userId);
        if(user){
            return res.status(200).json({
                role: user.role
            });
        }else{
            return res.status(404).json({
                message: 'User does not exist'
            });
        }
    }catch(error){
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }
});

export {
    verifyToken,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    changeAvatar,
    getUser,
    getUserRole
};
