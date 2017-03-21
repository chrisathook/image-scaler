/**
 * Created by Christopher on 3/21/2017.
 */
"use strict";
const _ = require('lodash');
const jimp = require ('jimp');
const glob = require ('glob');

const source = './_source';
const dist = './_out';

let run = function (){
  
  console.log ('hello world');
  
  let files = findInDir(source,'**/*.png');
  
  console.log (files);
  
};



let findInDir = function (dir,pattern) {
  
  
  return glob.sync (pattern, {cwd:dir} )
  
  
};


run();