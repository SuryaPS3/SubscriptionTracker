import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

export const authorize = async (req, res, next) =>{
    try{
        let token;

        // Check if the token is present in the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // Extract the token from the header
        } else if (req.cookies.token) { // Check if the token is present in cookies
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({success:false, message: 'Unauthorized access'});
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password'); // Exclude password field
        if(!user){
            return res.status(401).json({success:false, message: 'Unauthorized access'});
        }
        req.user = user;
        next();
    }catch(error){

        res.statusCode(401).json({success: false, message: 'Unauthorized access'});
    }
}