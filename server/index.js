'use strict';

// imports
const express = require('express');
const morgan = require('morgan');
const {check, validationResult} = require('express-validator');
const cors = require('cors');
const dao = require('./pc-dao');
const userDao = require('./user-dao');

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// init
const app = express();
const port = 3001;

// set up middlewares
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/* ROUTES */
// GET /api/pages
app.get('/api/pages', (request, response) => {
  dao.listPages()
  .then(pages => response.json(pages))
  .catch(() => response.status(500).end());
});

// GET /api/pages/created-pages/<id>
app.get('/api/pages/created-pages/:id', async(req, res) => {
  try {
    const page = await dao.getPage(req.params.id);
    const page_content = await dao.getContentPage(req.params.id);
    if(page.error)
      res.status(404).json(page);
    else
      res.json([page, page_content]);
  } catch {
    res.status(500).end();
  }
});

// GET /api/creator/:id/created-pages
app.get('/api/pages/:id/created-pages', async (req, res) => {
  try {
    const content = await dao.getContent();
    const createdpages = await dao.listCreatedPagesOf();
    
    res.json([createdpages, content]);
  } catch {
    res.status(500).end();
  }
});


// POST /api/pages/:id/created-pages
app.post('/api/pages/:id/created-pages', [
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const newCreatedPage = req.body;
  const userId = req.params.id;
  const user = await userDao.getUserById(userId);
  const author = user.name;

  try {
    const id = await dao.addCreatedPage(newCreatedPage, userId, author);
    res.status(201).location(id).end();
  } catch(e) {
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({error: 'Impossible to create the page.'});
  }
});

// PUT /api/created-pages/<id>
app.put('/api/created-pages/:id', [
  check('title').notEmpty(),
  check('author').notEmpty(),
  check('creation_date').isDate({format: 'YYYY-MM-DD', strictMode: true})
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const createdPageToUpdate = req.body;
  const pageId = req.params.id;
  const user = await userDao.getUserById(createdPageToUpdate.userId);
  const author = user.name;
  try {
    await dao.updateCreatedPage(createdPageToUpdate, pageId, author);
    res.status(200).end();
  } catch {
    res.status(503).json({'error': `Impossible to update created page #${req.params.id}.`});
  }
});

// DELETE `/api/created-pages/:id`
app.delete('/api/created-pages/:pageId',
  isLoggedIn,
  [ check('pageId').isInt() ],
  async (req, res) => {
    try {
      // NOTE: if there is no film with the specified id, the delete operation is considered successful.
      const result = await dao.deleteCreatedPage(req.params.pageId);
      if (result == null)
        return res.status(200).json({}); 
      else
        return res.status(404).json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of created page ${req.body.pageId}: ${err} ` });
    }
  }
);

// POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// start the server
app.listen(port, () => 'API server started');

