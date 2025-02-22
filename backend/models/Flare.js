import { Schema, model } from 'mongoose';

const FlareSchema = new Schema({
    section: { type: Integer, required: true },
    id: { type: String, required: true },
    raw: { type: String, required: true },
    data: { type: String, required: true, unique: true, match: /@dlsu\.edu\.ph$/ },
});

export default model('Flare', FlareSchema);
