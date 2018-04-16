const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const postModel = require('../models/postModel');
const mongoose = require('mongoose');
const color = require('colors')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/user-auth')
const config = require('../config.json')

var postFunctions = {

    getAll: function (req, res) {
        postModel.find()
            .sort('-createdAt')
            .exec()
            .then(function (doc) {
                console.log('Successfully handled getAll query!'.green)
                res.status(200).json(doc)
            })
    },

    post: function (req, res) {
        var postModel = new Model({
            _id: new mongoose.Types.ObjectId(),
            postedBy: req.body.postedBy,
            title: req.body.title,
            content: req.body.content,
        })
        postModel.save()
            .then(function (doc) {
                console.log('Successfully handled postModel query!'.green)
                res.status(201).json(doc)
            })
            .catch(function (err) {
                console.log(err.message.red)
                res.status(500).json({
                    ERROR: err.message
                })
            })
    },

    delete: function (req, res) {

        postModel.remove({
                _id: req.params._id
            })
            .exec()
            .then(function (doc) {
                console.log('Successfully handled delete query!'.green)
                res.status(200).json(doc)
            })
            .catch(function (err) {
                console.log(err.message.red)
                res.status(404).json({
                    ERROR: err.message
                })
            })
    },
}

router.route('/')
    .get(authenticate, postFunctions.getAll)
    .post(authenticate, postFunctions.post)

module.exports = router;