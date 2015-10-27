module.exports = function(grunt) {

   // Load all grunt modules
   require("load-grunt-tasks")(grunt);
   grunt.loadNpmTasks("intern");

   // Time the grunt tasks
   // (ignores any that take less than 1% of total time)
   require("time-grunt")(grunt);

   // Load external grunt tasks
   grunt.loadTasks("resources/grunt");

};