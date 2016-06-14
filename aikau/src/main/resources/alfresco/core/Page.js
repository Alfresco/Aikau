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
 * This is used as the default root object when instantiating a page. There should be no need
 * to ever instantiate this widget directly.
 *
 * @module alfresco/core/Page
 * @extends module:alfresco/core/ProcessWidgets
 * @mixes module:alfresco/core/ResizeMixin
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["alfresco/core/ProcessWidgets",
        "alfresco/core/ResizeMixin",
        "alfresco/core/topics",
        "alfresco/enums/urlTypes",
        "alfresco/util/urlUtils",
        "service/constants/Default",
        "dojo/string",
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/_base/window",
        "alfresco/core/PubQueue",
        "jquery", // NOTE: Need to include JQuery at root page to prevent XHR require request for first module that uses it
        "jqueryui", // NOTE: Need to include JQuery UI at root page to prevent XHR require request for first module that uses it
        "alfresco/core/shims"],
        function(ProcessWidgets, ResizeMixin, topics, urlTypes, urlUtils, AlfConstants, string, declare, domConstruct, array,
                 lang, domClass, win, PubQueue, $, jqueryui, shims) {

   return declare([ProcessWidgets, ResizeMixin], {

      /**
       * This is the base class for the page
       *
       * @instance
       * @type {string}
       * @default
       */
      baseClass: "alfresco-core-Page",

      /**
       * This is the callback handler for any require based errors that may occur during page load.
       *
       * @instance
       * @param  {object} error Details of the error that has occurred
       */
      onError: function alfresco_core_Page__onError(error) {
         /* global console */
         console.error("The following AMD module loading error occurred", error);
         this._showPage();
      },

      /**
       * Overrides the superclass implementation to call [processServices]{@link module:alfresco/core/Core#processServices}
       * and [processWidgets]{@link module:alfresco/core/Core#processWidgets} as applicable.
       *
       * @instance
       */
      postCreate: function alfresco_core_Page__postCreate() {
         if ((this.services && this.services.length) ||
             (this.widgets && this.widgets.length))
         {
            // See AKU-956 / AKU-998- register a new page with with the PubQueue...
            PubQueue.getSingleton().registerPage();
         }

         /*jshint devel:true*/
         shims.apply();
         
         try
         {
            if (AlfConstants.DEBUG)
            {
               require.on("error", lang.hitch(this, this.onError));
            }

            // If we're in debug mode, then we should add some DOM elements for the Developer View. This will
            // allow developers to see which WebScript has generated the page and to click a link to generate
            // a sample JAR to customize the page.
            if (AlfConstants.DEBUG && this.domNode && this.webScriptId)
            {
               this.webScriptLabel = "WebScript ID:";
               this.extensionDownloadUrl = urlUtils.convertUrl("generator/extension?webscriptId=" + this.webScriptId, urlTypes.PAGE_RELATIVE);
               this.extensionDownloadLabel = "(Click to generate extension JAR)";
               var pageInfoTemplate = "<div class=\"alfresco-debug-PageInfo\">" +
                  "<span class=\"label\">${webScriptLabel}</span>" +
                  "<span class=\"value\">${webScriptId}</span>" +
                  "<a href=\"${extensionDownloadUrl}\">${extensionDownloadLabel}</a>" +
               "</div>";
               var pageInfo = string.substitute(pageInfoTemplate, this);
               var pageInfoDom = domConstruct.toDom(pageInfo);
               domConstruct.place(pageInfoDom, this.domNode, "first");
            }

            // See AKU-891 - Prevent all standard drag and drop events from working if they bubble as
            // far as the html element. This decision has been taken to prevent users from inadvertently
            // dropping files onto areas of any page that can't handle them (and subsequently having those
            // files rendered by the browser). JQuery used here as Dojo approach proved problematic and we
            // have JQuery loaded anyway. All drag events need to be subscribed to to prevent the drop
            // being fired, see: http://stackoverflow.com/questions/14674349/why-preventdefault-does-not-work
            $("html").on("dragenter dragstart dragend dragleave dragover drag drop", function (e) {
               e.preventDefault();
            });

            if (this.services && this.services.length)
            {
               this.processServices(this.services);
            }
            else if (this.widgets && this.widgets.length)
            {
               // Make sure to process widgets if there are no services...
               // Otherwise they will be processed once all the services are instantiated...
               this.processWidgets(this.widgets, this.containerNode);
            }
         }
         catch (e)
         {
            this.alfLog("error", "The following error occurred building the page", e);
            this._showPage();
            PubQueue.getSingleton().release();
         }
      },

      /**
       * @instance
       */
      onReadyPublish: function alfresco_core_Page__onReadyPublish(publicationDetails) {
         if (publicationDetails && publicationDetails.publishTopic)
         {
            this.alfLog("log", "Onload publication", publicationDetails);
            this.alfPublish(publicationDetails.publishTopic, publicationDetails.publishPayload);
         }
         else
         {
            this.alfLog("warn", "The page was configured with an onload publication but no 'publishTopic' was provided", publicationDetails, this);
         }
      },

      /**
       * Handles the dependency management and instantiation of services required.
       *
       * @instance
       * @param {Array} services An array of the services to be instantiated.
       * @param {function} callback A function to call once the service has been instantiated
       * @param {object} callbackScope The scope with which to call the callback
       * @param {number} index The index of the service to create
       */
      processServices: function alfresco_core_Page__processServices(services, callback, callbackScope, index) {
         if (services)
         {
            if (!this.servicesToDestroy)
            {
               this.servicesToDestroy = [];
            }

            // Reset the processing complete flag (this is to support multiple invocations of widget processing)...
            this.serviceProcessingComplete = false;

            // TODO: Using these attributes will not support multiple calls to processWidgets from within the same object instance
            this._processedServiceCountdown = services.length;
            this._processedServices = [];

            // Iterate over all the services in the configuration object and add them...
            array.forEach(services, function(serviceConfig) {
               this.createService(serviceConfig, this._registerProcessedService, this, index);
            }, this);
         }
      },

      /**
       * This method will instantiate a new service having requested that its JavaScript resource and
       * dependent resources be downloaded. In principle all of the required resources should be available
       * if the service is being processed in the context of the Surf framework and dependency analysis of
       * the page has been completed. However, if this is being performed as an asynchronous event it may
       * be necessary for Dojo to request additional modules. This is why the callback function is required
       * to ensure that successfully instantiated modules can be kept track of.
       *
       * @instance
       * @param {object} config The configuration for the service
       * @param {element} domNode The DOM node to attach the service to
       * @param {function} callback A function to call once the service has been instantiated
       * @param {object} callbackScope The scope with which to call the callback
       * @param {number} index The index of the service to create (this will effect it's location in the
       * [_processedServices]{@link module:alfresco/core/Core#_processedServices} array)
       */
      createService: function alfresco_core_Page__createService(config, callback, callbackScope, index) {

         var dep = null,
             serviceConfig = {};
         if (typeof config === "string")
         {
            dep = config;
         }
         else if (typeof config === "object" && config.name)
         {
            dep = config.name;
            if (typeof config.config === "object")
            {
               serviceConfig = config.config;
            }
         }
         if (serviceConfig.pubSubScope === undefined)
         {
            // ...otherwise inherit the callers pubSubScope if one hasn't been explicitly configured...
            serviceConfig.pubSubScope = this.pubSubScope;
         }

         var _this = this;
         var requires = [dep];
         require(requires, function(ServiceType) {
            if (typeof ServiceType === "function")
            {
               try
               {
                  // We need to add the dependency name of the service into the constructor arguments
                  // in order for the BaseService (if extended, which really it should be) to be able
                  // to use that dependency name to register the service instance (see AKU-531)...
                  serviceConfig.alfServiceName = dep;
                  var service = new ServiceType(serviceConfig);
                  _this.servicesToDestroy.push(service);
               }
               catch (e) 
               {
                  _this.alfLog("error", "The following error occurred creating a service", e);
                  _this._showPage();
               }
            }
            else
            {
               _this._showPage();
               _this.alfLog("error", "The following service could not be found, so is not included on the page '" +  dep + "'. Please correct the use of this service in your page definition");
            }
            if (callback)
            {
               // If there is a callback then call it with any provided scope (but default to the
               // "this" as the scope if one isn't provided).
               callback.call((callbackScope || _this), service, index);
            }
         });
      },

      /**
       * Used to keep track of all the services created as a result of a call to the [processWidgets]{@link module:alfresco/core/Core#processWidgets} function
       *
       * @instance
       * @type {Array}
       * @default
       */
      _processedServices: null,

      /**
       * This is used to countdown the services that are still waiting to be created. It is initialised to the size
       * of the services array supplied to the [processServices]{@link module:alfresco/core/Core#processServices} function.
       *
       * @instance
       * @type {number}
       * @default
       */
      _processedServiceCountdown: null,

      /**
       * This function registers the creation of a service. It decrements the
       * [_processedServiceCountdown]{@link module:alfresco/core/Core#_processedServiceCountdown} attribute
       * and calls the [allServicesProcessed]{@link module:alfresco/core/Core#allServicesProcessed} function when it reaches zero.
       *
       * @instance
       * @param {object} service The service that has just been processed.
       * @param {number} index The target index of the service
       */
      _registerProcessedService: function alfresco_core_Core___registerProcessedService(service, index) {
         this._processedServiceCountdown--;
         if (index !== 0 && (!index || isNaN(index)))
         {
            this._processedServices.push(service);
         }
         else
         {
            this._processedServices[index] = service;
         }

         if (this._processedServiceCountdown === 0)
         {
            this.allServicesProcessed(this._processedServices);
            this.serviceProcessingComplete = true;
         }
      },

      /**
       * This is set from false to true after the [allServicesProcessed]{@link module:alfresco/core/Core#allServicesProcessed}
       * extension point function is called. It can be used to check whether or not service processing is complete.
       * This is to allow for checks that service processing has been completed BEFORE attaching a listener to the
       * [allServicesProcessed]{@link module:alfresco/core/Core#allServicesProcessed} function.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      serviceProcessingComplete: false,

      /**
       * This is an extension point for handling the completion of calls to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       *
       * @instance
       * @param {Array} services An array of all the services that have been processed
       */
      allServicesProcessed: function alfresco_core_Page__allServicesProcessed(services) {
         /*jshint unused:false*/
         this.alfLog("log", "All services processed");
         if (this.widgets && this.widgets.length)
         {
            // Make sure to process widgets if there are no services...
            // Otherwise they will be processed once all the services are instantiated...
            this.processWidgets(this.widgets, this.containerNode);
         }
         else
         {
            PubQueue.getSingleton().release();
         }
      },

      /**
       * @instance
       */
      allWidgetsProcessed: function alfresco_core_Page__allWidgetsProcessed(widgets) {
         /*jshint unused:false*/
         this.alfLog("log", "All page widgets processed");
         // TODO: Need to be able to notify widgets that they can start publications in the knowledge that other widgets are available
         // to respond...

         if (this.publishOnReady)
         {
            array.forEach(this.publishOnReady, lang.hitch(this, this.onReadyPublish));
         }

         // Release all publications that have been queued awaiting all the widgets to have finished being
         // created...
         PubQueue.getSingleton().release();
         this.alfPublish(topics.PAGE_WIDGETS_READY, {});

         // Once everything has completed loading we want to publish a resize event to give all of the widgets
         // a chance to set their dimensions correctly. This is somewhat using a sledgehammer to crack a nut but
         // is a simple and effective means of ensuring the correct layout on page load. In particular this was
         // prompted by issues with the AlfTabContainer in Chrome not handling client height correctly (see AKU-506)
         this.alfPublishResizeEvent(this.domNode);

         // Add a class to indicate that the page is ready. This is primarily for testing purposes.
         domClass.add(this.domNode, "allWidgetsProcessed");
         this._showPage();
      },

      /**
       * Un-hide the body of the page
       *
       * @instance
       * @since 1.0.59
       */
      _showPage: function alfresco_core_Page___showPage() {
         domClass.add(document.body, "aikau-reveal");
      }
   });
});