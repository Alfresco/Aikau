var alfConfig = require("./_config");

module.exports = function(grunt) {
   grunt.config.merge({

      folder_list: {
         alf_widgets: {
            options: {
               files: true,
               folder: true
            },
            files: [{
               src: [alfConfig.files.js],
               dest: alfConfig.files.alfWidgets
            }]
         },
         alf_test_models: {
            options: {
               files: true,
               folder: true
            },
            files: [{
               src: [alfConfig.files.testModel],
               dest: alfConfig.files.alfTestModels
            }]
         }
      }

   });
};