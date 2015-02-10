module.exports = function(grunt) {

   // NOTE: It is by design that we wait for RequireEverything to be loaded. This is because
   //       by waiting for all dependencies to be processed in Surf BEFORE starting the unit tests
   //       we can avoid spurious test failures caused by timeouts. If RequireEverything has been
   //       loaded then then unit tests will run much faster and in a more consistent fashion.
   //       The down-side is that this is the longest page to load, however for test development
   //       it is recommended to manually control the Jetty test server for expediency.
   grunt.config.merge({
      waitServer: {
         server: {
            options: {
               url: "http://localhost:8089/aikau/page/tp/ws/RequireEverything",
               interval: 5000,
               timeout: 300000
            }
         }
      }
   });
};