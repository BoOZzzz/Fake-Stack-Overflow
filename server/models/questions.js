// Question Document Schema
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    text: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
    asked_by: { type: String, required: true, default: "Anonymous" },
    ask_date_time: { type: Date, default: new Date() },
    views: { type: Number, default: 0},
    votes: { type: Number, default: 0},
    summary: {type:String, required: true, max: 140},
});

module.exports = mongoose.model('Question', questionSchema);

