var alfConfig = require("./_config");

module.exports = function(grunt) {

   // Clean, re-create, display in browser
   grunt.registerTask("docs", ["clean:jsdoc", "jsdoc", "connect:jsdoc"]);

   // Create the JSDoc
   grunt.config.merge({

      jsdoc: {
         dist: {
            src: [alfConfig.dir.jsdoc, alfConfig.files.jsdocReadme],
            options: {
               destination: alfConfig.dir.docs,
               template: alfConfig.dir.jsdocTemplates,
               configure: alfConfig.files.jsdocConfig
            }
         }
      }

   });
};