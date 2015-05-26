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
 * This the basic checkbox form control. It extends the [BaseFormControl]
 * {@link module:alfresco/forms/controls/BaseFormControl} and supports the standard
 * form control configuration. The value can be set as either string or boolean 
 * representations of true and false but the returned value will always be a boolean.
 * 
 * @module alfresco/forms/controls/CheckBox
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dijit/form/CheckBox",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(BaseFormControl, declare, CheckBox, lang, domClass) {
   
   return declare([BaseFormControl], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/CheckBox.css"}]
       */
      cssRequirements: [{cssFile:"./css/CheckBox.css"}],

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_CheckBox__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            checked: this.value === "true" || this.value === true
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_CheckBox__createFormControl(config, /*jshint unused:false*/ domNode) {
         var additionalCssClasses = "";
         if (this.additionalCssClasses !== null)
         {
            additionalCssClasses = this.additionalCssClasses;
         }
         domClass.add(this.domNode, "alfresco-forms-controls-CheckBox " + additionalCssClasses);
         return new CheckBox(config);
      },
      
      /**
       * Gets the checked value of the checkbox.
       * 
       * @instance
       * @returns {boolean} The checked state of the checkbox
       */
      getValue: function alfresco_forms_controls_CheckBox__getValue() {
         var value = null;
         if (this.wrappedWidget)
         {
            value = this.wrappedWidget.get("checked");
            if (value === "")
            {
               value = this.value;
            }
         }
         value = this.convertStringValuesToBoolean(value);
         this.alfLog("log", "Returning value for field: '" + this.name + "': ", value);
         return value;
      },
      
      /**
       * Sets the checked value of the checkbox.
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_CheckBox__setValue(value) {
         if (this.deferValueAssigment)
         {
            this.inherited(arguments);
         }
         else
         {
            this.alfLog("log", "Setting field: '" + this.name + "' with value: ", value);
            if (this.wrappedWidget)
            {
               this.wrappedWidget.set("checked", value);
            }
         }
      },
      
      /**
       * Overrides the inherited function to listen to watch for changes to the "checked" attribute of the CheckBox 
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_CheckBox__setupChangeEvents() {
         // Whenever a widgets value changes then we need to publish the details out to other form controls (that exist in the
         // same scope so that they can modify their appearance/behaviour as necessary)...
         if (this.wrappedWidget)
         {
            // TODO: Do we need to do anything with the watch handle when the widget is destroyed?
            this.wrappedWidget.watch("checked", lang.hitch(this, "onValueChangeEvent"));
         }
      }
   });
});