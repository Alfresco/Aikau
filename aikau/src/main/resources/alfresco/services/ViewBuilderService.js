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
 * @module alfresco/services/ViewBuilderService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.102
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, BaseService, CoreXhr, topics, lang, AlfConstants) {
   
   return declare([BaseService, CoreXhr], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/ViewBuilderService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/ViewBuilderService.properties"}],
      
      /**
       * Sets up the subscriptions for the service
       * 
       * @instance
       */
      registerSubscriptions: function alfresco_services_ViewBuilderService__registerSubscriptions() {
         this.alfSubscribe("ALF_ADD_VIEW", lang.hitch(this, this.onAddView));
         this.alfSubscribe("ALF_REMOVE_VIEW", lang.hitch(this, this.onRemoveView));
         this.alfSubscribe("ALF_GET_VIEWS", lang.hitch(this, this.onGetViews));
      },

      /**
       * 
       * 
       * @instance
       * @param {object} payload
       */
      onAddView: function alfresco_services_ViewBuilderService__onAddView(payload) {
         if (payload && 
             payload.name &&
             payload.view)
         {

            var headerCells = [];
            var cells = [];
            payload.view.items.forEach(function(item) {
               var headerCell = {
                  name: "alfresco/lists/views/layouts/HeaderCell",
                  config: {
                     label: item.propLabel
                  }
               };
               headerCells.push(headerCell);

               var cell = {
                  name: "alfresco/lists/views/layouts/Cell",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/renderers/Property",
                           config: {
                              propertyToRender: "node.properties." + item.propName
                           }
                        }
                     ]
                  }
               };
               cells.push(cell);
            });

            var model = {
               name: "alfresco/lists/views/AlfListView",
               config: {
                  widgetsForHeader: headerCells,
                  widgets: [
                     {
                        name: "alfresco/lists/views/layouts/Row",
                        config: {
                           widgets: cells
                        }
                     }
                  ]
               }
            };

            var data = {
               name: payload.name,
               model: model
            };

            var url = AlfConstants.PROXY_URI + "aikau/view";
            var config = {
               url: url,
               method: "POST",
               data: data
            };
            this.mergeTopicsIntoXhrPayload(payload, config);
            this.serviceXhr(config);
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
      onGetViews: function alfresco_services_ViewBuilderService__onGetViews(payload) {
         var url = AlfConstants.PROXY_URI + "aikau/views";
         var config = {
            url: url,
            method: "GET"
         };
         this.mergeTopicsIntoXhrPayload(payload, config);
         this.serviceXhr(config);
      },

      /**
       * Removes an item from the requested list
       * 
       * @instance
       * @param {object} payload The details of the list to remove an item from
       * @param {string} payload.listId The ID of the list to retrieve the item from
       * @param {string} payload.id The ID of the item to remove
       */
      onRemoveView: function alfresco_services_ViewBuilderService__onRemoveView(payload) {
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
