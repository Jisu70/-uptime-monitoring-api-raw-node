/* Title:-Initial file For project .
Description  :-Initial file For to start the node server and workers.
Author: Sudipta Jana .
Date : 17/may/23  */

// Dependencies
const server = require('./library/server')
const workers = require('./library/worker')


// App object or module scaffolding
const app = {};


app.init = () => {
  // Start the server
  server.init() ;
  // Start the workers
  workers.init() ;
}


app.init() 


// Export the app 
module.exports = app ;
