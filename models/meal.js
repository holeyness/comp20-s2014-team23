
var foodCollection = "userfood";

// Meal model
// ingredients should be a map of {"food name":servings}
function Meal(db, ingredients, name, cook) {
  this.db = db;
  this.ingredients = ingredients;
  this.name = name;
  this.cook = cook;
}

Meal.prototype.withName = function(db) {
  //pass
};

// db is a monk db
// callback takes one parameter, the computed cost
Meal.prototype.computeCost = function(callback) {
  var db = this.db;
  var c = db.get(foodCollection);

  var totalCost = 0;

  var ingredientToServings = this.ingredients;
  var ingredientNames = Object.keys(this.ingredients);


  c.find({"username":this.cook.name, "food":{$in:ingredientNames}})
  .success(function(docs) {
    docs.forEach(function(el, idx, arr) {
      totalCost += computeFoodCost(el, ingredientToServings[el.food]);
    });
    callback(+(totalCost.toFixed(2))); // Round the number to 2 decimal places and make it a number, since this is a cost.
  })
  .error(function(err) {
    console.error("Error computing meal cost: " + err);
    callback(-1);
  });
};

function computeFoodCost(food, servings) {
  return food.servingCost * servings;
}

module.exports = Meal;