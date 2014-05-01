#Database Schema

##Mongo

**Collection**: "userCollection"  
**Example Document**: 
```json
{ 
    "_id" : ObjectId("534c86f1ef413bc09ebbc051"), 
    "userId" : 1, // unique id to identify the user by
    "username" : "bob", 
    "password" : "secret", 
    "email" : "bob@example.com" 
  }
```


**Collection**: "mealCollection"
**Example Document**:
```json
{
    "_id":ObjectId("..."),
    "username": "bob",
    "name": "Chicken and Rice",
    "ingredients": {
        "chicken": 2, // ingredient : number of servings
        "rice": 3
    }
}
```

***Collection***: "historyCollection"
**Example Document**:
```json
{
    "_id":ObjectId("..."),
    "username":"bob",
    "history":[
        {
            "date":new Date().toJSON(), // ISO-8601 format
            "meal": "b", // b, l, or d
            "mealName": "Capn Crunch"
            "cost": 3.50
        },
        ...
    ]
}
```