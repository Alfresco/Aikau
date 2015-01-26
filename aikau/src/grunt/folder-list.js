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
 * Search tasks
 */

module.exports = function (grunt, alf) {
   // Return the config. This gets pushed into the grunt.init.config method in Gruntfile.
   return {
      // @see: https://github.com/roughcoder/grunt-folder-list
      folder_list: {
         alf_widgets: {
            options: {
               files: true,
               folder: true
            },
            files: [
               {
                  src: [alf.jsFiles],
                  dest: alf.testResourcesDir + '/' + alf.alfWidgetsList
               }
            ]
         },
         alf_test_models: {
            options: {
               files: true,
               folder: true
            },
            files: [
               {
                  src: [alf.testModelFiles],
                  dest: alf.testResourcesDir + '/' + alf.alfTestModels
               }
            ]
         }
      }
   };
};