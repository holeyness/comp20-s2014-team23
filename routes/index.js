
exports.pantry = function (db){
	return function (req, res){
		var collection = db.get('userfood');

		var username = req.query["username"];

		console.log(username + " accessed pantry");

		collection.find({"username" : username},{}, function(e,docs){
			res.json(docs);
		})
	}
}

exports.submit = function(db){
	return function(req,res){

		var username = req.body.username;
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

exports.shopping = function(db){
	return function(req,res){
		res.render('shopping.html');
	}
}