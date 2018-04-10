var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var userModel = require('../models/userModel');
var mongoose = require('mongoose');
var color = require('colors')
var jwt = require('jsonwebtoken')

var userFunctions = {

  // This function will handle user login and will issue a token when successfully authenticated
  login: function (req, res) {
    userModel.find({
        email: req.body.email
      })
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
                _id: user[0]._id
              }, '**goforthandsettheworldonfire**', {
                expiresIn: '1h'
              }, function (error, token) {
                if (token) {
                  res.status(200).json({
                    MESSAGE: 'Authentication successful!',
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
          email: req.body.email,
          password: result
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
        _id: req.params.userID
      })
      .then(function (doc) {
        console.log('Successfully deleted user!'.green)
        res.status(200).json(doc)
      })
      .catch(function (error) {
        console.log(error.red)
        res.status(500).json(error.message)
      })
  }
}

/* GET users listing. */
router.route('/signup')
  .post(userFunctions.signup)

router.route('/login')
  .post(userFunctions.login)

router.route('/delete/:userID')
  .get(userFunctions.delete)

  module.exports = router;