/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Grunt tasks that use intern to run some tests
 */
module.exports = function(grunt) {

   // Load the Intern task - it isn"t "grunt-" prefixed so isn"t loaded automatically.
   // @see: https://github.com/theintern/intern/wiki/Using-Intern-with-Grunt#task-options
   grunt.loadNpmTasks("intern");

   // New Test
   grunt.registerTask("newTest", [
      "shell:stopTestApp",
      "vdown",
      "vup",
      "test"
   ]);
   grunt.registerTask("nt", [
      "newTest"
   ]);

   // Register a test task that uses Intern
   grunt.registerTask("test", [
      "startUnitTestApp",
      "waitServer",
      "intern:dev"
   ]);

   // Register a test task that uses Intern_local
   grunt.registerTask("test_local", [
      "startUnitTestApp",
      "waitServer",
      "intern:local"
   ]);

   // Register a test task that uses Intern_local for development purposes (no server restarts)
   grunt.registerTask("dt", [
      "intern:local"
   ]);

   // Register a test task that uses Intern_sl
   grunt.registerTask("test_sl", [
      "startUnitTestApp",
      "waitServer",
      "intern:sl" // Run all the intern tests on sauce labs
   ]);

   // Register a test task that uses Intern_grid
   grunt.registerTask("test_grid", [
      "startUnitTestApp",
      "waitServer",
      "intern:grid" // Run all the intern tests on grid
   ]);

   // Start the Jetty application for running the unit tests against. This will check that the
   // Jetty server is not already running (but checking that the port is not already in use)
   // but it will immediately return after spawning the process so it is necessary to use the
   // waitServer task to ensure that the server is ready before beginning tests
   grunt.registerTask("startUnitTestApp", "Spawn a Maven process to start the Jetty server running the unit test application", function() {

      grunt.log.writeln("Check Jetty unit test application state...");
      var done = this.async();

      var tcpPortUsed = require("tcp-port-used");
      tcpPortUsed.check(8089, "localhost")
         .then(function(inUse) {
            if (!inUse) {
               grunt.log.writeln("Starting unit test app...");
               grunt.task.run("shell:startTestApp");
               done();
            } else {
               grunt.log.writeln("Jetty unit test application appears to be running already...");
               done();
            }
         }, function(err) {
            console.error("Unknown if Jetty unit test application is already running:", err.message);
            done();
         });
   });

   grunt.registerTask("restartTestApp", [
      "shell:stopTestApp",
      "startUnitTestApp"
   ]);

   // Display notifications on test passes and failures...
   var notify = require("./node_modules/grunt-notify/lib/notify-lib");
   grunt.event.on("intern.fail", function(data) {
      notify({
         title: "Unit Test Failed",
         message: data
      });
   });

   // Return the config. This gets pushed into the grunt.init.config method in Gruntfile.
   return {
      // Use Intern plugin for tests.
      // @see: https://github.com/theintern/intern/wiki/Using-Intern-with-Grunt
      intern: {
         dev: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern",
               doCoverage: false
            }
         },
         dev_coverage: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern",
               doCoverage: true
            }
         },
         local: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern_local",
               doCoverage: false
            }
         },
         local_coverage: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern_local",
               doCoverage: true
            }
         },
         sl: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern_sl",
               doCoverage: false
            }
         },
         grid: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern_grid",
               doCoverage: false
            }
         }
      }
   };
};