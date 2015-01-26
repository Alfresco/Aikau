/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
        "alfresco/core/PathUtils",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(declare, AlfDocumentList, PathUtils, array, lang, domConstruct, domClass) {
   
   return declare([AlfDocumentList], {
      
      /**
       * 
       * @instance
       * @type {string}
       * @default null
       */
      dataRequestTopic: null,

      /**
       * This is the QuADDS to get data for. 
       *
       * @instance
       * @type {string}
       * @default null
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
       * @param {object} originalRequestConfig The configuration that was passed to the the [serviceXhr]{@link module:alfresco/core/CoreXhr#serviceXhr} function
       */
      onDataLoadSuccess: function alfresco_documentlibrary_QuaddsList__onDataLoadSuccess(payload) {
         this.alfLog("log", "Data Loaded", payload, this);

         this._currentData = payload;

         // Re-render the current view with the new data...
         var view = this.viewMap[this._currentlySelectedView];
         if (view != null)
         {
            this.showRenderingMessage();
            view.setData(this._currentData);
            view.renderView(false);
            this.showView(view);
            
            // Force a resize of the sidebar container to take the new height of the view into account...
            this.alfPublish("ALF_RESIZE_SIDEBAR", {});
         }
      },
   });
});