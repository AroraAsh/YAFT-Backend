# Backend

This is the Node.js backend for our fitness app using express as the server an mongoose (MongoDB) as the database.
Please use Node.js version 12.x and the Yarn package manager

Structure:
server.js - The entry point of our application
/app - Contains core application logic (database models, functions for managing the database, etc)
/app_api - Contains application logic relevant to the api (routes and controllers)

To run the server run 'node server.js'.  You can also run 'nodemon server.js' in development for automatic code reloading.