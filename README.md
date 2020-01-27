# Backend

This is the Node.js backend for our fitness app using express as the server an mongoose (MongoDB) as the database.

Please use Node.js version 12.x and the Yarn package manager

# Structure:

server.js - The entry point of our application

/app - Contains core application logic (database models, functions for managing the database, etc)

/app_api - Contains application logic relevant to the api (routes and controllers)

# Runnning

To run the server run 'node server.js'.  You can also run 'nodemon server.js' in development for automatic code reloading.


# API Specification

POST /login

Parameters: email, password, remember_me

GET /logout

POST /user/register

Parameters: name, email, password, age, gender

GET /user/profile

POST /user/password

Parameters: oldPassword, newPassword

POST /user/update

Parameters: name, age, gender

POST /activity/insert

Parameters: name, activityType, startDateType (yyyy-mm-dd hh:mm:ss or whatever Javascript Date.parse() can take), endDateTime, duration, caloriesBurned, distance

POST /activity/update (not implemented yet)

GET /activities/get_by_time 

Parameters: start (date), end (date)