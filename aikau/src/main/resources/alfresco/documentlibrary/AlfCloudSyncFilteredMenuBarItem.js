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
 * Extends the standard [menu bar item]{@link module:alfresco/menus/AlfMenuBarItem} and mixes in 
 * [filtering capabilities]{@link module:alfresco/menus/_AlfDisplayFilterMixin} that allow the 
 * button to only be shown when Cloud Synchronization is currently enabled for the current
 * parent node. This behaviour can be inverted (i.e. to only show the button when syncronization
 * is not enabled) by setting the "invertFilter" attribute to true.
 * 
 * @module alfresco/documentlibrary/AlfCloudSyncFilteredMenuBarItem
 * @extends module:alfresco/menus/AlfMenuBarItem
 * @mixes alfresco/menus/_AlfDisplayFilterMixin
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarItem",
        "alfresco/menus/_AlfDisplayFilterMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, AlfMenuBarItem, _AlfDisplayFilterMixin, _AlfDocumentListTopicMixin, lang, array) {
   
   return declare([AlfMenuBarItem, _AlfDisplayFilterMixin, _AlfDocumentListTopicMixin], {
      
      /**
       * Extends the [superclass function]{@link module:alfresco/menus/AlfMenuBarItem#postCreate} to subscribe to
       * the [metadataChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#metadataChangeTopic}
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfCloudSyncFilteredMenuBarItem__postCreate() {
         this.hide();
         this.filterTopic = this.metadataChangeTopic;
         this.inherited(arguments);
      },
      
      /**
       * This can be set to "true" to hide the button when the Cloud sync is NOT enabled.
       *  
       * @instance
       * @type {boolean}
       * @default false
       */
      invertFilter: false,
      
      /**
       * Hides the button when Cloud sync is enabled.
       * 
       * @instance
       * @param {object} payload The payload published on the filter topic 
       */
      filter: function alfresco_documentlibrary_AlfCloudSyncFilteredMenuBarItem__filter(payload) {
         var exists = lang.exists("node.parent.properties.sync:directSync", payload);
         if ((exists && !this.invertFilter) ||
             (!exists && this.invertFilter))
         {
            this.hide();
         }
         else
         {
            this.show();
         }
      }
   });
});