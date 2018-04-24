const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    title: {
        type: String,
        required: true
    },
    body: String,
    location: String,
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('events', EventSchema)