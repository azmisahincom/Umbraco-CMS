
'use strict';

/*
    * gulpfile.js
    * ===========
    * This is now using Gulp 4, each child task is now a child function in its own corresponding file.
    *
    * To add a new task, simply add a new task file to gulp/tasks folder, add a require statement below to include the one or more methods 
    * and then add the exports command to add the new item into the task menu.
    */

global.isProd = true;

const { src, dest, series, parallel, lastRun } = require('gulp');

const { dependencies } = require('./gulp/tasks/dependencies');
const { js } = require('./gulp/tasks/js');
const { less } = require('./gulp/tasks/less');
const { testE2e, testUnit } = require('./gulp/tasks/test');
const { views } = require('./gulp/tasks/views');
const { watchTask } = require('./gulp/tasks/watchTask');
const { removeProductionMode } = require('./gulp/tasks/removeProductionMode');

// Load local overwrites, can be used to overwrite paths in your local setup.
var fs = require('fs');
var onlyScripts = require('./gulp/util/scriptFilter');
try {
    if (fs.existsSync('./gulp/overwrites/')) {
        var overwrites = fs.readdirSync('./gulp/overwrites/').filter(onlyScripts);
        overwrites.forEach(function(overwrite) {
            require('./gulp/overwrites/' + overwrite);
        });
    }
} catch (err) {
    console.error(err)
  }

// ***********************************************************
// These Exports are the new way of defining Tasks in Gulp 4.x
// ***********************************************************
exports.build = series(parallel(dependencies, js, less, views), testUnit);
exports.dev = series(parallel(dependencies, js, less, views), watchTask);
exports.fastdev = series(removeProductionMode, parallel(dependencies, js, less, views), watchTask);
exports.watch = series(watchTask);
// 
exports.runTests = series(js, testUnit);
exports.testUnit = series(testUnit);
exports.testE2e = series(testE2e);
