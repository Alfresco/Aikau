var notify = require("../../node_modules/grunt-notify/lib/notify-lib");

module.exports = function(grunt) {

   // Notifications
   grunt.registerMultiTask("notify", function() {
      var opts = this.options();
      notify({
         title: opts.title,
         message: opts.message
      });
   });

   // Update the grunt config
   grunt.config.merge({
      notify: {
         testUpdating: {
            options: {
               title: "Test app updating",
               message: "The test app is updating..."
            }
         },
         testUpdated: {
            options: {
               title: "Test app updated",
               message: "The test app has been updated and the caches cleared"
            }
         },
         internFail: {
            options: {
               title: "Unit tests failed",
               message: "At least one unit test failed - please see screen for more info"
            }
         },
         internPass: {
            options: {
               title: "Unit tests passed",
               message: "All unit tests passed successfully"
            }
         },
      }
   });
};