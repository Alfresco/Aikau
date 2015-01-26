/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * Server wait tasks
 */

module.exports = function (grunt, alf) {
   // Return the config. This gets pushed into the grunt.init.config method in Gruntfile.

   // NOTE: It is by design that we wait for RequireEverything to be loaded. This is because
   //       by waiting for all dependencies to be processed in Surf BEFORE starting the unit tests
   //       we can avoid spurious test failures caused by timeouts. If RequireEverything has been
   //       loaded then then unit tests will run much faster and in a more consistent fashion.
   //       The down-side is that this is the longest page to load, however for test development
   //       it is recommended to manually control the Jetty test server for expediency.
   return {
      waitServer: {
         server: {
            options: {
               url: "http://localhost:8089/aikau/page/tp/ws/RequireEverything",
               interval: 5000,
               timeout: 300000
            }
         }
      }
   };
};