const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    date: Date,
    periods: [{
        period: String,
        startTime: Date,
        endTime: Date,
        duration: Number
    }]
})

module.exports = mongoose.model('schedule', ScheduleSchema)