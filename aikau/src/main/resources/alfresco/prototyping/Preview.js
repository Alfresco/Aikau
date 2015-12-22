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
        function(declare, _Widget, _Templated, template, AlfCore, CoreXhr, AlfConstants, Page, objectProcessingUtil, 
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

      pageDefinition: null,
      
      /**
       * @instance
       */
      postCreate: function alfresco_prototyping_Preview__postCreate() {
         if (this.pageDefinition)
         {
            this.generatePreview(this.pageDefinition);
         }
         this.alfSubscribe("ALF_GENERATE_PAGE_PREVIEW", lang.hitch(this, "generatePreview"));
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

      loadAllTemplatesSuccess: function alfresco_prototyping_Preview__loadTemplateSuccess(response, originalRequestConfig) {
         originalRequestConfig.promise.resolve(response.items);
      },

      setTemplateConfiguration: function alfresco_prototyping_Preview__setTemplateConfiguration(parameters) {
         if (Array.isArray(parameters.object)  &&
             parameters.config &&
             parameters.ancestors)
         {
            var parent = parameters.ancestors[parameters.ancestors.length-2]; 
            parameters.object.forEach(function(templateMapping) {
               if (templateMapping.property)
               {
                  // Get the last ancestor as this will be the "config" object of a widget in the 
                  // template that has a property to be set...
                  if (typeof templateMapping.id !== undefined)
                  {
                     // parent[templateMapping.property] = parameters.config[templateMapping.id];
                     lang.setObject(templateMapping.property, parameters.config[templateMapping.id], parent);
                     // delete parent["_alfTemplateMapping_" + valueProperty];
                  }
                  else
                  {
                     // TODO: Log missing value attribute (e.g. the attribute to get the value from to set in the template)
                  }
               }
               else
               {
                  // TODO: Log incorrect parameters argument - missing some attributes
               }
            });

            delete parent._alfTemplateMappings;
            delete parent._alfIncludeInTemplate;
         }
         else
         {
            // TODO: Log incorrect parameters
         }
      },

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
               // findObject(loadedTemplate, "_alfTemplateMapping_", parent.config, null, setTemplateConfiguration);
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
               // TODO: Log missing config (not able to set configure template without values!)
            }
         }
         else
         {
            // TODO: Log incorrect object type - string expected for template name/nodeRef
         }
      },

      // TODO: This should be in mixin module...
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

            var templateReponse = this.loadAllTemplates();
            when(templateReponse, lang.hitch(this, function(templates) {

               try
               {
                  var pageDefinition = this.getPageDefinitionFromPayload(payload);
                  var pageDefObject = dojoJson.parse(pageDefinition);

                  var data = {
                     jsonContent: pageDefObject
                  };

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

                  data.widgets = JSON.stringify(data.jsonContent);

                  this.serviceXhr({
                     url : AlfConstants.URL_SERVICECONTEXT + "surf/dojo/xhr/dependencies",
                     data: data,
                     method: "POST",
                     successCallback: this.updatePage,
                     failureCallback: this.onDependencyFailure,
                     callbackScope: this
                  });
               }
               catch(e)
               {
                  this.alfLog("error", "An error occurred parsing the JSON", e, this);
               }
            }));

            // // Clear out any previous preview...
            // domConstruct.empty(this.previewNode);
            
            
         }
         else
         {
            this.alfLog("warn", "A request was made to preview a page definition, but no 'pageDefinition' was provided", payload, this);
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
            if (response.cssMap.hasOwnProperty(media))
            {
               // TODO: query for the node outside of the loop
               // TODO: keep a reference to each node appended and then remove it when the preview is regenerated
               query("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + appContext + response.cssMap[media] + "\" media=\"" + media + "\">");
            }
         }
         
         // Build in the i18n properties into the global object...
         for (var scope in response.i18nMap)
         {
            if (typeof window[response.i18nGlobalObject].messages.scope[scope] === "undefined")
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
         array.forEach(response.nonAmdDeps, function(dep) {
            requires.push(AlfConstants.URL_RESCONTEXT + dep);
         });
         requires.push(AlfConstants.URL_RESCONTEXT + response.javaScript);
         require(requires, lang.hitch(this, "buildPreview", originalRequestConfig.data.jsonContent, this.previewNode));
      },

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
       * This function builds a new preview of the 
       *
       * @instance
       * @param {Object[]} config The configuration to use to build the preview
       * @param {element} rootNode The DOM node which should be used to add instantiated widgets to
       */
      buildPreview: function alfresco_prototyping_Preview__buildPreview(config, rootNode) {
         var tmpNode = domConstruct.create("div", {}, rootNode);
         this.rootPreviewWidget = new Page({
            widgets: config.widgets,
            services: config.services,
            publishOnReady: config.publishOnReady
         }, tmpNode);
      },

      /**
       * @instance
       */
      onDependencyFailure: function alfresco_prototyping_Preview__onDependencyFailure(response, originalRequestConfig) {
         this.alfLog("error", "An error occurred requesting the XHR dependencies", response, originalRequestConfig);
      }
   });
});