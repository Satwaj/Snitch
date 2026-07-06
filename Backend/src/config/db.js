
import mongoose from 'mongoose';
import {config} from './config.js';


const connectDB = async () => {
    console.log("MONGO_URI exists:", !!config.MONGO_URI);
    console.log("MONGO_URI starts with:", config.MONGO_URI?.substring(0, 20));

    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected");
};

export default connectDB
