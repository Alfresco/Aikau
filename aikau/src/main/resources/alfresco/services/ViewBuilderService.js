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
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/_base/array",
        "service/constants/Default"],
        function(declare, BaseService, CoreXhr, topics, lang, array, AlfConstants) {
   
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
       * The data to hold the views being built.
       * 
       * @instance
       * @type {object}
       * @default
       */
      viewData: null,

      /**
       * Sets up the subscriptions for the CommentService
       * 
       * @instance
       * @listens module:alfresco/core/topics#VIEW_BUILDER_ADD_VIEW_PROP
       * @listens module:alfresco/core/topics#VIEW_BUILDER_GET_VIEW_PROPS
       */
      registerSubscriptions: function alfresco_services_ViewBuilderService__registerSubscriptions() {
         this.alfSubscribe(topics.VIEW_BUILDER_ADD_VIEW_PROP, lang.hitch(this, this.onAddViewProp));
         this.alfSubscribe(topics.VIEW_BUILDER_DELETE_VIEW_PROP, lang.hitch(this, this.onRemoveViewProp));
         this.alfSubscribe(topics.VIEW_BUILDER_GET_VIEW_PROPS, lang.hitch(this, this.onGetViewProps));
         this.alfSubscribe(topics.VIEW_BUILDER_MOVE_PROP, lang.hitch(this, this.onMoveViewProp));
      },

      /**
       * Gets the data for the view requested. If the view with the requested viewId cannot be found
       * then an empty instance is created for it.
       *
       * @instance
       * @param  {string} viewId The ID of the view to retrieve (or create)
       * @return {object} The data for the view
       */
      getViewData: function alfresco_services_ViewBuilderService__getViewData(viewId) {
         if (!this.viewData)
         {
            this.viewData = {};
         }
         if (!this.viewData[viewId])
         {
            this.viewData[viewId] = {
               title: "",
               properties: []
            };
         }
         return this.viewData[viewId];
      },

      /**
       * Adds a new property to the requested view.
       * 
       * @instance
       * @param {object} payload The details of the view properties to receive
       * @param {string} payload.viewId The ID of the view to retrieve properties for.
       * @param {string} payload.propName The name of the property to add
       * @param {string} payload.propLabel The label to use for the property to add
       */
      onAddViewProp: function alfresco_services_ViewBuilderService__onAddViewProp(payload) {
         if (payload && 
             payload.viewId &&
             payload.propName &&
             payload.propLabel)
         {
            var viewData = this.getViewData(payload.viewId);
            viewData.properties.push({
               id: this.generateUuid(),
               propName: payload.propName,
               propLabel: payload.propLabel
            });

            this.alfPublish(topics.RELOAD_DATA_TOPIC, null, false, false, payload.alfResponseScope);
         }
         else
         {
            this.alfLog("warn", "A request was made to to add a property to a view but one or more of 'viewId', 'propName' and 'propLabel' was not provided", payload, this);
         }
      },

      /**
       * Retrieves the list of properties in the requested view.
       * 
       * @instance
       * @param {object} payload The details of the view properties to receive
       * @param {string} payload.viewId The ID of the view to retrieve properties for.
       */
      onGetViewProps: function alfresco_services_ViewBuilderService__onGetViewProps(payload) {
         if (payload && payload.viewId)
         {
            var viewData = this.getViewData(payload.viewId);

            // Clean up the data for refresh...
            viewData.properties.forEach(function(prop) {
               delete prop.index;
               delete prop.isLastItem;
            });

            this.alfPublish(payload.alfSuccessTopic, {
               response: viewData
            }, false, false, payload.alfResponseScope);
         }
         else
         {
            this.alfLog("warn", "A request was made to to retrieve the properties in a view but no 'viewId' was provided", payload, this);
         }
      },

      /**
       * Moves a property within in the requested view.
       * 
       * @instance
       * @param {object} payload The details of the view properties to receive
       * @param {string} payload.viewId The ID of the view to retrieve properties for.
       * @param {string} payload.id The ID of the property to move (not the propName, the generated unique id)
       */
      onMoveViewProp: function alfresco_services_ViewBuilderService__onGetViewProps(payload) {
         if (payload && 
            payload.viewId &&
            payload.id)
         {
            var viewData = this.getViewData(payload.viewId);

            // Find the property to move...
            var targetIndex = -1;
            viewData.properties.some(function(prop, index) {
               if (prop.id === payload.id)
               {
                  targetIndex = index;
               }
               return targetIndex !== -1;
            });

            // Move the property...
            var tmp;
            if (targetIndex !== -1)
            {
               if (payload.direction === "UP")
               {
                  if (targetIndex > 0)
                  {
                     tmp = viewData.properties[targetIndex - 1];
                     viewData.properties[targetIndex - 1] = viewData.properties[targetIndex];
                     viewData.properties[targetIndex] = tmp;
                     viewData.properties[targetIndex].index--;
                  }
               }
               else
               {
                  if (targetIndex < viewData.properties.length)
                  {
                     tmp = viewData.properties[targetIndex + 1];
                     viewData.properties[targetIndex + 1] = viewData.properties[targetIndex];
                     viewData.properties[targetIndex] = tmp;
                  }
               }
            }

            this.alfPublish(topics.RELOAD_DATA_TOPIC, null, false, false, payload.alfResponseScope);
         }
         else
         {
            this.alfLog("warn", "A request was made to move a property in a view but either the 'viewId' or 'propName' was missing", payload, this);
         }
      },

      /**
       * Removes a property from the requested view.
       * 
       * @instance
       * @param {object} payload The details of the view properties to receive
       * @param {string} payload.viewId The ID of the view to retrieve properties for.
       * @param {string} payload.id The ID of the property to remove
       */
      onRemoveViewProp: function alfresco_services_ViewBuilderService__onRemoveViewProp(payload) {
         if (payload && 
            payload.viewId &&
            payload.id)
         {
            var viewData = this.getViewData(payload.viewId);
            viewData.properties = viewData.properties.filter(function(prop) {
               return prop.id !== payload.id;
            });

            this.alfPublish(topics.RELOAD_DATA_TOPIC, null, false, false, payload.alfResponseScope);
         }
         else
         {
            this.alfLog("warn", "A request was made to move a property in a view but either the 'viewId' or 'propName' was missing", payload, this);
         }
      }
   });
});
