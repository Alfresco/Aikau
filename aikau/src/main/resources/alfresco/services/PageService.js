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
 * @module alfresco/services/PageService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/services/_PageServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/services/_PageServiceTopicMixin",
        "alfresco/core/NotificationUtils",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/util/objectProcessingUtil",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "service/constants/Default"],
        function(declare, BaseService, CoreXhr, _PageServiceTopicMixin, NotificationUtils, ObjectTypeUtils, objectProcessingUtil, lang, array, domConstruct, AlfConstants) {
   
   return declare([BaseService, CoreXhr, _PageServiceTopicMixin, NotificationUtils], {
      
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
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_PageService__registerSubscriptions() {
         this.alfSubscribe("ALF_AVAILABLE_PAGE_DEFINITIONS", lang.hitch(this, this.loadPages));
         this.alfSubscribe("ALF_GET_ALL_REMOTE_PAGES", lang.hitch(this, this.getPages));
         this.alfSubscribe(this.createPageTopic, lang.hitch(this, this.createPage));
         this.alfSubscribe(this.updatePageTopic, lang.hitch(this, this.updatePage));
         this.alfSubscribe("ALF_EXPORT_PAGE_DEFINITION", lang.hitch(this, this.exportPageModel));
      },
      

      /**
       * Exports the JSON model in a format that can be used in a WebScript.
       *
       * @instance
       * @param {object} payload Details of the page to export
       */
      exportPageModel: function alfresco_services_PageService__exportPageModel(payload) {
         var pageDef = this.getPageDefinitionFromPayload(payload);

         // Stringify the model in a nice format...
         var exportString = "model.jsonModel = " + JSON.stringify(pageDef, null, "   ");

         // Remove the quotes from the attributes (to make more consistent with WebScript controller style)...
         exportString = exportString.replace(/\"([^\"]*)\":/g, "$1:");
         this.generateWsDownload(payload.pageName + ".get.js", exportString);

         // Generate the desc.xml file...
         // TODO: Maybe we should be launching a dialog to collect the additional data, e.g. the URL, etc
         var descXmlString = 
         "<webscript>\n" + 
         "  <shortname></shortname>\n" + 
         "  <description></description>\n" + 
         "  <family></family>\n" + 
         "  <url></url>\n " + 
         "</webscript>";
         this.generateWsDownload(payload.pageName + ".get.desc.xml", descXmlString);

         // Generate the HTML template...
         var htmlString = "<@processJsonModel/>";
         this.generateWsDownload(payload.pageName + ".get.html.ftl", htmlString);
      },

      /**
       * 
       * @instance
       * @param {string} fileName The name of the file to create
       * @param {string} content The file contents to create
       */
      generateWsDownload: function alfresco_services_PageService__generateWsDownload(fileName, content) {
         var downloadLink = domConstruct.create("a", {
            href: "data:text/plain;charset=utf-8," + encodeURIComponent(content),
            download: fileName
         });
         downloadLink.click();
      },

      /**
       * PLEASE NOTE: This only works with the Horizon3-Repo-AMP REST APIs
       *
       * @instance
       * @param {object} payload The payload for the page request
       * @since 1.0.49
       */
      getPages: function alfresco_services_PageService__loadPages(/*jshint unused:false */ payload) {
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "horizon3/pages",
            method: "GET",
            alfTopic: payload.alfResponseTopic,
            successCallback: this.getPagesSuccess,
            callbackScope: this
         });
      },

      /**
       * Success handler for [getPages]{@link module:alfresco/services/PageService#getPages}.
       *
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       * @since 1.0.49
       */
      getPagesSuccess: function alfresco_services_PageService__getPagesSuccess(response, originalRequestConfig) {
         if (response && response.items && ObjectTypeUtils.isArray(response.items))
         {
            var pageDefs = [];
            array.forEach(response.items, lang.hitch(this, function(item) {
               pageDefs.push(
                  {
                     type: [ "widget"],
                     label: item.name,
                     value: {
                        templateModel: JSON.parse(item.content),
                        isTemplate: true
                     }
                  }
               );
            }));

            response.items = pageDefs;
            var topic = originalRequestConfig.alfTopic + "_SUCCESS";
            this.alfPublish(topic, {
               response: response,
               originalRequestConfig: originalRequestConfig
            });
         }
         else
         {
            this.alfLog("error", "The request to retrieve available page definitions returned a response that could not be interpreted", response, originalRequestConfig, this);
         }
      },

      /**
       * Makes an XHR request to retrieve the pages that are available. The pages returned are those
       * that have been created and stored in the Data Dictionary on the Alfresco repository. 
       *
       * @instance
       * @param {object} The paylod containing additional data. This can contain a "responseTopic" to 
       * publish the options back on.
       */
      loadPages: function alfresco_services_PageService__loadPages(payload) {
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "remote-share/pages",
            method: "GET",
            responseTopic: payload.responseTopic,
            successCallback: this.loadPagesSuccess,
            failureCallback: this.loadPagesFailure,
            callbackScope: this
         });
      },
      
      /**
       * This processes the results returned from the XHR request to obtain the available pages that have been
       * defined on the repository. This is necessary because the REST API doesn't return the data in an way
       * that fits with the typical use case (e.g. for providing selectable options in form controls). This function
       * has been written in respect of the [onPubSubOptions]{@link module:alfresco/forms/controls/BaseFormControl#onPubSubOptions}
       * function.
       *
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      loadPagesSuccess: function alfresco_services_PageService__loadPagesSuccess(response, originalRequestConfig) {
         if (response && response.items && ObjectTypeUtils.isArray(response.items))
         {
            var topic = originalRequestConfig.responseTopic || this.availablePagesLoadSuccess;
            var pageDefs = [];
            array.forEach(response.items, lang.hitch(this, "processAvailablePageDefResults", pageDefs));

            // NOTE: This is something of an assumption that we want to set the processed "pageDefs" as the "options" attribute
            //       here, but this has been written in respect of retrieving options to be displayed in a drop-down menu (e.g
            //       a form control extending alfresco/forms/controls/BaseFormControl) so it needs to be set in the "options"
            //       attribute although this should arguably be configurable.
            this.alfPublish(topic, {
               options: pageDefs,
               response: response,
               originalRequestConfig: originalRequestConfig
            });
         }
         else
         {
            this.alfLog("error", "The request to retrieve available page definitions returned a response that could not be interpreted", response, originalRequestConfig, this);
         }
         
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
      processAvailablePageDefResults: function alfresco_services_PageService__processAvailablePageDefResults(pageDefs, def, index) {
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
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      loadPagesFailure: function alfresco_services_PageService__loadPagesFailure(response, originalRequestConfig) {
         this.availablePagesLoadFailure(this.availablePagesTopic, {
            response: response,
            originalRequestConfig: originalRequestConfig
         });
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
      getPageDefinitionFromPayload: function alfresco_services_PageService__getPageDefinitionFromPayload(payload) {
         var pageDefinition = {
            publishOnReady: payload.publishOnReady,
            services: payload.services,
            widgets: payload.widgets
         };
         return pageDefinition;
      },

      /**
       * Removes unnecessary attributes from a template before it is passed for previewing.
       * 
       * @instance
       * @param {object} parameters
       * @since 1.0.49
       */
      cleanUpTemplateConfig: function alfresco_services_PageService__cleanUpTemplateConfig(parameters) {
         if (parameters.object === true)
         {
            var parent = parameters.ancestors[parameters.ancestors.length-1];
            objectProcessingUtil.findObject(parent.config, {
               prefix: "isTemplate",
               processFunction: lang.hitch(this, this.cleanUpTemplateConfig),
               config: null
            });

            parent._alfTemplateName = parent.label;
            delete parent.label;
            delete parent.isTemplate;
            delete parent.templateModel;
            delete parent.type;
         }
      },

      /**
       * 
       * @instance
       * @param {object} payload The details of the page to create
       */
      createPage: function alfresco_services_PageService__createPage(payload) {
         if (payload && payload.pageName)
         {
            var data = {
               name: payload.pageName,
               json: this.getPageDefinitionFromPayload(payload)
            };

            // Clean up template data to set "_alfTemplateName" and remove superfluous attributes...
            objectProcessingUtil.findObject(data, {
               prefix: "isTemplate",
               processFunction: lang.hitch(this, this.cleanUpTemplateConfig),
               config: null
            });

            this.serviceXhr({
               url : AlfConstants.PROXY_URI + "remote-share/page-definition",
               data: data,
               method: "POST",
               successCallback: this.pageCreateSuccess,
               failureCallback: this.pageCreateFailure,
               callbackScope: this
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to save a page definition to the repository but not enough information was provided", payload);
         }
      },
      
      /**
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      pageCreateSuccess: function alfresco_services_PageService__pageCreateSuccess(response, originalRequestConfig) {
         this.alfLog("log", "Successfully created page", response, originalRequestConfig);
         this.displayMessage(this.message("page.creation.success", [originalRequestConfig.data.name]));
         this.alfPublish(this.createPageSuccessTopic, {
            response: response,
            originalRequestConfig: originalRequestConfig
         });
      },
      
      /**
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      pageCreateFailure: function alfresco_services_PageService__pageCreateFailure(response, originalRequestConfig) {
         this.alfLog("error", "Failed to create page", response, originalRequestConfig);
         this.displayMessage(this.message("page.creation.failure", [originalRequestConfig.data.name]));
         this.alfPublish(this.createPageFailureTopic, {
            response: response,
            originalRequestConfig: originalRequestConfig
         });
      },
      
      /**
       * 
       * @instance
       * @param {object} payload The details of the page to update
       */
      updatePage: function alfresco_services_PageService__updatePage(payload) {
         if (payload && payload.pageName)
         {
            var data = {
               name: payload.pageName,
               json: this.getPageDefinitionFromPayload(payload)
            };
            this.serviceXhr({
               url : AlfConstants.PROXY_URI + "remote-share/page-definition/" + payload.pageName,
               data: data,
               method: "PUT",
               successCallback: this.pageUpdateSuccess,
               failureCallback: this.pageUpdateFailure,
               callbackScope: this
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to update a page definition to the repository but not enough information was provided", payload);
         }
      },
      
      /**
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      pageUpdateSuccess: function alfresco_prototyping_ScratchPad__pageUpdateSuccess(response, originalRequestConfig) {
         this.alfLog("log", "Successfully updated page", response, originalRequestConfig);
         this.displayMessage(this.message("page.update.success", [originalRequestConfig.data.name]));
         this.alfPublish(this.updatePageSuccessTopic, {
            response: response,
            originalRequestConfig: originalRequestConfig
         });
      },
      
      /**
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      pageUpdateFailure: function alfresco_prototyping_ScratchPad__pageUpdateFailure(response, originalRequestConfig) {
         this.alfLog("error", "Failed to update page", response, originalRequestConfig);
         this.displayMessage(this.message("page.update.failure", [originalRequestConfig.data.name]));
         this.alfPublish(this.updatePageFailureTopic, {
            response: response,
            originalRequestConfig: originalRequestConfig
         });
      }
   });
});