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
 * This is a service that is dedicated to creating JavaScript and NLS properties library files that provide
 * localized models for creating drag-and-drop based modelling pages. It was written with this single use
 * case in mind however it could potentially be used in other contexts.
 * 
 * @module alfresco/services/DragAndDropModelCreationService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/ObjectTypeUtils",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct"],
        function(declare, AlfCore, ObjectTypeUtils, lang, array, domConstruct) {
   
   return declare([AlfCore], {
      
      /**
       * Sets up the subscriptions for the service
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_DragAndDropModelCreationService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_DND_EXPORT_MODEL_LIBRARY_FILES", lang.hitch(this, this.onFormExport));
         this.alfSubscribe("ALF_DND_PREVIEW_FORM_MODELS", lang.hitch(this, this.onFormPreview));
      },

      /**
       * Handles requests to generate previews of the form models.
       *
       * @instance
       * @param {object} payload The model to preview.
       */
      onFormPreview: function alfresco_services_DragAndDropModelCreationService__onFormPreview(payload) {
         if (payload && payload.widgetsForConfig)
         {
            this.alfPublish("MAIN_ALF_GENERATE_PAGE_PREVIEW", {
               publishOnReady: [],
               services: [],
               widgets: payload.widgetsForConfig
            });
         }
         if (payload && payload.widgetsForNestedConfig)
         {
            this.alfPublish("NESTED_ALF_GENERATE_PAGE_PREVIEW", {
               publishOnReady: [],
               services: [],
               widgets: payload.widgetsForNestedConfig
            });
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} payload Details of the form configuration to export
       */
      onFormExport: function alfresco_services_DragAndDropModelCreationService__onFormExport(payload) {
         var prefix = payload.nlsPrefix || "dummy.prefix";
         var nlsProps = [];

         // We want to clone the payload here because as we process the NLS properties we are going to substitute
         // the generated NLS keys in place of the values that have been entered, however we don't want the modeller
         // UI to immediately reflect that change in case they want to edit and export again...
         var clonedPayload = lang.clone(payload);
         if (clonedPayload.widgetsForConfig)
         {
            this.processNlsData(nlsProps, prefix, clonedPayload.widgetsForConfig);
         }
         if (clonedPayload.widgetsForNestedConfig)
         {
            this.processNlsData(nlsProps, prefix, clonedPayload.widgetsForNestedConfig);
         }

         // Output the NLS properties...
         var nlsContent = "";
         array.forEach(nlsProps, function(nlsProp) {
            nlsContent += nlsProp.key + "=" + nlsProp.value + "\n";
         }); 
         this.generateDownload(payload.modelName + ".lib.properties", nlsContent);

         // Output the actual model file...
         var configSuffix = "Config",
             nestedConfigSuffix = "NestedConfig",
             displaySuffix = "Display";
         
         var libContent = "";
         libContent += this.createFunctionContent(payload.modelName, clonedPayload.widgetsForConfig, configSuffix);
         libContent += this.createFunctionContent(payload.modelName, clonedPayload.widgetsForNestedConfig, nestedConfigSuffix);
         libContent += this.createFunctionContent(payload.modelName, clonedPayload.widgetsForDisplay, displaySuffix);

         var targetValues = JSON.stringify(payload.targetValues);
         libContent += this.createModelFunction(payload.modelName, 
                                                payload.property, 
                                                targetValues,
                                                configSuffix,
                                                nestedConfigSuffix,
                                                displaySuffix);

         this.generateDownload(payload.modelName + ".lib.js", libContent);

         // NOTE: This publication is largely included for test purposes...
         this.alfPublish("ALF_DND_MODEL_LIBRARIES", {
            nls: nlsContent,
            js: libContent
         });
      },

      /**
       * Creates a new function declaration using the supplied arguments.
       *
       * @instance
       * @param {string} name The name to to use for the function prefix
       * @param {object} model The model to process
       * @param {string} suffix The function suffix
       * @return {string} A function declaration as a string
       */
      createFunctionContent: function alfresco_services_DragAndDropModelCreationService__createFunctionContent(name, model, suffix) {
         // This is a replacement function for ensuring that unrequired attributes are filtered out
         // of the output model...
         var replacer = function(key, value) {
            switch (key) {
               case "selectOptionType":
               case "showDynamicBehaviourConfig":
                  return undefined;
               default:
                  return value;
            }
         };

         var content = "function get" + name + suffix + "() {\n" +
            "   return " + JSON.stringify(model, replacer, "   ") + ";\n" + 
            "}\n\n";

         // Convert the JSON output to a JavaScript object literal style...
         var re = /"([^"]*)":/g;
         content = content.replace(re, "$1:");

         // Make sure that name is first...
         // NOTE: This is probably going to be quite brittle
         // CURRENTLY COMMENTED OUT BECAUSE NOT WORKING FOR NESTED ITEMS
         // var re2 = /(config: {(.|\n)*?}),\n(.*)(\s)(name:\s"([^"]*)")/g;
         // content = content.replace(re2, "$5,\n$3 $1"); 
         return content;
      },

      /**
       * Creates the JavaScript function string that can be called to generate a single model. This
       * is what would be called by the WebScript JavaScript controller that imports the library file.
       *
       * @instance
       * @param  {string} name The model name
       * @param  {string} property The property of a dropped item that should be compared against the target values
       * @param  {string} targetValues A JSON stringified array of target values to match against the property
       * @param  {string} configWidgetsSuffix The suffix used for the function that gets the widgetsForConfig
       * @param  {string} nestedWidgetsSuffix The suffix used for the function that gets the widgetsForNestedConfig
       * @param  {string} displayWidgetsSuffix The suffix used for the function that gets the widgetsForDisplay
       * @return {string} The function definition
       */
      createModelFunction: function alfresco_services_DragAndDropModelCreationService__createModelFunction(name, property, targetValues, configWidgetsSuffix, nestedWidgetsSuffix, displayWidgetsSuffix) {
         var content = "function getDefault" + name + "Model() {\n" + 
            "   return {\n" + 
            "      property: \"" + property + "\",\n" + 
            "      targetValues: " + targetValues + ",\n" + 
            "      widgetsForConfig: get" + name + configWidgetsSuffix + "(),\n" +
            "      widgetsForNestedConfig: get" + name + nestedWidgetsSuffix + "(),\n" + 
            "      widgetsForDisplay: get" + name + displayWidgetsSuffix + "()\n" + 
            "   };\n" + 
            "}\n";
         return content;
      },
      
      /**
       * Processes the supplied model to generate an NLS lib file. The generated NLS keys are then
       * swapped into the model in place of the actual values.
       *
       * @instance
       * @param {array} nlsProps An array to update with the generated NLS properties
       * @param {string} prefix The prefix for each NLS key.
       * @param {object} o The current object in the model being processed
       */
      processNlsData: function alfresco_services_DragAndDropModelCreationService__processNlsData(nlsProps, prefix, o) {
         // jshint maxcomplexity:false
         for (var key in o)
         {
            if (o.hasOwnProperty(key)) {
               
               // Get the value of the object...
               var v = o[key];
               if (ObjectTypeUtils.isString(v))
               {
                  var identifier = o.name || o.fieldId || o.id || o.value;
                  if (identifier)
                  {
                     // If the object is a string, check the key and if it matches an NLS key then convert it
                     // into an NLS property object and push it into the supplied array...
                     switch (key) {
                        case "title":
                        case "label":
                        case "description":
                        case "unitsLabel":
                           var nlsKey = prefix + "." + identifier + "." + key;
                           var nlsProp = {
                              key: nlsKey,
                              value: v
                           };
                           nlsProps.push(nlsProp);

                           // Replace the value with the key...
                           o[key] = nlsKey;
                           break;
                     }
                  }
                  else
                  {
                     this.alfLog("warn", "No sensible identifier to use for current NLS prop", key);
                  }
               }
               else if (ObjectTypeUtils.isArray(v))
               {
                  array.forEach(v, lang.hitch(this, this.processNlsData, nlsProps, prefix));
               }
               else if (ObjectTypeUtils.isObject(v))
               {
                  this.processNlsData(nlsProps, prefix, v);
               }
            }
         }
      },

      /**
       * This is only currently supported by Chrome.
       * 
       * @instance
       * @param {string} fileName The name of the file to create
       * @param {string} content The file contents to create
       */
      generateDownload: function alfresco_services_DragAndDropModelCreationService__generateDownload(fileName, content) {
         var downloadLink = domConstruct.create("a", {
            href: "data:text/plain;charset=utf-8," + encodeURIComponent(content),
            download: fileName
         });
         downloadLink.click();
      }
   });
});