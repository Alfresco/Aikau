/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
       * The value to be returned when the checkbox is not selected. If not specified, the default value is false.
       * If this value is provided then [onValue]{@link module:alfresco/forms/controls/CheckBox#onValue} must also
       * be provided.
       *
       * @instance
       * @type {*}
       * @default
       * @since 1.0.59
       */
      offValue: undefined,

      /**
       * The value to be returned when the checkbox is selected. If not specified, the default value is true.
       * If this value is provided then [offValue]{@link module:alfresco/forms/controls/CheckBox#offValue}
       * must also be provided.
       *
       * @instance
       * @type {*}
       * @default
       * @since 1.0.59
       */
      onValue: undefined,

      /**
       * Private state variable to store whether custom on/off values were provided.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.59
       */
      _hasCustomValues: false,

      /**
       * This is called after the properties have been mixed into the widget.
       *
       * @instance
       * @override
       * @since 1.0.59
       */
      postMixInProperties: function alfresco_forms_controls_CheckBox__postMixInProperties() {

         // Call overridden method
         this.inherited(arguments);

         // Check the configured properties
         if (typeof this.offValue === "undefined" && typeof this.onValue !== "undefined") {
            this.alfLog("error", "When providing an 'onValue' for a checkbox, must also provide an 'offValue'", this);
         } else if (typeof this.onValue === "undefined" && typeof this.offValue !== "undefined") {
            this.alfLog("error", "When providing an 'offValue' for a checkbox, must also provide an 'onValue'", this);
         } else if (typeof this.onValue !== "undefined" && typeof this.offValue !== "undefined") {
            this._hasCustomValues = true;
         }

         // Apply defaults
         if (typeof this.offValue === "undefined") {
            this.offValue = false;
         }
         if (typeof this.onValue === "undefined") {
            this.onValue = true;
         }
      },

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_CheckBox__getWidgetConfig() {
         // Return the configuration for the widget
         // NOTE: setValue will always be called after creation, so let that determine the checked state, especially because the logic is messy!
         return {
            id : this.generateUuid(),
            name: this.name
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
         var value = null,
            checked;
         if (this.wrappedWidget)
         {
            checked = this.wrappedWidget.get("checked");
            value = checked ? this.onValue : this.offValue;
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
               if (this._hasCustomValues) {
                  if (value === this.onValue) {
                     this.wrappedWidget.set("checked", true);
                  } else if (value === this.offValue) {
                     this.wrappedWidget.set("checked", false);
                  } else {
                     this.alfLog("warn", "Specified value '" + value + "' (" + typeof value + ") does not match possible values of '" + this.onValue + "' (" + typeof this.onValue + ") or '" + this.offValue + "' (" + typeof this.offValue + ")", this);
                  }
               } else {
                  this.wrappedWidget.set("checked", !!value);
               }
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