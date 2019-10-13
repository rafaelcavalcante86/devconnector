const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');

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

/**
 * @route PUT api/profile/experience
 * @desc Add profile experience
 * @access Private
 */
router.put('/experience', [auth, [  
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]] , ProfileController.addProfileExperience);

/**
 * @route DELETE api/profile/experience/:expId
 * @desc Delete profile experience
 * @access Private
 */
router.delete('/experience/:expId', auth, ProfileController.deleteProfileExperience);

/**
 * @route PUT api/profile/education
 * @desc Add profile education
 * @access Private
 */
router.put('/education', [auth, [  
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
]] , ProfileController.addProfileEducation);

/**
 * @route DELETE api/profile/education/:eduId
 * @desc Delete profile education
 * @access Private
 */
router.delete('/education/:eduId', auth, ProfileController.deleteProfileEducation);

/**
 * @route GET api/profile/github/:username
 * @desc Get user repositories from github
 * @access Public
 */
router.get('/github/:username', ProfileController.getGithubRepositories);

module.exports = router;
