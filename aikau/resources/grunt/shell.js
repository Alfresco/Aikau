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