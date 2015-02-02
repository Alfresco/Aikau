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
 * @module alfresco/forms/controls/DateTextBox
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/date/stamp",
        "dijit/form/DateTextBox",
        "dojo/dom-class"],
        function(BaseFormControl, declare, lang, stamp, DateTextBox, domClass) {
   return declare([BaseFormControl], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/DateTextBox.css"}]
       */
      cssRequirements: [{cssFile:"./css/DateTextBox.css"}],

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_DateTextBox__getWidgetConfig() {
         // Return the configuration for the widget
         var value = null;
         if (this.value instanceof Date)
         {
            value = this.value;
         }
         else if (lang.isString(this.value))
         {
            value = stamp.fromISOString(this.value, { selector: "date" });
         }
         return {
            id : this.id + "_CONTROL",
            name: this.name,
            options: (this.options !== null) ? this.options : []
         };
      },

      getValue: function alfresco_forms_controls_DateTextBox__getValue() {
         var value = this.inherited(arguments);
         return stamp.toISOString(value, { selector: "date" });
      },

      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_DateTextBox__createFormControl(config, domNode) {
         domClass.add(this.domNode, "alfresco-forms-controls-DateTextBox");
         return new DateTextBox(config);
      }
   });
});