/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Grunt tasks that use the shell plugin to run commands in a unix shell.
 */
module.exports = function(grunt, alfConfig) {
   /*jshint maxlen:400*/

   var _ = require("lodash"), // Add the lodash util library
      extend = _.extend;

   // Shell Commands run by grunt
   // @see: https://github.com/sindresorhus/grunt-shell
   // Community Config to support the community who don't have access to our Dev Env.
   // Alfresco Config makes use of Dev Env commands that allow us to build Enterprise as well

   var communityConfig = {
         // Reset Share's Caches:
         resetCaches: {
            command: "curl -s -d 'reset=on' --header 'Accept-Charset:ISO-8859-1,utf-8' --header 'Accept-Language:en' -u admin:admin http://localhost:8081/share/service/index ;  curl -s 'http://localhost:8081/share/page/caches/dependency/clear' -H 'Content-Type: application/x-www-form-urlencoded' --data 'submit=Clear+Dependency+Caches' -u admin:admin",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },

         // start share & alfresco
         // Assumes script called "start-tomcat" and "start-app-tomcat" exist.
         startRepo: {
            command: "mvn install -pl ../../projects/web-client,../../projects/solr -Psolr-http -DskipTests && start-tomcat",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         startRepoExistingBuild: {
            command: "start-tomcat",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         se: {
            command: "mvn prepare-package -pl ../../projects/slingshot -DskipTests -Dmaven.yuicompressor.skip --offline",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         startShare: {
            command: "mvn prepare-package -pl ../../projects/slingshot -DskipTests -Dmaven.yuicompressor.skip && start-app-tomcat",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         startShareInc: {
            command: "mvn install -pl ../../projects/slingshot -DskipTests && start-app-tomcat",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         scb: {
            command: "mvn clean install -pl ../../projects/slingshot -DskipTests",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOption: {
                  maxBuffer: "Infinite"
               }
            }
         }

      },


      alfrescoConfig = {
         // Reset Share's Caches:
         resetCaches: {
            command: "ws -s; ds -s",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },

         // start share & alfresco
         startRepo: {
            command: "m r -ie -t",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         startRepoFull: {
            command: "m r -be -t",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         startRepoExistingBuild: {
            command: "m r -t",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         scb: {
            command: "m s -be",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOption: {
                  maxBuffer: "Infinite"
               }
            }
         },
         se: {
            // Note: always do an offline build for this use-case, we want it fast.
            command: "m s -e -o",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         startShare: {
            command: "m s -e && m s -t",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },
         startShareInc: {
            command: "m s -ie && m s -t",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         }
      },
      sharedConfig = {

         // Starts the Aikau unit test application
         startTestApp: {
            command: "mvn jetty:run",
            options: {
               stdout: true,
               stderr: false,
               async: true
            }
         },

         // Stops the Aikau unit test application
         stopTestApp: {
            command: "mvn jetty:stop"
         },

         // Generate JSDocs
         jsdoc: {
            command: "jsdoc ../../" + alfConfig.files.jsdoc + " ../../" + alfConfig.jsdocReadme + " -c ../../conf.json", // TODO: Make this work with defined paths.
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  cwd: alfConfig.dir.nodeBin
               }
            }
         },

         jsdocServer: {
            command: "python -m SimpleHTTPServer 8082",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  cwd: alfConfig.dir.docs,
                  maxBuffer: "Infinite"
               }
            }
         },

         mvnClean: {
            command: "mvn clean",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  cwd: alfConfig.dir.root,
                  maxBuffer: "Infinite"
               }
            }
         },

         // Update NPM dependencies:
         npmInstall: {
            command: "npm install",
            options: {
               stdout: true,
               stderr: true,
               failOnError: false,
               execOptions: {
                  maxBuffer: "Infinite"
               }
            }
         },

         // selenium
         seleniumUp: {
            command: "java -jar selenium*.jar",
            options: {
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  cwd: alfConfig.dir.vagrant + "/selenium",
                  maxBuffer: "Infinite"
               }
            }
         },

         // Stop running servers (I don't know of a more friendly but equally effective than this).
         killRepo: {
            command: "kill `lsof -t -i :8080 -sTCP:LISTEN`",
            options: {
               stdout: true,
               stderr: true,
               failOnError: false
            }
         },
         killShare: {
            command: "kill `lsof -t -i :8081 -sTCP:LISTEN`",
            options: {
               stdout: true,
               stderr: true,
               failOnError: false
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
               stdout: true,
               stderr: true,
               failOnError: true,
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
               stdout: true,
               stderr: true,
               failOnError: true,
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
               stdout: true,
               stderr: true,
               failOnError: true,
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
               stdout: true,
               stderr: true,
               failOnError: true,
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
               stdout: true,
               stderr: true,
               failOnError: true,
               execOptions: {
                  cwd: alfConfig.dir.vagrant,
                  maxBuffer: "Infinite"
               }
            }
         }

      },

      configToMerge = alfrescoConfig;
   if (process.env.CURRENT_PROJECT && process.platform === "win32") {
      // If we're not running within the Alfresco Dev Env (CURRENT_PROJECT) or
      // we"re running on Windows (which doesn"t support spawning child unix shells via node)
      // then we should run with communityConfig that doesn't assume the Dev Env helper scripts are present.
      configToMerge = communityConfig;
   }
   var shellConfig = extend(sharedConfig, configToMerge);

   // Return the config. This gets pushed into the grunt.init.config method in Gruntfile.
   return {
      shell: shellConfig
   };
};