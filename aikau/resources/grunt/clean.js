var alfConfig = require("./_config");

module.exports = function(grunt) {
   grunt.config.merge({

      clean: {
         coverage: [alfConfig.dir.coverage],
         instrumentedCode: [alfConfig.dir.mainInstrumented],
         jsdoc: [alfConfig.dir.docs],
         testScreenshots: [alfConfig.files.testScreenshots]
      }

   });
};