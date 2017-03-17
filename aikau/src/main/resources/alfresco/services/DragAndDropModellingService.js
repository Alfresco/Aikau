/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * <p>This service should be used in conjunction with the 
 * [DragAndDropTargetControl]{@link module:alfresco/form/controls/DragAndDropTargetControl}
 * and the widgets in the "alfresco/dnd" package. It should be configured with models for how
 * dropped items should be both rendered and edited. Each model should be placed into the
 * [models]{@link module:alfresco/services/DragAndDropModellingService#models} array. An example
 * model might look like this:</p>
 * <p><pre>{
 *    property: "name",
 *    targetValues: ["alfresco/forms/controls/(.*)"],
 *    widgetsForConfig: [
 *       {
 *          id: "ALF_EDIT_FORM_CONTROL_LABEL",
 *          name: "alfresco/forms/controls/TextBox",
 *          config: {
 *             fieldId: "LABEL",
 *             label: "Label",
 *             description: "The label for the form field value",
 *             name: "config.label"
 *          }
 *       }
 *    ],
 *    widgetsForDisplay: [
 *       {
 *          name: "alfresco/dnd/DroppedItemWrapper",
 *          config: {
 *             label: "{label}",
 *             value: "{value}",
 *             type: "{type}",
 *             widgets: [
 *                {
 *                   name: "alfresco/dnd/DroppedItemWidgets"
 *                }
 *             ]
 *          }
 *       }
 *    ]
 * }</pre></p>
 * <p>In this example we are mapping the configuration of a [dropped item]{@link module:alfresco/dnd/DragAndDropItems#items}
 * that has a property "name" that matches any of the Regular Expressions defined in the "targetValues" array 
 * (in this case we are targeting any data objects that have a "name" property that maps to that of a form 
 * control wigdget (e.g. "alfresco/forms/controls/TextBox")). If the criteria for this model is met then the 
 * "widgetsForConfig" or "widgetsForDisplay" arrays will be returned depending upon which has been asked for.</p>
 * <p>The "widgetsForDisplay" array is a model of widgets that will be rendered for the 
 * [dropped item]{@link module:alfresco/dnd/DragAndDropItems#items} and the "widgetsForConfig" array is a model 
 * of widgets that can be used to edit the value of that item.</p>
 * 
 * @module alfresco/services/DragAndDropModellingService
 * @extends module:alfresco/services/BaseService
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/dnd/Constants",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/util/objectProcessingUtil"],
        function(declare, BaseService, lang, array, Constants, ObjectTypeUtils, objectProcessingUtil) {
   
   return declare([BaseService], {
      
      /**
       * Sets up the subscriptions for the service
       * 
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_DragAndDropModellingService__registerSubscriptions() {
         this.alfSubscribe(Constants.requestWidgetsForDisplayTopic, lang.hitch(this, this.onDroppedItemDataRequest, "widgetsForDisplay"));
         this.alfSubscribe(Constants.requestWidgetsForConfigTopic, lang.hitch(this, this.onDroppedItemDataRequest, "widgetsForConfig"));
         this.alfSubscribe(Constants.requestWidgetsForNestedConfigTopic, lang.hitch(this, this.onDroppedItemDataRequest, "widgetsForNestedConfig"));
      },

      /**
       * This should be configured as an array of models to inspect when data is requested. See the 
       * main service description above for details.
       * 
       * @instance
       * @type {array}
       * @default
       */
      models: null,

      /**
       * This is the default widget model to render for dropped items that are not matched against
       * any specific model.
       *
       * @instance
       * @type {array}
       */
      widgetsForDefaultDisplay: [{
         name: "alfresco/dnd/DroppedItemWrapper",
         config: {
            showEditButton: false,
            label: "{label}",
            value: "{value}",
            type: "{type}",
            widgets: [{
               name: "alfresco/dnd/DroppedItem"
            }]
         }
      }],

      /**
       * This is the default widget model to use as for editing dropped items.
       *
       * @instance
       * @type {array}
       */
      widgetsForDefaultConfig: [],

      /**
       * This is the default widget model to include when editing nested dropped items.
       *
       * @instance
       * @type {array}
       */
      widgetsForDefaultNestedConfig: [],

      /**
       * Handles requests to find a model that matches the value provided in the published payload. If a matching model
       * is found then the supplied configuration from that model will be published in response.
       *
       * @instance
       * @param {string} configAttribute The attribute to use from the configuration if the model matches
       * @param {object} payload The payload provided
       */
      onDroppedItemDataRequest: function alfresco_services_DragAndDropModellingService__onDroppedItemDataRequest(configAttribute, payload) {
         var value = lang.getObject("value", false, payload);
         if (value)
         {
            var response = {};
            var success = array.some(this.models, lang.hitch(this, this.processModel, configAttribute, response, value));
            if (success === true)
            {
               // Found a match, resolve a promise or publish on a response topic provided...
               this.provideResponse(payload, response);
            } 
            else 
            {
               // Could not find a match, fall back to the default
               switch (configAttribute) {
                  case "widgetsForDisplay":
                     this.provideResponse(payload, {
                        widgets: lang.clone(this.widgetsForDefaultDisplay)
                     });
                     break;
                  case "widgetsForConfig":
                     this.provideResponse(payload, {
                        widgets: lang.clone(this.widgetsForDefaultConfig)
                     });
                     break;
                  case "widgetsForNestedConfig":
                     this.provideResponse(payload, {
                        widgets: lang.clone(this.widgetsForDefaultNestedConfig)
                     });
                     break;
                  default:
                     this.provideResponse(payload, {
                        widgets: []
                     });
                     break;
               }
            }
         } 
         else 
         {
            this.alfLog("error", "A request was made to provide a display model for a dropped item, but no value was provided", payload, this);
         }
      },

      /**
       * Provides a response to the request for information via either a promise or on a response topic depending upon
       * what has been provided in the supplied payload argument.
       *
       * @instance
       * @param {object} payload An object containing the details of the request.
       * @param {object} response The response to return.
       */
      provideResponse: function alfresco_services_DragAndDropModellingService__provideResponse(payload, response) {
         if (payload.promise && typeof payload.promise.resolve === "function") 
         {
            payload.promise.resolve(response);
         } 
         else if (payload.alfResponseTopic) 
         {
            this.alfPublish(payload.alfResponseTopic, response);
         } 
         else 
         {
            this.alfLog("error", "Matching model data was found for dropped item, but no promise or alfResponseTopic was provided in the payload", payload, this);
         }
      },

      /**
       * Find the drop targets in a template and ensure that they are have the appropriate
       * template configuration applied to them (i.e. that when they are displayed they are
       * shown with the externalised template label and set the appropriate property).
       *
       * @instance
       * @param  {object} parameters The template processing parameters
       * @return {boolean} An indication as to whether or not a template was processed.
       * @since 1.0.49
       */
      findDropTargets: function alfresco_services_DragAndDropModellingService__findDropTargets(parameters) {
         if (parameters.object === "alfresco/dnd/DragAndDropNestedTarget")
         {
            var parent = parameters.ancestors[parameters.ancestors.length-1];
            var targetProperty = lang.getObject("config.targetProperty", false, parent);
            if (targetProperty)
            {
               // See if the target property of the DragAndDropNestedTarget is a mapped in
               // the template...
               array.some(parameters.config.templateMappings, function(mapping) {
                  var found = (mapping.property === targetProperty);
                  if (found)
                  {
                     var clonedParent = lang.clone(parent);

                     // We need to swap the actual targetProperty and label for the template mapped versions...
                     clonedParent.config.targetProperty = "config." + mapping.id;
                     clonedParent.config.label = mapping.label;
                     parameters.config.data.push(clonedParent);
                  }
                  return found;
               });
            } 
         }
         else
         {
            var configParent = parameters.ancestors[parameters.ancestors.length-2];
            array.some(parameters.config.templateMappings, function(mapping) {
               var found = (mapping.property === parameters.object);
               if (found)
               {
                  var clonedParent = lang.clone(configParent);
                  clonedParent.config.name = "config." + mapping.id;
                  clonedParent.config.label = mapping.label;
                  clonedParent.config.description = mapping.description;
                  parameters.config.data.push(clonedParent);
               }
               return found;
            });
         }
      },

      /**
       * Add the externalised configuration defined for a template to the model for displaying it.
       * 
       * @instance
       * @param {object} parameters
       * @since 1.0.49
       */
      addConfig: function alfresco_services_DragAndDropModellingService__addConfig(parameters) {
         var parent = parameters.ancestors[parameters.ancestors.length-2];
         var templateResponse = {};
         array.some(parameters.config.models, lang.hitch(this, this.processModel, parameters.config.configAttribute, templateResponse, parent));
         
         // The problem with widgetsForDisplay is knowing what to filter and what to display.
         // There could be multiple nested config...
         // We should just have the drop targets (DragAndDropNestedTarget) where the "targetProperty" matches an exposed property (e.g. config.widgets)
         objectProcessingUtil.findObject(templateResponse, {
            prefix: "name",
            processFunction: lang.hitch(this, this.findDropTargets),
            config: {
               templateMappings: parameters.object,
               data: parameters.config.data
            }
         });
      },

      /**
       * Inspects the supplied model with data provided to see whether or not the model matches the data.
       * 
       * @instance
       * @param {string} configAttribute The configuration attribute to return from the model
       * @param {object} response The payload object to populate if the current model matches
       * the supplied value.
       * @param {object} value The value to compare against the model provided
       * @param {object} model The model to test the value against
       */
      processModel: function alfresco_services_DragAndDropModellingService__processModel(configAttribute, response, value, model) {
         var modelMatchFound = false;

         if ((value.isTemplate === true || value._alfTemplateName) && value.templateModel)
         {
            // The dropped item is a template, it will be necessary to construct the data from the data it contains...
            var templateModel = value.templateModel;
            var config = {
               models: this.models,
               data: [],
               configAttribute: configAttribute
            };

            // Working through the template model to find all the "_alfTemplateMappings" attributes - these
            // define how nested configuration within the template should be exposed as configuration attributes
            // of the template itself. For each mapping the addConfig function will be called to add this to
            // the configuration for display (either in the edit form or as a drop target)...
            objectProcessingUtil.findObject(templateModel, {
               prefix: "_alfTemplateMappings",
               processFunction: lang.hitch(this, this.addConfig),
               config: config
            });

            // Depending upon the configAttribute requested (either configuration for editing or configuration
            // for rendering the dropped item) the response should be constructed. For display it will be necessary
            // to place the model in a wrapper...
            modelMatchFound = true;
            if (configAttribute === "widgetsForDisplay")
            {
               response.widgets = [
                  {
                     name: "alfresco/dnd/DroppedTemplateItemWrapper",
                     label: "Nested item wrapper",
                     responseScope: "",
                     config: {
                        value: "{value}",
                        widgets: config.data,
                        label: "{label}",
                        showEditButton: "false"
                     }
                  }
               ];
            }
            else
            {
               response.widgets = config.data;
            }
         }
         else if (model.property && model.targetValues && value[model.property]) 
         {
            // The model has a property to check for, and the value contains the property
            // We're going to want to test this value against the configured RegularExpression target
            // values so assing it to a variable for later use...
            var targetPropertyValue = value[model.property];

            // Defensively check that the target values have been provided as an array so that we 
            // can issue a warning if invalid configuration has been provided.
            if (ObjectTypeUtils.isArray(model.targetValues))
            {
               // Check to see if the current value matches any of the target value regular expressions
               // provided. If any match then we will use the current model to populate the response
               // payload
               if (array.some(model.targetValues, lang.hitch(this, this.matchesTargetValue, targetPropertyValue)))
               {
                  // Check that the attriibute we're looking for is actually provided for this model
                  if (model[configAttribute])
                  {
                     response.widgets = lang.clone(model[configAttribute]);
                     modelMatchFound = true;
                  }
                  else
                  {
                     this.alfLog("error", "A model was matched to the supplied value, but the model doesn't have a '" + configAttribute + "' attribute", targetPropertyValue, model, this);
                  }
               }
            }
            else
            {
               this.alfLog("warn", "The model target values were not provided as an array", model.targetValues, this);
            }
         }
         return modelMatchFound;
      },

      /**
       * This function is used by the [processModel]{@link module:alfresco/services/DragAndDropModellingService#processModel}
       * function to test a supplied value against a Regular Expression to determine whether or not the model
       * applies to the value.
       * 
       * @instance
       * @param {object} value The value to test
       * @param {string} regex The string to use to build a Regular Expression with to test the value against.
       * @returns {boolean} True if the value matches against the Regular Expression and false otherwise.
       */
      matchesTargetValue: function alfresco_services_DragAndDropModellingService__matchesTargetValue(value, regex) {
         var match = false;
         try 
         {
            var re = new RegExp(regex);
            match = re.test(value);
         }
         catch (e)
         {
            this.alfLog("error", "There was an error testing a target value against the supplied value", value, regex, e, this);
         }
         return match;
      }
   });
});