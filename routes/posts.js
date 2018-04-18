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

    comment: function (req, res) {
        postModel.findByIdAndUpdate(
                req.params._id, {
                    $push: {
                        'comments': {
                            body: req.body.body,
                            postedBy: req.body.postedBy
                        }
                    }
                }, {
                    new: true
                })
            .populate('comments.postedBy')
            .exec()
            .then(function (doc) {
                res.status(201).json(doc)
            })
            .catch(function (error) {
                res.status(500).json({
                    ERROR: error
                })
            })
    },

    getAll: function (req, res) {
        postModel.find()
            .sort('-createdAt')
            .lean().populate('comments.postedBy', 'firstName lastName email rank')
            .exec()
            .then(function (doc) {
                console.log('Successfully handled getAll query!'.green)
                res.status(200).json(doc)
            })
            .catch(function (error) {
                res.status(500).json({
                    ERROR: error.message
                })
            })
    },

    post: function (req, res) {
        var post = new postModel({
            _id: new mongoose.Types.ObjectId(),
            postedBy: req.body.postedBy,
            title: req.body.title,
            content: req.body.content,
        })
        post.save()
            .then(function (doc) {
                console.log('Successfully handled postModel query!'.green)
                res.status(201).json(doc.populate(postedBy))
            })
            .catch(function (error) {
                console.log(error.message.red)
                res.status(500).json({
                    ERROR: error.message
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
            .catch(function (error) {
                console.log(error.message.red)
                res.status(404).json({
                    ERROR: error.message
                })
            })
    },

    update: function (req, res) {

        Model.findByIdAndUpdate(req.params._id, req.body)
            .then(function (doc) {
                console.log('Successfully handled update query!'.green)
                res.status(200).json(doc)
            })
            .catch(function (error) {
                console.log(error.message.red)
                res.status(500).json({
                    ERROR: error.message
                })
            })
    }
}

router.route('/')
    .get(authenticate, postFunctions.getAll)
    .post(authenticate, postFunctions.post)

router.route('/:_id')
    .post(authenticate, postFunctions.comment)

module.exports = router;