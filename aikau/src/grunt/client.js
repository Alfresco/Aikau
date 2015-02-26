/**
 * This file is used to perform actions relating to your client application(s), i.e. ones that are using Aikau,
 * and specifically helper functions to make developing for those clients easier.
 *
 * In order to use these tasks, you will need to have the client configuration accessible from a clientConfig.js
 * file in the root of this project.
 *
 * Example clientConfig.js content:
 *
 *    module.exports = {
 *       clientPatch: {
 *          destinations: {
 *             "My Alfresco Client": {
 *                libDir: "/Users/fbloggs/Development/projects/myAlf/code/root/projects/slingshot/target/share/WEB-INF/lib/",
 *                cacheBust: {
 *                   url: "http://localhost:8081/share/page/caches/dependency/clear",
 *                   method: "POST",
 *                   auth: {
 *                      user: "admin",
 *                      pass: "admin"
 *                   }
 *                }
 *             }
 *          }
 *       }
 *    };
 *
 * The destination member-properties are:
 *    libDir:
 *       This is the directory into which to copy built Aikau JARs
 *    moduleReload [optional]:
 *       If there is a URL that could be hit which would reload/use the copied JAR(s) then specify it here
 *       NOTE: The format of this object is as per the options object at https://github.com/johngeorgewright/grunt-http
 *    cacheBust [optional]:
 *       If there is a URL that could be hit which would clear any dependency caches to do with Aikau, then specify it here
 *       NOTE: The format of this object is as per the options object at https://github.com/johngeorgewright/grunt-http
 *
 * WARNING:
 * This config file will be ignored by git, so you should ensure that appropriate backups are in place as necessary.
 */

// Load requires
var path = require("path");

// Try to load a clientConfig file
var clientConfig;
try {
   clientConfig = require("../../clientConfig");
} catch (e) {
   // Ignore if not found
}

// Main function
module.exports = function(grunt) {

   // Create the clientPatch task
   grunt.registerTask("clientPatch", "Take a local Aikau JAR and put it into the specified Share webapp", function() {

      // Make sure we have the clientConfig
      if (!clientConfig) {
         grunt.log.error("Client config file missing: " + path.resolve("clientConfig.js"));
         return false;
      }

      // Load the destination choices for the patch
      var destinations = clientConfig.clientPatch.destinations,
         choices = [];
      for (var destName in destinations) {
         if (destinations.hasOwnProperty(destName)) {
            choices.push({
               name: destName
            });
         }
      }

      // Update the prompt configuration with the questions
      var questions = [{
         config: "customConfig.clientPatch.destination",
         type: "list",
         message: "Patch which client?",
         choices: choices
      }];
      grunt.config("prompt.clientPatch.options.questions", questions);

      // Create a configuration task to run after the prompt task
      grunt.registerTask("handleAnswers", function() {

         // Get the destination info from the question-answer
         var chosenDestination = grunt.config("customConfig.clientPatch.destination"),
            destinationInfo = clientConfig.clientPatch.destinations[chosenDestination];

         // Update the grunt config appropriately
         grunt.config("copy.clientPatch.dest", destinationInfo.libDir);
         grunt.config("http.clientPatchModuleReload.options", destinationInfo.moduleReload);
         grunt.config("http.clientPatchCacheBust.options", destinationInfo.cacheBust);

         // Create callback handler for the HTTP tasks
         function httpCallback(error, response, body) {
            /*jshint unused:false*/
            if (response.statusCode >= 400) {
               grunt.log.error("HTTP call failed. Continuing...");
            } else {
               grunt.log.ok();
            }
         }

         // Assume control of certain options for the HTTP tasks
         if (destinationInfo.moduleReload) {
            grunt.config("http.clientPatchModuleReload.options.callback", httpCallback);
            grunt.config("http.clientPatchModuleReload.options.ignoreErrors", true);
         }
         if (destinationInfo.cacheBust) {
            grunt.config("http.clientPatchCacheBust.options.callback", httpCallback);
            grunt.config("http.clientPatchCacheBust.options.ignoreErrors", true);
         }

         // Run the tasks
         grunt.task.run("shell:mavenInstall");
         grunt.task.run("copy:clientPatch");
         destinationInfo.cacheBust && grunt.task.run("http:clientPatchCacheBust");
         destinationInfo.moduleReload && grunt.task.run("http:clientPatchModuleReload");

      });

      // Ask the destination-question and then handle the results
      grunt.task.run("prompt:clientPatch");
      grunt.task.run("handleAnswers");

   });

};