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
 * <p>This widget provides a way in which data can be asynchronously loaded by configuring a
 * [loadItemPublishTopic]{@link module:alfresco/renderers/Item#loadItemPublishTopic} to publish
 * when created. There is full support for the standard payload construction options provided
 * by the [_PublishPayloadMixin]{@link module:alfresco/renderers/_PublishPayloadMixin} when
 * requesting the data through the configuration of:
 * <ul>
 * <li>[loadItemPublishTopic]{@link module:alfresco/renderers/Item#loadItemPublishTopic}</li>
 * <li>[loadItemPublishPayload]{@link module:alfresco/renderers/Item#loadItemPublishPayload}</li>
 * <li>[loadItemPublishPayloadType]{@link module:alfresco/renderers/Item#loadItemPublishPayloadType}</li>
 * <li>[loadItemPublishGlobal]{@link module:alfresco/renderers/Item#loadItemPublishGlobal}</li>
 * <li>[loadItemPublishToParent]{@link module:alfresco/renderers/Item#loadItemPublishToParent}</li>
 * <li>[loadItemPublishScope]{@link module:alfresco/renderers/Item#loadItemPublishScope}</li>
 * <li>[loadItemPublishPayloadModifiers]{@link module:alfresco/renderers/Item#loadItemPublishPayloadModifiers}</li>
 * <li>[loadItemPublishPayloadItemMixin]{@link module:alfresco/renderers/Item#loadItemPublishPayloadItemMixin}</li>
 * </ul>
 * A [widgets]{@link module:alfresco/renderers/Item#widgets} model should be configured to render the loaded
 * data, this model can be processed by configuring the 
 * [widgetModelModifiers]{@link module:alfresco/renderers/Item#widgetModelModifiers} that are applied.
 * </p>
 *
 * @example <caption>Sample configuration to load an render a user</caption>
 * {
 *   name: "alfresco/renderers/Item",
 *   config: {
 *     loadItemPublishTopic: "ALF_GET_USER",
 *     loadItemPublishPayload: {
 *       userName: "admin"
 *     },
 *     itemProperty: "user",
 *     widgets: [
 *       {
 *         name: "alfresco/renderers/Property",
 *         config: {
 *           propertyToRender: "displayName"
 *         }
 *       }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/renderers/Item
 * @extends module:aikau/core/BaseWidget
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 * @since 1.0.86
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dijit/registry",
        "dojo/dom-construct"], 
        function(declare, BaseWidget, _MultiItemRendererMixin, _PublishPayloadMixin, lang, array, registry, domConstruct) {
   
   return declare([BaseWidget, _MultiItemRendererMixin, _PublishPayloadMixin], {
      
      /**
       * This is a dot-notation property that can be set to look up a specific location in the 
       * response. 
       *
       * @instance
       * @type {string}
       * @default
       */
      itemProperty: null,

      /**
       * The topic published to request an item to render.
       *
       * @instance
       * @type {string}
       * @default
       */
      loadItemPublishTopic: null,

      /**
       * The payload to publish when requesting an item to render.
       *
       * @instance
       * @type {object}
       * @default
       */
      loadItemPublishPayload: null,

      /**
       * The type of payload being published when requesting an item to render.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       */
      loadItemPublishPayloadType: null,

      /**
       * Whether or not to publish globally when requesting an item to render.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      loadItemPublishGlobal: false,

      /**
       * Whether or not to publish on the global scope when requesting an item to render.
       *
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      loadItemPublishToParent: false,

      /**
       * A custom scope to publish on when requesting an item to render.
       * 
       * @instance
       * @type {string[]}
       * @default
       */
      loadItemPublishScope: null,

      /**
       * The modifiers to apply to the payload published when requesting an item to render (only applies when
       * the [loadItemPublishPayloadType]{@link module:alfresco/renderers/Toggle#loadItemPublishPayloadType}
       * is configured to be "PROCESS").
       * 
       * @instance
       * @type {string[]}
       * @default
       */
      loadItemPublishPayloadModifiers: false,

      /**
       * Indicates whether or not the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}
       * should be mixed into the payload published when requesting an item to render.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      loadItemPublishPayloadItemMixin: false,

      /**
       * The modifiers to apply to the widget model before rendering.
       *
       * @instance
       * @type {string[]}
       * @default
       */
      widgetModelModifiers: ["processCurrentItemTokens"],

      /**
       * The widgets processed by AlfDocument should all be designed to work with a "currentItem" attribute.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgets: null,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_Item__createWidgetDom() {
         this.domNode = document.createElement("div");
         this.domNode.classList.add("alfresco-renderers-Item");

         this.containerNode = document.createElement("div");
         this.domNode.appendChild(this.containerNode);
      },

      /**
       * Subscribes to the document load topic
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Item__postMixInProperties() {
         this.alfSubscribe(this.loadItemPublishTopic + "_SUCCESS", lang.hitch(this, this.onItemLoaded));
      },
      
      /**
       * If no current item is set but a nodeRef has been provided then publish a request to get the document
       * with that nodeRef.
       *
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfDocument_postCreate() {
         var publishPayload = this.generatePayload(this.loadItemPublishPayload, 
                                                   this.currentItem, 
                                                   null, 
                                                   this.loadItemPublishPayloadType, 
                                                   this.loadItemPublishPayloadItemMixin, 
                                                   this.loadItemPublishPayloadModifiers);
         publishPayload.alfResponseTopic = this.pubSubScope + this.loadItemPublishTopic + "_SUCCESS";
         this.alfPublish(this.loadItemPublishTopic, publishPayload, this.loadItemPublishGlobal, this.loadItemPublishToParent, this.loadItemPublishScope || "");
      },

      /**
       * @instance
       * @param {object} payload The details of the document that have been provided.
       */
      onItemLoaded: function alfresco_renderers_Item__onItemLoaded(payload) {
         if ((this.itemProperty || this.itemProperty === "") && lang.exists(this.itemProperty, payload))
         {
            this.currentItem = lang.getObject(this.itemProperty, false, payload);
            this.renderItem();
         }
         else if (lang.exists("response.item", payload)) 
         {
            this.currentItem = payload.response.item;
            this.renderItem();
         }
         else
         {
            this.alfLog("warn", "Item data was provided but an item was not found", payload, this);
         }
      },

      /**
       * 
       * @instance
       */
      renderItem: function alfresco_renderers_Item__renderItem() {
         if (this.containerNode)
         {
            array.forEach(registry.findWidgets(this.containerNode), lang.hitch(this, this.destroyWidget));
            domConstruct.empty(this.containerNode);
         }
         if (this.currentItem && this.containerNode)
         {
            // This relies on the alfresco/lists/views/layouts/_MultiItemRendererMixin implementation of the 
            // createWidget function in order to pass the "currentItem" attribute on to any child widgets...
            var clonedWidgets = lang.clone(this.widgets);
            this.processObject(this.widgetModelModifiers || ["processCurrentItemTokens"], clonedWidgets);
            this.processWidgets(clonedWidgets, this.containerNode);
         }
         else
         {
            this.alfLog("warn", "It was not possible to render an item because the item either doesn't exist or there is no DOM node for it", this);
         }
      },
      
      /**
       * Recursive destroy the supplied widget.
       * 
       * @instance
       * @param {object} widget The widget to destroy
       * @param {number} index The index of the widget
       */
      destroyWidget: function alfresco_renderers_Item__destroyWidget(widget, /*jshint unused:false*/ index) {
         if (typeof widget.destroyRecursive === "function")
         {
            widget.destroyRecursive();
         }
      }
   });
});