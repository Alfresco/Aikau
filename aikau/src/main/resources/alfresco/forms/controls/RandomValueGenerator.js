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
 * This is a simple validation text field that generates a UUID as it's value when it is generated.
 * It was created for use in drag-and-drop page creation for allowing hidden fieldId values to be
 * uniquely generated when a widget is selected from a palette. These fieldIds allow dynamic behaviour
 * rules to be configured for form widgets
 *
 * @module alfresco/forms/controls/RandomValueGenerator
 * @extends module:alfresco/forms/controls/DojoValidationTextBox
 * @author Dave Draper
 */
define(["alfresco/forms/controls/DojoValidationTextBox",
        "dojo/_base/declare"], 
        function(DojoValidationTextBox, declare) {
   
   return declare([DojoValidationTextBox], {
      
      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_RandomValueGenerator__getWidgetConfig() {
         return {
            id : this.generateUuid(),
            name: this.name,
            value: this.value || this.generateUuid()
         };
      }
   });
});