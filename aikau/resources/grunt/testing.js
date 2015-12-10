var notify = require("../../node_modules/grunt-notify/lib/notify-lib"),
   tcpPortUsed = require("tcp-port-used");

module.exports = function(grunt) {

   // New Test
   grunt.registerTask("newTest", ["shell:stopTestApp", "vdown", "vup", "test"]);
   grunt.registerTask("nt", ["newTest"]);

   // Register a test task that uses Intern_local for development purposes (no server restarts)
   grunt.registerTask("dt", ["intern:local"]);

   // Register test tasks for local/vagrant/SauceLabs/grid respectively
   grunt.registerTask("test_local", ["startUnitTestApp", "waitServer", "clean:testScreenshots", "generate-require-everything", "intern:local"]);
   grunt.registerTask("test", ["startUnitTestApp", "waitServer", "clean:testScreenshots", "generate-require-everything", "intern:dev"]);
   grunt.registerTask("test_bs", ["startUnitTestApp", "waitServer", "clean:testScreenshots", "generate-require-everything", "intern:bs"]);
   grunt.registerTask("test_sl", ["startUnitTestApp", "waitServer", "clean:testScreenshots", "generate-require-everything", "intern:sl"]);
   grunt.registerTask("test_grid", ["waitServer", "clean:testScreenshots", "generate-require-everything", "intern:grid"]);

   // Watch for changes and retest
   grunt.registerTask("watchDev", ["watch:dev"]);
   grunt.registerTask("watchTest", ["watch:test"]);

   // Restart the test server
   grunt.registerTask("restartTestApp", ["shell:stopTestApp", "startUnitTestApp"]);

   // Build and then clear cached stuff
   grunt.registerTask("updateTest", ["notifyTestUpdating", "shell:mavenProcessTestResources", "http:testAppReloadWebScripts", "http:testAppClearCaches", "notifyTestUpdated"]);

   // Start jetty server if not already running. Use waitServer to check startup finished
   grunt.registerTask("startUnitTestApp", "Spawn a Maven process to start the Jetty server running the unit test application", function() {
      grunt.log.writeln("Check Jetty unit test application state...");
      var done = this.async();
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

   // Notifications
   grunt.registerTask("notifyTestUpdating", "Notify that the 'updatedTest' task has started", function() {
      notify({
         title: "Test app updating",
         message: "The test app is updating..."
      });
   });
   grunt.registerTask("notifyTestUpdated", "Notify that the 'updatedTest' task has completed", function() {
      notify({
         title: "Test app updated",
         message: "The test app has been updated and the caches cleared"
      });
   });
   grunt.event.on("intern.fail", function(data) {
      notify({
         title: "Unit test(s) failed",
         message: data
      });
   });
   grunt.event.on("intern.pass", function(data) {
      notify({
         title: "Unit test(s) passed successfully",
         message: data
      });
   });

   // Update the grunt config
   grunt.config.merge({
      intern: {
         options: {
            rowsCols: process.stdout.rows + "|" + process.stdout.columns // Used by ConcurrentReporter
         },
         bs: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern_bs",
               useLocalhost: true
            }
         },
         dev: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern"
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
               config: "src/test/resources/intern_local"
            }
         },
         sl: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern_sl"
            }
         },
         grid: {
            options: {
               runType: "runner",
               config: "src/test/resources/intern_grid"
            }
         }
      }
   });

};