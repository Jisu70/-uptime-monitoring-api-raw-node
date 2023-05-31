/* Title:- Utilities .
Description:-A RESFUL API to monitor up and down time of given links by the user.
Author:-Sudipta Jana .
Date :- 21/may/23  */

// Dependencies
const crypto = require("crypto");
const environments = require("./environment");

// Scaffolding
const utilities = {};

/**
 * This method return parsedJSON
 * @param {
 * } jsonString
 * @returns
 */
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }
  return output;
};

/**
 * This method convert password(string) into hash format
 * @param {
 * } str
 * @returns
 */
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
};

/**
 * For creat a random string
 * @param {*} str
 * @returns
 */
utilities.creatRandomString = (strlength) => {
  let length = strlength;
  length = typeof strlength === "number" && strlength > 0 ? strlength : false;
  if (length) {
    let possibleCharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 0 ; i < length; i++) {
  
      const  randomChracter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomChracter
    }
    return output ;
  } else {
    return false;
  }
};

module.exports = utilities; //
