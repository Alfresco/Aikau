var alfConfig = require("./_config");

module.exports = function(grunt) {
   grunt.config.merge({
      shell: {

         // Default options
         options: {
            stdout: true,
            stderr: true,
            failOnError: true
         },

         // Starts the Aikau unit test application
         startTestApp: {
            command: "mvn jetty:run",
            options: {
               stderr: false,
               async: true
            }
         },

         // Stops the Aikau unit test application
         stopTestApp: {
            command: "mvn jetty:stop"
         },

         // selenium
         seleniumUp: {
            command: "java -jar selenium*.jar",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant + "/selenium",
                  maxBuffer: "Infinite"
               }
            }
         },

         // See also vagrant.js
         // Start the vagrant VM
         vagrantUp: {
            // This checks the installed plugin list first to see if vbguest is installed. If not it installs it before running vagrant up
            // vbguest makes sure the virtual box guest additions on the VM are kept in sync with the Virtual Box app installed locally.
            // if the two aren't kept in sync, then there may be issues connecting to the VM which may not be obviously related.
            // If this command errors, then make sure you're running the latest vagrant version (1.6.5 or newer).
            command: "vagrant plugin list | grep 'vbguest'> /dev/null; if [ $? -eq 1 ]; then vagrant plugin install vagrant-vbguest; fi; vagrant up",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },

         // Reset the vagrant VM
         vagrantDestroy: {
            command: "vagrant destroy -f",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },

         // Set up an already running Vagrant VM instance
         vagrantProvision: {
            command: "vagrant provision",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },

         // Shutdown a running vagrant VM istance
         vagrantHalt: {
            command: "vagrant halt",
            options: {
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         },

         // See also vagrant.js
         // Start the vagrant VM
         vagrantReload: {
            command: "vagrant reload",
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