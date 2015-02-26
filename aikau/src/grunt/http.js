module.exports = function(grunt) {
   grunt.config.merge({

      // Connect (simple HTTP server)
      connect: {
         jsdoc: {
            options: {
               base: "docs",
               hostname: "*",
               keepalive: true,
               open: true,
               port: 1337,
               useAvailablePort: true
            }
         }
      },

      // grunt-http (http abilities within grunt)
      http: {
         clientPatchModuleReload: {},
         clientPatchCacheBust: {}
      }

   });
};