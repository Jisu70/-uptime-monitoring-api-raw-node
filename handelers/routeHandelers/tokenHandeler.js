/* Title:- Token Handelers .
Description  :-  Handelers to handel toke related routes
Author: Sudipta Jana .
Date : 30/may/23  */

//  Dependencies
// const handler = require('../../helpers/handelReqRes')

const data = require("../../library/data");

const { hash, creatRandomString } = require("../../helpers/utility");

const { parseJSON } = require("../../helpers/utility");

// const { user } = require("../../routes");

// Modules scaffolding
const handeler = {};

handeler.tokenHandeler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handeler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handeler._token = {};

//                    USER POST REQUEST

handeler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 10
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      let hashedPassword = hash(password);
      let userdata = parseJSON(userData);
      if (hashedPassword === userdata.password) {
        let tokenId = creatRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expires,
        };
        // Store the token
        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: " Server side error ",
            });
          }
        });
      } else {
        callback(400, {
          message: " Password is not valid ",
        });
      }
    });
  } else {
    callback(400, {
      message: " You have a problem in your request ",
    });
  }
};

//                    USER GET REQUEST

handeler._token.get = (requestProperties, callback) => {
  // Check the token ID no. is valid
  const id =
    typeof requestProperties.queryStringObj.id === "string" &&
    requestProperties.queryStringObj.id.trim().length === 20
      ? requestProperties.queryStringObj.id
      : false;

  if (id) {
    // Find the token
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          error: "canot get the token ! ",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found ! ",
    });
  }
};

//                    USER PUT REQUEST
handeler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend == true
      ? true
      : false;

  if (id && extend) {
    data.read("tokens", id, (err, tokenData) => {
      let tokenObject = parseJSON(tokenData);

      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;
        // store the updated token
        data.update("tokens", id, tokenObject, () => {
          if (!err) {
            callback(200);
          } else {
            callback(404, {
              error: "token already expired! ",
            });
          }
        });
      } else {
        callback(404, {
          error: "token already expired! ",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request  ! ",
    });
  }
};

//                    USER DELETE REQUEST

handeler._token.delete = (requestProperties, callback) => {
  // Check if the token  is valid
  const id =
    typeof requestProperties.queryStringObj.id === "string" &&
    requestProperties.queryStringObj.id.trim().length === 20
      ? requestProperties.queryStringObj.id
      : false;

  if (id) {
    // Read user data
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        // Delete user data
        data.delete("tokens", id, (err) => {
          if (err) {
            callback(200, {
              message: " Token was successfully deleted!",
            });
          } else {
            callback(500, {
              error: "There was a server side error!",
            });
          }
        });
      } else {
        callback(500, {
          error: "Server side error",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid Phone Number",
    });
  }
};

module.exports = handeler;
