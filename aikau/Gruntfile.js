module.exports = function(grunt) {

   // Load all grunt modules
   require("load-grunt-tasks")(grunt);
   grunt.loadNpmTasks("intern");

   // Load external grunt tasks
   grunt.loadTasks("src/grunt");

};