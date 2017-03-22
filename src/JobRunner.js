/**
 * Created by Christopher on 3/22/2017.
 */
"use strict";
const _ = require('lodash');
let JobConfig = function (sourceDir, outputDir, name = 'defaultName', scale = 1, targetKB = 100) {
  return {name: name, scale: scale, targetKB: targetKB, sourceDir: sourceDir, outputDir: outputDir};
};
let RunJob = function (jobConfig) {
  return new Promise(function (resolve, reject) {
    let files = findInDir(jobConfig.sourceDir, '**/*.png');
    
  })
};
let findInDir = function (dir, pattern) {
  return glob.sync(pattern, {cwd: dir})
};
module.exports = {
  JobConfig: JobConfig,
  RunJob: RunJob
};
