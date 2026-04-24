import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // 'finance', 'mental_health', etc.
    minPoints: { type: Number, required: true }, // z.B. 0
    maxPoints: { type: Number, required: true }, // z.B. 10
    description: String,
    link: String
});

export const Course = mongoose.model('Course', CourseSchema);