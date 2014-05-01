var Meal = require('../models/meal');
var User = require('../models/user').User;
var moment = require('moment');

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
		var price = req.body.price;
		var quantity = req.body.quantity;
		var servingCost = double(price)/double(quantity);

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
		var username = req.body.username
		var food = req.body.food;
		var quantity = req.body.quantity;
		var collection = db.get('userfood');

		db.collection.update(
   			{ "username" : username , "food" : food },
  			{ $inc : { "quantity" : quantity } },
 			{ multi: false }
		);
		res.writeHead(200, {'Content-Type:' : 'text/html'});
		res.end('less food :(');
		}
}

exports.cooking = function (db) {
	return function(req,res) {
		res.render('cooking.html');
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
			updateMealHistory(db, m, cost);
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
function updateMealHistory(db, meal, cost) {
	collection = db.get(historyCollection);

	var newMeal = {
		"date":new Date().toJSON(),
		"meal": "b", // b, l, or d
		"mealName": meal.name,
		"cost": cost
	};

	collection.find({"username":meal.cook.name})
	.success(function(docs) {
		console.log(docs)
		console.log(docs.length)
		if (docs.length === 0) {
			collection.insert({
				"username":meal.cook.name,
		    "history":[]
			});
		}

		collection.update(
			{"username":meal.cook.name},
	    {$push : {"history":newMeal}}
		);
	});
}

exports.getHistory = function(db) {
	return function(req,res) {
		var numDays = req.body.numDays || 7;

		if (numDays < 0) numDays * -1;
		collection = db.get(historyCollection);
		collection.findOne({"username":req.user.name}).success(function(docs) {
			// The history array has the oldest elements at the front. We want our results the other way around.
			history = docs.history.reverse();

			var result = [];
			var limit = moment().subtract(numDays, 'days');
			for (var i = 0; i < history.length; i++) {
				if (moment(history[i].date) > limit) {
					result.push(history[i]);
				}
			}

			res.json({"history":result});
		}).error(function(err) {
			res.send(500);
		});
	}
}
