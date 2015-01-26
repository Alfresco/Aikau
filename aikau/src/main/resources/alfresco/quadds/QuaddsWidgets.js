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
 * 
 * @module alfresco/quadds/QuaddsWidgets
 * @extends module:alfresco/core/ProcessWidgets
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["alfresco/core/ProcessWidgets",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/declare",
        "dojo/_base/array",
        "dojo/_base/lang",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "dojo/dom-construct",
        "dojo/json",
        "dojo/query",
        "dojo/NodeList-manipulate"], 
        function(ProcessWidgets, CoreWidgetProcessing, declare, array, lang, CoreXhr, AlfConstants, domConstruct, dojoJson, query) {
   
   return declare([ProcessWidgets, CoreWidgetProcessing, CoreXhr], {
      
      /**
       * 
       * @instance
       * @type string
       * @default null
       */
      quadds: null,

      /**
       * Requests all the QuADDS items
       *
       * @instance
       */
      postCreate: function alfresco_quadds_QuaddsWidgets__postCreate() {

         if (this.quadds != null)
         {
            var responseTopic = this.generateUuid();
            this._quaddsItemsHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, "processQuaddsItems"), true);

            this.alfPublish("ALF_GET_QUADDS_ITEMS", {
               responseTopic: responseTopic,
               quadds: this.quadds
            });
         }
         else
         {
            this.alfLog("warn", "A QuaddsWidgets instance was configured that did not specify a QuADDS name", this);
         }
      },

      /**
       * @instance
       */
      updatePage: function alfresco_prototyping_Preview__updatePage(response, originalRequestConfig) {
         // Iterate over the CSS map and append a new <link> element into the <head> element to ensure that all the
         // widgets CSS dependencies are loaded... 
         for (var media in response.cssMap)
         {
            // TODO: query for the node outside of the loop
            // TODO: keep a reference to each node appended and then remove it when the preview is regenerated
            query("head").append('<link rel="stylesheet" type="text/css" href="' + appContext + response.cssMap[media] + '" media="' + media + '">');
         }

         
         // Build in the i18n properties into the global object...
         for (var scope in response.i18nMap)
         {
            if (typeof window[response.i18nGlobalObject].messages.scope[scope] == "undefined")
            {
               // If the scope hasn't already been used then we can just assign it directly...
               window[response.i18nGlobalObject].messages.scope[scope] = response.i18nMap[scope];
            }
            else
            {
               // ...but if the scope already exists, then we need to mixin the new properties...
               lang.mixin(window[response.i18nGlobalObject].messages.scope[scope], response.i18nMap[scope]);
            }
         }

         // The data response will contain a MD5 referencing JavaScript resource that we should request that Dojo loads...
         var requires = [];
         array.forEach(response.nonAmdDeps, function(dep, i) {
            requires.push(AlfConstants.URL_RESCONTEXT + dep);
         });
         requires.push(AlfConstants.URL_RESCONTEXT + response.javaScript);
         require(requires, function() {
            console.log("QuADDS requirements loaded");

            // _this.processWidgets(widgets, this.containerNode);
         });
         
      },

      /**
       * Build an array of widget configurations from the QuADDS data and process it
       *
       * @instance
       */
      processQuaddsItems: function alfresco_quadds_QuaddsWidgets__processQuaddsItems(payload) {
         var widgets = [];
         array.forEach(payload.items, lang.hitch(this, "processQuaddsItem", widgets));

         var pageDefinition = {
            publishOnReady: [],
            services: [],
            widgets: widgets
         };
         pageDefinition = dojoJson.stringify(pageDefinition);
         var pageDefObject = dojoJson.parse(pageDefinition);
         var data = {
            jsonContent: pageDefObject,
            widgets: pageDefinition
         };
         this.serviceXhr({
            url : AlfConstants.URL_SERVICECONTEXT + "surf/dojo/xhr/dependencies",
            data: data,
            method: "POST",
            successCallback: this.updatePage,
            // failureCallback: this.onDependencyFailure,
            callbackScope: this
         });

         this.processWidgets(widgets, this.containerNode);
      },

      /**
       * Extract any widget configuration from the QuADDS item and add it to the supplied array.
       * @instance
       */
      processQuaddsItem: function alfresco_quadds_QuaddsWidgets__processQuaddsItem(widgets, quaddsItem, index) {
         var widgetConfig = lang.getObject("data.widget", false, quaddsItem);
         if (widgetConfig != null)
         {
            widgets.push(widgetConfig);
         }
      }
   });
});