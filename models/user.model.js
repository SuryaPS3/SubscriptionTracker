import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'User name is required'],
        trim: true,
        minlength: [3,'User name must be at least 3 characters long'],
        maxlength: [50,'User name must be less than 50 characters long']
    },
    email: {
        type: String,
        required: [true,'User email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true,'User password is required'],
        minlength: [6,'User password must be at least 6 characters long']   
    }
})  

const User = mongoose.model('User', userSchema);

export default User;