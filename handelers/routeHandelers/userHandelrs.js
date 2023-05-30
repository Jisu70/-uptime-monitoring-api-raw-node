/* Title:- User Handelers .
Description  :- Rout Handelers to handel user related routes
Author: Sudipta Jana .
Date : 21/may/23  */

//  Dependencies
// const handler = require('../../helpers/handelReqRes')

const data = require("../../library/data");

const { hash } = require("../../helpers/utility");

const { parseJSON } = require("../../helpers/utility");

const { user } = require("../../routes");

// Modules scaffolding
const handeler = {};

handeler.userHandeler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handeler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handeler._user = {};

//                    USER POST REQUEST

handeler._user.post = (requestProperties, callback) => {
  // Validation
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement;

  if (firstName && lastName && phone && password && tosAgreement) {
    //  Make sure user already exist or not
    data.read("users", phone, (err) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        console.log(userObject);
        // Store the user to database
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(201, {
              message: " user data created successfully ! ",
            });
          } else {
            callback(500, {
              message: "could not create user ",
            });
          }
        });
      } else {
        callback(500, {
          message: "There is a problem on the server side.",
        });
      }
    });
  } else {
    callback(400, {
      message: "You have a problem in your request",
    });
  }
};

//                    USER GET REQUEST

handeler._user.get = (requestProperties, callback) => {
  // Check the phone no. is valid
  const phone =
    typeof requestProperties.queryStringObj.phone === "string" &&
    requestProperties.queryStringObj.phone.trim().length === 10
      ? requestProperties.queryStringObj.phone
      : false;
  if (phone) {
    // Find the user here
    data.read("users", phone, (err, userData) => {
      const user = { ...parseJSON(userData) };
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          error: "canot get the user ! ",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found ! ",
    });
  }
};

//                    USER PUT REQUEST
handeler._user.put = (requestProperties, callback) => {
  // Check the phone no. is valid
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 10
      ? requestProperties.body.phone
      : false;

  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      data.read("users", phone, (err, uData) => {
        if (!err && uData) {
          const userData = parseJSON(uData);
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = hash(password);
          }

          // Update data of the user
          data.update("users", phone, userData, (err) => {
            if (!err) {
              callback(200, {
                message: "User was updated successfully",
              });
            } else {
              callback(500, {
                error: "There was a problem in the server side",
              });
            }
          });
        } else {
          callback(400, {
            error: "You have a problem in your request",
          });
        }
      });
    } else {
      callback(400, {
        error: "You have a problem in your request",
      });
    }
  } else {
    callback(400, {
      error: "Invalid Phone Number",
    });
  }
};


//                    USER DELETE REQUEST

handeler._user.delete = (requestProperties, callback) => {
  // Check the phone no. is valid
  const phone =
    typeof requestProperties.queryStringObj.phone === "string" &&
    requestProperties.queryStringObj.phone.trim().length === 10
      ? requestProperties.queryStringObj.phone
      : false;
  console.log(phone);
  if (phone) {
    data.read("users", phone, (err, userData) => {
      if (!err && userData) {
        data.delete("users", phone, (response) => {
          console.log('response -> ', !response);
          if (response) {
            callback(200, {
              message: " User data deletes successfully",
            });
          } else {
            callback(500, {
              error: " Cannot delete user ",
            });
          }
        });
      } else {
        callback(500, {
          error: " server side error ",
        });
      }
    });
  } else {
    callback(400, {
      error: " Invalid Phone Number ",
    });
  }
};

module.exports = handeler;
