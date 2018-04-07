const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PrepPosts', PostSchema);