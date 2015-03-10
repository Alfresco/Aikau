/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This extends the [base form control module]{@link module:alfresco/forms/controls/BaseFormControl} to provide
 * a ComboBox form control. This controls currently only supports dynamic rather than fixed options which are
 * retrieved and filtered by a dedicated [ServiceStore]{@link module:alfresco/forms/controls/utilities/ServiceStore}
 * instance.
 *
 * @module alfresco/forms/controls/ComboBox
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "alfresco/forms/controls/utilities/UseServiceStoreMixin",
        "alfresco/forms/controls/utilities/IconMixin",
        "dojo/_base/declare",
        "dijit/form/ComboBox",
        "dojo/_base/lang"], 
        function(BaseFormControl, UseServiceStoreMixin, IconMixin, declare, ComboBox, lang) {

   return declare([BaseFormControl, UseServiceStoreMixin, IconMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/ComboBox.css"}]
       */
      cssRequirements: [{cssFile:"./css/ComboBox.css"}],

      /**
       * This determines whether or not the ComboBox will automatically copy the
       * first matched item into the input field as the user is typing. Defaults
       * to false.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      autoComplete: false,

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_ComboBox__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.id + "_CONTROL",
            name: this.name
         };
      },
      
      /**
       * Creates a new [ServiceStore]{@link module:alfresco/forms/controls/utilities/ServiceStore} object to use for 
       * retrieving and filtering the available options to be included in the ComboBox and then instantiates and returns
       * the a Dojo ComboBox widget that is configured to use it.
       * 
       * @instance
       */
      createFormControl: function alfresco_forms_controls_ComboBox__createFormControl(config, domNode) {
         var serviceStore = this.createServiceStore();
         var comboBox = new ComboBox({
            id: this.id + "_CONTROL",
            name: this.name,
            value: this.value,
            store: serviceStore,
            searchAttr: serviceStore.queryAttribute,
            labelAttribute: serviceStore.labelAttribute,
            queryExpr: "${0}",
            autoComplete: this.autoComplete
         });
         this.addIcon(comboBox);
         this.showOptionsBasedOnValue(comboBox);
         return comboBox;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setValue} to
       * reset the ComboBox if the empty string is set as the value.
       * 
       * @instance
       * @param {object} value
       */
      setValue: function alfresco_forms_controls_ComboBox__setValue(value) {
         this.inherited(arguments);
         if (value === "")
         {
            this.wrappedWidget.reset();
         }
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
      setupChangeEvents: function alfresco_forms_controls_ComboBox__setupChangeEvents() {
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