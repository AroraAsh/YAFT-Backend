# Backend

This is the Node.js backend for our fitness app using express as the server an mongoose (MongoDB) as the database.

Please use Node.js version 12.x and the Yarn package manager

# Structure:

server.js - The entry point of our application

/app - Contains core application logic (database models, functions for managing the database, etc)

/app_api - Contains application logic relevant to the api (routes and controllers)

# Runnning

To run the server run 'node server.js'.  You can also run 'nodemon server.js' in development for automatic code reloading.


# POST Data
Use JSON or form data
For JSON use application/json in content type header.

# API Specification

POST /login

Parameters: email, password, remember_me

GET /logout

----------------------------User API's-----------------------------------------------------

POST /user/register

Parameters: name, email, password, age, gender

GET /user/profile

POST /user/password

Parameters: oldPassword, newPassword

POST /user/update

Parameters: name, age, email, gender, height, stepGoal, distanceGoal, calorieGoal, activityGoal, sleepGoal

POST /user/add_weight

Parameters: weight, date

POST /user/update_weight

Parameters: weightId, weight, date, delete ("true" if you want to delete the weight)

GET /user/all

POST /user/location

Parameters: lat,long


----------------------------Activity API's-----------------------------------------------------

POST /activity/insert

Parameters: name, activityType, startDateType, endDateTime, stepCoumt, duration, caloriesBurned, distance

POST /activity/update

Parameters: name, activityType, startDateTime, endDateTime, stepCount, duration, caloriesBurned, distance

GET /activities/get_by_time 

Parameters: start (date), end (date)

GET /activities/get_by_id

Parameters: activityId

----------------------------Friend API's-----------------------------------------------------

POST /friends/request

Parameters: requestToEmailId

POST /friends/confirm

Parameters: requestToEmailId

GET /friends

 