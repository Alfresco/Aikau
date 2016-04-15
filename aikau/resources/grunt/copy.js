module.exports = function(grunt) {
   grunt.config.merge({

      copy: {
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