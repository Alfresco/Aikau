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
 * @module alfresco/forms/controls/DojoCheckBox
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
       * @default [{cssFile:"./css/DojoCheckBox.css"}]
       */
      cssRequirements: [{cssFile:"./css/DojoCheckBox.css"}],

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_DojoCheckBox__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            value: this.value,
            checked: (this.value == "true" || this.value === true)
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_DojoCheckBox__createFormControl(config, domNode) {
         var additionalCssClasses = "";
         if (this.additionalCssClasses != null)
         {
            additionalCssClasses = this.additionalCssClasses;
         }
         domClass.add(this.domNode, "alfresco-forms-controls-DojoCheckBox " + additionalCssClasses);
         return new CheckBox(config);
      },
      
      /**
       * Gets the checked value of the checkbox.
       * 
       * @instance
       * @returns {boolean} The checked state of the checkbox
       */
      getValue: function alfresco_forms_controls_DojoCheckBox__getValue() {
         var value = null;
         if (this.wrappedWidget)
         {
            value = this.wrappedWidget.get("checked");
            if (value === "")
            {
               value = this.value;
            }
         }
         this.alfLog("log", "Returning value for field: '" + this.name + "': ", value);
         return value;
      },
      
      /**
       * Sets the checked value of the checkbox.
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_DojoCheckBox__setValue(value) {
         this.alfLog("log", "Setting field: '" + this.name + "' with value: ", value);
         if (this.wrappedWidget)
         {
            this.wrappedWidget.set("checked", value);
         }
      },
      
      /**
       * Overrides the inherited function to listen to watch for changes to the "checked" attribute of the CheckBox 
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_DojoCheckBox__setupChangeEvents() {
         var _this = this;
         
         // Whenever a widgets value changes then we need to publish the details out to other form controls (that exist in the
         // same scope so that they can modify their appearance/behaviour as necessary)...
         if (this.wrappedWidget)
         {
            // TODO: Do we need to do anything with the watch handle when the widget is destroyed?
            var watchHandle = this.wrappedWidget.watch("checked", lang.hitch(this, "onValueChangeEvent"));
         }
      }
   });
});