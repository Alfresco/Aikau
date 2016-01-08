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
 * Utility object for formatting-related utilities. Note that this is not a Class, and so does
 * not need to be instantiated before use.
 *
 * @module alfresco/util/formatUtils
 * @author Martin Doyle
 * @since 1.0.50
 */
define(["dojo/_base/lang"], function(lang) {

   // The private container for the functionality and properties of the util
   var util = {

      // See API below
      formatFileSize: function alfresco_util_formatUtils__formatFileSize(numBytes, precision) {
         var units = ["bytes", "kB", "MB", "GB", "TB"],
            precision = typeof precision === "undefined" ? 1 : precision,
            roundingPower = Math.pow(10, precision),
            unitsPower = 0;
         while (numBytes > 1024) {
            numBytes /= 1024;
            unitsPower++;
         }
         if (precision >= 0) {
            numBytes = Math.round(numBytes * roundingPower) / roundingPower;
         }
         return numBytes + " " + units[unitsPower];
      }
   };

   /**
    * The public API for this utility class
    * 
    * @alias module:alfresco/util/formatUtils
    */
   return {

      /**
       * <p>Convert the specified number of bytes into a human friendly string.</p>
       *
       * <p>Examples: 123 => 123 bytes, 1234 => 1.2 kB, 123456 => 123.5 kB, 12345678 => 12.4 MB</p>
       * 
       * @instance
       * @function
       * @param {number} numBytes The number of bytes
       * @param {number} [precision=1] How many decimal places to format numbers to (-1 will prevent rounding)
       * @returns {string} The formatted string
       */
      formatFileSize: lang.hitch(util, util.formatFileSize)
   };
});