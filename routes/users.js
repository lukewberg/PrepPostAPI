const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');
const color = require('colors')
const jwt = require('jsonwebtoken')
const config = require('../config')


const userFunctions = {

  getMessages: function (req, res) {
    userModel.findById(req.body._id)
      .exec()
      .then(function (doc) {
        res.status(200).json(doc.messages)
      })
      .catch(function (error) {
        res.status(500).json({
          ERROR: error.message
        })
      })
  },

  sendMessage: function (req, res) {
    userModel.findByIdAndUpdate(req.body._id, {
        $push: {
          'messages': {
            title: req.body.title,
            body: req.body.body,
            postedBy: req.body.postedBy
          }
        }
      }, {
        new: true
      })
      .exec()
      .then(function () {
        res.status(201).json({
          MESSAGE: 'Message Sent!'
        })
      })
      .catch(function (error) {
        res.status(500).json({
          ERROR: error.message
        })
      })
  },

  // This function takes the _id value of a user, and updates it's fields with the ones supplied in the payload
  update: function (req, res) {
    userModel.findByIdAndUpdate(req.params._id, req.body, {
        new: true
      })
      .then(function (doc) {
        console.log('Successfully handled up date query!'.green)
        res.status(200).json(doc)
      })
      .catch(function (err) {
        console.log(err.message.red)
        res.status(500).json({
          ERROR: err.message
        })
      })
  },

  // This function simply finds all users in the database and returns them in the response
  findAll: function (req, res) {
    userModel.find()
      .select('-messages -_id -__v -createdAt -updatedAt')
      .exec()
      .then(function (doc) {
        console.log('Successfully handled getAll query!'.green)
        res.status(200).json(doc)
      })
      .catch(function (err) {
        console.log(err.message.red)
        res.status(500).json({
          ERROR: err.message
        })
      })
  },

  // This function finds one user based on that users unique _id key
  findOne: function (req, res) {

    userModel.findById(req.body._id)
      .exec()
      .then(function (doc) {
        console.log('Successfully handled get query!'.green)
        res.status(200).json(doc)
      })
      .catch(function (err) {
        console.log(err.message.red)
        res.status(500).json({
          ERROR: err.message
        })
      })
  },

  // This function will handle user login and will issue a token when successfully authenticated
  login: function (req, res) {
    userModel.find({
        email: req.body.email
      })
      .select('+password')
      .exec()
      .then(function (user) {
        if (user.length < 1) {
          res.status(401).json({
            MESSAGE: 'Authentication failed!'
          })
        } else {
          bcrypt.compare(req.body.password, user[0].password, function (error, result) {
            if (result) {
              jwt.sign({
                email: user[0].email,
                _id: user[0]._id,
                rank: user[0].rank
              }, config.JWT_KEY, {
                expiresIn: '1h'
              }, function (error, token) {
                if (token) {
                  res.status(200).json({
                    MESSAGE: 'Authentication successful!',
                    _id: user[0]._id,
                    TOKEN: token
                  })
                } else {
                  res.status(500).json({
                    MESSAGE: 'Internal error!'
                  })
                }
              })
            } else {
              res.status(401).json({
                MESSAGE: 'Authentication failed!'
              })
            }
          })
        }
      })
      .catch(function (error) {
        res.status(500).json({
          ERROR: error.message
        })
      })
  },

  // This function adds a user after it has validated the email address and hashed the password
  signup: function (req, res) {
    bcrypt.hash(req.body.password, 10, function (error, result) {
      console.log(result)
      if (error) {
        console.log('Failed to salt password! Abort!'.red);
        res.status(500).json({
          ERROR: error
        });
      } else {
        var user = new userModel({
          _id: new mongoose.Types.ObjectId(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: result,
          rank: req.body.rank
        });
        user.save()
          .then(function (doc) {
            console.log('Successfully created new user!'.cyan);
            res.status(201).json(doc);
          })
          .catch(function (error) {
            console.log(error.message);
            res.status(500).json({
              ERROR: error.message
            })
          })
      }
    })
  },

  // This functiion deletes a user based solely on that users _id
  delete: function (req, res) {
    userModel.remove({
        _id: req.body._id
      })
      .then(function (doc) {
        console.log('Successfully deleted user!')
        res.status(200).json(doc)
      })
      .catch(function (error) {
        console.log(error.message.red)
        res.status(500).json(error.message)
      })
  }
}

/* GET users listing. */
router.route('/signup')
  .post(userFunctions.signup)

router.route('/login')
  .post(userFunctions.login)

router.route('/delete')
  .delete(userFunctions.delete)

router.route('/find')
  .get(userFunctions.findAll)

router.route('/update/:_id')
  .patch(userFunctions.update)

router.route('/message')
  .post(userFunctions.sendMessage)
  .get(userFunctions.getMessages)

module.exports = router;