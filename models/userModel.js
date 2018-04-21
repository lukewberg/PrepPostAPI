const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        require: true,
        select: false
    },
    rank: {
        // Must be either student, teacher, moderator, or administrator
        type: String,
        required: true,
        enum: ['admin', 'moderator', 'teacher', 'student'],
        default: 'student'
    },

    class: {
        type: String,
        required: true
        
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', UserSchema);