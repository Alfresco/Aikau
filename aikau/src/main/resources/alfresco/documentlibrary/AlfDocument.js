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
 * Used to represent a list of documents.
 * @todo Clearly needs more info
 * 
 * @module alfresco/documentlibrary/AlfDocument
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "dojo/text!./templates/AlfDocument.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dijit/registry",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, _MultiItemRendererMixin, template, AlfCore, CoreWidgetProcessing, lang, array, registry, domConstruct) {
   
   return declare([_WidgetBase, _TemplatedMixin, _MultiItemRendererMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfDocumentList.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfDocument.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * The widgets processed by AlfDocument should all be be designed to work with a "currentItem" attribute.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgets: null,

      /**
       * The topic published to request a document to display.
       *
       * @instance
       * @type {string}
       * @default "ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST"
       */
      loadDataPublishTopic: "ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST",

      /**
       * This indicates whether or not to make a request for document data directly from the 
       * Alfresco Repository or via the Share layer. When this widget is used outside of Share
       * it will be necessary to configure this to be true.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      rawData: false,

      /**
       * Used to indicate whether or not to force an XHR request to retrieve the full node data. Defaults
       * to false assuming that all the data required is currently available in "currentItem".
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      xhrRequired: false,

      /**
       * Subscribes to the document load topic
       * 
       * @instance
       */
      postMixInProperties: function alfresco_documentlibrary_AlfDocument__postMixInProperties() {
         this.alfSubscribe(this.loadDataPublishTopic + "_SUCCESS", lang.hitch(this, this.onDocumentLoaded));
      },
      
      /**
       * If no current item is set but a nodeRef has been provided then publish a request to get the document
       * with that nodeRef.
       *
       * @instance
       * @fires ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST
       */
      postCreate: function alfresco_documentlibrary_AlfDocument_postCreate() {
         if (this.xhrRequired === true || (!this.currentItem && this.nodeRef))
         {
            // Cover all options for finding a nodeRef!
            var nodeRef = this.nodeRef || this.currentItem.nodeRef;
            if (!nodeRef && this.currentItem.node && this.currentItem.node.nodeRef)
            {
               nodeRef = this.currentItem.node.nodeRef;
            }

            if (nodeRef)
            {
               this.alfPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", {
                  nodeRef: nodeRef,
                  rawData: this.rawData,
                  alfResponseTopic: this.pubSubScope + this.loadDataPublishTopic
               }, true);
            }
            else
            {
               this.alfLog("warn", "No 'nodeRef' available to request node data", this);
            }
         }
         else
         {
            this.renderDocument();
         }
      },

      /**
       * This is a dot-notation property that can be set to look up a specific location in the 
       * response. By default it is not set, and only required when not relying on the 
       * [DocumentService]{@link module:alfresco/services/DocumentService} to provide data.
       *
       * @instance
       * @type {string}
       * @default null
       */
      itemProperty: null,

      /**
       * @instance
       * @param {object} payload The details of the document that have been provided.
       */
      onDocumentLoaded: function alfresco_documentlibrary_AlfDocument__onDocumentLoaded(payload) {
         if (this.itemProperty && lang.exists(this.itemProperty, payload))
         {
            this.currentItem = lang.getObject(this.itemProperty, false, payload);
            this.renderDocument();
         }
         else if (lang.exists("response.item", payload)) 
         {
            this.currentItem = payload.response.item;
            this.renderDocument();
         }
         else
         {
            this.alfLog("warn", "Document data was provided but an item was not found", payload, this);
         }
      },

      /**
       * 
       * @instance
       */
      renderDocument: function alfresco_documentlibrary_AlfDocument__renderDocument() {
         if (this.containerNode)
         {
            array.forEach(registry.findWidgets(this.containerNode), lang.hitch(this, "destroyWidget"));
            domConstruct.empty(this.containerNode);
         }
         if (this.currentItem && this.containerNode)
         {
            // This relies on the alfresco/lists/views/layouts/_MultiItemRendererMixin implementation of the 
            // createWidget function in order to pass the "currentItem" attribute on to any child widgets...
            this.processWidgets(this.widgets, this.containerNode);
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
      destroyWidget: function alfresco_documentlibrary_AlfDocument__destroyWidget(widget, /*jshint unused:false*/ index) {
         if (typeof widget.destroyRecursive === "function")
         {
            widget.destroyRecursive();
         }
      }
   });
});