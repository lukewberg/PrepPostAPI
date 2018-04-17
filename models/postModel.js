const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemplateAttachmentSchema = new Schema({
    name: String,
    data: Buffer,
    type: String
})

const PostSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [{
        body: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userSchema'
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('posts', PostSchema);