


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
  collection.find({"userId":id}).toArray(function(err, results) {
    if (err) {
      console.error("error finding user by id");
      return fn(null, null);
    }

    console.log("FOUND a valid user by user id user id:" + JSON.stringify(results[0]));

    foundUser = new User(results[0].username, results[0].userId, results[0].email);
    return fn(null, foundUser);
  });
}

exports.findByUsernameOrEmail = function(db, userNameOrEmail, fn) {
  var collection = db.get(userCollection);
  collection.findOne({"$or" : [{"username":userNameOrEmail}, {"email":userNameOrEmail}]}, function(err, result) {
    if (err) {
      console.error("error findig user by name");
      return fn(null,null);
    }
    if (result == null) {
      console.log("found no user for" + userNameOrEmail);
      return fn(null, null);
    }

    console.log("FOUND a valid user by username: " + JSON.stringify(result));

    foundUser = new User(result.username, result.userId, result.email, result.password);
    console.log(foundUser)
    return fn(null, foundUser);
  });
}
