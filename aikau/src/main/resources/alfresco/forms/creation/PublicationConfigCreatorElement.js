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
 * @module alfresco/forms/creation/PublicationConfigCreatorElement
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
      i18nRequirements: [{i18nFile: "./i18n/Publication.properties"}],
      
      /**
       * @instance
       */
      determineKeyAndValue: function alfresco_forms_creation_PublicationConfigCreatorElement__determineKeyAndValue() {
         this.inherited(arguments);
         if (this.elementValue.targetId === undefined)
         {
            this.elementValue.targetId = "";
         }
         if (this.elementValue.publishPayload === undefined)
         {
            this.elementValue.publishPayload = [];
         }
      },
      
      // /**
      //  * Extends the inherited function to create a subscription for updates to the available form fields to select
      //  * from when creating a new rule and then explicitly publishes a request to get the latest field information.
      //  * 
      //  * @instance
      //  */
      // postCreate: function alfresco_forms_controls_PublicationConfigCreatorElement__postCreate() {
      //    this.alfSubscribe("ALF_FORM_FIELDS_UPDATE", lang.hitch(this, "updateAvailableFields"));
      //    this.alfPublish("ALF_REQUEST_AVAILABLE_FORM_FIELDS", {});
      //    this.inherited(arguments);
      // },
      
      // *
      //  * This function is the callback handler for requesting the currently available fields. It is very similar to 
      //  * the "getOptionsFromPublication" function in BaseFormControl except that it sets an instance variable. It is
      //  * necessary to get the latest fields in order to be able to render the read display correctly.
      //  * 
      //  * @instance
      //  * @param {payload} payload The payload containing the details of the available fields
       
      // updateAvailableFields: function alfresco_forms_controls_PublicationConfigCreatorElement__setAvailableFields(payload) {
      //    var options = lang.getObject("options", false, payload);
      //    if (options != null && ObjectTypeUtils.isArray(options))
      //    {
      //       this.availableFields = options;
      //    }
      //    else
      //    {
      //       this.availableFields = []
      //    }
      // },
      
      /**
       * Attempts to create a human readable description of the current rule definition.
       * 
       * @instance
       */
      createReadDisplay: function alfresco_forms_creation_PublicationConfigCreatorElement__createReadDisplay() {
         var value = this.getValue();
         this.readDisplay.innerHTML = this.message("publication.readDisplay.label", {
            "topic": value.publishTopic
         });
      },
      
      /**
       *
       *
       * @instance
       */
      createEditDisplay: function alfresco_forms_creation_PublicationConfigCreatorElement__createEditDisplay() {
         this.inherited(arguments);
         this.alfPublish("ALF_REQUEST_AVAILABLE_FORM_FIELDS", {});
      },

      /**
       * Returns the widgets to be used in the form created for edit mode.
       * 
       * @instance
       * @returns {object[]}
       */
      getFormWidgets: function alfresco_forms_creation_PublicationConfigCreatorElement__getFormWidgets() {
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
                  name: "publishTopic",
                  label: "publication.topic.label",
                  description: "publication.topic.description",
                  value: this.elementValue.publishTopic,
                  requirementConfig: {
                     initialValue: true
                  }
               }
            },
            {
               name: "alfresco/forms/controls/MultipleKeyValuePairFormControl",
               config: {
                  name: "publishPayload",
                  label: "publication.config.label",
                  description: "publication.config.description",
                  value: this.elementValue.publishPayload
               }
            }
         ];
      }
   });
});