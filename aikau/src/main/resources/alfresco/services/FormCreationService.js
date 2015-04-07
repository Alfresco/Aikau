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
 * @module alfresco/services/FormCreationService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/services/_PageServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "alfresco/services/_PageServiceTopicMixin",
        "alfresco/core/NotificationUtils",
        "alfresco/core/ObjectTypeUtils",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "service/constants/Default"],
        function(declare, AlfCore, CoreXhr, _PageServiceTopicMixin, NotificationUtils, ObjectTypeUtils, lang, array, domConstruct, AlfConstants) {
   
   return declare([AlfCore, CoreXhr, _PageServiceTopicMixin, NotificationUtils], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/PageService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/PageService.properties"}],
      
      /**
       * Sets up the subscriptions for the PageService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_FormCreationService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_EXPORT_PAGE_DEFINITION", lang.hitch(this, this.onFormExport));
      },
      
      /**
       * 
       * @instance
       * @param {object} payload Details of the form configuration to export
       */
      onFormExport: function alfresco_services_FormCreationService__onFormExport(payload) {
         var prefix = payload.modelName || "dummy.prefix";
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
         var libContent = "";
         libContent = "function get" + payload.modelName + "ConfigWidgets() {\n" +
            "   return " + JSON.stringify(clonedPayload.widgetsForConfig, null, "   ") + ";\n" + 
            "}\n\n";
         this.generateDownload(payload.modelName + ".lib.js", libContent);
      },

      processNlsData: function alfresco_services_FormCreationService__processNlsData(nlsProps, prefix, o) {
         // jshint maxcomplexity:false
         for (var key in o)
         {
            if (o.hasOwnProperty(key)) {
               
               // Get the value of the object...
               var v = o[key];
               if (ObjectTypeUtils.isString(v))
               {
                  var identifier = o.name || o.fieldId || o.id;
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
       * 
       * @instance
       * @param {string} fileName The name of the file to create
       * @param {string} content The file contents to create
       */
      generateDownload: function alfresco_services_FormCreationService__generateDownload(fileName, content) {
         var downloadLink = domConstruct.create("a", {
            href: "data:text/plain;charset=utf-8," + encodeURIComponent(content),
            download: fileName
         });
         downloadLink.click();
      },

      /**
       * This updates the supplied array of page defintion with the current page definition. This checks that the supplied
       * definition has both "name" and "nodeRef" attributes - the "name" attribute is converted to a "label" attribute and
       * the "nodeRef" attribute is converted to a "value" attribute in order to make the ultimately returned array be 
       * compatible with options for form controls. If the definition does not have these attributes then it is not added to
       * the array.
       * 
       * @instance
       * @param {object[]} pageDefs The array of page definitions to add the current definition to
       * @param {object} def The current definition to add to the supplied array
       * @param {number} index The index of the page def in the original results set
       */
      processAvailablePageDefResults: function alfresco_services_FormCreationService__processAvailablePageDefResults(pageDefs, def, index) {
         // jshint unused:false
         if (def.name && def.nodeRef)
         {
            var processedDef = {
               label: def.name,
               value: def.nodeRef
            };
            pageDefs.push(processedDef);
         }
         else
         {
            this.alfLog("error", "Missing attributes from page definition", def, this);
         }
      },
      
      /**
       * Extracts the page definition from the supplied payload. If the payload contains a "pageDefinition"
       * attribute then it is expected that the value is "stringified" JSON, but if it is supplied as
       * individual "publishOnReady", "services" and "widgets" attributes then they will need to be combined
       * and stringified.
       *
       * @instance
       * @param {object} payload The payload from which to retrieve the page definition.
       */
      getPageDefinitionFromPayload: function alfresco_services_FormCreationService__getPageDefinitionFromPayload(payload) {
         var pageDefinition = {
            publishOnReady: payload.publishOnReady,
            services: payload.services,
            widgets: payload.widgets
         };
         return pageDefinition;
      }
   });
});