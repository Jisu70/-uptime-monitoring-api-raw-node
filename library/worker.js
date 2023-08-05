/* Title:- Workers Library .
Description  : Workers related files 
Author: Sudipta Jana .
Date : 17/may/23  */

// Dependencies
const data = require('./data')

// Worker object or module scaffolding
const worker = {};

worker.gatherAllCheck = () => {
  // To get all the checks

}

worker.loop = () => {
  setInterval(() => {
    worker.gatherAllCheck()
  }, 1000 * 60 )
}

// Run the server
worker.init = () => {
  // Execute all the check 
  worker.gatherAllCheck()
  // Call the loop 
  worker.loop()
} ;

// Server
module.exports = worker ;