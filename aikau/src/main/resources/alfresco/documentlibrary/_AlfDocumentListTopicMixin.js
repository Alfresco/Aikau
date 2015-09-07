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
 * This module simply provides a set of attributes that define topic names for publications
 * and subscriptions. This should be mixed into any widget that wishes to use those topics
 * to ensure consistency. It also allows the actual values to be managed from a single file. 
 * 
 * @module alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/topics"], 
        function(declare, topics) {
   
   return declare(null, {

      /**
       * This topic is used to request that the Document List reloads data using its current parameters.
       * 
       * @event reloadDataTopic
       * @instance
       * @type {string} 
       * @default
       */
      reloadDataTopic: topics.RELOAD_DATA_TOPIC,
      
      /**
       * This topic is used to publish changes to the current displayed parent location. It should be used to provide
       * all the metdata for rendering the current view of documents.
       *
       * @event metadataChangeTopic
       * @instance
       * @type {string} 
       * @default
       */
      metadataChangeTopic: "ALF_CURRENT_NODEREF_CHANGED",
      
      /**
       * @event hashChangeTopic
       * @instance
       * @type {string} 
       * @default
       */
      hashChangeTopic: "ALF_HASH_CHANGED",
      
      /**
       * This differs from the "hashChangeTopic" because it describes the "filter" filter (as opposed to a "path" filter)
       * rather than just indicating that the current filter has been changed. This is required so that widgets can reflect
       * information about the currently selected filter - for example, a breadcrumb trail needs to show information about the
       * selected filter.
       *
       * @event filterSelectionTopic
       * @instance
       * @type {string} 
       * @default
       */
      filterSelectionTopic: "ALF_DOCLIST_FILTER_SELECTION",
      
      /**
       * This topic is used to publish changes for the users access rights to the current location, e.g. if they 
       * no longer have creation rights.
       * 
       * @event userAccessChangeTopic
       * @instance
       * @type {string} 
       * @default
       */
      userAccessChangeTopic: "ALF_DOCLIST_USER_ACCESS_CHANGED",
      
      /**
       * This topic is used to publish the details of documents loaded for the current location.
       * 
       * @event documentsLoadedTopic
       * @instance
       * @type {string} 
       * @default
       */
      documentsLoadedTopic: "ALF_DOCLIST_DOCUMENTS_LOADED",

      /**
       * This topic is used to indicate that documents could not be loaded.
       * 
       * @event documentLoadFailedTopic
       * @instance
       * @type {string} 
       * @default
       */
      documentLoadFailedTopic: "ALF_DOCLIST_DOCUMENTS_LOAD_FAILED",
      
      /**
       * This topic is used to publish changes of page within the current location.
       * 
       * @event pageSelectionTopic
       * @instance
       * @type {string} 
       * @default
       */
      pageSelectionTopic: "ALF_DOCLIST_PAGE_SELECTED",
      
      /**
       * This topic is used to publish changes of the number of documents to show for each page.
       * 
       * @event docsPerpageSelectionTopic
       * @instance
       * @type {string} 
       * @default
       */
      docsPerpageSelectionTopic: "ALF_DOCLIST_DOCS_PER_PAGE_SELECTION",
      
      /**
       * This is the topic on which the valid registered views will publish the menu items that can be used to
       * select them (the view). A default is provided but can be overridden.
       * 
       * @event selectionMenuItemTopic
       * @instance
       * @type {string} 
       * @default
       */
      selectionMenuItemTopic: "ALF_DOCLIST_PROVIDE_VIEW_SELECTION_MENU_ITEM",
      
      /**
       * @event viewSelectionTopic
       * @instance
       * @type {string} 
       * @default
       */
      viewSelectionTopic: "ALF_DOCLIST_SELECT_VIEW",
      
      /**
       * The name of the group into which to place all view selection menu items.
       * 
       * @event viewSelectionMenuItemGroup
       * @instance
       * @type {string}
       * @default
       */
      viewSelectionMenuItemGroup: "DOCUMENT_LIBRARY_VIEW",
     
      /**
       * The topic to publish on when a view is selected that provides additional controls
       * 
       * @event additionalViewControlsTopic
       * @instance
       * @type {string} 
       * @default
       */
      additionalViewControlsTopic: "ALF_DOCLIST_PROVIDE_ADDITIONAL_VIEW_CONTROLS",
      
      /**
       * This differs from the "documentSelectedTopic" attribute as it is used to make general selection requests, e.g. "selectAll"
       * 
       * @event documentSelectionTopic
       * @instance
       * @type {string} 
       * @default
       */
      documentSelectionTopic: "ALF_DOCLIST_FILE_SELECTION",
      
      /**
       * This differs from the "documentSelectionTopic" attribute as it should be used for individual documents
       * 
       * @event documentSelectedTopic
       * @instance
       * @type {string} 
       * @default
       */
      documentSelectedTopic: "ALF_DOCLIST_DOCUMENT_SELECTED",
      
      /**
       * Used to indicate the list of currently selected documents has changed and provides the details of those items.
       * 
       * @event selectedDocumentsChangeTopic
       * @instance
       * @type {string} 
       * @default
       */
      selectedDocumentsChangeTopic: "ALF_SELECTED_FILES_CHANGED",
      
      /**
       * Use to indicate that an individual document has been deselected (e.g. that it should no longer be included in group actions).
       * 
       * @event documentDeselectedTopic
       * @instance
       * @type {string} 
       * @default
       */
      documentDeselectedTopic: "ALF_DOCLIST_DOCUMENT_DESELECTED",
      
      /**
       * @event sortRequestTopic
       * @instance
       * @type {string} 
       * @default
       */
      sortRequestTopic: "ALF_DOCLIST_SORT",
      
      /**
       * @event
       * @instance
       * @type {string} 
       * @default
       */
      sortFieldSelectionTopic: "ALF_DOCLIST_SORT_FIELD_SELECTION",
      
      /**
       * @event showFoldersTopic
       * @instance
       * @type {string} 
       * @default
       */
      showFoldersTopic: "ALF_DOCLIST_SHOW_FOLDERS",
      
      /**
       * Used to indicate whether or not to display the current path rendered within the document list.
       *
       * @event showPathTopic
       * @instance
       * @type {string} 
       * @default
       */
      showPathTopic: "ALF_DOCLIST_SHOW_PATH",
      
      /**
       * Indicates whether or not to display a sidebar to accompany the document list (this may contain additional controls
       * such as trees, filters, etc).
       *
       * @event showSidebarTopic
       * @instance
       * @type {string} 
       * @default
       */
      showSidebarTopic: "ALF_DOCLIST_SHOW_SIDEBAR",
      
      /**
       * Used to request an action on an individual document (as opposed to a group of documents).
       *
       * @event singleDocumentActionTopic
       * @instance
       * @type {string} 
       * @default
       */
      singleDocumentActionTopic: "ALF_SINGLE_DOCUMENT_ACTION_REQUEST",
      
      /**
       * Used to indicate that a document has been tagged.
       *
       * @event documentTaggedTopic
       * @instance
       * @type {string}
       * @default
       */
      documentTaggedTopic: "ALF_DOCUMENT_TAGGED",
         
      /**
       * @event syncLocationTopic
       * @instance
       * @type {string}
       * @default
       */
      syncLocationTopic: "ALF_SYNC_CURRENT_LOCATION",
      
      /**
       * @event unsyncLocationTopic
       * @instance
       * @type {string}
       * @default
       */
      unsyncLocationTopic: "ALF_UNSYNC_CURRENT_LOCATION",

      /**
       * Used by infinite scroll to let other widgets know that the bottom of the page has been reached.
       * 
       * @event scrollNearBottom
       * @instance
       * @type {string}
       * @default [topics.SCROLL_NEAR_BOTTOM]{@link module:alfresco/core/topics#SCROLL_NEAR_BOTTOM}
       */
      scrollNearBottom: topics.SCROLL_NEAR_BOTTOM,

      /**
       * Used to let infinite scroll know we're finished and it can trigger again.
       *
       * @event scrollReturn
       * @instance
       * @type {string}
       * @default
       */
      scrollReturn: "ALF_SCROLL_RETURN",

      /**
       * Indicates that a document request has started. Usually used in conjunction with requestFinishedTopic.
       * e.g. by code to prevent duplicate submission of requests.
       *
       * @event requestInProgressTopic
       * @instance
       * @type {string}
       * @default
       */
      requestInProgressTopic: "ALF_DOCLIST_REQUEST_IN_PROGRESS",

      /**
       * Indicates that a document request finished. Usually used in conjunction with requestInProgressTopic.
       * e.g. by code to prevent duplicate submission of requests.
       *
       * @event requestFinishedTopic
       * @instance
       * @type {string}
       * @default
       */
      requestFinishedTopic: "ALF_DOCLIST_REQUEST_FINISHED",

      /**
       * This topic should be published to indicate that a path has been changed. It is used by both the
       * [AlfDocumentList]{@link module:alfresco/documentlibrary/AlfDocumentList} and the
       * [AlfBreadcrumbTrail]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail}, but the default
       * value can be overridden through configuration if required.
       * 
       * @instance
       * @type {string}
       * @default [topics.PATH_CHANGED]{@link module:alfresco/core/topics#PATH_CHANGED}
       */
      pathChangeTopic: topics.PATH_CHANGED
   });
});