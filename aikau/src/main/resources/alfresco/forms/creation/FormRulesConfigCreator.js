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
 * @module alfresco/forms/creation/FormRulesConfigCreator
 * @extends module:alfresco/forms/controls/MultipleEntryCreator
 * @author Dave Draper
 */
define(["alfresco/forms/controls/MultipleEntryCreator",
        "alfresco/forms/creation/FormRulesConfigCreatorElement",
        "dojo/_base/declare",
        "dojo/_base/array",
        "dijit/registry",
        "dojo/_base/lang"], 
        function(MultipleEntryCreator, FormRulesConfigCreatorElement, declare, array, registry, lang) {
   
   return declare([MultipleEntryCreator], {
      /**
       * @instance
       * @param {object} config
       * @returns {object} A new FormRulesConfigCreatorElement
       */
      createElementWidget: function(config) {
         return new FormRulesConfigCreatorElement(config);
      }
   });
});