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
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "alfresco/forms/PublishForm",
        "dojo/_base/array"], 
        function(BaseFormControl, declare, PublishForm, array) {
   
   return declare([BaseFormControl], {
      
      i18nRequirements: [{i18nFile: "./i18n/FormCreation.properties"}],
      
      widgets: [
         {
            id: "regex",
            name: "alfresco/forms/controls/DojoValidationTextBox",
            config: {
               name: "regex",
               label: "field.validation.regex.label",
               description: "field.validation.regex.description"
            }
         },
         {
            id: "errorMessage",
            name: "alfresco/forms/controls/DojoValidationTextBox",
            config: {
               name: "errorMessage",
               label: "field.validation.errorMessage.label",
               description: "field.validation.errorMessage.description"
            }
         }
      ],
      
      getWidgetConfig: function() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            widgets: this.widgets
         };
      },
      
      createFormControl: function(config, domNode) {
         return new PublishForm(config);
      },
      
      getValue: function() {
         
         var value = {};
         if (this.wrappedWidget != null) 
         {
            array.forEach(this.wrappedWidget._processedWidgets, function(widget, index) {
               value[widget.name] = widget.getValue();
            });
         }
         return value;
      }
   });
});