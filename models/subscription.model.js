import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Subscription name is required'],
        trim: true,
        minlength: [3,'Subscription name must be at least 3 characters long'],
        maxlength: [50,'Subscription name must be less than 50 characters long']
    },
    price:{
        type: Number,
        required: [true,'Subscription price is required'],
        min: [0,'Subscription price must be a positive number']         
    },
    currency:{
        type: String,
        enum:['USD','EUR','GBP','INR'],
        default:'INR',
        trim: true,
        uppercase: true,
        match: [/^[A-Z]{3}$/, 'Please use a valid 3-letter currency code']
    },
    frequency:{
        type: String,
        enum:['daily','weekly','monthly','yearly']
    },
    category:{
        type: String,
        enum:['entertainment','sports','music','finance','education','health','other'],
        required: [true,'Subscription category is required']
    },
    status:{
        type: String,
        enum:['active','inactive','cancelled'],
        default:'active'    
    },
    startDate:{
        type: Date,
        required: [true,'Subscription start date is required'],
        validate:{
            validator: (value)=> value <= new Date(),
            message: 'Subscription start date cannot be in the future'
        }  
    },
    endDate:{
        type: Date,
        validate:{
            validator: function(value){
                return !value || value > this.startDate;
            },
            message: 'Subscription end date must be after the start date'
        }
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,'Subscription must be associated with a user'],
        index: true
    }
},{
    timestamps: true
})

//Auto-calculate endDate based on frequency
subscriptionSchema.pre('save', function(){
    if(this.isModified('frequency') || this.isModified('startDate')){
        const startDate = this.startDate || new Date();
        let endDate;
        switch(this.frequency){
            case 'daily':
                endDate = new Date(startDate.getTime() + 24*60*60*1000);
                break;
            case 'weekly':
                endDate = new Date(startDate.getTime() + 7*24*60*60*1000);
                break;
            case 'monthly':
                endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
                break;
            case 'yearly':
                endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
                break;
            default:
                endDate = null;
        }
        this.endDate = endDate;
    }
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;