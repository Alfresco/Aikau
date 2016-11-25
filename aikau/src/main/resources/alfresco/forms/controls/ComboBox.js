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
 * This extends the [base form control module]{@link module:alfresco/forms/controls/BaseFormControl} to provide
 * a ComboBox form control. This controls currently only supports dynamic rather than fixed options which are
 * retrieved and filtered by a dedicated [ServiceStore]{@link module:alfresco/forms/controls/utilities/ServiceStore}
 * instance.
 *
 * <p><strong>PLEASE NOTE: </strong>Because this form control uses the a
 * [ServiceStore]{@link module:alfresco/forms/controls/utilities/ServiceStore} please take care to configure the
 * "queryAttribute", "labelAttribute", "valueAttribute" and "resultsProperty" attributes.</p>
 *
 * @example <caption>Example configuration</caption>
 * {
 *    id: "COMBO_BOX",
 *    name: "alfresco/forms/controls/FilteringSelect",
 *    config: {
 *       fieldId: "COMBO_BOX_1",
 *       name: "person",
 *       label: "Select or name a person",
 *       description: "The people options are provided by the OptionsService, but can be filtered via the ServiceStore",
 *       optionsConfig: {
 *          queryAttribute: "label",
 *          labelAttribute: "label",
 *          valueAttribute: "value",
 *          publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
 *          publishPayload: {
 *             resultsProperty: "options",
 *             url: url.context + "/proxy/alfresco/api/people",
 *             itemsAttribute: "people",
 *             labelAttribute: "userName",
 *             valueAttribute: "userName"
 *          }
 *       }
 *    }
 * }
 *
 * @module alfresco/forms/controls/ComboBox
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @mixes module:alfresco/forms/controls/utilities/UseServiceStoreMixin
 * @mixes module:alfresco/forms/controls/utilities/IconMixin
 * @mixes module:alfresco/forms/controls/utilities/TextBoxValueChangeMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/forms/controls/utilities/UseServiceStoreMixin",
        "alfresco/forms/controls/utilities/IconMixin",
        "alfresco/forms/controls/utilities/TextBoxValueChangeMixin",
        "dijit/form/ComboBox",
        "dojo/aspect",
        "dojo/_base/lang"], 
        function(declare, BaseFormControl, UseServiceStoreMixin, IconMixin, TextBoxValueChangeMixin, ComboBox, aspect, lang) {

   return declare([BaseFormControl, UseServiceStoreMixin, IconMixin, TextBoxValueChangeMixin], {

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
       * @default
       */
      autoComplete: false,

      /**
       * The placeholder to be used
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.48
       */
      placeHolder: null,

      /**
       * Indicates whether opening the drop-down menu should show all available options
       * or just those that match the current value of the control. Defaults to true
       * (meaning that only filtered results are displayed).
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.96
       */
      showAllOptionsOnOpen: false,

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
      createFormControl: function alfresco_forms_controls_ComboBox__createFormControl(/*jshint unused:false*/config, domNode) {
         var placeHolder = (this.placeHolder) ? this.message(this.placeHolder) : "";
         var serviceStore = this.createServiceStore();
         var comboBox = new ComboBox({
            id: this.id + "_CONTROL",
            name: this.name,
            placeHolder: placeHolder,
            store: serviceStore,
            searchAttr: serviceStore.queryAttribute,
            labelAttribute: serviceStore.labelAttribute,
            queryExpr: "${0}",
            autoComplete: this.autoComplete
         });
         this.addIcon(comboBox);
         !this.showAllOptionsOnOpen && this.showOptionsBasedOnValue(comboBox);
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
       * Extends the [mixed in setupChangeEvents]{@link alfresco/forms/controls/utilities/TextBoxValueChangeMixin#setupChangeEvents}
       * to listen to selection events.
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_ComboBox__setupChangeEvents() {
         this.inherited(arguments);
         if (this.wrappedWidget)
         {
            aspect.after(this.wrappedWidget, "_selectOption", lang.hitch(this, function() {
               this._oldValue = this.__oldValue; // Set the old value as the last buffer...
               this.__oldValue = this.getValue(); // Make the last buffer the current value being set
               this.onValueChangeEvent(this.name, this._oldValue, this.getValue());
            }), true);
         }
      }
   });
});