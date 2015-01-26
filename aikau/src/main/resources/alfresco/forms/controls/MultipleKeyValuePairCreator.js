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

/**
 * @module alfresco/forms/controls/MultipleKeyValuePairCreator
 * @extends alfresco/forms/controls/MultipleEntryCreator
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/MultipleEntryCreator", 
        "alfresco/forms/controls/MultipleEntryElementWrapper",
        "alfresco/forms/controls/MultipleKeyValuePairElement"], 
        function(declare, MultipleEntryCreator, MultipleEntryElementWrapper, MultipleKeyValuePairElement) {
   
   return declare([MultipleEntryCreator], {

      /**
       * Indicates whether or not re-ordering should be enabled through the use of drag and drop
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      enableDND: false,
      
      /**
       * This function should be extended by concrete implementations to create the element to go in the
       * element wrapper.
       * 
       * @instance
       * @param {object} config
       * @returns {object} A new [MultipleKeyValuePairElement]{@link module:alfresco/forms/controls/MultipleKeyValuePairElement} instance
       */
      createElementWidget: function(config) {
         return new MultipleKeyValuePairElement(config);
      }
   });
});