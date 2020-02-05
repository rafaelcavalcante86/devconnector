const request = require('request');
const config = require('config');
const { validationResult } = require('express-validator');

const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');

class ProfileController {

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async getUserProfile(req, res) {

        try {
    
            const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
    
            if (!profile) {
                return res.status(400).json({ errors: [{ msg: 'User has no profile' }] });
            }
    
            res.json(profile);
    
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
    static async createUpdateProfile(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
    
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;
    
        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
    
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;
    
        try {
    
            let profile = await Profile.findOne({ user: req.user.id });
    
            // Update
            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields }, 
                    { new: true }
                );
    
                return res.json(profile);
            }
    
            // Create
            profile = new Profile(profileFields);
            await profile.save();
    
            res.json(profile);
    
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
    static async getAllProfiles(req, res) {

        try {
    
            const profiles = await Profile.find().populate('user', ['name', 'avatar']);
            res.json(profiles);
    
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
    static async getProfileByUserId(req, res) {

        try {
    
            const profile = await Profile.findOne({ user: req.params.userId }).populate('user', ['name', 'avatar']);
            if (!profile) {
                return res.status(400).json({ errors: [{ msg: "Profile not found" }] });
            }
    
            res.json(profile);
    
        } catch (err) {
            console.error(err.message);
    
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: "Profile not found" }] });
            }
            
            res.status(500).send('Server error');
        }
    
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteProfile(req, res) {

        try {
    
            // Remove user posts
            await Post.deleteMany({ user: req.user.id });
    
            // Remove profile
            await Profile.findOneAndRemove({ user: req.user.id }).populate('user', ['name', 'avatar']);
    
            // Remove profile
            await User.findOneAndRemove({ _id: req.user.id }).populate('user', ['name', 'avatar']);
     
    
            res.json({ msg: "User deleted" });
    
        } catch (err) {
            console.error(err.message);
    
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: "Profile not found" }] });
            }
            
            res.status(500).send('Server error');
        }
    
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async addProfileExperience(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {

            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);

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
    static async deleteProfileExperience(req, res) {

        try {

            const profile = await Profile.findOne({ user: req.user.id });

            // Get remove index
            const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.expId);

            profile.experience.splice(removeIndex, 1);

            await profile.save();

            res.json(profile);

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
    static async addProfileEducation(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try {

            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile);

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
    static async deleteProfileEducation(req, res) {

        try {

            const profile = await Profile.findOne({ user: req.user.id });

            // Get remove index
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.eduId);

            profile.education.splice(removeIndex, 1);

            await profile.save();

            res.json(profile);

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
    static async getGithubRepositories(req, res) {

        try {

            const options = {
                uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
                method: 'GET',
                headers: { 'user-agent': 'node.js' }
            };

            request(options, (error, response, body) => {
                if (error) console.error(error.message);

                if (response.statusCode !== 200) {
                    return res.status(404).json({ errors: [{ msg: 'No Github profile found.' }] });
                }

                res.json(JSON.parse(body));

            });

            // const profile = await Profile.findOne({ user: req.user.id });

            // // Get remove index
            // const removeIndex = profile.education.map(item => item.id).indexOf(req.params.eduId);

            // profile.education.splice(removeIndex, 1);

            // await profile.save();

            // res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

    }

}

module.exports = ProfileController;