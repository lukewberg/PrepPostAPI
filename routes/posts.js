const express = require('express');
const router = express.Router();
const postModel = require('../models/postModel');
const mongoose = require('mongoose');
const color = require('colors')


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
            .populate('postedBy')
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
            .lean().populate('postedBy', 'firstName lastName email rank')
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
                res.status(201).json(doc)
            })
            .catch(function (error) {
                console.log(error)
                res.status(500).json({
                    ERROR: error.message
                })
            })
    },

    delete: function (req, res) {

        postModel.remove({
                _id: req.body._id
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

        postModel.findByIdAndUpdate(req.params._id, req.body)
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
    .get(postFunctions.getAll)
    .post(postFunctions.post)
    .delete(postFunctions.delete)

router.route('/update/:_id')
    .patch(postFunctions.update)

router.route('/comment/:_id')
    .post(postFunctions.comment)

module.exports = router;