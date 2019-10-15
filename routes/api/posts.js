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
    check('text', 'Text is required').not().isEmpty()
]], PostController.createPost);

/**
 * @route GET api/posts
 * @desc Get all posts
 * @access Private
 */
router.get('/', auth, PostController.getAllPosts);

/**
 * @route GET api/posts/:postId
 * @desc Get post by id
 * @access Private
 */
router.get('/:postId', auth, PostController.getPostById);

/**
 * @route DELETE api/posts/:postId
 * @desc Delete post
 * @access Private
 */
router.delete('/:postId', auth, PostController.deletePost);

/**
 * @route PUT api/posts/like/:postId
 * @desc Like a post
 * @access Private
 */
router.put('/like/:postId', auth, PostController.likePost);

/**
 * @route PUT api/posts/unlike/:postId
 * @desc Dislike a post
 * @access Private
 */
router.put('/unlike/:postId', auth, PostController.unlikePost);

/**
 * @route POST api/posts/comment/:postId
 * @desc Add post comment
 * @access Private
 */
router.post('/comment/:postId', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], PostController.addPostComment);

/**
 * @route DELETE api/posts/comment/:postId/:commentId
 * @desc Delete post comment
 * @access Private
 */
router.delete('/comment/:postId/:commentId', auth, PostController.deletePostComment);

module.exports = router;
