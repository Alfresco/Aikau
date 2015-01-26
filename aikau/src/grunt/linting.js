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
 * Grunt tasks to for CSS and JS linting 
 * 
 * Config for csslint and jshint plugins
 */

module.exports = function (grunt, alf) {
   // Return the config. This gets pushed into the grunt.init.config method in Gruntfile.
   return {
      // Sanity check the CSS
      // @see: https://github.com/gruntjs/grunt-contrib-csslint
      // This needs a bit of work before it's useful - ours currently fails. A lot.
      csslint: {
         share: {
            options: {
               import: false,
               csslintrc: ".csslintrc"
            },
            src: [alf.cssFiles]
         }
      },

      jshint: {
         all: ['**/.js', '**/.json']
      }
   };
};