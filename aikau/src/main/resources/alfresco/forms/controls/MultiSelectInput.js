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
 * @module alfresco/forms/controls/MultiSelectInput
 * @extends alfresco/forms/controls/BaseFormControl
 * @extends alfresco/forms/controls/utilities/IconMixin
 * @extends alfresco/forms/controls/utilities/UseServiceStoreMixin
 * @author Martin Doyle
 */
define([
      "alfresco/forms/controls/BaseFormControl",
      "alfresco/forms/controls/MultiSelect",
      "alfresco/forms/controls/utilities/IconMixin",
      "alfresco/forms/controls/utilities/UseServiceStoreMixin",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(BaseFormControl, MultiSelect, IconMixin, UseServiceStoreMixin, declare, lang) {

      return declare([BaseFormControl, UseServiceStoreMixin, IconMixin], {

         /**
          * @override
          * @instance
          */
         getWidgetConfig: function alfresco_forms_controls_MultiSelectInput__getWidgetConfig() {
            return {
               id: this.id + "_CONTROL",
               name: this.name,
               placeholder: (this.placeholder && this.message(this.placeholder)) || ""
            };
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
            /*jshint unused:false*/
            var serviceStore = this.createServiceStore();
            var multiSelect = new MultiSelect({
               id: this.id + "_CONTROL",
               name: this.name,
               value: this.value,
               store: serviceStore,
               searchAttr: serviceStore.queryAttribute,
               labelAttribute: serviceStore.labelAttribute,
               valueAttribute: serviceStore.valueAttribute,
               queryExpr: "${0}"
            });
            this.addIcon(multiSelect);
            this.showOptionsBasedOnValue(multiSelect);

            // It's necessary to override the standard Dojo validation message handling here.
            multiSelect.displayMessage = lang.hitch(this, this.onFilteringValidation);
            return multiSelect;
         },

         /**
          * This function is hitched to the MultiSelect widget's displayMessage function
          * and is used to control the overall validation for the widget so that it works with
          * other Aikau form controls.
          *
          * @override
          * @instance
          * @param {string} message The error message to display (this will be null if value is valid)
          */
         onFilteringValidation: function alfresco_forms_controls_MultiSelectInput__onFilteringValidation(message) {
            if (!message) {
               this._validationMessage.innerHTML = "";
               this.alfPublish("ALF_VALID_CONTROL", {
                  name: this.name,
                  fieldId: this.fieldId
               });
               this.hideValidationFailure();
            } else {
               this._validationMessage.innerHTML = message;
               this.alfPublish("ALF_INVALID_CONTROL", {
                  name: this.name,
                  fieldId: this.fieldId
               });
               this.showValidationFailure();
            }
         }
      });
   });