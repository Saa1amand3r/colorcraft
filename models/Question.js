import { Schema, model, models } from 'mongoose';

const QuestionSchema = new Schema({
    r1: { type: Number, required: true },
    g1: { type: Number, required: true },
    b1: { type: Number, required: true },
    r2: { type: Number, required: true },
    g2: { type: Number, required: true },
    b2: { type: Number, required: true },
    formal: { type: Number, required: true },
    informal: { type: Number, required: true },
    basic: { type: Number, required: true },
    extravagant: { type: Number, required: true },
    userId: { type: Number, required: true }  // New field to store userId
}, {
    timestamps: true
});

const Question = models.Question || model('Question', QuestionSchema);

export default Question;
