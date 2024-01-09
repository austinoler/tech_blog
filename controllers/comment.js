const { Comment } = require('../models');

const commentController = {
  // Create comment route handler
  createComment: async (req, res) => {
    try {
      const { text, postId } = req.body;

      const newComment = await Comment.create({
        text,
        postId,
        userId: req.session.user_id, // Assuming you have user authentication middleware
      });

      res.status(201).json(newComment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  },

  // Update comment route handler
  updateComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;

      const updatedComment = await Comment.update(
        { text },
        { where: { id, userId: req.session.user_id } }
      );

      if (updatedComment[0] === 0) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
      }

      res.status(200).json({ message: 'Comment updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update comment' });
    }
  },

  // Delete comment route handler
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedComment = await Comment.destroy({
        where: { id, userId: req.session.user_id },
      });

      if (!deletedComment) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
      }

      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  },
};

module.exports = commentController;
