/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * @module alfresco/forms/controls/MultipleKeyValuePairElement
 * @extends module:alfresco/forms/controls/MultipleEntryElement
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/MultipleEntryElement", 
        "dijit/form/TextBox",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dijit/registry"], 
        function(declare, MultipleEntryElement, TextBox, lang, domConstruct, domClass, registry) {
   
   return declare([MultipleEntryElement], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/MultipleKeyValuePairElement.properties"}],

      /**
       * @instance
       * @type {string}
       * @default "label"
       */
      keyProp: "label",
      
      /**
       * @instance
       * @type {string}
       * @default "multi.kvp.key.label"
       */
      keyLabel: "multi.kvp.key.label",
      
      /**
       * @instance
       * @type {string}
       * @default "multi.kvp.key.description"
       */
      keyDescription: "multi.kvp.key.description",
      
      /**
       * @instance
       * @type {string}
       * @default "value"
       */
      valueProp: "value",
      
      /**
       * @instance
       * @type {string}
       * @default "multi.kvp.value.label"
       */
      valueLabel: "multi.kvp.value.label",
      
      /**
       * @instance
       * @type {string}
       * @default "multi.kvp.value.description"
       */
      valueDescription: "multi.kvp.value.description",
      
      /**
       * @instance
       */
      determineKeyAndValue: function alfresco_forms_controls_MultipleKeyValuePairElement__determineKeyAndValue() {
         this.inherited(arguments);
         if (this.elementValue[this.keyProp] === undefined)
         {
            this.elementValue[this.keyProp] = "";
         }
         if (this.elementValue[this.valueProp] === undefined)
         {
            this.elementValue[this.valueProp] = "";
         }
      },
      
      /**
       * The default read display simply shows the value of the element.
       * 
       * @instance
       */
      createReadDisplay: function alfresco_forms_controls_MultipleKeyValuePairElement__createReadDisplay() {
         var currentValue = this.getValue();
         this.readDisplay.innerHTML = this.encodeHTML(currentValue[this.keyProp] + " = " + currentValue[this.valueProp]);
      },
      
      /**
       * Returns the widgets to be used in the form created for edit mode.
       * 
       * @instance
       * @returns {object[]}
       */
      getFormWidgets: function alfresco_forms_controls_MultipleKeyValuePairElement__getFormWidgets() {
         return [
            {
               // This is the hidden id and needs to be included to ensure that the id is persisted.
               name: "alfresco/forms/controls/DojoValidationTextBox",
               config: {
                  name: "fieldId",
                  label: "fieldId",
                  value: this.elementValue.fieldId,
                  visibilityConfig: {
                     initialValue: false
                  }
               }
            },
            {
               name: "alfresco/forms/controls/DojoValidationTextBox",
               config: {
                  name: this.keyProp,
                  label: this.keyLabel,
                  description: this.keyDescription,
                  value: this.elementValue[this.keyProp],
                  requirementConfig: {
                     initialValue: true
                  }
               }
            },
            {
               name: "alfresco/forms/controls/DojoValidationTextBox",
               config: {
                  name: this.valueProp,
                  label: this.valueLabel,
                  description: this.valueDescription,
                  value: this.elementValue[this.valueProp],
                  requirementConfig: {
                     initialValue: true
                  }
               }
            }
         ];
      }
   });
});