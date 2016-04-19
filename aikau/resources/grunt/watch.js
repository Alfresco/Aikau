var alfConfig = require("./_config");

module.exports = function(grunt) {

   // Single-word shortcut aliases
   grunt.registerTask("watchDev", ["watch:dev"]);
   grunt.registerTask("watchTest", ["watch:test"]);

   // Update the config
   grunt.config.merge({
      watch: {
         dev: {
            files: [alfConfig.files.app, alfConfig.files.testApp, alfConfig.files.testFramework, "!" + alfConfig.requireEverything.widget],
            tasks: ["updateApp"],
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