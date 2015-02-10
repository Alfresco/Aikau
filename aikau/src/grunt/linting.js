var alfConfig = require("./_config");

module.exports = function(grunt) {
   grunt.config.merge({
      jshint: {
         options: {
            reporter: require("jshint-stylish"),
            jshintrc: true,
            force: true
         },
         all: [
            alfConfig.files.gruntFile,
            alfConfig.files.gruntTasks,
            alfConfig.files.js
         ]
      }
   });
};