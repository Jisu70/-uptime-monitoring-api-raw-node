/* Title:- Check Handelers .
Description  :-  Handelers to handel user define  checks
Author: Sudipta Jana .
Date : 03/jun/23  */

//  Dependencies
// const handler = require('../../helpers/handelReqRes')

const data = require("../../library/data");

const { hash } = require("../../helpers/utility");

const { parseJSON, creatRandomString } = require("../../helpers/utility");

const tokenHandeler = require("./tokenHandeler");

const { maxChecks } = require("../../helpers/environment");

const { ifError } = require("assert");

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
    ["GET", "PUT", "POST", "DELETE"].indexOf(requestProperties.body.method) > -1
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
  console.log(protocol);
  console.log(url);
  console.log(method);
  console.log(successCodes);
  console.log(timeoutSeconds);
  if (protocol && url && method && successCodes && timeoutSeconds) {
    //Verify token
    const token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;
    // lookup the user phone by reading their token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const userPhone = parseJSON(tokenData).phone;
        data.read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            tokenHandeler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                const userObject = parseJSON(userData);
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                console.log(userChecks);
                if (userChecks.length <= maxChecks) {
                  const checkId = creatRandomString(20);
                  let checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };
                  // save the object
                  data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      // Add check ID to the users object

                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      // Save the new user data

                      data.update("users", userPhone, userObject, (err) => {
                        if (!err) {
                          // return  the data ;
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "  There was a problem in server side  ",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "  There was a problem in server side  ",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: " User has already reached max check limit  ",
                  });
                }
              } else {
                callback(403, {
                  error: " Authentication Problem ",
                });
              }
            });
          } else {
            callback(403, {
              error: " user not found ",
            });
          }
        });
      } else {
        callback(403, {
          error: " Authentication Problem ",
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

handeler._check.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObj.id === "string" &&
    requestProperties.queryStringObj.id.trim().length === 20
      ? requestProperties.queryStringObj.id
      : false;
  if (id) {
    console.log("id", id);
    // Lookup the checks
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
        tokenHandeler._token.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, parseJSON(checkData));
            } else {
              callback(403, {
                error: " Authentication failure ",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: " You have a problem in your request ! ",
        });
      }
    });
  } else {
    callback(400, {
      error: "There is a problem in your request ",
    });
  }
};

//                    USER PUT REQUEST

handeler._check.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObj.id === "string" &&
    requestProperties.queryStringObj.id.trim().length === 20
      ? requestProperties.queryStringObj.id
      : false;
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
    ["GET", "PUT", "POST", "DELETE"].indexOf(requestProperties.body.method) > -1
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
  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // verify the token
      data.read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          let checkObject = parseJSON(checkData);
          const token =
            typeof requestProperties.headersObject.token === "string"
              ? requestProperties.headersObject.token
              : false;
          tokenHandeler._token.verify(
            token,
            checkObject.userPhone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.method = method;
                }
                if (successCodes) {
                  checkObject.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkObject.timeoutSeconds = timeoutSeconds;
                }
                // now update the object
                data.update("checks", id, checkObject, (err) => {
                  if (!err) {
                    callback(200);
                  } else {
                    callback(500, {
                      error: " There was a server side error ! ",
                    });
                  }
                });
              } else {
                callback(403, {
                  error: " Authentication problem  ! ",
                });
              }
            }
          );
        } else {
          callback(500, {
            error: " there was problem in server side ! ",
          });
        }
      });
    } else {
      callback(400, {
        error: " You must provide atleast one filed to update  ! ",
      });
    }
  } else {
    callback(400, {
      error: " You have problem in your request ! ",
    });
  }
};

//                    USER DELETE REQUEST

handeler._check.delete = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryStringObj.id === "string" &&
    requestProperties.queryStringObj.id.trim().length === 20
      ? requestProperties.queryStringObj.id
      : false;

  if (id) {
    // lookup the check
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
        // tokenHandler
        tokenHandeler._token.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              // delete the check data
              data.delete("checks", id, (err) => {
                if (!err) {
                  data.read(
                    "users",
                    parseJSON(checkData).userPhone,
                    (err, userData) => {
                      const userObject = parseJSON(userData);
                      if (!err && userData) {
                        const userChecks =
                          typeof userObject.checks === "object" &&
                          userObject.checks instanceof Array
                            ? userObject.checks
                            : [];

                        // remove the deleted check id from user's list of checks
                        const checkPosition = userChecks.indexOf(id);
                        if (checkPosition > -1) {
                          userChecks.splice(checkPosition, 1);
                          // resave the user data
                          userObject.checks = userChecks;
                          data.update(
                            "users",
                            userObject.phone,
                            userObject,
                            (err4) => {
                              if (!err4) {
                                callback(200);
                              } else {
                                callback(500, {
                                  error: "There was a server side problem!",
                                });
                              }
                            }
                          );
                        } else {
                          callback(500, {
                            error:
                              "The check id that you are trying to remove is not found in user!",
                          });
                        }
                      } else {
                        callback(500, {
                          error: "There was a server side problem!",
                        });
                      }
                    }
                  );
                } else {
                  callback(500, {
                    error: "There was a server side problem!",
                  });
                }
              });
            } else {
              callback(403, {
                error: "Authentication failure!",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "You have a problem in your request",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

module.exports = handeler;
