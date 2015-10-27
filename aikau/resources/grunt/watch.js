var alfConfig = require("./_config");

module.exports = function(grunt) {
   grunt.config.merge({
      watch: {
         dev: {
            files: [alfConfig.files.app, alfConfig.files.testApp, alfConfig.files.testFramework, "!" + alfConfig.requireEverything.widget],
            tasks: ["updateTest"],
            options: {
               livereload: true
            }
         },
         test: {
            files: [alfConfig.files.testScripts],
            tasks: ["intern:dev"]
         }
      }
   });
};