var alfConfig = require("./_config"),
   path = require("path"),
   istanbul = require("istanbul");

module.exports = function(grunt) {

   // Listing all the widgets and then generate the RequireEverything widget
   grunt.registerTask("generateRequireEverything", function() {

      // Alias access to the config
      var config = alfConfig.requireEverything;

      // Loop through the files and record the paths
      var amdPaths = [];
      grunt.file.recurse(alfConfig.dir.main, filePath => {
         var pathMatch = config.pathRegex.exec(filePath),
            amdPath = pathMatch && pathMatch[1],
            includeFile = amdPath && config.exclusions.indexOf(amdPath) === -1;
         includeFile && amdPaths.push(amdPath);
      });
      var requireString = `"${amdPaths.join("\",\n   \"")}"`;

      // Create the new file
      var fileTemplate = grunt.file.read(config.template),
         parsedTemplate = fileTemplate.replace("{0}", requireString);
      grunt.file.write(config.widget, parsedTemplate);
   });

   // Functions to copy/restore the instrumented/original code
   grunt.registerTask("copyInstrumented", function() {
      grunt.file.expand(alfConfig.dir.appTargetDirs).forEach(targetDir => {
         grunt.file.recurse(alfConfig.dir.mainInstrumented, (abspath, rootdir) => {
            var relativePath = abspath.substr(rootdir.length).replace(/^(\/|\\)/, ""),
               targetPath = path.join(targetDir, alfConfig.dir.basePackage, relativePath);
            grunt.file.copy(abspath, targetPath);
         });
      });
   });
   grunt.registerTask("restoreInstrumented", function() {
      grunt.file.expand(alfConfig.dir.appTargetDirs).forEach(targetDir => {
         grunt.file.recurse(alfConfig.dir.main, (abspath, rootdir) => {
            var relativePath = abspath.substr(rootdir.length).replace(/^(\/|\\)/, ""),
               targetPath = path.join(targetDir, alfConfig.dir.basePackage, relativePath);
            grunt.file.copy(abspath, targetPath);
         });
      });
   });

   // The coverage alias
   grunt.registerTask("coverage", [
      "shell:stopTestApp",
      "generateRequireEverything",
      "clean:coverage",
      "instrumentCode",
      "copyInstrumented",
      "startApp",
      "waitServer",
      "intern:dev",
      "shell:stopTestApp",
      "restoreInstrumented",
      "clean:instrumentedCode"
   ]);

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

      // Loop through the files and instrument them
      grunt.file.recurse(alfConfig.dir.main, (abspath, rootdir, subdir, filename) => {
         var orig = grunt.file.read(abspath),
            relativePath = subdir ? path.join(subdir, filename) : filename,
            isJS = filename.substr(-3) === ".js",
            instrumented = isJS ? instrumenter.instrumentSync(orig, abspath) : orig;
         grunt.file.write(path.join(alfConfig.dir.mainInstrumented, relativePath), instrumented);
      });
   });

   // Register test tasks for local/vagrant/SauceLabs/grid respectively
   grunt.registerTask("prepareForTesting", ["startApp", "waitServer", "clean:testScreenshots", "generateRequireEverything"]);
   grunt.registerTask("test_local", ["prepareForTesting", "intern:local"]);
   grunt.registerTask("test", ["prepareForTesting", "intern:dev"]);
   grunt.registerTask("test_bs", ["prepareForTesting", "intern:bs"]);
   grunt.registerTask("test_bamboo", ["prepareForTesting", "intern:bamboo"]);

   // Intern events
   grunt.event.on("intern.fail", function() {
      grunt.task.run("notify:internFail");
   });
   grunt.event.on("intern.pass", function() {
      grunt.task.run("notify:internPass");
   });

   // Update the grunt config
   grunt.config.merge({
      intern: {
         options: {
            runType: "runner",
            rowsCols: process.stdout.rows + "|" + process.stdout.columns,
            coverageDir: alfConfig.dir.coverage,
            testsDir: alfConfig.dir.testResources,
            rawIO: true
         },
         bs: {
            options: {
               config: "src/test/resources/intern_bs"
            }
         },
         bamboo: {
            options: {
               config: "src/test/resources/intern_bamboo",
               rawIO: false
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