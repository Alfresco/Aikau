var alfConfig = require("./_config"),
   tcpPortUsed = require("tcp-port-used");

module.exports = function(grunt) {

   // Register tasks to start/stop the test app
   grunt.registerTask("startApp", function() {
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
   grunt.registerTask("stopApp", function() {
      grunt.task.run("shell:stopTestApp");
   });

   // Reload the test app and clear in-server caches
   grunt.registerTask("updateTest", ["updateApp"]);
   grunt.registerTask("updateApp", ["notify:testUpdating", "shell:mavenProcessTestResources", "http:testAppReloadWebScripts", "http:testAppClearCaches", "notify:testUpdated"]);

   // Update the config
   grunt.config.merge({
      shell: {

         // Default options
         options: {
            stdout: true,
            stderr: true,
            failOnError: true
         },

         // Aikau test server
         startTestApp: {
            command: "mvn jetty:run",
            options: {
               stderr: false,
               async: true
            }
         },
         stopTestApp: {
            command: "mvn jetty:stop"
         },

         // Maven
         mavenInstall: {
            command: "mvn install"
         },
         mavenProcessTestResources: {
            command: "mvn -q process-test-resources"
         },

         // Vagrant
         vagrantUp: {
            command: "vagrant up",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },
         vagrantUpAndProvision: {
            command: "vagrant up --provision",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },
         vagrantProvision: {
            command: "vagrant provision",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },
         vagrantHalt: {
            command: "vagrant halt",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },
         vagrantDestroy: {
            command: "vagrant destroy -f",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },
         vagrantInstallGuestPlugins: {
            command: "vagrant plugin install vagrant-vbguest",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.root,
                  maxBuffer: "Infinite"
               }
            }
         },
         vagrantMountSharedFoldersFix: {
            command: "vagrant ssh -c \"sudo ln -s /opt/VBoxGuestAdditions-*/lib/VBoxGuestAdditions /usr/lib/VBoxGuestAdditions\"",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },
         vagrantReloadAndProvision: {
            command: "vagrant reload --provision",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         }
      }

   });
};