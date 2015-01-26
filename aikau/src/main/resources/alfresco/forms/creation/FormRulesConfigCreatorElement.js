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
 * @module alfresco/forms/creation/FormRulesConfigCreatorElement
 * @extends module:alfresco/forms/controls/MultipleEntryElement
 * @author Dave Draper
 */
define(["alfresco/forms/controls/MultipleEntryElement",
        "dojo/_base/declare",
        "alfresco/forms/PublishForm",
        "alfresco/core/ObjectTypeUtils",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/forms/controls/DojoValidationTextBox",
        "alfresco/forms/controls/DojoSelect",
        "alfresco/forms/controls/MultipleEntryFormControl"], 
        function(MultipleEntryElement, declare, PublishForm, ObjectTypeUtils, lang, array, DojoValidationTextBox, DojoSelect, MultipleEntryFormControl) {
   
   return declare([MultipleEntryElement], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/FormCreation.properties"}],
      
      /**
       * @instance
       */
      determineKeyAndValue: function alfresco_forms_creation_FormRulesConfigCreatorElement__determineKeyAndValue() {
         this.inherited(arguments);
         if (this.elementValue.targetId === undefined)
         {
            this.elementValue.targetId = "";
         }
         if (this.elementValue.is === undefined)
         {
            this.elementValue.is = [];
         }
         if (this.elementValue.isNot === undefined)
         {
            this.elementValue.isNot = [];
         }
      },
      
      /**
       * Extends the inherited function to create a subscription for updates to the available form fields to select
       * from when creating a new rule and then explicitly publishes a request to get the latest field information.
       * 
       * @instance
       */
      postCreate: function alfresco_forms_controls_FormRulesConfigCreatorElement__postCreate() {
         this.alfSubscribe("ALF_FORM_FIELDS_UPDATE", lang.hitch(this, "updateAvailableFields"));
         this.alfPublish("ALF_REQUEST_AVAILABLE_FORM_FIELDS", {});
         this.inherited(arguments);
      },
      
      /**
       * This function is the callback handler for requesting the currently available fields. It is very similar to 
       * the "getOptionsFromPublication" function in BaseFormControl except that it sets an instance variable. It is
       * necessary to get the latest fields in order to be able to render the read display correctly.
       * 
       * @instance
       * @param {payload} payload The payload containing the details of the available fields
       */
      updateAvailableFields: function alfresco_forms_controls_FormRulesConfigCreatorElement__setAvailableFields(payload) {
         var options = lang.getObject("options", false, payload);
         if (options != null && ObjectTypeUtils.isArray(options))
         {
            this.availableFields = options;
         }
         else
         {
            this.availableFields = []
         }
      },
      
      /**
       * Attempts to create a human readable description of the current rule definition.
       * 
       * @instance
       */
      createReadDisplay: function alfresco_forms_creation_FormRulesConfigCreatorElement__createReadDisplay() {
         var value = this.getValue();
         if (value.is != null && value.isNot != null)
         {
            var msgType = "";
            if (value.is.length == 0 && value.isNot.length == 0)
            {
               msgType = "rule.display.any";
            }
            else if (value.is.length > 0 && value.isNot.length == 0)
            {
               msgType = "rule.display.mustBe";
            }
            else if (value.isNot.length > 0 && value.is.length == 0)
            {
               msgType = "rule.display.mustNotBe";
            }
            else
            {
               msgType = "rule.display.mustAndmustNotBe";
            }

            // Get the selected field name...
            var fieldName = this.findAvailableField(value);
            if (fieldName != null)
            {
               this.readDisplay.innerHTML = this.message(msgType, {"field": fieldName, 
                  "mustBe" : this.generateReadValues(value.is),
                  "mustNotBe" : this.generateReadValues(value.isNot)});
            }
            else
            {
               this.readDisplay.innerHTML = this.message("rule.fieldDeleted.label");
            }
         }
         else
         {
            this.readDisplay.innerHTML = "";
         }
      },
      
      createEditDisplay: function alfresco_forms_creation_FormRulesConfigCreatorElement__createEditDisplay() {
         this.inherited(arguments);
         this.alfPublish("ALF_REQUEST_AVAILABLE_FORM_FIELDS", {});
      },
      /**
       * Searches through the availableFields to find a field with the same id as the targetId attribute of the
       * current value. Returns the label associated with the field for display purposes.
       * 
       * TODO: Emit a validation event if the field cannot be found (as this would indicate that it has been deleted)
       * 
       * @instance
       * @param {object} value The current value to find the field for
       * @returns {string} fieldName
       */
      findAvailableField: function alfresco_forms_creation_FormRulesConfigCreatorElement__findAvailableField(value) {
         var fieldName = null;
         if (this.availableFields != null)
         {
            for (var i=0; i<this.availableFields.length; i++)
            {
               if (this.availableFields[i].value == value.targetId)
               {
                  fieldName = this.availableFields[i].label;
                  break;
               }
            }
         }
         return fieldName;
      },
      
      /**
       * Creates a comma separated string from an array of objects where each element has a "value" attribute.
       * 
       * @instance
       * @param {object[]} valueArray
       * @returns {string} A comma separated list of the values in the array.
       */
      generateReadValues: function alfresco_forms_creation_FormRulesConfigCreatorElement__generateReadValues(valueArray) {
         var values = "";
         array.forEach(valueArray, function(value, index) {
            values = values + "'" + value.value + "'" + ((index < valueArray.length-1) ? ", " : "");
         });
         return values;
      },
      
      /**
       * Returns the widgets to be used in the form created for edit mode.
       * 
       * @instance
       * @returns {object[]}
       */
      getFormWidgets: function alfresco_forms_creation_FormRulesConfigCreatorElement__getFormWidgets() {
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
               name: "alfresco/forms/controls/DojoSelect",
               config: {
                  name: "targetId",
                  label: "rule.field.label",
                  description: "rule.field.description",
                  value: this.elementValue.targetId,
                  optionsConfig: {
                     updateTopics: [{
                        // Make the subscription global but prefix it with the pubSubScope for the element.
                        // This is necessary because the form being creating has it's own scope (to prevent
                        // pollution of field events) but the field updates must come from the wider scope
                        topic: this.pubSubScope + "ALF_FORM_FIELDS_UPDATE",
                        global: true
                     }],
                     callback: "getOptionsFromPublication"
                  },
                  requirementConfig: {
                     initialValue: true
                  }
               }
            },
            {
               name: "alfresco/forms/controls/MultipleEntryFormControl",
               config: {
                  name: "is",
                  label: "rule.is.label",
                  description: "rule.is.description",
                  value: this.elementValue.is
               }
            },
            {
               name: "alfresco/forms/controls/MultipleEntryFormControl",
               config: {
                  name: "isNot",
                  label: "rule.isNot.label",
                  description: "rule.isNot.description",
                  value: this.elementValue.isNot
               }
            }
         ];
      }
   });
});