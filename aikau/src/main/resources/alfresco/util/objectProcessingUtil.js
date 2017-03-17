/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * Provides a function for recursing through objects and processing data within them.
 * 
 * @module alfresco/util/objectProcessingUtil
 * @author Dave Draper
 * @since 1.0.49
 */
define(["dojo/_base/lang"],
   function(lang) {

      // The private container for the functionality and properties of the util
      var util = {

         /**
          * Convert a URL string into a URL Object
          *
          * @param url {string}
          * @returns {object}
          */
         findObject: function alfresco_util_objectProcessingUtil__findObject(object, parameters) {
            if (!parameters.ancestors)
            {
               parameters.ancestors = [];
            }

            // Push the current object into the ancestors array for the purpose of recursion...
            // We're going to need to get the object ancestors...
            parameters.ancestors.push(object);

            if (Array.isArray(object))
            {
               object.forEach(function(child, index) {
                  parameters.ancestors.push(index); // Push the index of the current object in the parent array
                  util.findObject(child, parameters);
                  parameters.ancestors.pop(); // Pop the index...
               });
            }
            else if (typeof object === "object")
            {
               // Iterate over the object keys...
               Object.keys(object).forEach(function(key) {

                  if (key.startsWith(parameters.prefix))
                  {
                     // Do some stuff with the object...
                     if (typeof parameters.processFunction === "function")
                     {
                        parameters.processFunction.call(this, {
                           object: object[key],
                           config: parameters.config,
                           ancestors: parameters.ancestors
                        });
                     }
                  }
                  else
                  {
                     // Recurse into the object...
                     util.findObject(object[key], parameters);
                  }
               });
            }

            // Pop the last ancestor as we exit the recursion...
            parameters.ancestors.pop();
         }
      };

      /**
       * The public API for this utility class
       *
       * @alias module:alfresco/util/urlUtils
       */
      return {

         /**
          * Convert the supplied URL string into a URL object
          *
          * @instance
          * @function
          * @param {string} url The URL to parse
          * @returns {object} The URL object
          */
         findObject: lang.hitch(util, util.findObject)
      };
   });