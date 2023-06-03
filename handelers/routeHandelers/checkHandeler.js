/* Title:- Check Handelers .
Description  :-  Handelers to handel user define  checks
Author: Sudipta Jana .
Date : 03/jun/23  */

//  Dependencies
// const handler = require('../../helpers/handelReqRes')

const data = require("../../library/data");

const { hash } = require("../../helpers/utility");

const { parseJSON } = require("../../helpers/utility");

const tokenHandeler = require("./tokenHandeler");

// Modules scaffolding
const handeler = {};

handeler.checkHandeler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handeler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handeler._check = {};

//                    USER POST REQUEST

handeler._check.post = (requestProperties, callback) => {
  // Validates Input
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["get", "put", "post", "delete"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  let timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;
  if (protocol && url && method && successCodes && timeoutSeconds) {
    //Verify token
    const token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;
        // Verify the token 
    tokenHandeler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {

      } else {
        callback(403, {
          error: "User authenticatian failed",
        });
      }
    });
  } else {
    callback(400, {
      error: "There is a problem in your request ",
    });
  }
};

//                    USER GET REQUEST

handeler._check.get = (requestProperties, callback) => {};

//                    USER PUT REQUEST

handeler._check.put = (requestProperties, callback) => {};

//                    USER DELETE REQUEST

handeler._check.delete = (requestProperties, callback) => {};

module.exports = handeler;
