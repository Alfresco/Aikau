var alfConfig = require("./_config");

module.exports = function(grunt) {
   grunt.config.merge({

      clean: {
         coverageReports: alfConfig.files.coverageReports,
         coverageReportsTemp: alfConfig.dir.coverageTemp,
         instrumentedCode: alfConfig.dir.jsInst,
         jsdoc: alfConfig.dir.docs,
         requireEverythingWidgetsList: alfConfig.files.alfWidgets,
         testScreenshots: alfConfig.files.testScreenshots
      }

   });
};