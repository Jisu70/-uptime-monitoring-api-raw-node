/* Title:- Utilities .
Description:-A RESFUL API to monitor up and down time of given links by the user.
Author:-Sudipta Jana .
Date :- 21/may/23  */
// Dependencies
const crypto = require('crypto')
const environments = require('./environment')
// Scaffolding
const utilities = {}

// parse json string to object 
utilities.parseJSON = (jsonString) => {
  let output ;
  try {
    output = JSON.parse(jsonString)
  } catch (error) {
    output = {}
  }
  return output
}

utilities.hash = (str) => {
  if( typeof str === 'string' && str.length >0 ){
    const hash = crypto 
    .createHmac('sha256',environments.secretKey)
    .update(str)
    .digest('hex')
    console.log(hash);
    return hash ;
  }
}

module.exports = utilities; // 