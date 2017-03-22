/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const _ = require('lodash');
const jimp = require('jimp');
const glob = require('glob');
const path = require('path');
const sizeAndScale = require('./src/ImageOperations').sizeAndScale;
const source = path.resolve(process.cwd(), '_source');
const dist = path.resolve(process.cwd(), '_out');
let run = function () {
  console.log('hello world');
  let files = findInDir(source, '**/*.png');
  let ip = [];
  _.forEach(files, function (value, index) {
    ip.push(sizeAndScale(
      path.resolve(source, value),
      path.resolve(dist, value)
    ))
  })
};
let findInDir = function (dir, pattern) {
  return glob.sync(pattern, {cwd: dir})
};
run();