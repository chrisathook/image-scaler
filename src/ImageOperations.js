/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const _ = require('lodash');
const Jimp = require('jimp');
const imageSize = require('image-size');
const kb = 1024;
let sizeAndScale = function (imagePath, outputPath, scale = 1, sizeInKB = 100) {
  return new Promise(function (resolve, reject) {
    Jimp.read(imagePath).then(bufferReport).then (function (report){
      
      console.log (report)
      
    })
  })
};


let bufferReport = function (image) {
  return new Promise(function (resolve, reject) {
    image.getBuffer(Jimp.AUTO, function (err, value) {
      let size = value.byteLength;
      resolve({size: size, kb: Math.ceil(size / kb)})
    });
  })
};
module.exports = {
  sizeAndScale: sizeAndScale
};