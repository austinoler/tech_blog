// Import necessary packages and modules
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Create Express.js app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up session
const sess = {
  secret: 'your-secret-key',
  cookie: {
    maxAge: 60000, // Set the session to expire after a certain time of inactivity
  },
  resave: false,
  saveUninitialized: true,
  rolling: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Set up Handlebars.js as the view engine
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware for parsing JSON and URLencoded request data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static directory
app.use(express.static(path.join(__dirname, 'public')));

// Implement user authentication middleware
const withAuth = (req, res, next) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    next();
  }
};

// Apply authentication middleware to specific routes
app.use('/dashboard', withAuth);

// Use routes defined in the controllers
app.use(routes);

// Sync Sequelize models and start Express.js app
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});
