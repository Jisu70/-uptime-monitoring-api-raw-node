/* Title:- Sample Handelers .
Description  :- sample Handelers
Author: Sudipta Jana .
Date : 21/may/23  */


// Modules scaffolding 
const  handeler = {} ;

handeler.sampleHandeler = (requestProperties,callback) =>{
  console.log(requestProperties)
  callback(200,{
    message : ' This is a sample url '
  }) ;

}

module.exports = handeler ;