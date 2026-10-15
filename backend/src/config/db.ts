import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB verbunden - yalla!');
    } catch (err) {
        console.error('MongoDB Verbindungsfehler:', err);
        process.exit(1);
    }
};
