var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var userModel = require('../models/userModel');
var mongoose = require('mongoose');
var color = require('colors')

var userFunctions = {

  // This function adds a userafter it has validated the email address and hashed the password
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

router.route('/delete/:userID')
  .get(userFunctions.delete)
module.exports = router;