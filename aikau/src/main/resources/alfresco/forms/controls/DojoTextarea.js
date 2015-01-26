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
 * @module alfresco/forms/controls/DojoTextarea
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dijit/form/SimpleTextarea"], 
        function(BaseFormControl, declare, Textarea) {
   
   return declare([BaseFormControl], {
      
      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_DojoTextarea__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            value: this.value,
            rows: this.rows,
            cols: this.cols
         };
      },

      /**
       * The number of rows to initially display.
       * 
       * @instance
       * @type {string}
       * @default "5"
       */
      rows: "5",

      /**
       * The number of columns to initially display.
       * 
       * @instance
       * @type {string}
       * @default "50"
       */
      cols: "50",
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_DojoTextarea__createFormControl(config, domNode) {
         return new Textarea(config);
      },
      
      /**
       * This will be set to the last known value of the text box before the current keyup event.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      _oldValue: null,
      
      /**
       * This is used as a temporary buffer variable to keep track of changes to the old value. 
       * 
       * @instance
       * @type {string}
       * @default null
       */
      __oldValue: null,

      /**
       * Overrides the default change events to use blur events on the text box. This is done so that we can validate
       * on every single keypress. However, we need to keep track of old values as this information is not readily
       * available from the text box itself.
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_DojoTextarea__setupChangeEvents() {
         var _this = this;
         
         if (this.wrappedWidget)
         {
            this.wrappedWidget.on("keyup", function() {
               _this._oldValue = _this.__oldValue; // Set the old value as the last buffer...
               _this.__oldValue = this.getValue(); // Make the last buffer the current value being set
               
               _this.alfLog("log", "keyup - OLD value: " + _this._oldValue + ", NEW value: " + this.getValue());
               _this.formControlValueChange(_this.name, _this._oldValue, this.getValue());
               _this.validate();
            });
         }
      }
   });
});