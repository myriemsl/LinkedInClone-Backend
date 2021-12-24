const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddelware = require('../Middelware/authMiddelware');
const Post = require('../Models/Post');
const User = require('../Models/User');

// Create a post (Route: POST /posts)
router.post( "/", [authMiddelware, 
      [check('text', 'Text is required').not().isEmpty()]], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
    let owner = await User.findById(req.userId).select('-password');
    let newPost = new Post({
        text: req.body.text,
        name: owner.name,
        avatar: owner.avatar,
        owner: req.userId
    })
    newPost.save()
           .then((post) => res.status(201).send(post))
           .catch((err) => {
               console.error(err.message);
               res.status(500).send({msg: "Server Error"});
           });
});

// Get all posts (Route: GET /posts)
router.get('/', authMiddelware, (req, res) => {
        Post.find()
            .then((posts) => res.send(posts))
            .catch((err) => {
             console.error(err.message);
             res.status(500).send({ msg: "Server Error"});
            });
});

// Get post by ID /Private (Route: GET /posts/:id)
router.get("/:id", authMiddelware, (req, res) => {
    Post.findById(req.params.id)
    .then((post) => res.status(201).send(post))
      .catch((err) => {
        console.error(err.message);
        res.status(500).send({msg: "Server Error"});
    });
  });
 
// Delete a post (Route: DELETE a/posts/:id)
router.delete('/:id', authMiddelware, (req,res) => {
    Post.findById(req.params.id)
         .remove()
         .then(() => res.json({ msg: 'Post removed' }))
         .catch((err) => {
            console.error(err.message);
            res.status(500).send({msg: "Server Error"});
        });
});

// Like a post (Route: PUT /posts/like/:id)
 router.put('/like/:id', authMiddelware, async (req, res) => {
    let post = await Post.findById(req.params.id);
    if (post.likes.some(like => like.user.toString() === req.userId)) {
        return res.status(400).json({ msg: 'Post already liked' });
      }
    post.likes.unshift({ user: req.userId});
    post.save()
        .then((post) => res.json(post.likes))
        .catch((err) => {
            console.error(err.message);
            res.status(500).send({msg: "Server Error"});
        });
  });

  // Comment on a post (Route: POST posts/comment/:id)
  router.post('/comment/:id', [authMiddelware,
      [check('text', 'Text is required').not().isEmpty()]
    ], async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
        let owner = await User.findById(req.userId).select('-password');
        let post = await Post.findById(req.params.id);
        let newComment = {
          text: req.body.text,
          name: owner.name,
          avatar: owner.avatar,
          owner: req.userId
        };
        post.comments.unshift(newComment);
        post.save()
        .then((post) => res.json(post.comments))
        .catch((err) => {
            console.error(err.message);
            res.status(500).send({msg: "Server Error"});
        });
    });

module.exports = router;







