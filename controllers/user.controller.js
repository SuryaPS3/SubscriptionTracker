import User from '../models/user.model.js';

export const getUsers = async (req, res, next)=>{
    try{
        const users = await User.find().select('-password');

        if(!users){
            const error = new Error('No user found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success: true, data: users}) // Exclude password field

    }catch(error){
        next(error);
    }
}

export const getUserById = async (req, res, next)=>{
    try{
        const user = await User.findById(req.params.id).select('-password'); // Exclude password field
        
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success: true, data: user});
    }catch(error){
        next(error);
    }
}

export const updateUserProfile = async (req,res,next)=>{
    try{
        //check if user is updating their own profile
        if(req.user._id.toString()!==req.params.id.toString()){
            const error = new Error('You are not authorized to update this profile');
            error.statusCode = 401;
            throw error;
        }

        // remove senstivie fields from req.body
        const {password, email, ...updateData} = req.body;

        //if email update is requested, check if new email is already in use
        if(email && email !==req.user.email){
            const existingUser = await User.findOne({email});
            if(existingUser){
                const error = new Error('Email is already in use');
                error.statusCode = 400;
                throw error;
            }
            updateData.email = email; // allow email update if it's not in use
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {new : true}).select('-password');

        if(!updatedUser){
            const error = new Error ('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success:true,
            message:"Profile updated successfully",
            data : updatedUser
        });
    }catch(e){
        next(e);
    }
}

export const deleteUser = async (req,res,next)=>{
    try{
        //check if user is deleting their own profile
        if(req.user._id.toString()!==req.params.id.toString()){
            const error = new Error('You are not authorized to delete this profile');
            error.statusCode = 401;
            throw error;
        }
        const userId = req.params.id;

        //First, delete all user's subscriptions
        await Subscription.deleteMany({userId});

        //Then, delete the user
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if(!deletedUser){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success:true,
            message: 'User and associated subscriptions deleted successfully'
        })
    }catch(e){
        next(e);
    }
}