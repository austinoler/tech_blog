const { User } = require('../models');
const bcrypt = require('bcrypt');

const userController = {
  // Signup route handler
  signup: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        password: hashedPassword,
      });

      // Set session after successful signup
      req.session.user_id = newUser.id;

      res.status(200).json(newUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to signup' });
    }
  },

  // Login route handler
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }

      // Set session after successful login
      req.session.user_id = user.id;

      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to login' });
    }
  },

  // Logout route handler
  logout: (req, res) => {
    // Destroy the session on logout
    req.session.destroy(() => {
      res.status(204).end();
    });
  },
};

module.exports = userController;
