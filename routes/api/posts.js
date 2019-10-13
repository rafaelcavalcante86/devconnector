const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');

const PostController = require('../../controllers/post.controller');

/**
 * @route POST api/posts
 * @desc Create post
 * @access Private
 */
router.post('/', [auth, [
    check('text', 'Test is required').not().isEmpty()
]], PostController.createPost);

module.exports = router;
