/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const Jimp = require('jimp');
const kb = 1024;
let sizeAndScale = function (imagePath, outputPath, scale = 1, sizeInKB = 200) {
  return new Promise(function (resolve, reject) {
    let quality = 20;
    let startingImage = null;
    let finalImage = null;
    let callback = function (report, imageGood = false) {
      if (imageGood === true) {
        finalImage.write(outputPath.replace('.png', '.jpg'), function (err, value) {
          resolve()
        });
      } else {
        if (quality > 10) {
          run(startingImage, callback);
        } else {
          reject('Image Cannot Be Made At this File Weight')
        }
      }
    };
    let run = function (image, cb) {
      quality -= 1;
      let currentImage = image.clone().quality(quality);
      bufferReport(currentImage, Jimp.MIME_JPEG).then(function (report) {
        if (report.kb <= sizeInKB) {
          finalImage = currentImage;
          cb(report, true);
        } else {
          cb(report, false);
        }
      })
    };
    Jimp.read(imagePath).then(function (image) {
      startingImage = image;
      run(startingImage, callback);
    });
  })
};
let bufferReport = function (image, mime = Jimp.AUTO) {
  return new Promise(function (resolve, reject) {
    image.getBuffer(mime, function (err, value) {
      let size = value.byteLength;
      resolve({size: size, kb: Math.ceil(size / kb)})
    });
  })
};
module.exports = {
  sizeAndScale: sizeAndScale
};