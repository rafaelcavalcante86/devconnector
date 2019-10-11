const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const ProfileController = require('../../controllers/profile.controller');



/**
 * @route GET api/profile/me
 * @desc Get current user's profile
 * @access Private
 */
router.get('/me', auth, ProfileController.getUserProfile);

/**
 * @route POST api/profile
 * @desc Create or update user profile
 * @access Private
 */
router.post('/', [auth, [
    check('status', 'Status is required.').not().isEmpty(),
    check('skills', 'Skills is required.').not().isEmpty()
]], ProfileController.createUpdateProfile);


/**
 * @route GET api/profile
 * @desc Get all profiles
 * @access Public
 */
router.get('/', ProfileController.getAllProfiles);


/**
 * @route GET api/profile/user/:userId
 * @desc Get profile by user id
 * @access Public
 */
router.get('/user/:userId', ProfileController.getProfileByUserId);


/**
 * @route DELETE api/profile
 * @desc Delete profile, user and posts
 * @access Private
 */
router.delete('/', auth, ProfileController.deleteProfile);


module.exports = router;
