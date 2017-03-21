/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const _ = require('lodash');
const Jimp = require('jimp');
const imageSize = require('image-size');

const kb=1024;

let sizeAndScale = function (imagePath, outputPath, scale = 1, sizeInKB = 100) {
  return new Promise(function (resolve, reject) {
    Jimp.read(imagePath).then(function (image) {
  
      let size = 0;
  
      let imageBuffer = image.getBuffer (Jimp.AUTO,function (err,value){
        size = imageSize (value);
        size
        
      });
      
     
      
      
    })
  })
};



module.exports = {
  
  sizeAndScale : sizeAndScale
  
};