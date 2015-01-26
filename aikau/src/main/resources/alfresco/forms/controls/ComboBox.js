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
            name: this.name,
            value: (this.value != null) ? this.value : null
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
      }
   });
});