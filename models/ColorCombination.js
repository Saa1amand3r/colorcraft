import { Schema, model, models } from 'mongoose';

const ColorCombinationSchema = new Schema({
    hex1: {type:String, required: true},
    r1: { type: Number, required: true },
    g1: { type: Number, required: true },
    b1: { type: Number, required: true },
    hex2: {type:String, required: true},
    r2: { type: Number, required: true },
    g2: { type: Number, required: true },
    b2: { type: Number, required: true },
}, {
    timestamps: true
});

const ColorCombination = models.ColorCombination || model('ColorCombination', ColorCombinationSchema);

export default ColorCombination;
