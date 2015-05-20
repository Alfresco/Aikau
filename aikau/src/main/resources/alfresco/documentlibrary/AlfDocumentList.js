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
 *
 * @module alfresco/documentlibrary/AlfDocumentList
 * @extends module:alfresco/lists/AlfSortablePaginatedList
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/AlfSortablePaginatedList",
        "alfresco/core/JsNode",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/hash",
        "dojo/io-query"],
        function(declare, AlfSortablePaginatedList, JsNode, array, lang, hash, ioQuery) {

   return declare([AlfSortablePaginatedList], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfDocumentList.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfDocumentList.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfDocumentList.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfDocumentList.css"}],

      /**
       * Indicates whether or not folders should be shown in the document library.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      showFolders: true,

      /**
       * Indicates whether or not documents should be shown in the document library.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      showDocuments: true,

      /**
       * @instance
       * @type {object}
       * @default null
       */
      currentFilter: null,

      /**
       * Used to trigger an event to navigate up a directory.
       *
       * @instance
       * @type {String}
       * @default "ALF_DOCLIST_PARENT_NAV"
       */
      parentNavTopic: "ALF_DOCLIST_PARENT_NAV",

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfSortablePaginatedListt#postMixInProperties}
       * to set a default filter to be a root path.
       *
       * @instance
       */
      postMixInProperties: function alfresco_documentlibrary_AlfDocumentList__postMixInProperties() {
         this.inherited(arguments);

         if (this.useHash === true)
         {
            // Push the core hash update variables into the array configured by the extended AlfSortablePaginatedList
            this._coreHashVars.push("path","filter","tag","category");
         }

         this.currentFilter = {
            path: "/"
         };
      },

      /**
       * This function sets up the subscriptions that the Document List relies upon to manage its
       * internal state and request documents.
       *
       * @instance
       * @listens ALF_DOCUMENTLIST_PATH_CHANGED
       * @listens ALF_DOCUMENTLIST_CATEGORY_CHANGED
       * @listens ALF_DOCUMENTLIST_TAG_CHANGED
       * @listens filterSelectionTopic
       * @listens documentSelectionTopic
       * @listens parentNavTopic
       */
      setupSubscriptions: function alfrescdo_documentlibrary_AlfDocumentList__setupSubscriptions() {
         this.inherited(arguments);
         this.alfSubscribe("ALF_DOCUMENTLIST_PATH_CHANGED", lang.hitch(this, this.onPathChanged));
         this.alfSubscribe("ALF_DOCUMENTLIST_CATEGORY_CHANGED", lang.hitch(this, this.onCategoryChanged));
         this.alfSubscribe("ALF_DOCUMENTLIST_TAG_CHANGED", lang.hitch(this, this.onTagChanged));
         this.alfSubscribe(this.filterSelectionTopic, lang.hitch(this, this.onFilterChanged));
         this.alfSubscribe(this.documentSelectionTopic, lang.hitch(this, this.onDocumentSelection));
         this.alfSubscribe(this.showFoldersTopic, lang.hitch(this, this.onShowFolders));
         this.alfSubscribe(this.parentNavTopic, lang.hitch(this, this.onParentNav));
      },

      /**
       * Handles requests to update the current path.
       *
       * @instance
       * @param {object} payload The details of the new path
       * @fires ALF_NAVIGATE_TO_PAGE
       */
      onPathChanged: function alfresco_documentlibrary_AlfDocumentList__onPathChanged(payload) {
         if (payload.path)
         {
            if (this.useHash === true)
            {
               var currHash = ioQuery.queryToObject(hash());
               currHash.path = payload.path;
               currHash.currentPage = 1;
               delete currHash.filter;
               delete currHash.category;
               delete currHash.tag;
               this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                  url: ioQuery.objectToQuery(currHash),
                  type: "HASH"
               }, true);
            }
            else
            {
               this.currentPage = 1;
               this.currentFilter = {
                  path: payload.path
               };
               this.loadData();
            }
         }
         else
         {
            this.alfLog("warn", "A request was made to change the displayed path of a Document List, but no 'path' attribute was provided", payload, this);
         }
      },

      /**
       * Handles requests to update the current category.
       *
       * @instance
       * @param {object} payload The details of the new category path
       * @fires ALF_NAVIGATE_TO_PAGE
       */
      onCategoryChanged: function alfresco_documentlibrary_AlfDocumentList__onCategoryChanged(payload) {
         if (payload.path)
         {
            if (this.useHash === true)
            {
               var currHash = ioQuery.queryToObject(hash());
               currHash.category = payload.path;
               currHash.currentPage = 1;
               delete currHash.filter;
               delete currHash.path;
               delete currHash.tag;
               this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                  url: ioQuery.objectToQuery(currHash),
                  type: "HASH"
               }, true);
            }
            else
            {
               this.currentPage = 1;
               this.currentFilter = {
                  category: payload.path
               };
               this.loadData();
            }
         }
         else
         {
            this.alfLog("warn", "A request was made to change the displayed path of a Document List, but no 'path' attribute was provided", payload, this);
         }
      },

      /**
       *
       *
       * @instance
       * @param {object} payload The details of the changed filter
       * @fires ALF_NAVIGATE_TO_PAGE
       */
      onFilterChanged: function alfresco_documentlibrary_AlfDocumentList__onFilterChanged(payload) {
         if (payload.value)
         {
            if (this.useHash === true)
            {
               var currHash = ioQuery.queryToObject(hash());
               currHash.filter = payload.value;
               currHash.currentPage = 1;
               delete currHash.category;
               delete currHash.path;
               delete currHash.tag;
               this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                  url: ioQuery.objectToQuery(currHash),
                  type: "HASH"
               }, true);
            }
            else
            {
               this.currentPage = 1;
               this.currentFilter = {
                  filter: payload.value
               };
               this.loadData();
            }
         }
         else
         {
            this.alfLog("warn", "A request was made to change the filter for a Document List, but no 'value' attribute was provided", payload, this);
         }
      },

      /**
       *
       *
       * @instance
       * @param {object} payload The details of the changed tag
       * @fires ALF_NAVIGATE_TO_PAGE
       */
      onTagChanged: function alfresco_documentlibrary_AlfDocumentList__onTagChanged(payload) {
         if (payload.value)
         {
            if (this.useHash === true)
            {
               var currHash = ioQuery.queryToObject(hash());
               currHash.tag = payload.value;
               currHash.currentPage = 1;
               delete currHash.category;
               delete currHash.path;
               delete currHash.filter;
               this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                  url: ioQuery.objectToQuery(currHash),
                  type: "HASH"
               }, true);
            }
            else
            {
               this.currentPage = 1;
               this.currentFilter = {
                  tag: payload.value
               };
               this.loadData();
            }
         }
         else
         {
            this.alfLog("warn", "A request was made to change the tag filter for a Document List, but no 'value' attribute was provided", payload, this);
         }
      },

      /**
       * This is the topic that will be subscribed to for responding to item clicks unless [useHash]{@link module:alfresco/documentlibrary/AlfDocumentList#useHash}
       * is set to true. [Views]{@link module:alfresco/lists/views/AlfListView} that defined
       * renderers that provide links using the [_ItemLinkMixin]{@link module:alfresco/renderers/_ItemLinkMixin} should
       * be configured to set a matching [linkClickTopic][_ItemLinkMixin]{@link module:alfresco/renderers/_ItemLinkMixin#linkClickTopic}
       * attribute in order to have their actions processed.
       *
       * @instance
       * @type {string}
       * @default "ALF_DOCLIST_NAV"
       */
      linkClickTopic: "ALF_DOCLIST_NAV",

      /**
       * This function is called whenever the [linkClickTopic]{@link module:alfresco/documentlibrary/AlfDocumentList#linkClickTopic}
       * is published. It processes the payload and updates the current filter and then refreshes the current
       * data by calling [loadData]{@link module:alfresco/documentlibrary/AlfDocumentList#loadData}.
       *
       * @instance
       * @param {object} payload
       */
      onItemLinkClick: function alfresco_documentlibrary_AlfDocumentList__onItemLinkClick(payload) {
         var node = lang.getObject("item.node", false, payload) || payload.node;
         if (node.isContainer === true || node.isLink === true)
         {
            this.onFolderClick(payload);
         }
         else
         {
            this.onDocumentClick(payload);
         }

      },

      /**
       *
       * @instance
       * @param {object} payload
       */
      onFolderClick: function alfresco_documentlibrary_AlfDocumentList__onFolderClick(payload) {
         if (payload.url)
         {
            this.currentFilter = this.processFilter(payload.url);
            if (this._readyToLoad) 
            {
               this.loadData();
            }
         }
         else
         {
            this.alfLog("warn", "A 'url' attribute was expected to be provided for an item click", payload, this);
         }
      },

      /**
       *
       * @instance
       * @param {object} payload
       */
      onDocumentClick: function alfresco_documentlibrary_AlfDocumentList__onDocumentClick(payload) {
         // jshint unused:false
         // No action for the moment
      },

      /**
       * Checks the hash for updates relating to pagination and sorting.
       *
       * @instance
       * @param {object} hashParameters An object containing the current hash parameters
       */
      _updateCoreHashVars: function alfresco_documentlibrary_AlfDocumentList___updateCoreHashVars(hashParameters) {
         this.inherited(arguments);
         this.currentFilter = hashParameters;
      },

      /**
       * Triggered when a request to navigate to the current items parent is shown. If the
       * [currentFilter]{@link module:alfresco/documentlibrary/AlfDocumentList#currentFilter}
       * is a non-root path then it will be updated to remove the last element of the current path.
       * In all other cases a publication will be made requesting the retrieval of the parent node.
       *
       * @param payload
       * @fires ALF_DOC_GET_PARENT_NODEREF
       */
      onParentNav: function alfresco_documentlibrary_AlfDocumentList__onParentNav(/*jshint unused:false*/payload) {
         if (this.currentFilter.path && this.currentFilter.path !== "/")
         {
            // NOTE: It's coded like this to support IE8 (which doesn't support lastIndexOf)...
            var p = this.currentFilter.path;
            var a = p.split("/");
            a.pop();
            this.currentFilter.path = a.join("/");
            this.resetPaginationData();
            this.loadData();
         }
         else
         {
            // Get current item's parent:
            var responseTopic = this.generateUuid() + "_parentNavSuccess",
               subscriptionHandles = [this.alfSubscribe(responseTopic, lang.hitch(this, this.onParentNavSuccess), true)];

            // We want to get the parent's parent of the current items that are displayed.
            var parentNodeRef = lang.getObject("currentData.metadata.parent.nodeRef", false, this);

            if (parentNodeRef) {
               this.alfPublish("ALF_DOC_GET_PARENT_NODEREF", {
                  nodeRef: parentNodeRef,
                  rawData: this.rawData,
                  originalResponseTopic: responseTopic, // not alfResponseTopic - as this needs passing through another response cycle.
                  subscriptionHandles: subscriptionHandles
               }, true);
            }
            else
            {
               this.alfLog("error", "Cannot retrieve parent nodeRef", this);
            }
         }
      },

      /**
       * Triggered when we have the parent node object. (call back from onParentNav)
       *
       * @param payload
       */
      onParentNavSuccess: function alfresco_documentlibrary_AlfDocumentList__onParentNavSuccess(payload) {
         // We've received the nodeRef back, let's send it on to the click handler.
         this.alfPublish(this.linkClickTopic, payload);
      },

      /**
       * Set this attribute to be true if the Document List should retrieve data directly from the 
       * Alfresco repository rather than going through an intermediary client REST API. For example
       * the [DocumentService]{@link module:alfresco/services/DocumentService} will request data from
       * a Share REST API rather than going directly to the repository.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      rawData: false,

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfSortablePaginatedList#updateLoadDataPayload} to
       * add the additional document library related data.
       *
       * @instance
       * @param {object} payload The payload object to update
       */
      updateLoadDataPayload: function alfresco_lists_AlfSortablePaginatedList__updateLoadDataPayload(payload) {
         this.inherited(arguments);

         var type = "all";
         if (this.showFolders === false && this.showDocuments === false)
         {
            // Someone has been silly...
            this.alfLog("warn", "An AlfDocumentList has been configured to neither show folders nor documents, so showing both", this);
         }
         else if (this.showFolders === false)
         {
            type = "documents";
         }
         else if (this.showDocuments === false)
         {
            type = "folders";
         }

         payload.type = type;
         payload.site = this.siteId;
         payload.container = this.containerId;
         payload.filter = this.currentFilter;
         payload.libraryRoot = this.rootNode;
         payload.rawData = this.rawData;

         if (!this.siteId && this.nodeRef)
         {
            // Repository mode (don't resolve Site-based folders)
            payload.nodeRef = this.nodeRef.toString();
         }
      },

      /**
       * This is an extension point function for extending modules to perform processing on the loaded
       * data once it's existence has been verified
       *
       * @instance
       * @param {object} response The original response.
       */
      processLoadedData: function alfresco_lists_AlfList__processLoadedData(response) {
         array.forEach(this.currentData, function(item) {
            item.jsNode = new JsNode(item.node);
         }, this);

         // Publish the details of the metadata returned from the data request...
         if (response.metadata)
         {
            this.alfPublish(this.metadataChangeTopic, {
               node: response.metadata
            });

            // Publish the details of the permissions for the current user. This will
            // only be available when the a specific node is shown rather than a set
            // of results across multiple nodes (e.g. the result of a filter request)
            if (response.metadata.parent &&
                response.metadata.parent.permissions &&
                response.metadata.parent.permissions.user)
            {
               this.alfPublish(this.userAccessChangeTopic, {
                  userAccess: response.metadata.parent.permissions.user
               });
            }
         }
         this.inherited(arguments);
      },

      /**
       * @instance
       * @param {object} payload The published details of the selected items
       */
      onDocumentSelection: function alfresco_documentlibrary_AlfDocumentList__onDocumentSelection(payload) {
         this.alfLog("log", "Documents Selected: ", payload);
         // TODO!
      },

      /**
       * @instance
       * @param {object} payload The details of the request
       */
      onShowFolders: function alfresco_documentlibrary_AlfDocumentList__onShowFolders(payload) {
         this.alfLog("log", "Show Folders Request: ", payload);
         if (payload && (payload.selected || payload.selected === false))
         {
            this.showFolders = payload.selected;
            if (this._readyToLoad)
            {
               this.loadData();
            }
         }
      }
   });
});
