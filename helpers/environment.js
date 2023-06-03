/* Title:- Environments.
Description  :- This module helps in maintaining different configurations 
for different environments, allowing you to easily switch between settings 
when deploying your application to different environments like development, 
staging, and production.
Author: Sudipta Jana .
Date : 21/may/23  */

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey :'shdvbhjbvshvfsfb',
  maxChecks : 5 

};

// production environment
environments.production = {
  port: 5000,
  envName: "production",
  secretkey :'jhfghwehfgopiehgfh',
  maxChecks : 5 
};

// determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module
module.exports = environmentToExport;
