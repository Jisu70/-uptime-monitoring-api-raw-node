/* Title:- Server Library .
Description  : Server related files 
Author: Sudipta Jana .
Date : 17/may/23  */

// Dependencies
const http = require("http"); // Importing the 'http' module for creating an HTTP server

const { handleReqRes } = require("../helpers/handelReqRes"); // Importing the 'handleReqRes' function from the './helpers/handelReqRes' module

const environments = require("../helpers/environment");

const data = require("../library/data");

// Server object or module scaffolding
const server = {};

// Configuration
server.config = {
  port : 3000
}

// Create server
server.createServer = () => {
  const creteServerVarible = http.createServer(app.handleReqRes); // Creating an HTTP server using the 'handleReqRes' function
  creteServerVarible.listen(server.config.port, () => {
    console.log(`Server listening on port ${server.config.port}`); // Logging a message when the server starts listening on the specified port
  });
};
// Handle request and response
server.handleReqRes = handleReqRes; // Assigning the 'handleReqRes' function to the 'handleReqRes' property of the 'app' object

// Run the server
server.createServer = () => {
  server.createServer( )
} ; // Calling the 'createServer' method to start the server and make it listen on the specified port

// Server
module.exports = server /*  */;