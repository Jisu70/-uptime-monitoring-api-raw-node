/* Title:- Uptime Monitoring application .
Description  :-A RESFUL API to monitor up and down time of given links by the user.
Author: Sudipta Jana .
Date : 21/may/23  */

// Dependencies
const http = require("http"); // Importing the 'http' module for creating an HTTP server

const { handleReqRes } = require("./helpers/handelReqRes"); // Importing the 'handleReqRes' function from the './helpers/handelReqRes' module

const environments = require("./helpers/environment");

const data = require("./library/data");

// App object or module scaffolding
const app = {};

// Testing file system
//         For creat file
// data.create("test", "newFile", { name: "India", language: "Bangla" }, (err) => {
//   if (err) {
//     console.log(`Error occurred:`, err);
//   } else {
//     console.log("Data written to file successfully.");
//   }
// });
//         For read file
// data.read("test", "newFile", (err, data) => {
//   console.log(`Data:`, data);
//   console.log(`Error:`, err);
// });
//         For update file

data.update("test", "newFile", { name: "ENGAND", language: "ENGLISH" }, (err) => {

  console.log(`Error:`, err);
});

// // Configuratione
// app.config = {           ///   Moving to enviroment.js
//   port: 3000, // Setting the server port to 3000
// };

// Create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes); // Creating an HTTP server using the 'handleReqRes' function

  server.listen(environments.port, () => {
    console.log(`Server listening on port ${environments.port}`); // Logging a message when the server starts listening on the specified port
  });
};
// Handle request and response
app.handleReqRes = handleReqRes; // Assigning the 'handleReqRes' function to the 'handleReqRes' property of the 'app' object

// Run the server
app.createServer(); // Calling the 'createServer' method to start the server and make it listen on the specified port
