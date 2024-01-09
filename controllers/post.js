const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');

// Define routes and route handlers
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });
    res.render('homepage', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['username'] },
        { model: Comment, include: [{ model: User, attributes: ['username'] }] },
      ],
    });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.render('post', { post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
});


module.exports = router;
