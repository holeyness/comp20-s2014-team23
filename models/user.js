


var userCollection = 'userCollection';

// User Model - thin wrapper around DB fields.
function User(userName, userId, email, password) {
  this.name = userName;
  this.Id = userId;
  this.email = email;
  this.password = password;
}

// db is the mongo db returned by mongo.Db.connect()
exports.findById = function(db, id, fn) {
  console.log("searching by ID");
  var collection = db.get(userCollection);
  collection.findOne({"userId":id}, function(err, result) {
    if (err) {
      console.error("error finding user by id");
      return fn(null, null);
    }

    foundUser = new User(result.username, result.userId, result.email);
    return fn(null, foundUser);
  });
}

exports.findByUsernameOrEmail = function(db, userNameOrEmail, fn) {
  var collection = db.get(userCollection);
  collection.findOne({"$or" : [{"username":userNameOrEmail}, {"email":userNameOrEmail}]}, function(err, result) {
    if (err) {
      console.error("Error finding user by name or email: " + err);
      return fn(null,null);
    }
    if (result == null) {
      console.log("Found no user for: " + userNameOrEmail);
      return fn(null, null);
    }

    foundUser = new User(result.username, result.userId, result.email, result.password);
    return fn(null, foundUser);
  });
}
