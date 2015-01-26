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
 * @module alfresco/documentlibrary/AlfSitesList
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
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfDocumentList.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfSitesList.properties"}],

      /**
       * 
       * @instance
       * @type {string}
       * @default null
       */
      dataRequestTopic: null,

      /**
       * This is the site to get data for. This is only really applicable when getting data about 
       * a specific site as opposed 
       * @instance
       * @type {string}
       * @default null
       */
      site: null,

      /**
       * Extends the default implementation to override the loading message.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_documentlibrary_AlfSitesList__postMixInProperties() {
         this.inherited(arguments);
         this.fetchingDataMessage = this.message("sitesList.loading.data.message");
      },

      /**
       * Overrides the default implementation to retrieve site data.
       *
       * @instance
       */
      loadData: function alfresco_documentlibrary_AlfSitesList__loadData() {
         this.showLoadingMessage();

         // Set a response topic that is scoped to this widget...
         var documentPayload = {
            responseTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST"
         };

         if (this.site != null)
         {
            documentPayload.site = this.site;
         }

         if (this.usePagination)
         {
            documentPayload.page = this.currentPage;
            documentPayload.pageSize = this.currentPageSize;
         }

         if (!this.useInfiniteScroll)
         {
            this.clearViews();
         }

         this.alfPublish(this.dataRequestTopic, documentPayload);
      },

      /**
       * Handles successful calls to get site data.
       * 
       * @instance
       * @param {object} response The response object
       * @param {object} originalRequestConfig The configuration that was passed to the the [serviceXhr]{@link module:alfresco/core/CoreXhr#serviceXhr} function
       */
      onDataLoadSuccess: function alfresco_documentlibrary_AlfSitesList__onDataLoadSuccess(payload) {
         this.alfLog("log", "Data Loaded", payload, this);

         var pagination = payload.response.list.pagination;
         this.currentData = { 
            totalRecords: pagination.totalItems // MNT-12871 fix.
         };

         try
         {
            // Site admin API returns items nested inside individual entry objects inside an entries array, this just removes that entry object.
            var items = array.map(payload.response.list.entries, function(entries){ return entries.entry;});
            this._currentData = {
               items: items
            };
         }
         catch (e)
         {
            this.alfLog("error", "Could not get entries");
         }
         
         // Publish the details of the loaded documents.
         // With the pagination items mapped to what the documentList expects
         this.alfPublish(this.documentsLoadedTopic, {
            documents: this._currentData.items,
            totalDocuments: pagination.totalItems,
            startIndex: pagination.skipCount
         });

         // Re-render the current view with the new data...
         var view = this.viewMap[this._currentlySelectedView];
         if (view != null)
         {
            this.showRenderingMessage();
            view.setData(this._currentData);
            view.renderView();
            this.showView(view);
            
            // Force a resize of the sidebar container to take the new height of the view into account...
            this.alfPublish("ALF_RESIZE_SIDEBAR", {});
         }
      },
   });
});