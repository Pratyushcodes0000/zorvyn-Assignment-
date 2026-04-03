const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI environment variable is not set');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        
        // Testing the connection
        await mongoose.connection.db.admin().ping();
        console.log(' Database connection test successful');
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;

