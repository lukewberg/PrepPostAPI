const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')
const color = require('colors')
const modAuth = require('../middleware/modAuth')
const userAuth = require('../middleware/userAuth')

const post = new postController()

router.route('/')
    .get(userAuth, post.getAll)
    .post(userAuth, post.post)
    .delete(modAuth, post.delete)

router.route('/update/:_id')
    .patch(userAuth, post.update)

router.route('/comment/:_id')
    .post(userAuth, post.comment)

module.exports = router;