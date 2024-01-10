const express = require('express');
const router = express.Router();
const { Post, Comment, User } = require('../models');
const withAuth = require('../middleware/authMiddleware');

// Create a new post
router.post('/api/posts', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.session.user_id,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts
router.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['text', 'createdAt', 'updatedAt'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve posts' });
  }
});

// Get a single post by ID
router.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['text', 'createdAt', 'updatedAt'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve post' });
  }
});

// Update a post by ID
router.put('/api/posts/:id', withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
          userId: req.session.user_id,
        },
      }
    );

    if (updatedPost[0] === 0) {
      res.status(403).json({ error: 'Unauthorized to update this post' });
      return;
    }

    res.status(200).json({ message: 'Post updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete a post by ID
router.delete('/api/posts/:id', withAuth, async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.session.user_id,
      },
    });

    if (!deletedPost) {
      res.status(403).json({ error: 'Unauthorized to delete this post' });
      return;
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;



module.exports = router;
