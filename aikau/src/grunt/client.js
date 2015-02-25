var alfConfig = require("./_config");

module.exports = function(grunt) {

   // Update the grunt config
   grunt.config.merge({
      prompt: {
         clientPatch: {
            options: {
               questions: []
            }
         },
      }
   });

   // Create the clientPatch task
   grunt.registerTask("clientPatch", "Take a local Aikau JAR and put it into the specified Share webapp", function() {

      // Build the questions config for the prompt
      var destinations = alfConfig.clientPatch.destinations,
         choices = destinations.map(function(destination) {
            return {
               name: destination.name,
               value: destination.libDir
            };
         }),
         questions = [{
            config: "copy.clientPatch.dest",
            type: "list",
            message: "Patch which client?",
            choices: choices
         }];

      // Update the prompt configuration
      grunt.config("prompt.clientPatch.options.questions", questions);

      // Ask the question
      grunt.task.run("prompt:clientPatch");

      // Copy to the clean config (it's now already in the copy config)
      var chosenDest = grunt.config("copy.clientPatch.dest"),
         aikauJars = chosenDest + "/aikau-*.jar";
      grunt.config("clean.clientPatch", aikauJars);

      // Call the tasks
      grunt.task.run("shell:mavenInstall");
      grunt.task.run("clean:clientPatch");
      grunt.task.run("copy:clientPatch");

   });

};