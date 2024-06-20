// Tag Document Schema
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, max: 100 },
});

module.exports = mongoose.model('Tag', tagSchema);