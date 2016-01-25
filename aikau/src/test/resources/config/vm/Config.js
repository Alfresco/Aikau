/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * This provides the configuration for widget unit tests.
 * 
 * @author Richard Smith
 */
define({

   /**
    * This is a selection of urls for test purposes. They should ONLY be defined here so that
    * pervasive changes can be made in this one file.
    *
    * @instance
    * @type {object}
    */
   urls: {
      unitTestAppBaseUrl: "http://192.168.56.1:8089"
   },

   /**
    * A selection of timeouts
    *
    * @instance
    * @type {object}
    */
   timeout: {
      base: 5000,
      find: 2000,
      pageLoad: 30000,
      executeAsync: 5000
   }

});