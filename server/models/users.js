const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {
        type: String,
        unique: true, 
        required: true, 
        validate: {
        validator: function(v) {
            return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true 
    },
    admin: {type: Boolean, default: false},
    reputation: {type: Number, default: 0},
    voted_q: [{type:mongoose.Schema.Types.ObjectId, ref:"Question"}],
    voted_a: [{type:mongoose.Schema.Types.ObjectId, ref:"Answer"}]
});



module.exports = mongoose.model('User', userSchema);