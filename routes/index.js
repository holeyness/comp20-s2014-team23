var Meal = require('../models/meal');
var User = require('../models/user').User;

var mealCollection = "mealCollection";
var historyCollection = "historyCollection";

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
		var price = parseInt(req.body.price);
		var quantity = parseInt(req.body.quantity);
		var servingCost = price/quantity;

		var collection = db.get('userfood');

		collection.insert({
			"username" : username,
			"food": food,
			"price": price,
			"quantity": quantity,
			"servingCost": servingCost
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

exports.delete = function(db){
	return function(req,res){
		var thisuser = req.body.username;
		var thisfood = req.body.food;
		var thisquantity = parseInt(req.body.quantity);

		var collection = db.get('userfood');

		collection.update({ $and: [ {username: thisuser }, { food: thisfood } ] }, {$inc: {quantity: thisquantity}});
		res.writeHead(200, {'Content-Type:' : 'text/html'});
		res.end('less food :(');
		}
}

exports.submitMeal = function (db) {
	return function(req,res) {
		console.log(req.body)
		var ingredients = JSON.parse(req.body.ingredients);
		var mealName = req.body.name;

		var m = new Meal(db, ingredients, mealName, req.user);

		m.computeCost(function(cost) {
			console.log("Meal costs: " + cost);
		});

		saveMeal(db, m);

		res.send(200);
	}
}

function saveMeal(db, meal) {
	collection = db.get(mealCollection);
	collection.insert({
		"username":meal.cook.name,
		"ingredients":meal.ingredients,
		"name":meal.name
	}, function(err, doc) {
		if (err) console.error(err);
	});
}

// Cost can change over time, so save it here.
function updateMealHistory(db, user, meal, cost) {

}

exports.cooking = function (db) {
	return function(req,res) {
		res.render('cooking.html');
	}
}