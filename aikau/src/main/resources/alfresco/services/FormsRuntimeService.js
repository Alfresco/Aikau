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
 * @module alfresco/services/FormsRuntimeService
 * @extends module:alfresco/services/BaseService
 * @author Dave Draper
 * @since 1.0.NEXT
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/NodeUtils",
        "alfresco/core/topics",
        "service/constants/Default",
        "dojo/_base/array",
        "dojo/_base/lang"],
        function(declare, BaseService, CoreXhr, NodeUtils, topics, AlfConstants, array, lang) {
   
   return declare([BaseService, CoreXhr], {
      
      /**
       * 
       * @instance
       * @type {object}
       */
      defaultMappings: {
         edit: {
            "/org/alfresco/components/form/controls/textfield.ftl" : "alfresco/forms/controls/TextBox",
            "/org/alfresco/components/form/controls/textarea.ftl"  : "alfresco/forms/controls/TextArea"
         },
         view: {
            "/org/alfresco/components/form/controls/textfield.ftl" : "alfresco/renderers/Property",
            "/org/alfresco/components/form/controls/textarea.ftl" : "alfresco/renderers/Property"
         },
         constraints: {
            "Alfresco.forms.validation.fileName": {
               pattern: "([\"\*\\\>\<\?\/\:\|]+)|([\.]?[\.]+$)|(^[ \t]+|[ \t]+$)",
               match: false
            },
            "Alfresco.forms.validation.wikiTitle": {
               pattern: "([#\\\?\/\|]+)|([\.]?[\.]+$)",
               match: false
            },
            "Alfresco.forms.validation.nodeRef": {
               pattern: "^[^\:^ ]+\:\/\/[^\:^ ]+\/[^ ]+$",
               match: true
            },
            "Alfresco.forms.validation.phone": {
               pattern: "^[0-9\(\)\[\]\-\+\*#\\:\/,; ]+$",
               match: true
            },
            "Alfresco.forms.validation.time": {
               pattern: "^([0-1]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$",
               match: true
            },
            "Alfresco.forms.validation.url": {
               pattern: "(ftp|http|https):\/\/[\w\-_]+(\.[\w\-_]+)*([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?",
               match: true
            }
            // TODO: "Alfresco.forms.validation.email" not handled yet due to complexity

         }
      },

      widgetsForMappings: [
         {
            name: "alfresco/forms/controls/TextBox"
         },
         {
            name: "alfresco/forms/controls/TextArea"
         },
         {
            name: "alfresco/renderers/Property"
         }
      ],

      /**
       * 
       * 
       * @instance
       */
      registerSubscriptions: function alfresco_services_FormsRuntimeService__registerSubscriptions() {
         this.alfSubscribe(topics.REQUEST_FORM, lang.hitch(this, this.onFormRequest));
      },
      
      /**
       * 
       * 
       * @instance
       */
      onFormRequest: function alfresco_services_FormsRuntimeService__onFormRequest(payload) {
         if (payload.itemKind &&
             payload.itemId &&
             payload.mode)
         {
            var itemId = payload.itemId;
            if (payload.itemKind === "node")
            {
               var nodeData = NodeUtils.processNodeRef(payload.itemId);
               itemId = nodeData.uri;
            }

            var url = AlfConstants.URL_SERVICECONTEXT + "aikau/form" +
                      "?itemKind=" + payload.itemKind + 
                      "&itemId=" + itemId + 
                      "&formId=" + (payload.formId || "null") + 
                      "&mode=" + payload.mode;

            var successTopic = payload.alfSuccessTopic || 
                               payload.alfResponseTopic ||
                               (payload.alfTopic + "_SUCCESS");

            this.serviceXhr({url : url,
                             method: "GET",
                             alfSuccessTopic: successTopic,
                             successCallback: this.onFormLoaded,
                             failureCallback: this.onFormLoadFailure,
                             callbackScope: this});
         }
         else
         {
            this.alfLog("error", "A request was made to retrieve a form that was missing one of 'itemKind', 'itemId', 'formId' or 'mode' attributes", payload, this);
         }
      },

      /**
       * The form data is returned as a JSON object that needs to be parsed and the data mapped to Aikau
       * configuration.
       * 
       * @instance
       * @param {object} response The response will be the form configuration to render
       * @param {object} originalReqeuestConfig The object used when making the XHR request that resulted in this callback
       */
      onFormLoaded: function alfresco_services_FormsRuntimeService__onFormLoaded(response, originalRequestConfig) {
         if (response.structure &&
             response.fields &&
             response.constraints)
         {
            var widgets = [];
            if (response.mode === "view")
            {
               var properties = [];
               var metadataGroup = {
                  name: "alfresco/node/MetadataGroups",
                  config: {
                     currentItem: response.data,
                     groups: [
                        {
                           title: "TODO", // TODO: Need to figure out correct value here...
                           widgets: properties
                        }
                     ]
                  }
               };

               array.forEach(response.structure, function(structureElement) {
                  if (structureElement.children)
                  {
                     array.forEach(structureElement.children, lang.hitch(this, this.addField, properties, response));
                  }
               }, this);

               widgets.push(metadataGroup);
            }
            else
            {
               var formControls = [];
               var formConfig = {

                  name: "alfresco/forms/Form",
                  config: {
                     showOkButton: response.showSubmitButton,
                     showCancelButton: response.showCancelButton,
                     okButtonPublishTopic: response.method === "post" ? "ALF_CRUD_CREATE" : "ALF_CRUD_UPDATE",
                     okButtonPublishPayload: {
                        url: response.submissionUrl
                     },
                     value: response.data,
                     widgets: formControls
                  }
               };

               // Iterate over the structure array and add the the form controls for all of the fields
               // that it contains...
               // TODO: Need to handle the different structures that are available...
               array.forEach(response.structure, function(structureElement) {
                  if (structureElement.children)
                  {
                     array.forEach(structureElement.children, lang.hitch(this, this.addField, formControls, response));
                  }
               }, this);

               widgets.push(formConfig);
            }
            
            this.alfPublish(originalRequestConfig.alfSuccessTopic, {
               widgets: widgets
            });
         }

         
      },

      /**
       * Called from [onFormLoaded]{@link module:alfresco/services/FormsRuntimeService#onFormLoaded} for
       * each structural element in the form. Each structural element will typically represent a field
       * to be rendered.
       * 
       * @instance
       * @param {object[]} widgets The array of widgets to add the widget for the field to
       * @param {object} formConfig The full configuration for the form being rendered
       * @param {object} structureElement The current structural element defining a field to be rendered
       */
      addField: function alfresco_services_FormsRuntimeService__addField(widgets, formConfig, structureElement) {
         if (structureElement && structureElement.id)
         {
            // TODO: Do we need to consider "kind" attributes on the structureElement other than "field" ???
            
            // Look up the target field referenced in the structure element...
            var targetField = formConfig.fields[structureElement.id];
            if (targetField)
            {
               // We need to get the control template from the field configuration. This will be a Surf/YUI2 
               // reference which is fairly meaningless in the context of Aikau, however we can use this to 
               // map to an Aikau form control...
               var controlTemplate = lang.getObject("control.template", false, targetField);
               if (controlTemplate)
               {
                  var widget;
                  if (formConfig.mode === "view")
                  {
                     widget = this.getViewProperty(targetField, controlTemplate);
                  }
                  else
                  {
                     widget = this.getEditFormControl(targetField, controlTemplate, formConfig);
                  }
                  widget && widgets.push(widget);
               }
            }
         }
      },

      /**
       * Called from [addField]{@link module:alfresco/services/FormsRuntimeService#addField} to create
       * a "view" mode widget for the field supplied.
       * 
       * @instance
       * @param  {object} targetField The configuration for the field to render.
       * @param  {string} controlTemplate The name of the template to be mapped to a widget
       * @return {object} A model for the widget to be used to render the property.
       */
      getViewProperty: function alfresco_services_FormsRuntimeService__getViewProperty(targetField, controlTemplate) {
         var widget;
         var formControl = this.defaultMappings.view[controlTemplate];
         if (formControl)
         {
            widget = {
               id: targetField.name.toUpperCase(),
               label: targetField.label,
               name: formControl,
               config: {
                  propertyToRender: targetField.dataKeyName
               }
            };
            
         }
         else
         {
            this.alfLog("warn", "Could not find a mapping for ", controlTemplate, this);
         }
         return widget;
      },

      /**
       * Called from [addField]{@link module:alfresco/services/FormsRuntimeService#addField} to create
       * a "edit" mode widget for the field supplied.
       * 
       * @instance
       * @param {object} targetField The configuration for the field to render.
       * @param {string} controlTemplate The name of the template to be mapped to a widget
       * @param {object} formConfig The full configuration for the form being rendered
       * @return {object} A model for the widget to be used to render the property.
       */
      getEditFormControl: function alfresco_services_FormsRuntimeService__addFormControl(targetField, controlTemplate, formConfig) {
         var widget;
         var formControl = this.defaultMappings.edit[controlTemplate];
         if (formControl)
         {
            widget = {
               id: targetField.name.toUpperCase(),
               name: formControl,
               config: {
                  fieldId: targetField.name.toUpperCase(),
                  name: targetField.name,
                  label: targetField.label,
                  description: targetField.description
               }
            };

            if (formConfig.constraints)
            {
               array.forEach(formConfig.constraints, function(constraint) {
                  if (constraint.fieldId === targetField.name)
                  {
                     this.addConstraint(widget, constraint);
                  }
               }, this);
            }
            
         }
         else
         {
            this.alfLog("warn", "Could not find a mapping for ", controlTemplate, this);
         }
         return widget;
      },

      /**
       * 
       * @instance
       * @param {object} widget The widget model to add the constraint to
       * @param {object} constraint The constraint configuration
       */
      addConstraint: function alfresco_services_FormsRuntimeService__addConstraint(widget, constraint) {
         if (constraint.id === "MANDATORY")
         {
            widget.config.requirementConfig = {
               initialValue: true
            };
         }
         else if (constraint.id === "REGEX")
         {
            var regex = this.defaultMappings.constraints[constraint.validationHandler];
            if (regex)
            {
               if (!widget.config.validationConfig)
               {
                  widget.config.validationConfig = [];
               }
               widget.config.validationConfig.push({
                  validation: "regex",
                  regex: regex.pattern,
                  invertRule: !regex.match,
                  errorMessage: constraint.message
               });
            }
         }
         // TODO: Need to address these constraints !!!
         else if (constraint.id === "NUMBER") {}
         else if (constraint.id === "MINMAX") {}
         else if (constraint.id === "LIST") {}
         else if (constraint.id === "LENGTH") {}
      },

      /**
       * 
       * 
       * @instance
       */
      onFormLoadFailure: function alfresco_services_FormsRuntimeService__onFormLoadFailure(response, originalRequestConfig) {
         // TODO: Need to handle failures appropriately...
      }
   });
});
