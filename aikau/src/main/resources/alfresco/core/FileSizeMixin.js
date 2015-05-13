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
 * 
 * @module alfresco/core/FileSizeMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare"], 
        function(declare) {
   
   return declare(null, {
      
      /**
       * @instance
       * @type {number}
       * @default 1024
       */
      BYTES_KB: 1024,

      /**
       * @instance
       * @type {number}
       * @default 1048576
       */
      BYTES_MB: 1048576,

      /**
       * @instance
       * @type {number}
       * @default 1073741824
       */
      BYTES_GB: 1073741824,

      /**
       * Converts a file size in bytes to human readable form
       *
       * @instance
       * @param {number} fileSize File size in bytes
       * @param {int} decimalPlaces number of decimal places
       * @return {string} The file size in a readable form, i.e 1.2mb
       */
      formatFileSize: function alfresco_core_FileSizeMixin__formatFileSize(fileSize, decimalPlaces) {
         decimalPlaces = decimalPlaces || 0;
         if (typeof fileSize === "string")
         {
            fileSize = fileSize.replace(/,/gi,"");
            fileSize = parseInt(fileSize, 10);
         }

         if (fileSize < this.BYTES_KB)
         {
            return fileSize + " " + this.message("size.bytes");
         }
         else if (fileSize < this.BYTES_MB)
         {
            fileSize = (fileSize / this.BYTES_KB).toFixed(decimalPlaces);
            return fileSize + " " + this.message("size.kilobytes");
         }
         else if (fileSize < this.BYTES_GB)
         {
            fileSize = (fileSize / this.BYTES_MB).toFixed(decimalPlaces);
            return fileSize + " " + this.message("size.megabytes");
         }
         else if (isNaN(fileSize))
         {
            // special case for missing content size
            return "0 " + this.message("size.bytes");
         }
         else
         {
            fileSize = (fileSize / this.BYTES_GB).toFixed(decimalPlaces);
            return fileSize + " " + this.message("size.gigabytes");
         }
      }
   });
});