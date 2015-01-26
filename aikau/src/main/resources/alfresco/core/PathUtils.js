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
 * This is a mixin that provides functions for processing paths.
 * 
 * @module alfresco/core/PathUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare"], 
        function(declare) {
   
   return declare(null, {
      
      /**
       * Append multiple parts of a path, ensuring duplicate path separators are removed.
       * Leaves "://" patterns intact so URIs and nodeRefs are safe to pass through.
       *
       * @instance
       * @param {...string} path A path to be combined
       * @return {string} A string containing the combined paths
       */
      combinePaths: function alfresco_core_PathUtils__combinePaths() {
         var path = "", i;
         for (i = 0; i < arguments.length; i++)
         {
            if (arguments[i] !== null)
            {
               path += arguments[i] + (arguments[i] !== "/" ? "/" : "");
            }
         }
         path = path.replace(/(^|[^:])\/{2,}/g, "$1/");

         // Remove trailing "/" if the last argument didn't end with one
         if (arguments.length > 0 && 
             typeof arguments[arguments.length - 1] === "string" && 
             arguments[arguments.length - 1].match(/(.)\/$/) === null)
         {
            path = path.replace(/(.)\/$/g, "$1");
         }
         return path;
      }
   });
});