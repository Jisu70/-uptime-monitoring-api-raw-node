/* Title:- Uptime Monitoring application .
Description:-A RESFUL API to monitor up and down time of given links by the user.
Author:-Sudipta Jana .
Date :- 21/may/23  */

// Dependencies
const { sampleHandeler } = require('./handelers/routeHandelers/sampleHandeler'); // Importing the 'sampleHandeler' function from the './handelers/routeHandelers/sampleHandeler' module
const { userHandeler } = require('./handelers/routeHandelers/userHandelrs'); // Importing the 'sampleHandeler' function from the './handelers/routeHandelers/sampleHandeler' module
const { tokenHandeler } = require('./handelers/routeHandelers/tokenHandeler'); // Importing the 'sampleHandeler' function from the './handelers/routeHandelers/sampleHandeler' module

// Routes configuration
const routes = {
  'sample': sampleHandeler,
  'user' : userHandeler,
  'token' :tokenHandeler
   // Assigning the 'sampleHandeler' function to the 'sample' route
};

module.exports = routes; // Exporting the 'routes' object to make it accessible to other modules

