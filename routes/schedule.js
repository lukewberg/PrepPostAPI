const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const scheduleModel = require('../models/scheduleModel');
const mongoose = require('mongoose');
const color = require('colors')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/user-auth')
const config = require('../config.json')
const schedule = require('node-schedule')
const moment = require('moment')

let scheduleCache = null


scheduleFunctions = {

    getToday: function(req, res){
        res.status(200).json(scheduleCache)
    },

    get: function (req, res) {
        if (scheduleCache != null && scheduleCache.length > 0) {
            console.log('Using cached schedule JSON Object.'.green)
            res.status(200).json(scheduleCache)
        } else {
            scheduleModel.find({
                    date: req.body.date
                })
                .exec()
                .then(function (doc) {
                    if (doc.length > 0) {
                        res.status(200).json(doc)
                    } else {
                        res.status(200).json({
                            MESSAGE: 'No special schedule today.'
                        })
                    }
                })
                .catch(function (error) {
                    res.status(500).json({
                        ERROR: error.message
                    })
                })
        }
    },

    getAll: function (req, res) {
        scheduleModel.find()
            .then(function (doc) {
                res.status(200).json(doc)
            })
            .catch(function (error) {
                res.status(500).json({
                    ERROR: error
                })
            })
    },

    remove: function (req, res) {
        scheduleModel.findByIdAndRemove(req.body._id)
            .exec()
            .then(function (doc) {
                res.status(200).json(doc)
            })
            .catch(function (error) {
                res.status(500).json({
                    ERROR: error.message
                })
            })
    },

    update: function (req, res) {
        scheduleModel.findByIdAndUpdate(req.body._id, req.body)
            .exec()
            .then(function (doc) {
                res.status(200).json(doc)
            })
            .catch(function (error) {
                res.status(500).json({
                    ERROR: error.message
                })
            })
    },

    post: function (req, res) {

        if (scheduleCache != null && scheduleCache.length > 0 && scheduleCache[0].date == req.body.date) {
            res.status(500).json({
                ERROR: 'There is already a special schedule in effect!'
            })
        } else {
            scheduleModel.find({
                    date: req.body.date
                })
                .exec()
                .then(function (doc) {
                    if (doc.length > 0) {
                        console.log('Schedule ERROR: Can only have one special schedule per day!')
                        console.log('Loading schedule into cache.')
                        scheduleCache = doc
                        res.status(500).json({
                            ERROR: 'Only one special schedule is permissible per day!'
                        })
                    } else {
                        var schedule = new scheduleModel({
                            _id: mongoose.Types.ObjectId(),
                            title: req.body.title,
                            date: req.body.date,
                            periods: req.body.periods
                        })
                        schedule.save()
                            .then(function (doc) {

                                if (doc.date == req.body.date) {
                                    console.log('Loading new schedule into cache.')
                                    scheduleCache = doc
                                    res.status(201).json(doc)
                                } else {
                                    console.log('Future schedule added!')
                                    res.status(201).json(doc)
                                }
                            })
                            .catch(function (error) {
                                res.status(500).json({
                                    ERROR: error.message
                                })
                            })
                    }
                })
        }
    }
}

var rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [new schedule.Range(1, 5)]
rule.hour = 0
rule.minute = 0
rule.second = 0


var refreshSchedule = schedule.scheduleJob(rule, function () {
    var d1 = moment().format('MM-DD-YYYY')
    scheduleModel.find({
            date: d1
        })
        .exec()
        .then(function (doc) {
            if (doc.length != 0) {
                scheduleCache = doc
                console.log(doc)
                console.log('New day, loading special schedule.')
            } else {
                console.log('No schedule for today.'.cyan)
                const scheduleCache = null
            }
        })
        .catch(function (error) {
            console.log('Schedule loading error: ' + error.message.red)
        })
})

scheduleModel.find({
        date: moment().format('MM-DD-YYYY')
    })
    .exec()
    .then(function (doc) {
        if (doc.length != 0) {
            scheduleCache = doc
            console.log('Schedule loaded into cache!'.cyan)
            console.log(doc)
        } else {
            console.log('No special schedule found for today.'.cyan)
        }
    })

router.route('/')
    .get(authenticate, scheduleFunctions.get)
    .post(authenticate, scheduleFunctions.post)

router.route('/today')
    .get(authenticate, scheduleFunctions.getToday)

module.exports = router