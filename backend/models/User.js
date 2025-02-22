import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    uuid: { type: String, required: true, unique: true },
    data: {
        section: Number,
        maxSections: Number,
        uuid: String,
        raw: [String],
        data: {
            type: Map,
            of: Schema.Types.Mixed
        },
        done: Boolean
    }
});

export default model('User', UserSchema);
