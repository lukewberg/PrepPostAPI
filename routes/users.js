const express = require('express');
const router = express.Router();
const modAuth = require('../middleware/modAuth')
const userAuth = require('../middleware/userAuth')
const usersController = require('../controllers/users')

var users = new usersController()

/* GET users listing. */
router.route('/signup')
  .post(users.signup)

router.route('/login')
  .post(users.login)

router.route('/delete')
  .delete(modAuth, users.delete)

router.route('/find')
  .get(users.findAll)

router.route('/update')
  .patch(userAuth, users.update)

router.route('/message')
  .post(userAuth, users.sendMessage)
  .get(userAuth, users.getMessages)

module.exports = router;