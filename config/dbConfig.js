import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const mongoURI = process.env.MONGODB_URI;

const dbConnection = async ()=>{
    try {
        await mongoose.connect(mongoURI, {
            
        });
        console.log('MongoDB Connected...');

    } catch (err) {
        console.error(`Error connecting to database: ${err}`);
        console.log('error in db connection')
    }
}

export default {dbConnection, mongoURI}
