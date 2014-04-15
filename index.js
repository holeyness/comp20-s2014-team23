var express = require('express')
  , passport = require('passport')
  , flash = require('connect-flash')
  , mongo = require('mongodb')
  , exphbs  = require('express3-handlebars')
  , LocalStrategy = require('passport-local').Strategy;

var userCollection = 'userCollection';

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/nomify';

var users = [
    { userId: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { userId: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  console.log("searching by ID");
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection(userCollection, function(er, collection) {
      collection.find({"userId":id}).toArray(function(err, results) {
        if (err) return fn(null, null);

        console.log("FOUND a valid user by user id user id:" + JSON.stringify(results[0]));
        return fn(null, results[0]);
      });
    });
  });

}

function findByUsername(username, fn) {
  mongo.Db.connect(mongoUri, function (err, db) {
    db.collection(userCollection, function(er, collection) {
      collection.find({"username":username}).toArray(function(err, results) {
        if (err) return fn(null,null);

        console.log("FOUND a valid user by username: " + JSON.stringify(results[0]));
        return fn(null, results[0]);
      });
    });
  });
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.userId);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

var app = express();

// configure Express
app.configure(function() {
  app.use(express.static(__dirname + '/views'));
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


app.get('/', function(req, res){
  res.render('index.html');
});

app.get('/pantry', ensureAuthenticated, function(req, res){
  res.render('pantry.html');
});

app.get('/login', function(req, res){
  console.log("login user: " + JSON.stringify(req.user));
  res.render('login.html');
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
    console.log('you logged in');
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000, function() {
  console.log('Express server listening on port 3000');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  console.log(req);
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}