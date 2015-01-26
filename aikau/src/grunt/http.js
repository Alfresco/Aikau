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
 * Grunt config for the http plugin.
 */

module.exports = function (grunt, alf) {
   return {
      // Make HTTP Requests:
      // @see: https://github.com/johngeorgewright/grunt-http
      http: {
         // Clear the Surf dependency caches - this is required after copying across the instrumented
         // source files for collecting code coverage results...
         clearDependencyCaches: {
            options: {
               uri: 'http://localhost:8081/share/page/caches/dependency/clear',
               method: 'POST',
               body: '',
               auth: {
                  user: "admin",
                  password: "admin"
               }
            }
         },
         // Clear all Surf caches - required for live reload.
         clearSurf: {
            options: {
               uri: 'http://localhost:8081/share/page/console',
               method: 'POST',
               form: {
                  reset: 'all',
                  submit: 'Reset+All'
               },
               auth: {
                  user: "admin",
                  password: "admin"
               }
            }
         }
      }
   }
}