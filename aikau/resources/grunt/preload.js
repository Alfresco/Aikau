/*jshint latedef:false,esversion:6*/
var fs = require("fs"),
   path = require("path"),
   http = require("http"),
   alfConfig = require("./_config");

// Modify grunt
module.exports = function(grunt) {

   // Need strict mode for block-level scoping
   "use strict";

   grunt.registerMultiTask("preload", "Pre-load all of the available unit-test pages", function() {

      // Setup variables
      var done = this.async(),
         filePaths = this.files[0].src,
         numFiles = filePaths.length,
         filesLoaded = 0,
         unitTestString = "<family>aikau-unit-tests</family>",
         urlRegex = /<url>(.+)<\/url>/,
         testUrls = [],
         totalTestUrls = 0,
         urlsLoaded = 0,
         urlPrefix = "http://localhost:8089/aikau/page/tp/ws",
         pwd = process.cwd();

      // Define function to load each URL
      var onUrlLoaded = function() {
            urlsLoaded++;
            if (testUrls.length) {
               loadNextUrl();
            } else {
               grunt.log.writeln("");
               grunt.log.writeln("Complete!");
               done();
            }
         },
         loadNextUrl = function() {
            var nextUrl = testUrls.shift(),
               fullUrl = urlPrefix + nextUrl,
               percentOnLoaded = Math.ceil((urlsLoaded + 1) / totalTestUrls * 100);
            grunt.log.write(fullUrl + "...");
            http.get(fullUrl, res => {
               res.resume();
               grunt.log.writeln(`done (${percentOnLoaded}% - ${urlsLoaded + 1}/${totalTestUrls})`);
               onUrlLoaded();
            }).on("error", e => {
               grunt.log.writeln(`error (${percentOnLoaded}% - ${urlsLoaded + 1}/${totalTestUrls})`);
               grunt.log.error(e.message);
               onUrlLoaded();
            });
         };

      // Load each file and, if valid, store the URL
      grunt.log.writeln("Parsing files for URLs...");
      filePaths.forEach(filePath => {
         var absPath = path.join(pwd, filePath);
         fs.readFile(absPath, "utf8", (err, content) => {
            filesLoaded++;
            if (err) {
               grunt.log.writeln("Error reading " + filePath + ": " + err.msg);
            } else if (content && typeof content === "string" && content.indexOf(unitTestString) !== -1) {
               let regexMatch = content.match(urlRegex);
               if (regexMatch) {
                  testUrls.push(regexMatch[1]);
               }
            } else {
               grunt.log.writeln("...skipping file " + path.basename(filePath));
            }
            if (filesLoaded === numFiles) {
               grunt.log.writeln("Retrieved " + testUrls.length + " URLs from " + filesLoaded + " files!");
               grunt.log.writeln("");
               grunt.log.writeln("Loading pages ...");
               totalTestUrls = testUrls.length;
               loadNextUrl();
            }
         });
      });
   });

   // Update the grunt config
   grunt.config.merge({
      preload: {
         src: alfConfig.files.testPageDescriptors
      }
   });

};