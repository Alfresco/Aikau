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
 * 
 * 
 * @module alfresco/services/InMemoryListService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.102
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "dojo/_base/lang"],
        function(declare, BaseService, CoreXhr, topics, lang) {
   
   return declare([BaseService, CoreXhr], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/InMemoryListService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/InMemoryListService.properties"}],
      
      /**
       * The data to hold the views being built.
       * 
       * @instance
       * @type {object}
       * @default
       */
      listData: null,

      /**
       * Sets up the subscriptions for the CommentService
       * 
       * @instance
       * @listens module:alfresco/core/topics#IN_MEM_LIST_ADD_ITEM
       * @listens module:alfresco/core/topics#IN_MEM_LIST_GET_ITEMS
       */
      registerSubscriptions: function alfresco_services_InMemoryListService__registerSubscriptions() {
         this.alfSubscribe(topics.IN_MEM_LIST_ADD_ITEM, lang.hitch(this, this.onAddListItem));
         this.alfSubscribe(topics.IN_MEM_LIST_DELETE_ITEM, lang.hitch(this, this.onRemoveItem));
         this.alfSubscribe(topics.IN_MEM_LIST_GET_ITEMS, lang.hitch(this, this.onGetListItems));
         this.alfSubscribe(topics.IN_MEM_LIST_MOVE_ITEM, lang.hitch(this, this.onMoveItem));
      },

      /**
       * Gets the data for the list requested. If the list with the requested listId cannot be found
       * then an empty instance is created for it. 
       *
       * @instance
       * @param  {string} listId The ID of the list to retrieve (or create)
       * @return {object} The data for the list
       */
      getList: function alfresco_services_InMemoryListService__getList(listId) {
         if (!this.listData)
         {
            this.listData = {};
         }
         
         if (!this.listData[listId])
         {
            this.listData[listId] = {
               id: listId,
               title: "",
               items: []
            };
         }
         return this.listData[listId];
      },

      /**
       * Adds a new item to the requested list.
       * 
       * @instance
       * @param {object} payload The details of the list
       * @param {string} payload.listId The ID of the list to add an item to
       * @param {object} payload.item The item to add to the list
       */
      onAddListItem: function alfresco_services_InMemoryListService__onAddListItem(payload) {
         if (payload && 
             payload.listId &&
             payload.item)
         {
            var listData = this.getList(payload.listId);
            payload.item.id = this.generateUuid();
            listData.items.push(payload.item);

            this.alfPublish(topics.RELOAD_DATA_TOPIC, null, false, false, payload.alfResponseScope);
         }
         else
         {
            this.alfLog("warn", "A request was made to to add an item to a list either 'listId' or 'item' was not provided", payload, this);
         }
      },

      /**
       * Retrieves all the items in the requested list
       * 
       * @instance
       * @param {object} payload The details of the list retrieve
       * @param {string} payload.listId The ID of the list to retrieve the items of
       */
      onGetListItems: function alfresco_services_InMemoryListService__onGetListItems(payload) {
         if (payload && payload.listId)
         {
            var listData = this.getList(payload.listId);

            // Clean up the data for refresh...
            listData.items.forEach(function(item) {
               delete item.index;
               delete item.isLastItem;
            });

            this.alfPublish(payload.alfSuccessTopic, {
               response: listData
            }, true);
         }
         else
         {
            this.alfLog("warn", "A request was made to to retrieve the items in a list but no 'listId' was provided", payload, this);
         }
      },

      /**
       * Moves an item within in the requested list
       * 
       * @instance
       * @param {object} payload The details of the list and item
       * @param {string} payload.listId The ID of the list to move the item within
       * @param {string} payload.id The ID of the item to move
       */
      onMoveItem: function alfresco_services_InMemoryListService__onGetListItems(payload) {
         if (payload && 
             payload.listId &&
             payload.id)
         {
            var listData = this.getList(payload.listId);

            // Find the item to move...
            var targetIndex = -1;
            listData.items.some(function(item, index) {
               if (item.id === payload.id)
               {
                  targetIndex = index;
               }
               return targetIndex !== -1;
            });

            // Move the item...
            var tmp;
            if (targetIndex !== -1)
            {
               if (payload.direction === "UP")
               {
                  if (targetIndex > 0)
                  {
                     tmp = listData.items[targetIndex - 1];
                     listData.items[targetIndex - 1] = listData.items[targetIndex];
                     listData.items[targetIndex] = tmp;
                     listData.items[targetIndex].index--;
                  }
               }
               else
               {
                  if (targetIndex < listData.items.length)
                  {
                     tmp = listData.items[targetIndex + 1];
                     listData.items[targetIndex + 1] = listData.items[targetIndex];
                     listData.items[targetIndex] = tmp;
                  }
               }
            }

            this.alfPublish(topics.RELOAD_DATA_TOPIC, null, false, false, payload.alfResponseScope);
         }
         else
         {
            this.alfLog("warn", "A request was made to move a property in a view but either the 'listId' or 'propName' was missing", payload, this);
         }
      },

      /**
       * Removes an item from the requested list
       * 
       * @instance
       * @param {object} payload The details of the list to remove an item from
       * @param {string} payload.listId The ID of the list to retrieve the item from
       * @param {string} payload.id The ID of the item to remove
       */
      onRemoveItem: function alfresco_services_InMemoryListService__onRemoveItem(payload) {
         if (payload && 
            payload.listId &&
            payload.id)
         {
            var listData = this.getList(payload.listId);
            listData.items = listData.items.filter(function(prop) {
               return prop.id !== payload.id;
            });

            this.alfPublish(topics.RELOAD_DATA_TOPIC, null, false, false, payload.alfResponseScope);
         }
         else
         {
            this.alfLog("warn", "A request was made to move a property in a view but either the 'listId' or 'propName' was missing", payload, this);
         }
      }
   });
});
