var express = require('express')
  , passport = require('passport')
  , path = require('path')
  , flash = require('connect-flash')
  , mongo = require('mongodb')
  , routes = require('./routes')
  , user = require('./models/user')
  , Meal = require('./models/meal')
  , exphbs  = require('express3-handlebars')
  , LocalStrategy = require('passport-local').Strategy;

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nomify';
var db = require('monk')(mongoUri);

var userCollection = 'userCollection';


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.Id);
});

passport.deserializeUser(function(id, done) {
  user.findById(db, id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new LocalStrategy({
    usernameField: 'EMail',
    passwordField: 'PWord'
  },
  function(userNameOrEmail, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      user.findByUsernameOrEmail(db, userNameOrEmail, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + userNameOrEmail }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

var app = express();

// configure Express
app.configure(function() {
  app.use('/static', express.static(__dirname + '/static'));
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  app.engine('html', exphbs())
  app.set('view engine', 'handlebars');

  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
});

app.get('/', ensureAuthenticated, function(req, res){
  res.render('home.html');
});

app.get('/login', function(req, res){
  if (req.isAuthenticated()) res.redirect('/');
  res.render('login.html');
});

app.get('/shopping', ensureAuthenticated, function(req, res){
  res.render('shopping.html');
});

app.get('/user', ensureAuthenticated, function(req, res) {
  res.json(req.user);
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    console.log('Successful login of user: ' + JSON.stringify(req.user));
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

app.post('/register', function(req, res) {
  var firstName = req.query.FirstName;
  var lastName = req.query.LastName;
  var password = req.query.PWord;
  var email = req.query.EMail;

  // TODO: username must be unique so this needs to check that
  var c = db.get(userCollection);
  c.insert({
    "name":{
      "first":firstName,
      "last":lastName
    },
    "username":firstName+lastName,
    "email":email,
    "password":password,
    "userId": (firstName+lastName).hashCode() // bad idea, but just want it to work for now. username needs to be unique anyways...
  });

  res.send(200);
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Express server listening on port 3000');
});

app.get('/pantry', ensureAuthenticated, routes.pantry(db));
app.post('/submit', ensureAuthenticated, routes.submit(db));
app.post('/cooking', ensureAuthenticated, routes.submitMeal(db));
app.get('/cooking', ensureAuthenticated, routes.cooking(db));
app.get('/meals', ensureAuthenticated, routes.getMeals(db)); // get all meals for a user.
app.get('/history', ensureAuthenticated, routes.getHistory(db)); // api route to get graph data
app.get('/graph', ensureAuthenticated, routes.graph(db));
app.post('/delete', routes.delete(db));


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}