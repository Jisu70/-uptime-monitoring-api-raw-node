/* Title:- User Handelers .
Description  :- Rout Handelers to handel user related routes
Author: Sudipta Jana .
Date : 21/may/23  */

//  Dependencies

const data = require("../../library/data");

const { hash } = require("../../helpers/utility");

const { parseJSON } = require("../../helpers/utility");

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
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;
  console.log("HEllo");
  if (phone) {
    // Find the user here
    data.read("users", phone, (err, u) => {
      const user = { ...parseJSON(u) };
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          error: "Requested user was not found ! ",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found ! ",
    });
  }
};
handeler._user.put = (requestProperties, callback) => {};
handeler._user.delete = (requestProperties, callback) => {};

module.exports = handeler;
