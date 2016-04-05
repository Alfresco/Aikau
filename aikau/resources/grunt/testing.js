var alfConfig = require("./_config"),
   path = require("path"),
   notify = require("../../node_modules/grunt-notify/lib/notify-lib"),
   tcpPortUsed = require("tcp-port-used"),
   istanbul = require("istanbul");

module.exports = function(grunt) {

   // Generate a task for copying the uninstrumented code back...
   grunt.registerTask("copyOriginalCode", "Copy Uninstrumented Code", function() {
      var srcPath = "src/main/resources/alfresco";
      var targetRoot = "target/classes/META-INF/js/aikau/";

      // Return unique array of all file paths which match globbing pattern
      var options1 = {
         cwd: srcPath,
         filter: "isFile"
      };
      var globPattern1 = "**/*";
      var options2 = {
         cwd: targetRoot,
         filter: "isDirectory"
      };
      var globPattern2 = "*";

      var targetVersion;
      grunt.file.expand(options2, globPattern2)
         .forEach(function(matches) {
            console.log("Found target version: " + matches);
            targetVersion = matches;
            grunt.file.expand(options1, globPattern1)
               .forEach(function(fileMatches) {
                  var src = path.join(srcPath, fileMatches);
                  var target = path.join(targetRoot + targetVersion + "/alfresco", fileMatches);
                  grunt.file.copy(src, target);
               });
         });
   });

   // Generate a task for copying the instrumented code...
   grunt.registerTask("copyInstrumentedCode", "Copy Instrumented Code", function() {
      var srcPath = "src/main/resources/alfrescoInst";
      var targetRoot = "target/classes/META-INF/js/aikau/";

      // Return unique array of all file paths which match globbing pattern
      var options1 = {
         cwd: srcPath,
         filter: "isFile"
      };
      var globPattern1 = "**/*";
      var options2 = {
         cwd: targetRoot,
         filter: "isDirectory"
      };
      var globPattern2 = "*";

      var targetVersion;
      grunt.file.expand(options2, globPattern2)
         .forEach(function(matches) {
            console.log("Found target version: " + matches);
            targetVersion = matches;
            grunt.file.expand(options1, globPattern1)
               .forEach(function(fileMatches) {
                  var src = path.join(srcPath, fileMatches);
                  var target = path.join(targetRoot + targetVersion + "/alfresco", fileMatches);
                  console.log("Copying '" + src + "' to '" + target + "'");
                  grunt.file.copy(src, target);
               });
         });
   });

   // Aliases
   grunt.registerTask("hideExistingCoverageReports", ["copy:coverageReportsToTemp", "clean:coverageReports"]);
   grunt.registerTask("showExistingCoverageReports", ["copy:coverageReportsFromTemp", "clean:coverageReportsTemp"]);

   /* Register additional helper functions
    * These are used in the above tasks.
    */

   // Generate the RequireEverything widget - a widget listing task, a file write and then a clean of the listing file
   grunt.registerTask("generate-require-everything", "A task for listing widgets and then generating the RequireEverything widget from the list", function() {
      grunt.task.run("folder_list:alf_widgets");
      grunt.task.run("write-require-everything");
      grunt.task.run("clean:requireEverythingWidgetsList");
   });

   // Generate the RequireEverything widget
   // Should always be run after a "folder_list:alf_widgets" task
   grunt.registerTask("write-require-everything", "A task for writing the RequireEverything widget file", function() {

      var template = grunt.file.read(alfConfig.dir.testResources + "/" + alfConfig.requireEverything.template),
         widgetFiles = grunt.file.readJSON(alfConfig.files.alfWidgets),
         fileList = [];

      // Iterate over widgetFiles, removing unwanted files and topping and tailing the file paths accordingly
      for (var i = 0; i < widgetFiles.length; i++) {
         var filePath = widgetFiles[i].location
            .replace(alfConfig.requireEverything.widgetsPrefix, "")
            .replace(alfConfig.requireEverything.widgetsSuffix, "");
         if (alfConfig.requireEverything.exclusions.indexOf(filePath) === -1) {
            fileList.push("\n\t\"" + filePath + "\"");
         }
      }

      grunt.file.write(alfConfig.requireEverything.widget, template.replace("{0}", fileList.toString()));
      grunt.log.writeln("Finished writing RequireEverything widget");
   });

   // Generate a coverage report using a vagrant initialised VM
   // The VM is run up by the task
   grunt.registerTask("coverage", "Updated coverage task for collecting coverage data using istanbul instrumentation", function() {
      grunt.task.run("shell:stopTestApp");
      grunt.task.run("generate-require-everything");
      grunt.task.run("instrumentCode");
      grunt.task.run("copyInstrumentedCode");
      grunt.task.run("startUnitTestApp");
      grunt.task.run("waitServer");
      grunt.task.run("intern:dev");
      grunt.task.run("shell:stopTestApp");
      grunt.task.run("copyOriginalCode");
   });

   /* Register additional helper functions
    * These are used in the above tasks.
    */

   // Delete existing instrumented code and run the coverage module instrumentation process to replace it
   grunt.registerTask("instrumentCode", "Use istanbul to instrument the widgets with coverage collection data", function() {

      // Reset instrumented directory
      if (grunt.file.isDir(alfConfig.dir.mainInstrumented)) {
         grunt.file.delete(alfConfig.dir.mainInstrumented, {
            force: true
         });
      }
      grunt.file.mkdir(alfConfig.dir.mainInstrumented);

      // Get istanbul instrumenter
      var instrumenter = new istanbul.Instrumenter();

      // Loop through the 
      grunt.file.recurse(alfConfig.dir.main, (abspath, rootdir, subdir, filename) => {
         // grunt.log.writeln(`abspath=${abspath}, rootdir=${rootdir}, subdir=${subdir}, filename=${filename}`);
         var orig = grunt.file.read(abspath),
            relativePath = subdir ? path.join(subdir, filename) : filename,
            isJS = filename.substr(-3) === ".js",
            instrumented = isJS ? instrumenter.instrumentSync(orig, abspath) : orig;
         // grunt.log.writeln(`Instrumenting ${abspath} (isJS=${isJS})`);
         grunt.file.write(path.join(alfConfig.dir.mainInstrumented, relativePath), instrumented);
      });
   });

   // New Test
   grunt.registerTask("newTest", ["shell:stopTestApp", "vdown", "vup", "test"]);
   grunt.registerTask("nt", ["newTest"]);

   // Register a test task that uses Intern_local for development purposes (no server restarts)
   grunt.registerTask("dt", ["intern:local"]);

   // Register test tasks for local/vagrant/SauceLabs/grid respectively
   grunt.registerTask("test_local", ["startUnitTestApp", "waitServer", "clean:testScreenshots", "generate-require-everything", "intern:local"]);
   grunt.registerTask("test", ["startUnitTestApp", "waitServer", "clean:testScreenshots", "generate-require-everything", "intern:dev"]);
   grunt.registerTask("test_bs", ["startUnitTestApp", "waitServer", "clean:testScreenshots", "generate-require-everything", "intern:bs"]);
   grunt.registerTask("test_bamboo", ["startUnitTestApp", "waitServer", "clean:testScreenshots", "generate-require-everything", "intern:bamboo"]);
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
            runType: "runner",
            rowsCols: process.stdout.rows + "|" + process.stdout.columns,
            coverageDir: alfConfig.dir.coverage,
            testsDir: alfConfig.dir.testResources
         },
         bs: {
            options: {
               config: "src/test/resources/intern_bs"
            }
         },
         bamboo: {
            options: {
               config: "src/test/resources/intern_bamboo"
            }
         },
         dev: {
            options: {
               config: "src/test/resources/intern"
            }
         },
         local: {
            options: {
               config: "src/test/resources/intern_local"
            }
         }
      }
   });

};