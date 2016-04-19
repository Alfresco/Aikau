/*jshint maxlen:false*/
var ANSI = require("./ANSI");

module.exports = function(grunt) {

   // Create usage-message
   var usageMessage = `
${ANSI.Bright}${ANSI.FgBlue}Available Grunt tasks${ANSI.Reset}

${ANSI.FgBlue}Main${ANSI.Reset}
${ANSI.Bright}<default>${ANSI.Reset}      Display this message
${ANSI.Bright}clientPatch${ANSI.Reset}    Build and copy the latest Aikau JAR to a pre-defined directory ${ANSI.Dim}(see client.js for full details)${ANSI.Reset}
${ANSI.Bright}jsdoc${ANSI.Reset}          Build the JSDoc
${ANSI.Bright}docs${ANSI.Reset}           Build the JSDoc, deploy to a temporary server, and launch a web browser to view it
${ANSI.Bright}jshint${ANSI.Reset}         JSHint the src and test code ${ANSI.Dim}(as Bamboo will do once committed)${ANSI.Reset}

${ANSI.FgBlue}Vagrant${ANSI.Reset}
${ANSI.Bright}vcreate${ANSI.Reset}        Create a new vagrant box ${ANSI.Dim}(this will destroy any existing one)${ANSI.Reset}
${ANSI.Bright}vup${ANSI.Reset}            Start the vagrant box
${ANSI.Bright}vdown${ANSI.Reset}          Stop the vagrant box
${ANSI.Bright}vrestart${ANSI.Reset}       Restart the vagrant box ${ANSI.Dim}(calls "vdown" "vup")${ANSI.Reset}

${ANSI.FgBlue}Unit-testing application${ANSI.Reset}
${ANSI.Bright}startApp${ANSI.Reset}       Start the testing application
${ANSI.Bright}stopApp${ANSI.Reset}        Stop the testing application
${ANSI.Bright}preload${ANSI.Reset}        Pre-load all of the available unit-test pages

${ANSI.FgBlue}Development${ANSI.Reset}
${ANSI.Bright}watchDev${ANSI.Reset}       Watch for changes to the main codebase or to unit-test pages and reload the application
${ANSI.Bright}watchTest${ANSI.Reset}      Watch for change to the test classes and re-run the current test suites
${ANSI.Bright}updateApp${ANSI.Reset}      Rebuild the application, reload it and clear caches ${ANSI.Dim}(used to be called "updateTest")${ANSI.Reset}

${ANSI.FgBlue}Testing${ANSI.Reset}
${ANSI.Bright}test${ANSI.Reset}           Run the test suites chosen in ${ANSI.Bright}Suites.js${ANSI.Reset}, using ${ANSI.Bright}Chrome/FF${ANSI.Reset} on the vagrant VM
${ANSI.Bright}test_local${ANSI.Reset}     Run the test suites chosen in ${ANSI.Bright}Suites.js${ANSI.Reset}, using local ${ANSI.Bright}Chrome/FF${ANSI.Reset} ${ANSI.Dim}("selenium-standalone" must be running)${ANSI.Reset}
${ANSI.Bright}test_bs${ANSI.Reset}        Run the test suites chosen in ${ANSI.Bright}Suites.js${ANSI.Reset}, using ${ANSI.Bright}Chrome/FF/Safari/IE11${ANSI.Reset} on ${ANSI.Bright}Mac/Win${ANSI.Reset} via BrowserStack
${ANSI.Bright}test_bamboo${ANSI.Reset}    As per the ${ANSI.Bright}"test_bs"${ANSI.Reset} task, but only tests ${ANSI.Bright}Chrome/FF${ANSI.Reset} on ${ANSI.Bright}Win${ANSI.Reset}
${ANSI.Bright}coverage${ANSI.Reset}       Runs the same environments and suites as the ${ANSI.Bright}"test"${ANSI.Reset} task, but also analyses code coverage
`;

   // Output callable, "public" tasks
   grunt.registerTask("default", function() {
      grunt.log.writeln(usageMessage);
   });
};