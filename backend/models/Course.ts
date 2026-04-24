import mongoose from 'mongoose';
import { Router, type Request, type Response } from 'express';

const CourseSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    category:    { type: String, required: true },
    minPoints:   { type: Number, required: true },
    maxPoints:   { type: Number, required: true },
    description: String,
    link:        String
});

export const Course = mongoose.model('Course', CourseSchema);




