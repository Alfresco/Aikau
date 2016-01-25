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
 * @module alfresco/forms/controls/MultiSelectInput
 * @extends alfresco/forms/controls/BaseFormControl
 * @mixes alfresco/forms/controls/utilities/IconMixin
 * @mixes alfresco/forms/controls/utilities/UseServiceStoreMixin
 * @author Martin Doyle
 */
define([
      "alfresco/core/CoreWidgetProcessing",
      "alfresco/forms/controls/BaseFormControl",
      "alfresco/forms/controls/utilities/IconMixin",
      "alfresco/forms/controls/utilities/UseServiceStoreMixin",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "alfresco/forms/controls/MultiSelect"
   ],
   function(CoreWidgetProcessing, BaseFormControl, IconMixin, UseServiceStoreMixin, declare, lang) {

      return declare([BaseFormControl, CoreWidgetProcessing, UseServiceStoreMixin, IconMixin], {

         /**
          * Override the [inherited value]{@link module:alfresco/forms/controls/BaseFormControl#getPubSubOptionsImmediately}
          * to suppress the initial retrieval of pubSubOptions for this control.
          *
          * @instance
          * @override
          * @type {boolean}
          * @default
          * @since 1.0.33
          */
         getPubSubOptionsImmediately: false,

         /**
          * @override
          * @instance
          */
         getWidgetConfig: function alfresco_forms_controls_MultiSelectInput__getWidgetConfig() {

            // Setup the widget config
            var widgetConfig = {
               id: this.id + "_CONTROL",
               name: this.name,
               width: this.width,
               choiceCanWrap: this.optionsConfig.choiceCanWrap,
               choiceMaxWidth: this.optionsConfig.choiceMaxWidth,
               labelFormat: this.optionsConfig.labelFormat

               // NOTE: This is not currently enabled, as it would create inconsistencies between
               // controls' abilities, however the intention is at some point to use this control
               // as a template to enable this option across all controls that take options (as
               // long as it's deemed appropriate to do so when we next look at it)
               // 
               // inferMissingProperties: this.optionsConfig.inferMissingProperties
            };

            // Don't want to pass through undefined values (will override defaults)
            if (!widgetConfig.choiceCanWrap && widgetConfig.choiceCanWrap !== false) {
               delete widgetConfig.choiceCanWrap;
            }
            if (!widgetConfig.choiceMaxWidth) {
               delete widgetConfig.choiceMaxWidth;
            }

            // Pass back the config
            return widgetConfig;
         },

         /**
          * Creates a new [ServiceStore]{@link module:alfresco/forms/controls/utilities/ServiceStore} object to use for
          * retrieving and filtering the available options to be included in the control and then instantiates and returns
          * the MultiSelect widget that is configured to use it.
          *
          * @override
          * @instance
          * @param    {object} config Configuration for the control
          * @returns  {object} The new control
          */
         createFormControl: function alfresco_forms_controls_MultiSelectInput__createFormControl(config) {
            var serviceStore = this.createServiceStore(),
               widgetConfig = lang.mixin({
                  store: serviceStore
               }, config);
            return this.createWidget({
               name: "alfresco/forms/controls/MultiSelect",
               config: widgetConfig
            });
         }
      });
   });