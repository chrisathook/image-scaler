/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const path = require('path');
const fs = require('fs-plus');
const os = require('os');
const gm = require('gm');
const del = require('del');
const imageSize = require('image-size');
const kb = 1024;
let sizeAndScale = function (imagePath, outputPath, minQuality, scale, targetKB) {
  return new Promise(function (resolve, reject) {
    let quality = 101;
    let step = function () {
      quality -= 1;
      processAndReport(imagePath, outputPath, scale, quality, true).then(function (results) {
        let size = Math.round(results.stats.size / kb);
        results.stats.size = size;
        // image will never be what we want
        if (quality < minQuality && size > targetKB) {
          resolve({success: false, stats: results.stats, dimensions: results.dimensions, path: outputPath});
        } else if (size <= targetKB) {
          // image is the file size we want
          processAndReport(imagePath, outputPath, scale, quality, false).then(function (results) {
            results.stats.size= Math.round(results.stats.size / kb);
            
            resolve({success: true, stats: results.stats, dimensions: results.dimensions, path: outputPath});
          })
        } else {
          // image too big, run again
          step()
        }
      })
    };
    step()
  })
};
let processAndReport = function (imagePath, outputPath, scale, quality, preflight = true) {
  return new Promise(function (resolve, reject) {
    if (preflight === true) {
      outputPath = path.resolve(os.tmpdir(), path.parse(outputPath).base);
    } else {
      if (!fs.existsSync(path.parse(outputPath).dir)) {
        fs.makeTreeSync(path.parse(outputPath).dir);
      }
    }
    gm(imagePath)
      .strip()
      .resize(`${scale}%`, `${scale}%`)
      .quality(quality)
      .write(outputPath, function (err) {
        if (err) {
          throw Error(err);
        } else {
          let stats = fs.statSync(outputPath);
          let dimensions = imageSize(outputPath);
          if (preflight === true) {
            del.sync(outputPath, {force: true});
          }
          resolve({stats: stats, dimensions: dimensions});
        }
      })
  });
};
module.exports = {
  sizeAndScale: sizeAndScale
};