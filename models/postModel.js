const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemplateAttachmentSchema = new Schema({
    name: String,
    data: Buffer,
    type: String
})

const PostSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    content: String,
    attachments: [TemplateImgSchema]
},
    {timestamps: true});

module.exports = mongoose.model('PrepPosts', PostSchema);