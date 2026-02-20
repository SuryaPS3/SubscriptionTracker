import User from '../models/user.model.js';

const getUsers = async (req, res, next)=>{
    try{
        const users = new User.find();

        if(!users){
            const error = new Error('No user found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success: true, data: users});

    }catch(error){
        next(error);
    }
}