/* Title:-Not Found Handelers .
Description  :- 404 Not Found  Handelers
Author: Sudipta Jana .
Date : 21/may/23  */


// Modules scaffolding 
const  handeler = {} ;

handeler.notFoundHandeler = (requestProperties,callback) =>{
  callback(404,{
    message : "Requested url was not found "
  })
}

module.exports = handeler ;