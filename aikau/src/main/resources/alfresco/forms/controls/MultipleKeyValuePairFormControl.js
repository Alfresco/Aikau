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
 * This extends the [MultipleEntryFormControl]{@link module:alfresco/forms/controls/MultipleEntryFormControl} to 
 * provide a creator that allows the creation of elements as a key/value pair rather than  just as single data items.
 * 
 * @module alfresco/forms/controls/MultipleKeyValuePairFormControl
 * @extends module:alfresco/forms/controls/MultipleEntryFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/MultipleEntryFormControl",
        "dojo/_base/declare",
        "alfresco/forms/controls/MultipleKeyValuePairCreator",
        "dojo/_base/array"], 
        function(MultipleEntryFormControl, declare, MultipleKeyValuePairCreator, array) {
   
   return declare([MultipleEntryFormControl], {
      
      /**
       * Overrides the inherited function to instantiate a new [MultipleKeyValuePairCreator]{@link module:alfresco/forms/controls/MultipleKeyValuePairCreator}
       * @instance
       * @param {object} config The configuration to pass to the [MultipleKeyValuePairCreator]{@link module:alfresco/forms/controls/MultipleKeyValuePairCreator}
       * @param {Element} domNode
       * @returns A new [MultipleKeyValuePairCreator]{@link module:alfresco/forms/controls/MultipleKeyValuePairCreator}
       */
      createFormControl: function(config, domNode) {
         return new MultipleKeyValuePairCreator(config);
      }
   })
});