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
 * <p>An input control that offers the functionality of radio-buttons or checkboxes,
 * rendered as a single control with push-button options.</p>
 *
 * <p>For full information about how to use this control and all of the available
 * options, please see the implementing widget:
 * [alfresco/forms/controls/PushButtonsControl]{@link module:alfresco/forms/controls/PushButtonsControl}.</p>
 * 
 * @module alfresco/forms/controls/PushButtons
 * @extends alfresco/forms/controls/BaseFormControl
 * @mixes alfresco/core/CoreWidgetProcessing
 * @author Martin Doyle
 * @since 1.0.44
 */
define(["alfresco/core/CoreWidgetProcessing",
        "alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-class",
        "alfresco/forms/controls/PushButtonsControl"],
       function(CoreWidgetProcessing, BaseFormControl, declare, lang, domClass) {

   return declare([BaseFormControl, CoreWidgetProcessing], {

      /**
       * When set to true, and this is a multi-value control, then the initial value will - if nothing
       * is specifically set - be set to the first value available.
       *
       * @instance
       * @override
       * @type {boolean}
       * @default
       * @since 1.0.65
       */
      firstValueIsDefault: false,

      /**
       * Run after widget created.
       *
       * @instance
       * @override
       */
      postCreate: function() {
         this.inherited(arguments);
         domClass.add(this.domNode, "alfresco-forms-controls-PushButtons");
      },

      /**
       * Construct the config for the wrapped control.
       *
       * @instance
       * @override
       * @returns {object} The configuration for the form control.
       */
      getWidgetConfig: function alfresco_forms_controls_PushButtons__getWidgetConfig() {

         this.supportsMultiValue = !!this.multiMode;

         // Setup the widget config
         var widgetConfig = {
            id: this.id + "_CONTROL",
            multiMode: !!this.multiMode,
            name: this.name,
            noWrap: !!this.noWrap
         };

         // Set config only if available
         if (!isNaN(this.width)) {
            widgetConfig.width = this.width;
         }
         if (!isNaN(this.maxLineLength)) {
            widgetConfig.maxLineLength = this.maxLineLength;
         }
         if (!isNaN(this.percentGap)) {
            widgetConfig.percentGap = this.percentGap;
         }
         if (!isNaN(this.minPadding)) {
            widgetConfig.minPadding = this.minPadding;
         }
         if (!isNaN(this.maxChoices)) {
            widgetConfig.maxChoices = this.maxChoices;
         }

         // Pass back the config
         return widgetConfig;
      },

      /**
       * Creates a new [ServiceStore]{@link module:alfresco/forms/controls/utilities/ServiceStore} object to use for
       * retrieving and filtering the available options to be included in the control and then instantiates and returns
       * the PushButtonsControl widget that is configured to use it.
       *
       * @override
       * @instance
       * @param    {object} config Configuration for the control
       * @returns  {object} The new control
       */
      createFormControl: function alfresco_forms_controls_PushButtons__createFormControl(config) {
         return this.createWidget({
            name: "alfresco/forms/controls/PushButtonsControl",
            config: config
         });
      }
   });
});