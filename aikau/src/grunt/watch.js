/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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

'use strict';

/**
 * Grunt tasks that watch files and do stuff when they change
 */

module.exports = function (grunt, alf) {
   // Return the config. This gets pushed into the grunt.init.config method in Gruntfile.
   return {
      // Watch Commands (when the specified watch is active, task is run when files change.)
      // @see: https://github.com/gruntjs/grunt-contrib-watch
      watch: {
         // Trigger a deploy and restart & tests when a file changes
         // It works best to have only one watch, otherwise multiple builds could happen simultaneously.
         // TODO: Aikau files only...
         deploy: {
            files: [alf.jsFiles, alf.cssFiles, alf.htmlFiles], // no alf.testFiles in deploy watch as they don't get deployed.
            tasks: [
               's',
               'notify:shareDeployed'
            ],
            options: {
               interrupt: true
            }
         },
         test: {
            files: [alf.jsFiles, alf.cssFiles, alf.testFiles, alf.htmlFiles],
            tasks: [
               'newTest',
               'shell:jsdoc'
            ],
            options: {
               interrupt: true
            }
         }
      }
   };
};
