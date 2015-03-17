var alfConfig = require("./_config");

module.exports = function(grunt) {
   grunt.config.merge({
      watch: {
         test: {
            files: [alfConfig.files.testScripts],
            tasks: ["intern:dev"]
         }
      }
   });
};