#API Routes

## /login
###POST
**Data:** "username=bob&password=mypassword"  
**Result:** index.html on success, login.html on failure  

###GET
**Result:** login.html  

## /register
*not yet implemented*

###POST
**Data:** "username=bob&password=mypassword&email=myemail@gmail.com"  
**Result:** redirect to logged in home page on success, error message on error

###GET
**Result:** returns register.html

## /cooking

###POST
**Data (url encoded of course):** "ingredients={"chicken":2, "rice":3}&name="Chicken with Rice"  
**Result:** 200 if successfully processed  

###GET
**Result:** cooking.html