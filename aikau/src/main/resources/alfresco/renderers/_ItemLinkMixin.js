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
 * @module alfresco/renderers/_ItemLinkMixin
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/UrlUtilsMixin
 * @mixes module:alfresco/core/PathUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "service/constants/Default",
        "alfresco/core/UrlUtilsMixin",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/_base/event",
        "dojo/Deferred"], 
        function(declare, AlfConstants, UrlUtilsMixin, topics, lang, event, Deferred) {
   
   return declare([UrlUtilsMixin], {

      /**
       * This is the topic that will be published when the item is clicked. The default is aimed at being processed
       * by the [NavigationService]{@link module:alfresco/services/NavigationService} but it can be overridden by the
       * widget mixing in this class to set a custom topic to use.
       *
       * @instance
       * @type {string}
       * @default
       */
      linkClickTopic: "ALF_NAVIGATE_TO_PAGE",

      /**
       * This handles the onClick events of the linked item. The supplied payload will be published to the navigation
       * service to redirect the page or update the current URL hash.
       *
       * @instance
       * @param {event} evt The click event
       */
      onItemLinkClick: function alfresco_renderers__ItemLinkMixin__onItemLinkClick(payload, evt) {
         // Stop the event to prevent the browser from processing the clicked anchor...
         event.stop(evt);
         this.alfLog("log", "Item link clicked: ", payload, this);
         this.alfPublish(this.linkClickTopic, payload);
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/InlineEditProperty#updateCurrentItem}
       * to reload the metadata for the item.
       * 
       * @instance
       * @since 1.0.83
       * @fires module:alfresco/core/topics#GET_DOCUMENT
       */
      updateCurrentItem: function alfresco_renderers__ItemLinkMixin__updateCurrentItem() {
         var d = new Deferred();
         
         var responseTopic = this.generateUuid();
         var handle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, function(payload) {
            this.alfUnsubscribe(handle);
            this.currentItem = payload.response.item;
            this.originalRenderedValue = this.getRenderedProperty(lang.getObject(this.propertyToRender, false, this.currentItem));
            this.renderedValue = this.mapValueToDisplayValue(this.originalRenderedValue);
            d.resolve();
         }), true);

         this.alfServicePublish(topics.GET_DOCUMENT, {
            alfResponseTopic: responseTopic,
            nodeRef: this.currentItem.nodeRef
         });

         return d;
      },

      /**
       * Updates the publication payload and topic for a folder.
       *
       * @instance
       * @param {object} publishPayload The publication payload object to update.
       * @param {object} item An optional item to provide. If this is not provided then "currentItem" is used instead
       */
      updateFolderLinkPublication: function alfresco_renderers__ItemLinkMIxin__updateFolderLinkPublication(publishPayload, item) {
         item = item || this.currentItem;
         var locn = item.location;
         publishPayload.path = this.combinePaths(locn.path, locn.file);
      },

      /**
       * @instance
       * @param {object} payload The payload to add the link data to
       * @param {object} item An optional item to provide. If this is not provided then "currentItem" is used instead
       * @returns {string} The topic to publish on
       */
      generateFileFolderLink: function alfresco_renderers__ItemLinkMixin__generateFileFolderLink(publishPayload, item) {
         item = item || this.currentItem;
         var topic = "ALF_NAVIGATE_TO_PAGE";
         if (!publishPayload)
         {
            this.alfLog("warn", "A request was made to generate a file or folder link but no payload object was provided to be updated", this);
         }
         else
         {
            if (item && item.node)
            {
               if (item.node.isLink && item.location.site)
               {
                  if (item.node.isContainer)
                  {
                     this.updateFolderLinkPublication(publishPayload);
                     topic = topics.PATH_CHANGED;
                  }
                  else
                  {
                     // TODO: This needs re-writing...
                     publishPayload.url = this.getActionUrls(item, item.location.site.name).documentDetailsUrl;
                  }
               }
               else
               {
                  if (item.node.isContainer)
                  {
                     this.updateFolderLinkPublication(publishPayload);
                     topic = topics.PATH_CHANGED;
                  }
                  else
                  {
                     // TODO: It'll be necessary to get the actual actionUrls - but currently it's to tangled to untangle easily
                     //var actionUrls = this.getActionUrls(item);
                     var actionUrls = this.getActionUrls(item);
                     if (item.node.isLink && item.node.linkedNode.isContainer)
                     {
                        publishPayload.url = actionUrls.folderDetailsUrl;
                     }
                     else
                     {
                        this.updateDocumentLinkPublication(publishPayload);
                     }
                  }
               }
            }
         }
         return topic;
      },
      
      /**
       * The standard details URL can be optionally overridden to go do a different page
       *
       * @instance
       * @type {string}
       * @default
       */
      customDetailsURL: null,

      /**
       * Retrieves the navigation payload to use for accessing the details page for an item. The defail payload
       * can be overridden by setting a [custom details URL]{@link module:alfresco/renderers/_ItemLinkMixin#customDetailsURL}
       * or by overriding this function in classes that mixin this module.
       *
       * @param {object} publishPayload The publication payload object to update.
       * @param {object} item An optional item to provide. If this is not provided then "currentItem" is used instead
       */
      updateDocumentLinkPublication: function alfresco_renderers__ItemLinkMixin__updateDocumentLinkPublication(publishPayload, item) {
         item = item || this.currentItem;
         publishPayload.url = "";
         publishPayload.type = "FULL_PATH";
         publishPayload.target = "CURRENT";
         if (!this.customDetailsURL)
         {
            var actionUrls = this.getActionUrls(item);
            publishPayload.url = actionUrls.documentDetailsUrl;
         }
         else
         {
            // If a custom URL has been provided then use that but append the nodeRef URI on the end
            publishPayload.url = this.customDetailsURL;
            if (lang.exists("currentItem.jsNode.nodeRef.uri", this))
            {
               // If the current item is a node with an accessible uri attribute then append it to the URL...
               // We should possibly only do this if a boolean attribute is set to true but at the moment
               // I can't see any cases where you wouldn't want to specify the node...
               publishPayload.url += "/" + item.jsNode.nodeRef.uri;
            }
         }
      }
   });
});