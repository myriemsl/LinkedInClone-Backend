const express = require('express');
const router = express.Router();
const authMiddelware = require('../Middelware/authMiddelware');
const Profile = require('../Models/Profile');
const User = require('../Models/User');
const Post = require('../Models/Post');
const { check, validationResult } =  require('express-validator');
require('dotenv').config();

// Get current user's profile  (Route: GET /profile/me)
router.get('/me', authMiddelware, async (req, res) => {
Profile.findOne({owner: req.userId}).populate('owner', ['name', 'avatar'])
        .then((profile) => res.status(201).send(profile))
        .catch((err) => {
            console.error(err.message);
            res.status(500).send({msg: "Server Error"});
        })
});

// Create profile (Route: POST /profile)
  router.post('/', [ authMiddelware,
         [ check('status', 'Status is required').not().isEmpty(),
           check('skills', 'Skills is required').not().isEmpty()
         ]
       ], async (req, res) => {
           const errors = validationResult(req);
           if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() });
          }

  let { company, website, location, status, skills, bio, githubusername, } = req.body; 
  let profileFields = {};
      profileFields.owner = req.userId;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (bio) profileFields.bio = bio;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) { 
        profileFields.skills = skills.split(',').map(skill => skill.trim());
      }        
  let profile = await Profile.findOne({ owner: req.userId });
      if (profile) {
          profile = await Profile.findOneAndUpdate(
            { owner: req.userId },
            { $set: profileFields },
            { new: true }
          );
          return res.json(profile);
        }
         profile = new Profile(profileFields);
         profile.save()
                .then((profile) => res.send(profile))
                .catch((err) => {
                  console.error(err.message);
                  res.status(500).send({msg: "Server Error"});
                })
    });
  
 // Get all profiles (Route: GET /profile)
 router.get('/', async (req, res) => {
    Profile.find().populate('owner', ['name', 'avatar'])
            .then((profiles) => res.send(profiles))
            .catch((err) => {
                console.error(err.message);
                res.status(500).send({msg: "Server Error"});
             })
    });

 // Get profile by user ID (Route: GET profile/user/:user_id )
  router.get('/user/:user_id', async (req, res) => {
   Profile.findOne({owner: req.params.user_id }).populate('owner', ['name', 'avatar'])
        .then((profile) => res.send(profile))
        .catch((err) => {
                console.error(err.message);
                res.status(500).send({msg: "Server Error"});
            })
  });

// Delete profile, user & posts (Route DELETE api/profile) 
  router.delete('/', authMiddelware, async (req, res) => {
    try {
        await Post.deleteMany({ owner: req.userId });
        await Profile.findOneAndRemove({ owner: req.userId });
        await User.findOneAndRemove({ _id: req.userId });
      res.json({ msg: 'User Removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

  // Add profile experience (Route: PUT /profile/experience)
  router.put('/experience', [ authMiddelware,
      [ check('title', 'Title is required').not().isEmpty(),
        check('company', 'degree is required').not().isEmpty(),
        check('from', 'From Date is required').not().isEmpty()
      ]
    ], async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) { 
        return res.status(400).json({ errors: errors.array() });
      }
      let { title, company, location, from, to, current, description } = req.body;
      let newExp = { title, company, location, from, to, current, description };  
      let profile = await Profile.findOne({ owner: req.userId });
       profile.experience.unshift(newExp);
       profile.save()
        .then((profile) => res.send(profile))
        .catch((err) => {
            console.error(err.message);
            res.status(500).send({msg: "Server Error"});
        })
    });
  
   // Delete experience from profile (Route: DELETE /profile/experience/:exp_id)
  router.delete('/experience/:exp_id', authMiddelware, async (req, res) => {
      let profile = await Profile.findOne({ owner: req.userId });
      let removeIndex = profile.experience
        .map(item => item.id).indexOf(req.params.exp_id);
      profile.experience.splice(removeIndex, 1);
       profile.save()
       .then((profile) => res.send(profile))
       .catch((err) => {
           console.error(err.message);
           res.status(500).send({msg: "Server Error"});
       })
  });

 // Add profile education (Route: PUT /profile/education) 

  router.put(
    '/education',
    [
        authMiddelware ,
      [
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
        check('from', 'From Date is required').not().isEmpty()
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      let {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
  
      let newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
  
      
        let profile = await Profile.findOne({ owner: req.userId });
  
        profile.education.unshift(newEdu);
  
        profile.save()
        .then((profile) => res.send(profile))
        .catch((err) => {
            console.error(err.message);
            res.status(500).send({msg: "Server Error"});
        })
        
    }
  );

// Delete education from profile (Route: DELETE /profile/education/:edu_id)
  router.delete('/education/:edu_id', authMiddelware, async (req, res) => {
    let profile = await Profile.findOne({ owner: req.userId });
    let removeIndex = profile.education
        .map(item => item.id).indexOf(req.params.edu_id);
      profile.education.splice(removeIndex, 1);
      profile.save()
      .then((profile) => res.send(profile))
      .catch((err) => {
          console.error(err.message);
          res.status(500).send({msg: "Server Error"});
      })
  });

module.exports = router;