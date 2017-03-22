/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const _ = require('lodash');
const jimp = require('jimp');
const glob = require('glob');
const path = require('path');
const fs = require('fs-plus');
const rimraf = require('rimraf');
//

const sizeAndScale = require('./src/ImageOperations').sizeAndScale;
const JobConfig = require('./src/JobRunner').JobConfig;
const RunJob = require('./src/JobRunner').RunJob;
//
const source = path.resolve(process.cwd(), '_source');
const dist = path.resolve(process.cwd(), '_out');


let run = function () {
  console.log('hello world');

  
  if (!fs.existsSync (dist)) {
    fs.makeTreeSync (dist);
  
  }else {
    rimraf.sync (dist);
    fs.makeTreeSync (dist);
  }
  
  let jobOne = JobConfig(source,dist);
  
  
  RunJob(jobOne).then (function (){
    
    console.log ('job done')
    
  })
  
  
};

run();