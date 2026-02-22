import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req,res,next)=>{
    try{
        const subscription = new Subscription({
            ...req.body,
            user: req.user._id
        });
        
        res.status(201).json({success: true, message: 'Subscription created successfully', data: subscription});
    }catch(error){
        next(error);
    }
}

