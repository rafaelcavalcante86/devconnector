const request = require('request');
const config = require('config');
const { validationResult } = require('express-validator');

const Post = require('../models/Post');
const User = require('../models/User');

class PostController {

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async createPost(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();

            res.json(post);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async getAllPosts(req, res) {

        try {
    
            const posts = await Post.find().sort({ date: -1 });
            res.json(posts);
    
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async getPostById(req, res) {

        try {
    
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ errors: [{ msg: 'Post not found' }] });
            }

            res.json(post);
    
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: "Post not found" }] });
            }
            res.status(500).send('Server error');
        }

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async deletePost(req, res) {

        try {
    
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ errors: [{ msg: 'Post not found' }] });
            }

            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
            }

            await post.remove();


            res.json({ msg: 'Post removed' });
    
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: "Post not found" }] });
            }
            res.status(500).send('Server error');
        }

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async likePost(req, res) {

        try {
    
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ errors: [{ msg: 'Post not found' }] });
            }

            if (post.likes.filter(like => like.user.toString() === req.user.id).length) {
                return res.status(400).json({ errors: [{ msg: 'Post already liked' }] });
            }

            post.likes.unshift({ user: req.user.id });

            await post.save();

            res.json(post.likes);
    
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: "Post not found" }] });
            }
            res.status(500).send('Server error');
        }

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async unlikePost(req, res) {

        try {
    
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ errors: [{ msg: 'Post not found' }] });
            }

            // Get remove index
            const removeIndex = post.likes.map(like => like.user).indexOf(req.user.id);
            if (removeIndex === -1) {
                return res.status(404).json({ errors: [{ msg: 'Post has not been liked yet' }] });
            }

            post.likes.splice(removeIndex, 1);

            await post.save();

            res.json(post.likes);
    
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: "Post not found" }] });
            }
            res.status(500).send('Server error');
        }

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async addPostComment(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.postId);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);

            post.save();

            res.json(post.comments);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async deletePostComment(req, res) {

        try {
    
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ errors: [{ msg: 'Post not found' }] });
            }

            // Pull out comment
            const comment = post.comments.find(comment => comment.id === req.params.commentId);

            // Make sure comment exists
            if (!comment) {
                return res.status(404).json({ errors: [{ msg: 'Comment does not exist' }] });
            }

            // Check user
            if (comment.user.toString() !== req.user.id) {
                return res.status(404).json({ errors: [{ msg: 'User not authorized' }] });
            }

            // Get remove index
            const removeIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.commentId);
            if (removeIndex === -1) {
                return res.status(404).json({ errors: [{ msg: 'Comment not found' }] });
            }

            post.comments.splice(removeIndex, 1);

            await post.save();

            res.json(post.comments);
    
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: "Post not found" }] });
            }
            res.status(500).send('Server error');
        }

    }

}

module.exports = PostController;