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
 * This extends the [SingleTextFieldForm]{@link module:alfresco/forms/SingleTextFieldForm} to
 * replace the text field with a [ComboBox]{@link module:alfresco/forms/controls/ComboBox}. As such
 * it is necessary to provide additional configuration information that the 
 * [ComboBox]{@link module:alfresco/forms/controls/ComboBox} can use to retrieve the options to
 * be displayed.
 * 
 * @module alfresco/forms/SingleComboBoxForm
 * @extends module:alfresco/forms/SingleTextFieldForm
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/SingleTextFieldForm",
        "alfresco/forms/controls/ComboBox"], 
        function(declare, SingleTextFieldForm) {
   
   return declare([SingleTextFieldForm], {
      
      /**
       * This is the attribute that will be queried in each returned item for the 
       * [ComboBox]{@link module:alfresco/forms/controls/ComboBox}. It defaults to 
       * "name" but can be overridden in configuration as required.
       *
       * @instance
       * @type {string}
       * @default "name"
       */
      queryAttribute: "name",

      /**
       * This is the topic that should be published on in order to request the available
       * options to display in the [ComboBox]{@link module:alfresco/forms/controls/ComboBox}.
       * It defaults to null so will need to be configured when this widget is used.
       *
       * @instance
       * @type {string}
       * @default null
       */
      optionsPublishTopic: null,

      /**
       * This is the payload that will be published in order to request the avilable options to
       * display in the [ComboBox]{@link module:alfresco/forms/controls/ComboBox}. It defaults 
       * to null so will need to be configured when this widget is used
       *
       * @instance
       * @type {object}
       * @default null
       */
      optionsPublishPayload: null,

      /**
       * Overridden to set the "widgets" attribute to be a single
       * [ComboBox]{@link module:alfresco/forms/controls/ComboBox}.
       *
       * @instance
       */
      postMixInProperties: function alfresco_forms_SingleComboBoxForm__postMixInProperties() {
         this.widgets = [
            {
               name: "alfresco/forms/controls/ComboBox",
               assignTo: "entryField",
               config: {
                  label: (this.textBoxLabel) ? this.message(this.textBoxLabel) : "",
                  name: this.textFieldName,
                  requirementConfig: {
                     initialValue: true
                  },
                  iconClass: (this.textBoxIconClass) ? this.textBoxIconClass : "",
                  additionalCssClasses: (this.textBoxCssClasses) ? this.textBoxCssClasses : "",
                  optionsConfig: {
                     queryAttribute: this.queryAttribute,
                     publishTopic: this.optionsPublishTopic,
                     publishPayload: this.optionsPublishPayload
                  }
               }
            }
         ];
      }
   });
});