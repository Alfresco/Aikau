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
      unitTestAppBaseUrl: null
   },

   /**
    * A selection of timeouts
    *
    * @instance
    * @type {object}
    */
   timeout: {
      base: 10000,
      find: 1000,
      pageLoad: 10000,
      executeAsync: 1000
   }

});