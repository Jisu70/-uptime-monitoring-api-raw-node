/* Title:- Handeler responce .
Description  :-A RESFUL API to monitor up and down time of given links by the user.
Author: Sudipta Jana .
Date : 21/may/23  */

// Dependencies
const url = require('url'); // Importing the 'url' module for URL parsing
const { StringDecoder } = require('string_decoder'); // Importing the 'StringDecoder' class from the 'string_decoder' module
const routes = require('../routes'); // Importing the 'routes' module
const { notFoundHandeler } = require('../handelers/routeHandelers/notFoundHandeler'); // Importing the 'notFoundHandeler' function from the 'notFoundHandeler' module

// Module scaffolding
const handler = {};

// Handle request and response
handler.handleReqRes = (req, res) => {
  // Request handling
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true); // Parsing the request URL and storing it in 'parsedUrl'
  const path = parsedUrl.pathname; // Extracting the path from 'parsedUrl'
  const trimmedPath = path.replace(/^\/+|\/+$/g, ''); // Removing leading and trailing slashes from the path
  const method = req.method.toLowerCase(); // Extracting the HTTP method and converting it to lowercase
  const queryStringObj = parsedUrl.searchParams; // Extracting the query parameters from 'parsedUrl'
  const headersObject = req.headers; // Extracting the request headers

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObj,
    headersObject
  }; // Creating an object with the extracted request properties

  const decoder = new StringDecoder('utf-8'); // Creating a new instance of 'StringDecoder' class with 'utf-8' encoding
  let realData = ''; // Variable to store the decoded data

  const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandeler; // Determining the appropriate handler based on the requested path



  // Concept of Buffer

  req.on('data', (buffer) => {
    realData += decoder.write(buffer); // Decoding the received buffer and appending it to 'realData'
  });

  req.on('end', () => {
    realData += decoder.end(); // Finalizing the decoding process and appending any remaining data to 'realData'

    console.log(realData); // Logging the received data

    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof(statusCode) === 'number' ? statusCode : 500; // Checking if the statusCode is a number, otherwise defaulting to 500
      payload = typeof(payload) === 'object' ? payload : {}; // Checking if the payload is an object, otherwise defaulting to an empty object
      const payloadString = JSON.stringify(payload); // Converting the payload to a JSON string
  
      // Return the final response
      res.writeHead(statusCode); // Setting the response status code
      res.end(payloadString); // Sending the response with the payload
  
    });


    // Response handling
    // res.setHeader('Content-Type', 'application/json');
    // res.writeHead(200);
    res.end(JSON.stringify({ message: 'Hello world, this is Sudipta' })); // Sending a response with a JSON payload

  });

  // Error handling
  req.on('error', (err) => {
    console.log(err); // Logging the error
    res.writeHead(400); // Setting the response status code to 400 (Bad Request)
    res.end('Bad Request'); // Sending a response with a plain text payload
  });
};

module.exports = handler;
