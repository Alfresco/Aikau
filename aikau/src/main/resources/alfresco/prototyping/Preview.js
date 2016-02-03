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
 * This widget allows Aikau models to be be displayed. It passes the model to Surf to obtain a list of the JavaScript and CSS
 * dependencies required to render the model and these are then dynamically added to the DOM.
 *
 * @example <caption>This is an example configuration:</caption>
 * 
 * @module alfresco/prototyping/Preview
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Preview.html",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "service/constants/Default",
        "alfresco/core/Page",
        "alfresco/util/objectProcessingUtil",
        "dojo/dom-construct",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/Deferred",
        "dojo/when",
        "dojo/json",
        "dojo/query",
        "dojo/NodeList-manipulate"], 
        function(declare, _Widget, _Templated, template, AlfCore, CoreXhr, topics, AlfConstants, Page, objectProcessingUtil, 
                 domConstruct, lang, array, Deferred, when, dojoJson, query) {
   
   return declare([_Widget, _Templated, AlfCore, CoreXhr], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/Preview.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/Preview.properties"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      pageDefinition: null,
      
      /**
       * Indicates whether or not templates stored on the Alfresco Repository should be retrieved so that
       * they can be processed within the generated preview.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.49
       */
      processTemplates: false,

      /**
       * This will hold a reference to the root object on which the preview is built. This object should be destroyed
       * before each new preview is built.
       *
       * @instance
       * @type {object}
       * @default
       */
      rootPreviewWidget: null,

      /**
       * This is used to store the timestamp of the last request made to generate the dependencies of a model. A timetamp
       * is taken before making an XHR request and included in the request configuration. When handling the response the 
       * request timestamp is compared against the last stored timestamp so that only the data for the last request is used
       * to build the preview.
       * 
       * @instance
       * @type {number}
       * @default
       * @since  1.0.54
       */
      _lastRequestTimestamp: null,

      /**
       * If a [pageDefinition]{@link module:alfresco/prototyping/Preview#pageDefinition} has been provided then the 
       * [generatePreview]{@link module:alfresco/prototyping/Preview#generatePreview} function will be called. A subscription
       * will be made for dynamic updating of the model.
       * 
       * @instance
       * @listens module:alfresco/core/topics#PREVIEW_MODEL_RENDER_REQUEST
       */
      postCreate: function alfresco_prototyping_Preview__postCreate() {
         if (this.pageDefinition)
         {
            this.generatePreview(this.pageDefinition);
         }
         this.alfSubscribe(topics.PREVIEW_MODEL_RENDER_REQUEST, lang.hitch(this, this.generatePreview));
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
      getPageDefinitionFromPayload: function alfresco_prototyping_Preview__getPageDefinitionFromPayload(payload) {
         var pageDefinition;
         if (!payload.stringified)
         {
            pageDefinition = {
               publishOnReady: payload.publishOnReady,
               services: payload.services,
               widgets: payload.widgets
            };
         }
         else 
         {
            pageDefinition = {
               publishOnReady: payload.publishOnReady ? JSON.parse(payload.publishOnReady) : [],
               services: payload.services? JSON.parse(payload.services) : [],
               widgets: payload.widgets? JSON.parse(payload.widgets): []
            };
         }
         pageDefinition = dojoJson.stringify(pageDefinition);
         return pageDefinition;
      },
      
      /**
       * PLEASE NOTE: This only works with the Horizon3-Repo-AMP REST APIs
       * 
       * @instance
       * @returns {object} Returns a promise of the XHR result to get the pages.
       * @since 1.0.49
       */
      loadAllTemplates: function alfresco_prototyping_Preview__loadAllTemplates() {
         var promise = new Deferred();
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "horizon3/pages",
            method: "GET",
            promise: promise,
            successCallback: this.loadAllTemplatesSuccess,
            callbackScope: this
         });
         return promise;
      },

      /**
       * Success handler for [loadAllTemplates]{@link module:alfresco/prototyping/Preview#loadAllTemplates}.
       * Resolves the promise originally returned.
       * 
       * @instance
       * @since 1.0.49
       */
      loadAllTemplatesSuccess: function alfresco_prototyping_Preview__loadTemplateSuccess(response, originalRequestConfig) {
         originalRequestConfig.promise.resolve(response.items);
      },

      /**
       * Configures a template that has been referenced in a model with the configuration defined for the 
       * template in that model.
       * 
       * @instance
       * @since 1.0.49
       */
      setTemplateConfiguration: function alfresco_prototyping_Preview__setTemplateConfiguration(parameters) {
         if (Array.isArray(parameters.object) &&
             parameters.config &&
             parameters.ancestors)
         {
            var parent = parameters.ancestors[parameters.ancestors.length-2];
            array.forEach(parameters.object, function(templateMapping) {
               if (templateMapping.property && templateMapping.id)
               {
                  // Get the last ancestor as this will be the "config" object of a widget in the 
                  // template that has a property to be set...
                  lang.setObject(templateMapping.property, parameters.config[templateMapping.id], parent);
               }
               else
               {
                  this.alfLog("warn", "Template mapping id or property was missing", templateMapping, parameters, this);
               }
            }, this);

            delete parent._alfTemplateMappings;
            delete parent._alfIncludeInTemplate;
         }
         else
         {
            this.alfLog("warn", "Cannot set template configuration without 'object', 'config' and 'ancestors' attributes", parameters, this);
         }
      },

      /**
       * Process a model to swap out any nested templates references that are contained within that 
       * model with the actual model of the referenced template. This will call the 
       * [setTemplateConfiguration]{@link module:alfresco/prototyping/Preview#setTemplateConfiguration}
       * function to update the processed template with any configuration that has been provided for it.
       * 
       * @instance
       * @since 1.0.49
       */
      processTemplate: function alfresco_prototyping_Preview__processTemplate(parameters) {
         // The object should actually be a string (i.e. the name or nodeRef of the template)...
         if (typeof parameters.object === "string" &&
             parameters.ancestors)
         {
            // Find the the template...
            var loadedTemplate;
            array.forEach(parameters.config.templates, function(template) {
               if (template.name === parameters.object)
               {
                  var parsedContent = JSON.parse(template.content);
                  loadedTemplate = parsedContent.widgets[0];
               }
            });

            // Get the parent in order to get the "config" to apply to the template...
            var parent = parameters.ancestors[parameters.ancestors.length-1];
            if (parent.config)
            {
               // Set the template configuration points...
               objectProcessingUtil.findObject(loadedTemplate, {
                  prefix: "_alfTemplateMappings", 
                  config: parent.config,
                  processFunction: lang.hitch(this, this.setTemplateConfiguration)
               });

               // Swap the loaded template back into the correct location...
               var arrayToUpdate = parameters.ancestors[parameters.ancestors.length-3];
               var indexToSwapForTemplate = parameters.ancestors[parameters.ancestors.length-2];
               arrayToUpdate.splice(indexToSwapForTemplate, 1, loadedTemplate);
            }
            else
            {
               this.alfLog("warn", "No 'config' attribute provided in parent of template.", parent, parameters, this);
            }
         }
         else
         {
            this.alfLog("warn", "Incorrect parameters - 'object' was missing or was not a string, no 'ancestors' provided", parameters, this);
         }
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
            // Found a template object...
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
       * @instance
       * @param {object} payload An object containing the details of the page definition to preview.
       */
      generatePreview: function alfresco_prototyping_Preview__generatePreview(payload) {
         if (payload)
         {
            if (this.rootPreviewWidget)
            {
               this.rootPreviewWidget.destroyRecursive(false);
            }
            this.previewNode.innerHTML = this.message("loading.preview.message");

            var pageDefinition = this.getPageDefinitionFromPayload(payload);
            var pageDefObject = dojoJson.parse(pageDefinition);

            var data = {
               jsonContent: pageDefObject
            };

            if (this.processTemplates)
            {
               var templateReponse = this.loadAllTemplates();
               when(templateReponse, lang.hitch(this, function(templates) {
                  try
                  {
                     objectProcessingUtil.findObject(data, {
                        prefix: "isTemplate",
                        processFunction: lang.hitch(this, this.cleanUpTemplateConfig),
                        config: null
                     });

                     // Find all templates and swap them out for the actual widget models...
                     objectProcessingUtil.findObject(data, {
                        prefix: "_alfTemplateName",
                        processFunction: lang.hitch(this, this.processTemplate),
                        config: {
                           templates: templates
                        }
                     });

                     this.requestPreviewDependencies(data);
                  }
                  catch(e)
                  {
                     this.alfLog("error", "An error occurred parsing the JSON", e, this);
                  }
               }));
            }
            else
            {
               // No need to load or process remote templates...
               this.requestPreviewDependencies(data);
            }
         }
         else
         {
            this.alfLog("warn", "A request was made to preview a page definition, but no 'pageDefinition' was provided", payload, this);
         }
      },

      /**
       * Makes an XHR request to retrieve the dependencies for the supplied page model. When the
       * request returns [updatePage]{@link module:alfresco/prototyping/Preview#updatePage} will be called
       * to render the preview.
       * 
       * @instance
       * @param {object} data The data for the preview.
       * @since 1.0.49
       */
      requestPreviewDependencies: function alfresco_prototyping_Preview__requestPreviewDependencies(data) {

         // Get a timestamp to make sure that we render the last request...
         var timestamp = Date.now();
         this._lastRequestTimestamp = timestamp;

         data.widgets = JSON.stringify(data.jsonContent);
         this.serviceXhr({
            url : AlfConstants.URL_SERVICECONTEXT + "surf/dojo/xhr/dependencies",
            data: data,
            lastRequestTimestamp: timestamp,
            method: "POST",
            successCallback: this.updatePage,
            failureCallback: this.onDependencyFailure,
            callbackScope: this
         });
      },
      
      /**
       * @instance
       */
      updatePage: function alfresco_prototyping_Preview__updatePage(response, originalRequestConfig) {
         // Iterate over the CSS map and append a new <link> element into the <head> element to ensure that all the
         // widgets CSS dependencies are loaded... 
         if (originalRequestConfig.lastRequestTimestamp === this._lastRequestTimestamp)
         {
            for (var media in response.cssMap)
            {
               if (response.cssMap.hasOwnProperty(media))
               {
                  // TODO: query for the node outside of the loop
                  // TODO: keep a reference to each node appended and then remove it when the preview is regenerated
                  query("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + appContext + response.cssMap[media] + "\" media=\"" + media + "\">");
               }
            }
            
            // Build in the i18n properties into the global object...
            var scopeMap = window[response.i18nGlobalObject].messages.scope;
            for (var scope in response.i18nMap)
            {
               if (typeof scopeMap[scope] === "undefined")
               {
                  // If the scope hasn't already been used then we can just assign it directly...
                  window[response.i18nGlobalObject].messages.scope[scope] = response.i18nMap[scope];
               }
               else
               {
                  // ...but if the scope already exists, then we need to mixin the new properties...
                  lang.mixin(scopeMap[scope], response.i18nMap[scope]);
               }
            }
            
            // The data response will contain a MD5 referencing JavaScript resource that we should request that Dojo loads...
            var requires = [];
            array.forEach(response.nonAmdDeps, function(dep) {
               requires.push(AlfConstants.URL_RESCONTEXT + dep);
            });
            requires.push(AlfConstants.URL_RESCONTEXT + response.javaScript);
            require(requires, lang.hitch(this, "buildPreview", originalRequestConfig.data.jsonContent, this.previewNode));
         }
      },

      /**
       * This function builds a new preview of the supplied model.
       *
       * @instance
       * @param {Object[]} config The configuration to use to build the preview
       * @param {element} rootNode The DOM node which should be used to add instantiated widgets to
       * @fires module:alfresco/core/topics#PREVIEW_MODEL_RENDERED
       */
      buildPreview: function alfresco_prototyping_Preview__buildPreview(config, rootNode) {
         domConstruct.empty(this.previewNode);
            
         var tmpNode = domConstruct.create("div", {}, rootNode);
         this.rootPreviewWidget = new Page({
            widgets: config.widgets,
            services: config.services,
            publishOnReady: config.publishOnReady
         }, tmpNode);

         this.alfPublish(topics.PREVIEW_MODEL_RENDERED);
      },

      /**
       * @instance
       */
      onDependencyFailure: function alfresco_prototyping_Preview__onDependencyFailure(response, originalRequestConfig) {
         this.alfLog("error", "An error occurred requesting the XHR dependencies", response, originalRequestConfig);
      }
   });
});