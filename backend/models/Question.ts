import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    text:   { type: String, required: true },
    points: { type: Number, required: true },
});

const QuestionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['finance', 'mental_health', 'health_fitness']
    },
    text:    { type: String, required: true },
    options: { type: [OptionSchema], required: true },
});

export const Question = mongoose.model('Question', QuestionSchema);

export interface IOption extends Document{
    _id: string;
    text: string;
    points: number;
}

export interface IQuestion extends Document {
    _id: string;
    category: string;
    text: string;
    options: IOption[];
}
