
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

exports.submit = function(db){
	return function(req,res){

		var username = req.body.user;
		var food = req.body.food;
		var price = req.body.price;
		var quantity = req.body.quantity;

		console.log(req.body);

		var collection = db.get('userfood');

		collection.insert({
			"username" : username,
			"food": food,
			"price": price,
			"quantity": quantity

		});
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end('we have food');
	}
}