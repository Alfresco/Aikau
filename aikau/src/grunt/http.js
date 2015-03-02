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
         clientPatchCacheBust: {},
         testAppReloadWebScripts: {
            options: {
               url: "http://localhost:8089/aikau/page/index",
               method: "POST",
               form: {
                  reset: "on"
               }
            }
         },
         testAppClearCaches: {
            options: {
               url: "http://localhost:8089/aikau/page/caches/dependency/clear",
               method: "POST"
            }
         }
      }

   });
};