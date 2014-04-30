
(function() {

var userCollection = 'userCollection';

// User Model - thin wrapper around DB fields.
function User(userName, userId, email) {
  this.name = "";
  this.Id = "";
  this.email = "";
}

// db is the mongo db returned by mongo.Db.connect()
exports.findById = function(db, id, fn) {
  console.log("searching by ID");
  db.collection(userCollection, function(err, collection) {
    collection.find({"userId":id}).toArray(function(err, results) {
      if (err) return fn(null, null);

      console.log("FOUND a valid user by user id user id:" + JSON.stringify(results[0]));

      foundUser = new User(results[0].username, results[0].userId, results[0].email);
      return fn(null, foundUser);
    });
  });
}

exports.findByUsername = function(db, username, fn) {
  db.collection(userCollection, function(er, collection) {
    collection.find({"username":username}).toArray(function(err, results) {
      if (err) return fn(null,null);

      console.log("FOUND a valid user by username: " + JSON.stringify(results[0]));

      foundUser = new User(results[0].username, results[0].userId, results[0].email);
      return fn(null, foundUser);
    });
  });
}

})();