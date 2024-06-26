// Answer Document Schema
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: { type: String, required: true },
    ans_by: { type: String },
    ans_date_time: { type: Date, default: new Date() },
    votes: {type: Number, default: 0}
});

module.exports = mongoose.model('Answer', answerSchema);