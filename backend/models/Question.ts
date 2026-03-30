import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    //TODO: es implementieren (jede Entity = neue .ts File in dem models ordner
    //      LG Chef
    question: {type: String, required: true},
    options: {type: [String], required: true},
    correct: {type: Number, required: true, min: 0, max: 3}
});

export const Question = mongoose.model('Question', QuestionSchema);