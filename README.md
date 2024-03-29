# NOM.ify  

## Project Name
NOM.ify  

## Problem
This application helps you keep track of how much your meals cost. Food costs are rising, and it’s hard to keep track of how much each meal you make costs.  

## Solution
Our application helps you keep up with the price of your meals.  

## Features
- Create account and login.
- Ability to add foods and their prices to the user's “pantry”.
- Calculates food costs with minimal user input.
- View meal price history and price comparison. Possibly through email too.

### Pick 5
- Server-side data persistence (e.g., with PostgreSQL, MongoDB, MySQL)
- Front-end framework including Bootstrap, Backbone.js, AngularJS
- Data / screen scraping
- Reporting with charts and graphs
- Send emails and/or SMSes (e.g., Twilio)  

## Data Collected & Used
We will be collecting food price information. We will also keep track of: what foods a certain user has in their pantry, how much their past meals cost.  

## Special Algorithms/Techniques
We may need to develop some special techniques to deal with inconsistent user input (e.g. determining when different bar codes belong to the same foods). Depending on the direction our project goes, we may also need to figure out a way to predict serving sizes based on some basic information.  

## Wireframes
![Login Page](/wireframes/login.png)
![Home Page](/wireframes/home.png)
![Shopping Page](/wireframes/barcode.png)
![Cooking Page](/wireframes/cooking.png)
![Cost Page](/wireframes/cost.png)
![Graph Page](/wireframes/graph.png)


#COMMENTS BY MING
* Why do you need to send emails and/or SMSes?
* Data entry will be interesting.  Not all food items will have PLU numbers or barcodes. Example: a package of chicken drumsticks. What you can do: have a pulldown menu of food items [beef, chicken, pork,....] and have user enter the price.  At least you're normalizing stuff instead of people entering things inconsistently (e.g., "Chick", "chicken", "Chicken", "package of chicken", "drumsticks")
