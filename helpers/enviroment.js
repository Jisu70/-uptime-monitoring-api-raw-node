/* Title:- Enviroments.
Description  :-Handel all enviroment related things 
Author: Sudipta Jana .
Date : 21/may/23  */

// Devpendencies

const environments  = {};

environments .staging = {
  port: 3000,
  envName: "staging",
};

environments .production = {
  port: 5000,
  envName: "production",
};

// Determine which enviroment was passed

const currentEnvironment  =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// Export corresponding enviroment object

const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;


    // export module
module.exports = environmentToExport;