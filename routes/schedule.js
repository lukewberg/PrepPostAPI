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


scheduleFunctions = {

    get: function (req, res) {
        scheduleModel.find(req.body._id)
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
        schedule = new scheduleModel({
            _id: mongoose.Types.ObjectId(),
            date: req.body.date,
            periods: req.body.periods
        })
        schedule.save()
            .then(function (doc) {
                res.status(201).json(doc)
            })
            .catch(function (error) {
                res.status(500).json({
                    ERROR: error.message
                })
            })
    }
}

var rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [new schedule.Range(1, 5)]
rule.hour = 0
rule.minute = 0
rule.second = 0

var refreshSchedule = schedule.scheduleJob(rule, function () {
    scheduleModel.find({})
        .exec()
        .then(function (doc) {
            const scheduleCache = doc
            console.log('It/s a new day! Loading todays/s schedule!')
            console.log(doc)
        })
})

scheduleModel.find({})
    .exec()
    .then(function (doc) {
        const scheduleCache = doc
        console.log('Schedule loaded into cache!'.cyan)
    })

router.route('/')
    .get(authenticate, scheduleFunctions.getAll)
    .post(authenticate, scheduleFunctions.post)

module.exports = router