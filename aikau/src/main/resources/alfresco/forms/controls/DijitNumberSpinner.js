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
 * This extension of NumberSpinner is to "fix" certain inconsistencies when
 * working with non-integer numbers.
 * 
 * @module alfresco/forms/controls/DijitNumberSpinner
 * @extends external:dijit/form/NumberSpinner
 * @author Martin Doyle
 */
define([
   "dijit/form/NumberSpinner",
   "dojo/_base/declare",
   "dojo/number"
], function(NumberSpinner, declare, number) {

   return declare([NumberSpinner], {

      /**
       * Override the standard value-getter to always return a number if one is provided.
       *
       * @instance
       * @override
       * @returns {number} The value, as a number, or null if NaN
       */
      _getValueAttr: function() {
         var rawValue = this.textbox.value,
            numberValue = number.parse(rawValue),
            value = null;
         if (!isNaN(numberValue)) {
            value = numberValue;
            if (value === Math.round(value)) {
               value = Math.round(value);
            }
         }
         return value;
      },

      /**
       * Override the standard value-setter to correctly locale-format the content
       *
       * @instance
       * @override
       * @param {number} newValue The new value to set
       */
      _setValueAttr: function(newValue) {
         if (!isNaN(newValue)) {
            if (typeof newValue === "string") {
               newValue = number.parse(newValue);
            }
            this.textbox.value = number.format(newValue);
         }
      }
   });
});