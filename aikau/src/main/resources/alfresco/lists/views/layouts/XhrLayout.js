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
 * This layout widget is intended to be used when rendering search results (or any data set
 * containing minimal node information). The idea is that the initially available data can be
 * rendered but when the user clicks on the item it will asynchronously request all of the 
 * information about that that node so that complete metadata and actions, etc can be displayed.
 * 
 * @module alfresco/lists/views/layouts/XhrLayout
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixed dijit/_OnDijitClickMixin
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/XhrLayout.html",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dijit/registry",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, template, _MultiItemRendererMixin, AlfCore, CoreWidgetProcessing, 
                 lang, array, registry, domConstruct) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _MultiItemRendererMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/XhrLayout.css"}]
       */
      cssRequirements: [{cssFile:"./css/XhrLayout.css"}],
      
      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_XhrLayout__postCreate() {

         var nodeData = lang.getObject("currentItem.node", false, this);
         if (nodeData === null && this.widgets !== null)
         {
            this.processWidgets(this.widgets, this.containerNode);
         }
         else if (this.widgetsForXhrData) 
         {
            this.processWidgets(this.widgetsForXhrData, this.containerNode);
         }
      },

      /**
       * 
       * @instance
       */
      getXhrData: function alfresco_lists_views_layouts_XhrLayout__getXhrData() {
         var nodeRef = lang.getObject("nodeRef", false, this.currentItem);
         if (nodeRef !== null)
         {
            // Generate a UUID for the response to the publication to ensure that only this widget
            // handles to the XHR data...
            var responseTopic = this.generateUuid();
            this._xhrDataRequestHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onXhrData), true);
            this.alfPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", {
               alfResponseTopic: responseTopic,
               nodeRef: nodeRef
            }, true);
         }
         else
         {
            this.alfLog("warn", "No nodeRef attribute available to use to retrieve all data.", this);
         }
      },

      /**
       * Handles the processing of the asynchronously requested data. It will attempt to render the returned
       * data item using the attribute "widgetsForXhrData".
       * 
       * @instance
       * @param {object} payload 
       */
      onXhrData: function alfresco_lists_views_layouts_XhrLayout__onXhrData(payload) {
         this.alfUnsubscribeSaveHandles([this._xhrDataRequestHandle]);
         if (lang.exists("response.item", payload)) 
         {
            this.currentItem = payload.response.item;
            if (this.containerNode)
            {
               try
               {
                  array.forEach(registry.findWidgets(this.containerNode), lang.hitch(this, this.destroyWidget));
               }
               catch(e)
               {
                  this.alfLog("error", "Couldn't destroy widgets", e);
               }
               domConstruct.empty(this.containerNode);
            }
            try
            {
               this.processWidgets(this.widgetsForXhrData, this.containerNode);
            }
            catch (e)
            {
               this.alfLog("error", "Couldn't create XHR layout",e);
            }
            
         }
         else
         {
            this.alfLog("warn", "Document data was provided but the 'response.item' attribute was not found", payload, this);
         }
      }
   });
});