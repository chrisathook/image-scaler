/**
 * Created by Christopher on 3/22/2017.
 */
"use strict";
const _ = require('lodash');
const path = require('path');
const glob = require('glob');
//
const sizeAndScale = require('../src/ImageOperations').sizeAndScale;
//
let JobConfig = function (sourceDir, outputDir,  scale , targetKB,name = 'defaultName' ) {
  return {name: name, scale: scale, targetKB: targetKB, sourceDir: sourceDir, outputDir: outputDir};
};
let RunJob = function (jobConfig) {
  return new Promise(function (resolve, reject) {
    let files = findInDir(jobConfig.sourceDir, '**/*.png');
    // generator
    function *run() {
      for (let value of files) {
        let ret = sizeAndScale(
          path.resolve(jobConfig.sourceDir, value),
          path.resolve(jobConfig.outputDir,jobConfig.name, value.replace ('.png','.jpg')),
          jobConfig.scale,
          jobConfig.targetKB
        );
        yield ret
      }
    }
    
    const iterator = run();
    
    function step() {
      let item = iterator.next();
      if (!item.done) {
        item.value.then(step);
      }else {
        
        resolve()
      }
    }
    
    step();
  })
};
let findInDir = function (dir, pattern) {
  return glob.sync(pattern, {cwd: dir})
};
module.exports = {
  JobConfig: JobConfig,
  RunJob: RunJob
};
