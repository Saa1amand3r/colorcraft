import { Schema, model, models } from 'mongoose';

const QuestionSchema = new Schema({
    color1: { type: String, required: true },
    color2: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: { type: Number, required: true }  // New field to store userId
}, {
    timestamps: true
});

const Question = models.Question || model('Question', QuestionSchema);

export default Question;
