/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const path = require('path');
const fs = require('fs-plus');
const os = require('os');
const gm = require('gm');
const del = require('del');
const kb = 1024;
let sizeAndScale = function (imagePath, outputPath,minQuality, scale, targetKB ) {
  return new Promise(function (resolve, reject) {
    let quality = 101;
    let step = function () {
      quality -= 1;
      processAndReport(imagePath, outputPath, scale, quality, true).then(function (stats) {
        let size = Math.round(stats.size / kb);
  
        // image will never be what we want
        if (quality <minQuality &&  size >targetKB ) {
          
          resolve ({success:false,stats:stats});
          
        }else if (size <= targetKB) {
          // image is the file size we want
          processAndReport(imagePath, outputPath, scale, quality, false).then(function (stats) {
            resolve ({success:true,stats:stats});
            
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
          if (preflight === true) {
            del.sync(outputPath, {force: true});
          }
          resolve(stats);
        }
      })
  });
};
module.exports = {
  sizeAndScale: sizeAndScale
};