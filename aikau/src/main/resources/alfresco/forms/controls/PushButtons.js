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
 * @example <caption>Sample configuration (uses noWrap and percentGap overrides):</caption>
 * {
 *    name: "alfresco/forms/controls/PushButtons",
 *    id: "CAN_BUILD",
 *    config: {
 *       name: "canbuild",
 *       label: "Can we build it?",
 *       noWrap: true,
 *       percentGap: 5,
 *       optionsConfig: {
 *          fixed: [
 *             {
 *                label: "Yes we can",
 *                value: true
 *             },
 *             {
 *                label: "No we can't",
 *                value: false
 *             }
 *          ]
 *       }
 *    }
 * }
 * 
 * @example <caption>Sample configuration (uses custom theme, ficed-width, multi-value mode properties):</caption>
 * {
 *    name: "alfresco/forms/controls/PushButtons",
 *    id: "PROPER_FOOTBALL",
 *    config: {
 *       additionalCssClasses: "grey-gradient",
 *       name: "properfootball",
 *       label: "Only proper form of football?",
 *       width: 400,
 *       multiMode: true,
 *       optionsConfig: {
 *          publishTopic: "GET_FOOTBALL_OPTIONS",
 *          publishGlobal: true
 *       }
 *    }
 * }
 * 
 * @module alfresco/forms/controls/PushButtons
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Martin Doyle
 * @since 1.0.44
 */
define(["alfresco/core/CoreWidgetProcessing",
        "alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-attr",
        "dojo/dom-class",
        "dojo/dom-construct",
        "alfresco/forms/controls/PushButtonsControl"],
       function(CoreWidgetProcessing, BaseFormControl, declare, array, lang, domAttr, domClass, domConstruct) {

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
       * An optional message to display when there are no buttons available for display.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.80
       */
      noButtonsLabel: null,

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#alfDisabled}
       * to ensure that the [control]{@link module:alfresco/forms/controls/PushButtonControl} is disabled.
       * 
       * @instance
       * @param  {boolean} status Whether or not the control should be disabled
       * @since 1.0.80
       */
      alfDisabled: function alfresco_forms_controls_BaseFormControl__alfDisabled(status) {
         this.inherited(arguments);

         if (this.wrappedWidget && this.wrappedWidget.opts)
         {
            array.forEach(this.wrappedWidget.opts, function(option) {
               if (option.inputNode)
               {
                  status ? domAttr.set(option.inputNode, "disabled", true) : domAttr.remove(option.inputNode, "disabled");
               }
            }, this);
         }
      },

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
            noWrap: !!this.noWrap,
            simpleLayout: !!this.simpleLayout
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
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setOptions}
       * to make use of any configured [noButtonsLabel]{@link module:alfresco/forms/controls/PushButtons#noButtonsLabel}
       * when an empty options array is provided.
       * 
       * @instance
       * @param {object[]} options An array of the options to be added.
       * @since 1.0.80
       */
      setOptions: function alfresco_forms_controls_BaseFormControl__setOptions(options) {
         this.inherited(arguments);

         if (options && 
             options.length === 0 && 
             this.noButtonsLabel && 
             this.wrappedWidget)
         {
            var span = domConstruct.create("span", {
               "class": "alfresco-forms-controls-PushButtons__noOptionsLabel"
            }, this.wrappedWidget.domNode);
            span.appendChild(document.createTextNode(this.message(this.noButtonsLabel)));
         }
      }
   });
});