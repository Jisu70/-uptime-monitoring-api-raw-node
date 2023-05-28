/* Title:- Sample Handelers .
Description  :- sample Handelers
Author: Sudipta Jana .
Date : 21/may/23  */


// Modules scaffolding 
const  handeler = {} ;

handeler.sampleHandeler = (requestProperties,callback) =>{
  callback(200,{
    message : ' This is from  sample url '
  }) ;

}

module.exports = handeler ;