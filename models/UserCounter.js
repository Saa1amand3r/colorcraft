import { Schema, model, models } from 'mongoose';

const UserCounterSchema = new Schema({
    lastUserId: { type: Number, required: true, default: 0 }
});

const UserCounter = models.UserCounter || model('UserCounter', UserCounterSchema);

export default UserCounter;
