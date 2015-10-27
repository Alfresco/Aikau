module.exports = function(grunt) {
   grunt.config.merge({

      copy: {
         coverageReportsToTemp: {
            files: [{
               expand: true,
               flatten: true,
               src: "code-coverage-reports/*",
               dest: "code-coverage-reports/temp/",
               filter: "isFile"
            }]
         },
         coverageReportsFromTemp: {
            files: [{
               expand: true,
               flatten: true,
               src: "code-coverage-reports/temp/*",
               dest: "code-coverage-reports/",
               filter: "isFile"
            }]
         },
         clientPatch: {
            expand: true,
            flatten: true,
            cwd: "target",
            src: "aikau-*.jar",
            dest: ""
         }
      }

   });
};