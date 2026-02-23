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

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.userId.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to access this resource');
            error.statusCode = 401;
            throw error;
        }

        // Create update object excluding userId (prevent unauthorized changes)
        const { userId, ...updateData } = req.body;

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            data: updatedSubscription
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.statusCode = 404;
            throw error;
        }

        if (subscription.userId.toString() !== req.user._id.toString()) {
            const error = new Error('You are not authorized to access this resource');
            error.statusCode = 401;
            throw error;
        }

        await subscription.deleteOne();

        res.status(200).json({ success: true, message: 'Subscription deleted successfully' });
    } catch (error) {
        next(error);
    }
};
