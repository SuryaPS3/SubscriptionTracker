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
        }});
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }};

export const signIn = (req,res)=>{res.send("Sign in route")};

export const signOut = (req,res)=>{res.send("Sign out route")};

export const createUser = (req,res)=>{res.send("Create a new user")};

export const authenticateUser = (req,res)=>{res.send("Authenticate user and return token")};

export const loginIn = (req,res)=>{res.send("Login route")};