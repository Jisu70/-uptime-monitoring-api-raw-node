/*
 * Title: Data Library
 * Description: Data Library functions for CRUD
 * Author:Sudipta Jana
 * Date: 11/20/2020
 *
 */

// dependencies
const fs = require("fs");
const path = require("path");

// module scaffolding
const library = {};

// base directory of the data folder
library.basedir = path.join(__dirname, "/../.data/");

// write data to file
library.create = (dir, file, data, callback) => {
  // open file for writing
  fs.open(
    `${library.basedir + dir}/${file}.json`,
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to stirng
        const stringData = JSON.stringify(data);
        // write data to file and then close it
        fs.writeFile(fileDescriptor, stringData, (err2) => {
          if (!err2) {
            fs.close(fileDescriptor, (err3) => {
              if (!err3) {
                callback(false);
              } else {
                callback("Error closing the new file!");
              }
            });
          } else {
            callback("Error writing to new file!");
          }
        });
      } else {
        callback("There was an error, file may already exists!");
      }
    }
  );
};

// Read file from data

library.read = (dir, file, callback) => {
  fs.readFile(`${library.basedir + dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

// For data read and write both [UPDATE]

library.update = (dir, file, data, callback) => {
  fs.open(
    `${library.basedir + dir}/${file}.json`,
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert the data to string
        const stringData = JSON.stringify(data);
        fs.truncate(fileDescriptor, (err) => {
          if (!err) {
            // Write to the file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback(`Error While Closing file`);
                  }
                });
              } else {
                callback(`Error while writing to gile `);
              }
            });
          }
        });
      }
    }
  );
};

module.exports = library;
