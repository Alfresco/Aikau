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
 * Grunt task config for the copy plugin.
 */
module.exports = function() {

   return {
      // Copy tasks
      copy: {
         // Used for jsdoc
         customJsDocTemplate: {
            files: [{
               expand: true,
               src: ["jsdoc-templates/alfresco/**/*"],
               dest: [""],
               rename: function(dest, src) {
                  src = src.substring(src.indexOf("jsdoc-templates/alfresco/") + 25);
                  var newDest = "node_modules/jsdoc/templates/alfresco/" + src;
                  return newDest;
               }
            }]
         },
         // Used for hiding existing coverage reports
         coverageReportsToTemp: {
            files: [{
               expand: true,
               flatten: true,
               src: ["code-coverage-reports/*"],
               dest: "code-coverage-reports/temp/",
               filter: "isFile"
            }]
         },
         // Used for showing existing coverage reports
         coverageReportsFromTemp: {
            files: [{
               expand: true,
               flatten: true,
               src: ["code-coverage-reports/temp/*"],
               dest: "code-coverage-reports/",
               filter: "isFile"
            }]
         }
      }
   };
};