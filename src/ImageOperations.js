/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const _ = require('lodash');
const jimp = require('jimp');


let sizeAndScale = function (imagePath, outputPath, scale = 1, sizeInKB = 100) {
  return new Promise(function (resolve, reject) {
    jimp.read(imagePath).then(function (image) {
      image.write(outputPath,function (value){
        
        resolve ()
        
      })
    })
  })
};



module.exports = {
  
  sizeAndScale : sizeAndScale
  
};