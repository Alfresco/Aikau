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
 * @module alfresco/documentlibrary/QuaddsList
 * @extends alfresco/documentlibrary/AlfDocumentList
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/AlfDocumentList",
        "dojo/_base/lang"], 
        function(declare, AlfDocumentList, lang) {
   
   return declare([AlfDocumentList], {
      
      /**
       * 
       * @instance
       * @type {string}
       * @default
       */
      dataRequestTopic: null,

      /**
       * This is the QuADDS to get data for. 
       *
       * @instance
       * @type {string}
       * @default
       */
      quadds: null,

      /**
       * Overrides the default implementation to retrieve site data.
       *
       * @instance
       */
      loadData: function alfresco_documentlibrary_QuaddsList__loadData() {
         this.clearViews();
         this.showLoadingMessage();

         // Set a response topic that is scoped to this widget...
         var quaddsPayload = {
            responseTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST",
            quadds: this.quadds
         };
         this.alfPublish("ALF_GET_QUADDS_ITEMS", quaddsPayload);
      },

      /**
       * Handles successful calls to get site data.
       * 
       * @instance
       * @param {object} response The response object
       * @param {object} originalRequestConfig The configuration that was passed to the [serviceXhr]{@link module:alfresco/core/CoreXhr#serviceXhr} function
       */
      onDataLoadSuccess: function alfresco_documentlibrary_QuaddsList__onDataLoadSuccess(payload) {
         this.alfLog("log", "Data Loaded", payload, this);

         this._currentData = payload;

         // Re-render the current view with the new data...
         var view = this.viewMap[this._currentlySelectedView];
         if (view)
         {
            this.showRenderingMessage();
            view.setData(this._currentData);
            // As part of the performance improvements (see AKU-1142) there is a switch
            // to using native Promises in view rendering. The AlfListView renderView 
            // function has been adapted to return a promise but for backwards compatibility
            // we need to retain the previous code path (which should be followed when 
            // rendering a view does not return a promise)...
            var renderedView = view.renderView(this.useInfiniteScroll);
            if (renderedView && typeof renderedView.then === "function")
            {
               renderedView.then(lang.hitch(this, this.showView, view)).then(lang.hitch(this, function() {
                  this.alfPublish("ALF_RESIZE_SIDEBAR", {});
               }));
            }
            else
            {
               this.showView(view);
               this.alfPublish("ALF_RESIZE_SIDEBAR", {});
            }
         }
      }
   });
});