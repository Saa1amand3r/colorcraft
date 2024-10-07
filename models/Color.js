import { Schema, model, models } from 'mongoose';

const ColorSchema = new Schema({
    hex: {type:String, required: true},
    r: { type: Number, required: true },
    g: { type: Number, required: true },
    b: { type: Number, required: true },
    name: { type: String, required: true },
}, {
    timestamps: true
});

const Color = models.Color || model('Color', ColorSchema);

export default Color;
