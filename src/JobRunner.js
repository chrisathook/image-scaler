/**
 * Created by Christopher on 3/22/2017.
 */
"use strict";
const path = require('path');
const glob = require('glob');
const json2csv = require('json2csv');
const fs = require('fs-plus');

//
const sizeAndScale = require('../src/ImageOperations').sizeAndScale;
//
let JobConfig = function (sourceDir, outputDir, minQuality, scale, targetKB, name = 'defaultName') {
  return {
    name: name,
    scale: scale,
    targetKB: targetKB,
    minQuality: minQuality,
    sourceDir: sourceDir,
    outputDir: outputDir
  };
};
let RunJob = function (jobConfig) {
  return new Promise(function (resolve, reject) {
    let files = findInDir(jobConfig.sourceDir, '**/*.png');
    // generator
    function *run() {
      for (let value of files) {
        let ret = sizeAndScale(
          path.resolve(jobConfig.sourceDir, value),
          path.resolve(jobConfig.outputDir, jobConfig.name, value.replace('.png', '.jpg')),
          jobConfig.minQuality,
          jobConfig.scale,
          jobConfig.targetKB
        );
        yield ret
      }
    }
    
    const iterator = run();
    const reporter = JobReporter();
    reporter.createQueue(
      ['Image Path', 'Final KB', 'Final Width', 'Final Height', 'Successful Conversion']
    );
    function step() {
      let item = iterator.next();
      if (!item.done) {
        item.value
          .then(function (value) {
            let lineItem = {
              "Image Path": value.path,
              "Final KB": value.stats.size,
              "Final Width": value.dimensions.width,
              "Final Height": value.dimensions.height,
              "Successful Conversion": value.success
            };
            reporter.appendLine(lineItem)
          })
          .then(step);
      } else {
        reporter.printReport(
          path.resolve(jobConfig.outputDir,jobConfig.name,jobConfig.name+'.csv')
          
        );
        resolve()
      }
    }
    
    step();
  })
};
let JobReporter = function () {
  let _queue = [];
  let _fields = [];
  let createQueue = function (fields) {
    _queue = [];
    _fields = fields;
  };
  let appendLine = function (lineItem) {
    _queue.push(lineItem);
  };
  let printReport = function (filePath) {
    return new Promise(function (resolve, reject) {
      let csv = json2csv({data: _queue, fields: _fields});
  
      fs.writeFile(filePath, csv, function(err) {
        if (err) {
  
          reject(err);
        }
        console.log('file saved');
        resolve()
      });
      
    });
  };
  return  {
    createQueue: createQueue,
    appendLine: appendLine,
    printReport: printReport
  };
};

let findInDir = function (dir, pattern) {
  return glob.sync(pattern, {cwd: dir})
};
module.exports = {
  JobConfig: JobConfig,
  RunJob: RunJob
};
