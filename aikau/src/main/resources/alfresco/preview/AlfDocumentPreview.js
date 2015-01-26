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
 * <p>This module can be used to easily preview content from an Alfresco Repository. Typically this will
 * be a child widget of an [AlfDocument]{@link module:alfresco/documentlibrary/AlfDocument} that can 
 * be used to retrieve all of the data required to generate the preview. In order to retrieve the data
 * it will also be necesssary to include a [DocumentService]{@link module:alfresco/services/DocumentService}
 * on the page.</p>
 * <p>By default there are a number of "plugins" that handle specific previews (e.g. HTML5 video and audio, images,
 * PDF.js renderings, etc) and it is possible to either override, remove, add or re-configure plugins using the 
 * [widgetsForPluginsOverrides]{@link module:alfresco/preview/AlfDocumentPreview#widgetsForPluginsOverrides}
 * attribute.</p>
 * <p>The dimensions of the previewer can generally be controlled using the [heightMode]
 * {@link module:alfresco/preview/AlfDocumentPreview#heightMode} attribute. However, it is entirely dependant upon
 * each plugin as to whether they honour this setting. For example the [Audio plugin]{@link module:alfresco/preview/Audio}
 * will ignore it as the dimensions are not important.</p>
 *
 * @module alfresco/preview/AlfDocumentPreview
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfDocumentPreview.html",
        "alfresco/core/Core",
        "service/constants/Default",
        "dijit/registry",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/on",
        "dojo/sniff",
        "jquery"], 
        function(declare, _Widget, _Templated, template, Core, AlfConstants, registry, lang, array, domClass, on, sniff, $) {
   
   return declare([_Widget, _Templated, Core], {
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfDocumentPreview.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfDocumentPreview.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfDocumentPreview.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfDocumentPreview.css"}],

      /**
       * These files need to be included from the "web-preview-js-dependencies.lib.ftl" file. These
       * are the original dependencies that were used in Share previously. These can hopefully be 
       * removed as necessary as we move away from Flash previewing?
       * 
       * @instance
       */
      nonAmdDependencies: ["/js/flash/extMouseWheel.js"],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * <p>This function attempts to set an appropriate height for the previewer. There are 3 different modes
       * of controlling the height:
       * <ul><li>"AUTO" will attempt to ensure that the the previewer takes up the complete vertical space in the 
       * client from where it starts. This makes sense to use if you have a single previewer on a page.</li>
       * <li>Any positive number (note: not as a string) will set an explicit height that won't change as the 
       * browser resizes</li>
       * <li>Any negative number will result in that amount being deducted from the browser window height and this
       * will change as the browser is resized. This can be useful for setting the previewer in a dialog.</li></ul>
       * </p>
       *
       * @instance
       * @default "AUTO"
       */
      heightMode: "AUTO",

      /**
       * 
       *
       * @instance
       * @type {object}
       * @default null
       */
      plugin: null,

      /**
       *
       * 
       * @instance
       * @type {object[]}
       * @default null
       */
      thumbnailModification: null,
         
      /**
       * Noderef to the content to display
       *
       * @instance
       * @type {string}
       * @default ""
       */
      nodeRef: "",

      /**
       * The size of the content
       *
       * @instance
       * @type {string}
       * @default "0"
       */
      size: "0",

      /**
       * The file name representing root container
       *
       * @instance
       * @type {string}
       * @default ""
       */
      name: "",

      /**
       * The mimeType of the node to display, needed to decide what plugin that should be used.
       *
       * @instance
       * @type {string}
       * @default ""
       */
      mimeType: "",

      /**
       * A list of previews available for this node, needed to decide which plugin that should be used.
       *
       * @instance
       * @type {object[]}
       * @default null
       */
      thumbnails: null,

      /**
       * The base to the rest api call for the node's content or thumbnails
       *
       * @isntance
       * @type {string}
       * @default "api"
       */
      api: "api",

      /**
       * The proxy to use for the rest api call for the node's content or thumbnails.
       * I.e. "alfresco" (or "alfresco-noauth" for public content & pages)
       *
       * @instance
       * @type {string}
       * @default "alfresco"
       */
      proxy: "alfresco",

      /**
       * MNT-9235: This flag identifies whether content of current node modified.
       * That means that the cached thumbnail is no more valid and it should be updated
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      avoidCachedThumbnail: false,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_preview_AlfDocumentPreview__postCreate() {

         // TODO: Set a common resize policy for plugins such that the plugin viewer can only
         //       ever take up the available space in the view port *UNLESS* a specific height
         //       has been defined. If a height has been defined then the width should respond
         //       to that height accordingly. Set max-height as the current viewport height.

         // TODO: Currently nothing will be publishing on this topic...
         this.alfSubscribe("ALF_DOCUMENT_PREVIEW_UPDATE", lang.hitch(this, "onPreviewChanged"));
         this.alfSubscribe("ALF_METADATA_REFRESH", lang.hitch(this, "doRefresh"));

         if (this.currentItem != null)
         {
            this.nodeRef = this.currentItem.node.nodeRef;
            this.name = this.currentItem.node.properties["cm:name"] || this.currentItem.node.properties["cm:title"];
            this.mimeType = this.currentItem.node.mimetype;
            this.size = this.currentItem.node.size;
            this.thumbnails = this.currentItem.thumbnailDefinitions;
            this.thumbnailModification = this.currentItem.node.properties["cm:lastThumbnailModification"];
         }

         // Initialise empty arrays as required...
         if (this.thumbnails == null)
         {
            this.thumbnails = [];
         }
         if (this.thumbnailModification == null)
         {
            this.thumbnailModification = [];
         }
         this.plugins = {};

         // Convert the JSON string conditions back into an object...
         // if (this.pluginConditions != null)
         // {
         //    this.pluginConditions = eval(this.pluginConditions);
         // }
         // else
         // {
         //    this.alfLog("warn", "No 'pluginConditions' attribute provided for document preview", this);
         // }
         
         // SWFObject patch to help flash plugins, will ensure all flashvars are URI encoded
         // TODO: Do we really need this still for Aikau???
         if (window.YAHOO != null && window.YAHOO.deconcept != null)
         {
            window.YAHOO.deconcept.SWFObject.prototype.getVariablePairs = function()
            {
               var variablePairs = [],
                  key,
                  variables = this.getVariables();
               for (key in variables)
               {
                  if (variables.hasOwnProperty(key))
                  {
                     variablePairs[variablePairs.length] = key + "=" + encodeURIComponent(variables[key]);
                  }
               }
               return variablePairs;
            };
         }

         this.setupPlugins();

         // Setup web preview
         this.setupPreview(false);
      },

      /**
       * This is the default set of plugins for the previewer. These can be overridden in their entirety
       * or changes to a subset can be made through configuration of the [widgetsForPluginsOverrides]
       * {@link module:alfresco/preview/AlfDocumentPreview#widgetsForPluginsOverrides} attribute.
       * 
       * @instance
       * @type {object[]}
       * @default null
       */
      widgetsForPlugins: [
         {
            id: "PdfJs",
            name: "alfresco/preview/PdfJs"
         },
         {
            id: "WebPreviewer",
            name: "alfresco/preview/WebPreviewer"
         },
         {
            id: "Image",
            name: "alfresco/preview/Image"
         },
         {
            id: "Video",
            name: "alfresco/preview/Video"
         },
         {
            id: "Audio",
            name: "alfresco/preview/Audio"
         },
         {
            id: "Flash",
            name: "alfresco/preview/Flash"
         },
         {
            id: "StrobeMediaPlayback",
            name: "alfresco/preview/StrobeMediaPlayback"
         }
      ],

      /**
       * This configuration attribute can be set to specifically override individual plugins
       * rather than replacing the entire default set. Each element in the array should contain an
       * "id" attribute for the plugin and a name that maps to a plugin module. If the element contains
       * the attribute "remove" set to true then any existing plugin with a matching ID will be removed,
       * if the element contains an attribute "replace" set to true then the entire configuration of the
       * existing plugin will be replaced. Otherwise the new configuration will be merged into the existing.
       *
       * @instance
       * @type {array}
       * @default []
       */
      widgetsForPluginsOverrides: [],

      /**
       * This function is used to add, update or remove individual plugins in the main list.
       *
       * @instance
       */
      updatePluginConfiguration: function alfresco_preview_AlfDocumentPreview__updatePluginConfiguration(pluginConfig) {

         // Check to see if the plugin already exists...
         var existingPlugin = null,
             existingPluginIndex = null;
         array.forEach(this.widgetsForPlugins, function(currentPlugin, index) {
            if (currentPlugin.id === pluginConfig.id)
            {
               existingPlugin = currentPlugin;
               existingPluginIndex = index;
            }
         });

         // Update, remove or add as appropriate
         if (existingPlugin)
         {
            if (pluginConfig.remove === true)
            {
               // Remove the plugin
               this.widgetsForPlugins.splice(existingPluginIndex, 1);
            }
            else 
            {
               // Update the name (if provided)...
               if (pluginConfig.name != null)
               {
                  existingPlugin.name = pluginConfig.name;
               }
               if (pluginConfig.replace === true || existingPlugin.config == null)
               {
                  // Completely replace the plugin configuration...
                  existingPlugin.config = pluginConfig.config;
               }
               else
               {
                  // Merge the plugin...
                  $.extend(true, existingPlugin.config, pluginConfig.config);
               }
            }
         }
         else
         {
            // A plugin with the supplied "id" does not already exist so we can just add it into the array 
            // for processing...
            this.widgetsForPlugins.push(pluginConfig);
         }
      },

      /**
       *
       * @instance
       */
      setupPlugins: function alfresco_preview_AlfDocumentPreview__setupPlugins() {
         this.plugins = {};

         if (this.widgetsForPluginsOverrides != null)
         {
            array.forEach(this.widgetsForPluginsOverrides, lang.hitch(this, this.updatePluginConfiguration));
         }

         array.forEach(this.widgetsForPlugins, function(plugin, index) {
            if (plugin.id != null && plugin.name != null)
            {
               this.alfLog("log", "Creating plugin: ", plugin.id);
               try
               {
                  var pluginModule = [plugin.name];
                  require(pluginModule, lang.hitch(this, "createPlugin", plugin.id, plugin.config));
               }
               catch (e)
               {
                  this.alfLog("error", "An error occurred creating a preview plugin", e);
               }
            }
            else
            {
               this.alfLog("warn", "A preview plugin was incorrectly defined - it was either missing an 'id' or 'name' attribute", plugin, this);
            }
         }, this);
      },

      /**
       *
       * @instance
       */
      createPlugin: function alfresco_preview_AlfDocumentPreview__createPlugin(pluginName, pluginConfig, PluginType) {
         // Defensively coded around the possibility that two document previewers might be included
         // on the same page, make sure that the ID is unique. This ID is actually mostly required for
         // automated testing purposes but it is important to ensure it's available...
         var i = 0;
         var tmpName = pluginName;
         while (registry.byId(tmpName) != null)
         {
            i++;
            tmpName = pluginName + "_" + i;
         }
         var config = {
            id: tmpName,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope,
            currentItem: this.currentItem,
            currentMetadata: this.currentMetadata,
            groupMemberships: this.groupMemberships,
            dataScope: this.dataScope
         };

         // Merge in any additional configuration...
         $.extend(true, config, pluginConfig);
         config.previewManager = this;

         // TODO: Merge configuration...
         var plugin = new PluginType(config);
         this.plugins[pluginName] = plugin;
         this.alfLog("log", "Created plugin: ", pluginName, plugin);
         return plugin;
      },

      /**
       * Space for preview "plugins" to register themselves in.
       * To provide a 3rd party plugin:
       *
       * 1. Create a javascript file and make it define a javascript class that defines a "plugin class" in this namespace.
       * 2. Override this component's .get.head.ftl file and make sure your javascript file (and its resources) are included.
       * 3. Override this component's .get.config.xml and define for which mimeTypes or thumbnails it shall be used.
       * 4. To make sure your plugin works in the browser, define a report() method that
       *    returns nothing if the browser is supported and otherwise a string with a message saying the reason the
       *    plugin can't be used in the browser.
       * 5. Define a display() method that will display the browser plugin or simply return a string of markup that shall be inserted.
       *
       * @instance
       * @type {object}
       * @default null
       */
      plugins: null,
      
      /**
       * Will find a previewer and set it up if one existed
       *
       * @instance
       */
      setupPreview: function alfresco_preview_AlfDocumentPreview__setupPreview() {

         // Display the preparing previewer message
         this.messageNode.innerHTML = this.message("label.preparingPreviewer");

         // Parameter nodeRef is mandatory
         if (this.nodeRef === undefined)
         {
            throw new Error("A nodeRef must be provided");
         }

         if (this.size == "0")
         {
            // Shrink the web previewers real estate and tell user that node has no content
            this.previewerNode.innerHTML = '<div class="message">' + this.message("label.noContent") + '</div>';
         }
         else
         {
            var condition, pluginDescriptor, plugin, messages = [];
            for (var i = 0, il = this.pluginConditions.length; i <il ; i++)
            {
               // Test that all conditions are valid
               condition = this.pluginConditions[i];
               if (!this.conditionsMatch(condition))
               {
                  this.alfLog("log", "Plugin condition does not match", condition);
                  continue;
               }

               // Conditions are valid, now create plugins and make sure they can run in this environment
               for (var pi = 0, pil = condition.plugins.length; pi < pil; pi++)
               {
                  pluginDescriptor = condition.plugins[pi];
                  this.alfLog("log", "Checking plugin:", pluginDescriptor);

                  // Check the plugin constructor actually exists, in case client-side dependencies
                  // have not been loaded (ALF-12798)
                  if (this.plugins[pluginDescriptor.name] != null)
                  {
                     // Get plugin
                     plugin = this.plugins[pluginDescriptor.name];
                     plugin.setAttributes(pluginDescriptor.attributes);

                     // Special case to ignore the WebPreviewer plugin on iOS - we don't want to report output either
                     // as the output is simply an HTML message unhelpfully informing the user to install Adobe Flash
                     if (sniff("ios") && pluginDescriptor.name === "WebPreviewer")
                     {
                        continue;
                     }

                     // Make sure it may run in this browser...
                     var report = plugin.report();
                     if (report)
                     {
                        // ...the plugin can't be used in this browser, save report and try another plugin
                        messages.push(report);
                     }
                     else
                     {
                        // ...yes, the plugin can be used in this browser, lets store a reference to it.
                        this.plugin = plugin;

                        // Ask the plugin to display the node
                        var markup;
                        try
                        {
                           domClass.add(this.previewerNode, pluginDescriptor.name);
                           markup = plugin.display();
                           if (markup)
                           {
                              // Insert markup if plugin provided it
                              this.previewerNode.innerHTML = markup;
                           }

                           // Finally! We found a plugin that works and didn't crash
                           // TODO: Do we need to fire anything here? What's listening for it?
                           //YAHOO.Bubbling.fire('webPreviewSetupComplete');
                           this.alfLog("log", "Found a suitable plugin: ", pluginDescriptor.name);
                           return;
                        }
                        catch(e)
                        {
                           // Oops a plugin failure, log it and try the next one instead...
                           this.alfLog("error",'Error:' + pluginDescriptor.name + ' failed to display: ' + e);
                           messages.push(this.message("label.error", pluginDescriptor.name, e.message));
                        }
                     }
                  }
                  else
                  {
                     // Plugin could not be instantiated, log it and try the next one instead...
                     this.alfLog("error",'Error, Alfresco.WebPreview.Plugins.' + pluginDescriptor.name + ' does not exist');
                     messages.push(this.message("label.errorMissing", pluginDescriptor.name));
                  }
               }
            }

            // Tell user that the content can't be displayed
            var noPreviewLabel = "label.noPreview";
            if (sniff("ios"))
            {
               noPreviewLabel = "label.noPreview.ios";
            }
            var message = this.message(noPreviewLabel, this.getContentUrl(true));
            for (i = 0, il = messages.length; i < il; i++)
            {
               message += '<br/>' + messages[i];
            }
            this.previewerNode.innerHTML = '<div class="message">' + message + '</div>';
         }
      },

      /**
       * MNT-9235: Handles all the 'onPreviewChangedEvent' events
       * 
       * @instance
       * @param {object} payload
       */
      onPreviewChanged: function alfresco_preview_AlfDocumentPreview__onPreviewChanged(payload) {
         this.avoidCachedThumbnail = true;

         // No event to stop, so commented out pending deletion...
         // YAHOO.util.Event.preventDefault(event);
         // YAHOO.util.Event.stopPropagation(event)
      },

      /**
       * Checks if the conditions are fulfilled.
       *
       * @instance
       * @param {object} condition The condition to match gainst this components options
       * @return {boolean} true if conditions are fulfilled for plugins to be used.
       */
      conditionsMatch: function alfresco_preview_AlfDocumentPreview__conditionsMatch(condition) {
         if (condition.attributes.mimeType && condition.attributes.mimeType != this.mimeType)
         {
            return false;
         }
         if (condition.attributes.thumbnail && (array.indexOf(this.thumbnails, condition.attributes.thumbnail) === -1))
         {
            return false;
         }
         return true;
      },

      /**
       * Helper method for plugins to create url tp the node's content.
       *
       * @instance
       * @param {Bbolean} download(Optional) Default false. Set to true if the url shall be constructed so it forces the
       *        browser to download the document, rather than displaying it inside the browser. 
       * @return {string} The "main" element holding the actual previewer.
       */
      getContentUrl: function alfresco_preview_AlfDocumentPreview__getContentUrl(download) {
         var proxy = window.location.protocol + "//" + window.location.host + AlfConstants.URL_CONTEXT + "proxy/" + this.proxy + "/",
            nodeRefAsLink = this.nodeRef.replace(":/", ""),
            noCache = "noCache=" + new Date().getTime();
         download = download ? "a=true" : "a=false";
         return proxy + this.api + "/node/" + nodeRefAsLink + "/content/" + encodeURIComponent(this.name) + "?c=force&" + noCache + "&" + download;
      },

      /**
       * Helper method for plugins to create a url to the thumbnail's content.
       *
       * @instance
       * @param thumbnail {String} The thumbnail definition name
       * @param fileSuffix {String} (Optional) I.e. ".png" if shall be inserted in the url to make certain flash
       *        plugins understand the mimetype of the thumbnail.
       * @return {String} The url to the thumbnail content.
       */
      getThumbnailUrl: function alfresco_preview_AlfDocumentPreview__getThumbnailUrl(thumbnail, fileSuffix) {
         var proxy = window.location.protocol + "//" + window.location.host + AlfConstants.URL_CONTEXT + "proxy/" + this.proxy + "/",
            nodeRefAsLink = this.nodeRef.replace(":/", ""),
            noCache = "noCache=" + new Date().getTime(),
            force = "c=force";
         
         // Check to see if last modification data is available for the thumbnail...
         for (var i = 0; i < this.thumbnailModification.length; i++)
         {
            if (this.thumbnailModification[i].indexOf(thumbnail) != -1)
            {
               var timestampPostfix = noCache;

               noCache = "lastModified=" + encodeURIComponent(this.thumbnailModification[i]);

               // MNT-9235: Avoiding loading content of thumbnail from the cache
               // if current node is updated without reloading of the page
               if (this.avoidCachedThumbnail)
               {
                  noCache += "&" + timestampPostfix;

                  // Resetting to 'false' since thumbnail will be eventually updated...
                  this.avoidCachedThumbnail = false;
               }

               break;
            }
         }
         return proxy + this.api + "/node/" + nodeRefAsLink + "/content/thumbnails/" + thumbnail + (fileSuffix ? "/suffix" + fileSuffix : "") + "?" + force + "&" + noCache;
      },

      /**
       * Makes it possible for plugins to get hold of the "previewer wrapper" HTMLElement.
       *
       * I.e. Useful for elements that use an "absolute" layout for their plugins (most likely flash), so they have
       * an element in the Dom to position their own elements after.
       *
       * @instance
       * @return {element} The "main" element holding the actual previewer.
       */
      getPreviewerElement: function alfresco_preview_AlfDocumentPreview__getPreviewerElement() {
         return this.previewerNode;
      },

      /**
       * Refreshes component by metadataRefresh event
       *
       * @instance
       */
      doRefresh: function alfresco_preview_AlfDocumentPreview__doRefresh() {
         if (this.plugin)
         {
            this.plugin.display();
         }
      },

      /**
       * Refreshes component by metadataRefresh event
       *
       * @instance
       * @param {int} reqMajorVer
       * @param {int} reqMinorVer
       * @param {int} reqRevision
       * @return {boolean} Returns true if a flash player of the required version is installed
       */
      hasRequiredFlashPlayer: function alfresco_preview_AlfDocumentPreview__hasRequiredFlashPlayer(reqMajorVer, reqMinorVer, reqRevision) {
         if (typeof DetectFlashVer == "function")
         {
            // NOTE: JSHint warning can be ignored...
            return DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision);
         }
         return false;
      },

      /**
       * A json representation of the .get.config.xml file.
       * This is evaluated on the client side since we need the plugins to make sure it is supported
       * the user's browser and browser plugins.
       *
       * @instance
       * @type {object[]}
       * @default null
       */
      pluginConditions: [
         {
            attributes:
            {
               mimeType: "application/pdf"
            },
            plugins: [
               {
                  name: "PdfJs",
                  attributes: {}
               }
            ]
         },
         {
            attributes:
            {
               thumbnail: "pdf",
            },
            plugins: [
               {
                  name: "PdfJs",
                  attributes: {
                     src: "pdf",
                     progressiveLoading: false
                  }
               }
            ]
         },
         {
            attributes: {
               thumbnail: "imgpreview",
               mimeType: "video/mp4"
            },
            plugins: [
               {
                  name: "StrobeMediaPlayback",
                  attributes: {
                     poster: "imgpreview",
                     posterFileSuffix: ".png"
                  }
               },
               {
                  name: "Video",
                  attributes: {
                     poster: "imgpreview",
                     posterFileSuffix: ".png"
                  }
               }
            ]
         },
         {
            attributes:
            {
               thumbnail: "imgpreview",
               mimeType: "video/m4v"
            },
            plugins: [
               {
                  name: "StrobeMediaPlayback",
                  attributes:
                  {
                     poster: "imgpreview",
                     posterFileSuffix: ".png"
                  }
               },
               {
                  name: "Video",
                  attributes:
                  {
                     poster: "imgpreview",
                     posterFileSuffix: ".png"
                  }
               }
            ]
         },
         {
            attributes:
            {
               thumbnail: "imgpreview",
               mimeType: "video/x-flv"
            },
            plugins: [
               {
                  name: "StrobeMediaPlayback",
                  attributes:
                  {
                     poster: "imgpreview",
                     posterFileSuffix: ".png"
                  }
               }
            ]
         },
         {
            attributes:
            {
               thumbnail: "imgpreview",
               mimeType: "video/quicktime"
            },
            plugins: [
               {
                  name: "StrobeMediaPlayback",
                  attributes:
                  {
                     poster: "imgpreview",
                     posterFileSuffix: ".png"
                  }
               }
            ]
         },
         {
            attributes:
            {
               thumbnail: "imgpreview",
               mimeType: "video/ogg"
            },
            plugins: [
               {
                  name: "Video",
                  attributes:
                  {
                     poster: "imgpreview",
                     posterFileSuffix: ".png"
                  }
               }
            ]
         },
         {
            attributes:
            {
               thumbnail: "imgpreview",
               mimeType: "video/webm"
            },
            plugins: [
               {
                  name: "Video",
                  attributes:
                  {
                     poster: "imgpreview",
                     posterFileSuffix: ".png"
                  }
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "video/mp4"
            },
            plugins: [
               {
                  name: "StrobeMediaPlayback",
                  attributes: {}
               },
               {
                  name: "Video",
                  attributes: {}
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "video/x-m4v"
            },
            plugins: [
               {
                  name: "StrobeMediaPlayback",
                  attributes:{}
               },
               {
                  name: "Video",
                  attributes:{}
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "video/x-flv"
            },
            plugins: [
               {
                  name: "StrobeMediaPlayback",
                  attributes:{}
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "video/quicktime"
            },
            plugins: [
               {
                  name: "StrobeMediaPlayback",
                  attributes:{}
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "video/ogg"
            },
            plugins: [
               {
                  name: "Video",
                  attributes:{}
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "video/webm"
            },
            plugins: [
               {
                  name: "Video",
                  attributes:{}
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "audio/mpeg"
            },
            plugins: [
               {
                  name: "StrobeMediaPlayback",
                  attributes: {}
               },
               {
                  name: "Audio",
                  attributes: {}
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "audio/x-wav"
            },
            plugins: [
               {
                  name: "Audio",
                  attributes: {}
               }
            ]
         },
         {
            attributes:
            {
               thumbnail: "webpreview"
            },
            plugins: [
               {
                  name: "WebPreviewer",
                  attributes:
                  {
                     paging: "true",
                     src: "webpreview"
                  }
               }
            ]
         },
         {
            attributes:
            {
               thumbnail: "imgpreview"
            },
            plugins: [
               {
                  name: "Image",
                  attributes:
                  {
                     src: "imgpreview"
                  }
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "image/jpeg"
            },
            plugins: [
               {
                  name: "Image",
                  attributes:
                  {
                     srcMaxSize: "2000000"
                  }
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "image/png"
            },
            plugins: [
               {
                  name: "Image",
                  attributes:
                  {
                     srcMaxSize: "2000000"
                  }
               }
            ]
         },
         {
            attributes:
            {
               mimeType: "image/gif"
            },
            plugins: [
               {
                  name: "Image",
                  attributes:
                  {
                     srcMaxSize: "2000000"
                  }
               }
            ]
         }
      ]
   });
});