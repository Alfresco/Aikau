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
 * @module alfresco/services/DragAndDropModellingService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/dnd/Constants",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/dnd/DroppedItemWidgets"],
        function(declare, AlfCore, lang, array, Constants, ObjectTypeUtils) {
   
   return declare([AlfCore], {
      
      /**
       * Sets up the subscriptions for the LogoutService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_DragAndDropModellingService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe(Constants.requestWidgetsForDisplayTopic, lang.hitch(this, this.onDroppedItemDataRequest, "widgetsForDisplay"));
         this.alfSubscribe(Constants.requestWidgetsForConfigTopic, lang.hitch(this, this.onDroppedItemDataRequest, "widgetsForConfig"));
      },

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
            }
            else
            {
               // Could not find a match, fall back to the default
            }
         }
         else
         {
            this.alfLog("error", "A request was made to provide a display model for a dropped item, but no value was provided", payload, this);
         }
      },

      /**
       * 
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
         if (model.property &&
             model.targetValues && 
             value[model.property])
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
                     response.widgets = model[configAttribute];
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