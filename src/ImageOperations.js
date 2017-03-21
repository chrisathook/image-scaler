/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const _ = require('lodash');
const Jimp = require('jimp');
const path = require('path');
const imageSize = require('image-size');
const kb = 1024;
let sizeAndScale = function (imagePath, outputPath, scale = 1, sizeInKB = 100) {
  return new Promise(function (resolve, reject) {
    let startingSize = 0;
    Jimp.read(imagePath)
      .then(bufferReport)
      .then(function (report) {
        console.log(imagePath);
        console.log(report.size);
        console.log(report.kb);
        startingSize = report.kb;
        return report
      })
      .then(function (report) {
        let quality = 101;
        let finalImage = null;
        let currentSize = 0;
        do {
          quality = quality - 1;
          let currentImage = report.image.clone().quality(quality);
          let currentReport = yield  bufferReport(currentImage);
          currentSize = currentReport.kb
          finalImage = currentImage
        } while (currentSize > sizeInKB || quality > 10) ;
        finalImage.write(imagePath.replace('.png', '.jpg'), function (err, value) {
          resolve()
        })
      })
  })
};
let bufferReport = function (image) {
  return new Promise(function (resolve, reject) {
    image.getBuffer(Jimp.AUTO, function (err, value) {
      let size = value.byteLength;
      resolve({image: image, size: size, kb: Math.ceil(size / kb)})
    });
  })
};
module.exports = {
  sizeAndScale: sizeAndScale
};