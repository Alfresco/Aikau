var alfConfig = require("./_config"),
   path = require("path"),
   tcpPortUsed = require("tcp-port-used");

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

   // Generate a coverage report using a vagrant initialised VM
   // The VM is run up by the task
   grunt.registerTask("vm-coverage-report", "A task for collecting code coverage reports using a vagrant VM", function() {
      grunt.task.run("shell:stopTestApp");
      grunt.option("force", true);
      grunt.task.run("generate-require-everything");
      grunt.task.run("instrument-code");
      grunt.task.run("copyInstrumentedCode");
      grunt.task.run("hideExistingCoverageReports");
      grunt.task.run("start-node-coverage-server");
      grunt.task.run("startUnitTestApp");
      grunt.task.run("waitServer");
      grunt.task.run("intern:dev_coverage");
      grunt.task.run("merge-reports");
      grunt.task.run("clean-reports");
      grunt.task.run("showExistingCoverageReports");
      grunt.task.run("copyOriginalCode");
      grunt.task.run("clean:instrumentedCode");
      grunt.task.run("shell:stopTestApp");
   });

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

   // Merge individual coverage reports in the node coverage server
   // TODO: Give the report a sensible name (e.g. with a timestamp)
   grunt.registerTask("merge-reports", "A task for merging code coverage reports", function() {
      var done = this.async();
      var mergeArgs = [
         "node_modules/node-coverage/merge.js",
         "-o",
         "code-coverage-reports/Coverage_Report_" + Date.now() + ".json"
      ];

      var reports = grunt.file.expand(["code-coverage-reports/*.json"]);
      for (var i = 0; i < reports.length; i++) {
         mergeArgs.push(reports[i]);
      }

      grunt.util.spawn({
         cmd: "node",
         args: mergeArgs,
         opts: {
            stdio: "inherit"
         }
      }, function(error, result, code) {
         /*jshint unused:false*/
         grunt.log.writeln("Finished merging reports...");
         done();
      });
   });

   // Remove individual reports from the node coverage server
   grunt.registerTask("clean-reports", "A task for cleaning out individual code coverage reports", function() {
      var reports = grunt.file.expand(["code-coverage-reports/report_*.json"]);
      for (var i = 0; i < reports.length; i++) {
         grunt.file.delete(reports[i]);
      }
   });

   // Delete existing instrumented code and run the coverage module instrumentation process to replace it
   grunt.registerTask("instrument-code", "Use the node-coverage module to instrument the widgets with coverage collection data", function() {
      var done = this.async();
      if (grunt.file.isDir(alfConfig.dir.jsInst)) {
         grunt.file.delete(alfConfig.dir.jsInst, {
            force: true
         });
      }

      grunt.util.spawn({
         cmd: "node",
         args: ["node_modules/node-coverage/instrument.js",
            "src/main/resources/alfresco",
            "src/main/resources/alfrescoInst",
            "--function"
         ]
      }, function(error, result, code) {
         /*jshint unused:false*/
         grunt.log.writeln("Finished instrumenting files...");
         done();
      });
   });

   // Start the node coverage server
   grunt.registerTask("start-node-coverage-server", "A task to start the node-coverage server (it will stay running)", function() {
      if (!grunt.file.isDir(alfConfig.dir.coverage)) {
         grunt.file.mkdir(alfConfig.dir.coverage);
      }

      tcpPortUsed.check(8082, "localhost")
         .then(function(inUse) {
            /*jshint unused:false*/
            if (!inUse) {
               var nodeCoverage = grunt.util.spawn({
                  cmd: "node",
                  args: ["node_modules/node-coverage/server.js",
                     "--port",
                     "8082",
                     "--report-dir",
                     alfConfig.dir.coverage
                  ],
                  opts: {
                     detached: "true",
                     stdio: "inherit"
                  }
               }, function(error, result, code) {
                  grunt.log.writeln("Finished spawning node-coverage server...");
               });
            } else {
               grunt.log.writeln("Node coverage server appears to be running already...");
            }
         }, function(err) {
            console.error("Unknown if coverage server is already running:", err.message);
         });
   });
};