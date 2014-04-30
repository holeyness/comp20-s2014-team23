
exports.pantry = function (db){
	return function (req, res){
		var username = req.user;
		var collection = db.get('userfood');

		console.log(username + "accessed pantry");

		collection.find({"username" : username},{}, function(e,docs){
			res.writeHead(200, {'Content-Type': 'text/html'});

			res.json(docs);
		})
	}
}