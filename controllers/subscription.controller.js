import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req,res,next)=>{
    try{
        const subscription = await Subscription.create({
            ...req.body,
            userId: req.user._id
        });
        res.status(201).json({success: true, message: 'Subscription created successfully', data: subscription});
    }catch(error){
        next(error);
    }
}

export const getUserSubscriptions = async (req,res,next)=>{
    try{
        if(req.user._id.toString()!==req.params.id.toString()){
            const error = new Error('You are not authorized to access this resource');
            error.statusCode = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({userId: req.params.id});
        res.status(200).json({success: true, data: subscriptions});
    }catch(error){
        next(error);
    }
}
