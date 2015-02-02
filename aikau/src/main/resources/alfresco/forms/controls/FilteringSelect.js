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
 * @module alfresco/forms/controls/FilteringSelect
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "alfresco/forms/controls/utilities/UseServiceStoreMixin",
        "alfresco/forms/controls/utilities/IconMixin",
        "dojo/_base/declare",
        "dijit/form/FilteringSelect",
        "dojo/_base/lang"], 
        function(BaseFormControl, UseServiceStoreMixin, IconMixin, declare, 
                 FilteringSelect, lang) {

   return declare([BaseFormControl, UseServiceStoreMixin, IconMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/ComboBox.css"}]
       */
      cssRequirements: [{cssFile:"./css/FilteringSelect.css"},
                        {cssFile:"./css/ComboBox.css"}],

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_FilteringSelect__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.id + "_CONTROL",
            name: this.name
         };
      },
      
      /**
       * Creates a new [ServiceStore]{@link module:alfresco/forms/controls/utilities/ServiceStore} object to use for 
       * retrieving and filtering the available options to be included in the ComboBox and then instantiates and returns
       * the a Dojo FilteringSelect widget that is configured to use it.
       * 
       * @instance
       */
      createFormControl: function alfresco_forms_controls_FilteringSelect__createFormControl(config, domNode) {
         var serviceStore = this.createServiceStore();
         var filteringSelect = new FilteringSelect({
            id: this.id + "_CONTROL",
            name: this.name,
            value: this.value,
            store: serviceStore,
            searchAttr: serviceStore.queryAttribute,
            labelAttribute: serviceStore.labelAttribute,
            queryExpr: "${0}",
         });
         this.addIcon(filteringSelect);
         this.showOptionsBasedOnValue(filteringSelect);

         // It's necessary to override the standard Dojo validation message handling here.
         filteringSelect.displayMessage = lang.hitch(this, this.onFilteringValidation);
         return filteringSelect;
      },

      /**
       * This function is hitched to the Dojo FilteringSelect widgets displayMessage function
       * and is used to control the overall validation for the widget so that it works with
       * other Aikau form controls.
       * 
       * @instance
       * @param {string} message The error message to display (this will be null if value is valid)
       */
      onFilteringValidation: function alfresco_forms_controls_FilteringSelect__onFilteringValidation(message) {
         if (!message)
         {
            this._validationMessage.innerHTML = "";
            this.alfPublish("ALF_VALID_CONTROL", {
               name: this.name,
               fieldId: this.fieldId
            });
            this.hideValidationFailure();
         }
         else
         {
            this._validationMessage.innerHTML = message;
            this.alfPublish("ALF_INVALID_CONTROL", {
               name: this.name,
               fieldId: this.fieldId
            });
            this.showValidationFailure();
         }
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setValue} to
       * reset the FilteringSelect if the empty string is set as the value.
       * 
       * @instance
       * @param {object} value
       */
      setValue: function alfresco_forms_controls_FilteringSelect__setValue(value) {
         this.inherited(arguments);
         if (value === "")
         {
            this.wrappedWidget.reset();
         }
      }
   });
});