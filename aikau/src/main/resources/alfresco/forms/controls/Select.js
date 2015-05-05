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
 * @module alfresco/forms/controls/Select
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dijit/form/Select",
        "dijit/focus",
        "dojo/dom-class"], 
        function(BaseFormControl, declare, Select, focusUtil, domClass) {

   return declare([BaseFormControl], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Select.css"}]
       */
      cssRequirements: [{cssFile:"./css/Select.css"}],

      /**
       * Adds a new option to the wrapped widget.
       *
       * @instance
       * @override
       * @param {object} option The option to add
       * @param {number} index The index of the option to add
       */
      addOption: function alfresco_forms_controls_Select__addOption(option, /*jshint unused:false*/ index) {
         // Dijit Select widget does not support empty values! https://bugs.dojotoolkit.org/ticket/9973
         if (option.value === "") {
            this.alfLog("error", "Attempted to add option with empty value", option);
         } else {
            this.inherited(arguments);
         }
      },

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_Select__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.id + "_CONTROL",
            name: this.name//,
            // options: (this.options !== null) ? this.options : []
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_Select__createFormControl(config) {
         var select = new Select(config);

         // Handle adding classes to control...
         var additionalCssClasses = "";
         if (this.additionalCssClasses !== null)
         {
            additionalCssClasses = this.additionalCssClasses;
         }
         domClass.add(this.domNode, "alfresco-forms-controls-Select " + additionalCssClasses);
         return select;
      },

      /**
       * Extends the inherited function to ensure that each option label is encoded to prevent potential
       * XSS attacks.
       * 
       * @instance
       * @param {object} option The option configuration
       * @param {number} index The index of the option
       */
      processOptionLabel: function alfresco_forms_controls_BaseFormControl__processOptionLabel(option, /*jshint unused:false*/ index) {
         this.inherited(arguments);
         if (option.label)
         {
            option.label = this.encodeHTML(option.label);
         }
      }
   });
});