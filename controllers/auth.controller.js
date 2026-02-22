import mongoose from 'mongoose';
import User from '../models/user.model.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

export const signUp = async (req,res,next)=>{
    
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const { username, email, password } = req.body;
        console.log("Received sign-up data:", { username, email });
        //check if already exists
        const existingUser = await User.findOne({ email});
        if(existingUser){
            const error = new Error('Email already in use');
            error.statusCode = 409;
            throw error;
        }

        //hashing a password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user
        const newUser = new User({
            name: username,
            email,
            password: hashedPassword
        });

        // Save the user to database
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        await session.commitTransaction();

        session.endSession();
            
        res.status(201).json({success: true, message: 'User created successfully',data:{
                user: {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email
                },
                token
        }
    });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);//forwarding to our error handling middleware
    }
};

export const signIn = async (req,res,next)=>{
    try{
        const { email, password } = req.body;

        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            const error = new Error('Email not found');
            error.statusCode = 404;
            throw error;
        }

        //compare password
        const passCompare = await bcrypt.compare(password, user.password);
        if(!passCompare){
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        //generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({success: true, message: 'User authenticated successfully', data:{
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        }});
    }catch(error){
        next(error);
    }
};

export const signOut = (req,res,next)=>{
    try{
        res.clearCookie('token');
        res.status(200).json({success: true, message: 'User signed out successfully'});
    }catch(e){
        next(e);
    }
};

