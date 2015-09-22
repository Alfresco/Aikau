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
 * <p>This module is intended to contain ALL topics used by the Aikau framework. Widgets that require topics
 * for publications or subscriptions should add this module as a dependency and then use a topic listed
 * as the default. This then allows configuration overrides as necessary.</p>
 * 
 * @module alfresco/core/topics
 * @author Martin Doyle
 * @author Dave Draper
 */
define([],function() {
   
   return {

      /**
       * Triggered when the progress request has failed
       *
       * @instance
       * @type {String}
       * @default
       * @since 1.0.33
       */
      ARCHIVE_PROGRESS_FAILURE: "ALF_ARCHIVE_PROGRESS_REQUEST_FAILURE",

      /**
       * Triggered when the progress request has succeeded.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      ARCHIVE_PROGRESS_SUCCESS: "ALF_ARCHIVE_PROGRESS_REQUEST_SUCCESS",

      /**
       * The topic to publish to request starting a new workflow for one or more Nodes.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.36
       *
       * @event module:alfresco/core/topics~ASSIGN_WORKFLOW
       * @parameter {object[]} nodes - The array of Nodes to start the workflow on
       * @parameter {object} currentTarget - The current Node in which the nodes reside
       */
      ASSIGN_WORKFLOW: "ALF_ASSIGN_WORKFLOW",

      /**
       * Event topic to trigger the cancel the editing of a checkout document
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      CANCEL_EDIT: "ALF_DOC_CANCEL_EDITING",

      /**
       * This can be published to clear any selected items that are logged by widgets
       * such as the [AlfSelectedItemsMenuBarPopup]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      CLEAR_SELECTED_ITEMS: "ALF_CLEAR_SELECTED_ITEMS",

      /**
       * This can be published to make a request to create a dialog. It is typically handled by the
       * [DialogService]{@link module:alfresco/services/DialogService}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.34
       */
      CREATE_DIALOG: "ALF_CREATE_DIALOG_REQUEST",

       /**
       * This can be published to make a request to create a dialog that contains a form. This differs from the standard
       * dialog request in that the payload is expected to contain a widget model containing the form controls to be placed
       * inside the dialog. The confirmation buttons of the dialog are automatically setup to respond to changes of validity
       * within the form.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.34
       */
      CREATE_FORM_DIALOG: "ALF_CREATE_FORM_DIALOG_REQUEST",

      /**
       * Delete the archive created for downloading.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      DELETE_ARCHIVE: "ALF_ARCHIVE_DELETE",

      /**
       * This topic is published to request the deletion of a node.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.34
       */
      DELETE_CONTENT: "ALF_DELETE_CONTENT_REQUEST",

      /**
       * This topic is published to request the deletion of a site.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.35
       *
       * @event module:alfresco/core/topics~DELETE_SITE
       * @property {object} [redirect] - The redirect data to use after successfully deleting the site
       * @property {string} [redirect.url] - The URL to navigate to
       * @property {string} [redirect.type="PAGE_RELATIVE"] - The type of navigation, either "PAGE_RELATIVE", "CONTEXT_RELATIVE", "FULL_PATH" or "HASH"
       * @property {string} [redirect.target=CURRENT"] - Whether to use the current tab ("CURRENT") or open in a new tab ("NEW")
       */
      DELETE_SITE: "ALF_DELETE_SITE",

      /**
       * Publish this to indicate the de-selection of an individual item
       * 
       * @instance
       * @type {string} 
       * @default
       * @since 1.0.35
       *
       * @event module:alfresco/core/topics~DOCUMENT_DESELECTED
       * @parameter {object} value - The item de-selected
       */
      DOCUMENT_DESELECTED: "ALF_DOCLIST_DOCUMENT_DESELECTED",
      
      /**
       * Publish this to indicate the selection of an individual item.
       * 
       * @instance
       * @type {string} 
       * @default
       * @since 1.0.35
       *
       * @event module:alfresco/core/topics~DOCUMENT_SELECTED
       * @parameter {object} value - The item selected
       */
      DOCUMENT_SELECTED: "ALF_DOCLIST_DOCUMENT_SELECTED",
      
      /**
       * This can be used to publish bulk changes in document selection. This differs from the 
       * [DOCUMENT_SELECTED]{@link module:alfresco/core/topics#DOCUMENT_SELECTED} as it is used to make general selection 
       * requests, e.g. "selectAll". Alternatively a "selectedItems" attribute can be used to list specific items that
       * should be selected.
       * 
       * @instance
       * @type {string} 
       * @default
       * @since 1.0.35
       * 
       * @event module:alfresco/core/topics~DOCUMENT_SELECTION_UPDATE
       * @parameter {string} [value=null] - The selection type, either "selectAll", "selectNone", "selectInvert", "selectFolders" or "selectDocuments"
       * @parameter {object[]} [selectedItems=null] A specific set of items to be selected
       */
      DOCUMENT_SELECTION_UPDATE: "ALF_DOCLIST_FILE_SELECTION",
      
      /**
       * This topic is published to request either the download of a single document or folder (or a selection
       * of documents and folder) as a ZIP file.
       * 
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.33
       */
      DOWNLOAD_AS_ZIP: "ALF_DOWNLOAD_AS_ZIP",

      /**
       * Event topic to trigger a file download in the browser
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      DOWNLOAD_NODE: "ALF_DOWNLOAD_FILE",

      /**
       * This topic can be published to request that a notification be displayed. It is subscribed to 
       * by the [NotificationService]{@link module:alfresco/services/NotificationService}.
       *
       * @instance
       * @type {string}
       * @default
       */
      DISPLAY_NOTIFICATION: "ALF_DISPLAY_NOTIFICATION",

      /**
       * This topic can be published to request that a prompt be displayed. It is subscribed to 
       * by the [NotificationService]{@link module:alfresco/services/NotificationService}.
       *
       * @instance
       * @type {string}
       * @default
       */
      DISPLAY_PROMPT: "ALF_DISPLAY_PROMPT",

      /**
       * This topic can be published to request the data for a list of documents at the location
       * provided in the payload. It is typically handled by the 
       * [DocumentService]{@link module:alfresco/services/DocumentService}.
       *
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.33
       */
      GET_DOCUMENT_LIST: "ALF_RETRIEVE_DOCUMENTS_REQUEST",

      /**
       * Get the node ref for the current node's parent.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      GET_PARENT_NODEREF: "ALF_DOC_GET_PARENT_NODEREF",

      /**
       * This topic can be published to request the data for a single document node. It is typically handled
       * by the [DocumentService]{@link module:alfresco/services/DocumentService}.
       *
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.33
       */
      GET_DOCUMENT: "ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST",

      /**
       * This topic can be published to request a user preference be returned. It is typically handled by 
       * the [PreferenceService]{@link module:alfresco/services/PreferenceService}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.34
       *
       * @event module:alfresco/core/topics~GET_PREFERENCE
       * @property {string} preference Dot-notation property indicating the user preference to retrieve
       * @property {function} callback The function to call when the preference has been retrieved
       * @property {object} callbackScope The scope with which to execute the callback
       */
      GET_PREFERENCE: "ALF_PREFERENCE_GET",

      /**
       * This topic can be published to request navigation to another URL.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.35
       *
       * @event module:alfresco/core/topics~NAVIGATE_TO_PAGE
       * @property {string} url - The URL to navigate to
       * @property {string} [type="PAGE_RELATIVE"] - The type of navigation, either "PAGE_RELATIVE", "CONTEXT_RELATIVE", "FULL_PATH" or "HASH"
       * @property {string} [target=CURRENT"] - Whether to use the current tab ("CURRENT") or open in a new tab ("NEW")
       */
      NAVIGATE_TO_PAGE: "ALF_NAVIGATE_TO_PAGE",

      /**
       * This topic is fired automatically whenever a notification is destroyed.
       *
       * @instance
       * @type {string}
       * @default
       */
      NOTIFICATION_CLOSED: "ALF_NOTIFICATION_CLOSED",

      /**
       * This topic is published when the page has finished loading. It should also be published
       * when dynamically creating widgets after the page has finished loading.
       *
       * @instance
       * @type {string}
       * @default
       */
      PAGE_WIDGETS_READY: "ALF_WIDGETS_READY",

      /**
       * This topic is published when a path changed. It is typically used in Document Libraries
       * to communicate navigation through a folder hierarchy to both request data and to keep
       * navigation widgets synchronized (e.g. [Document Lists]{@link module:alfresco/documentlibrary/AlfDocumentList}
       * and [Path Trees]{@link module:alfresco/navigation/PathTree}).
       *
       * @instance
       * @type {string}
       * @default
       */
      PATH_CHANGED: "ALF_DOCUMENTLIST_PATH_CHANGED",

      /**
       * This topic can be published to request to POST data to a new page
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.35
       *
       * @event module:alfresco/core/topics~POST_TO_PAGE
       * @property {string} url - The URL to navigate to
       * @property {string} [type="PAGE_RELATIVE"] - The type of navigation, either "PAGE_RELATIVE", "CONTEXT_RELATIVE", "FULL_PATH" or "HASH"
       * @property {string} [target=CURRENT"] - Whether to use the current tab ("CURRENT") or open in a new tab ("NEW")
       * @property {object} [parameters={}] - The parameters to include in the POST
       */
      POST_TO_PAGE: "ALF_POST_TO_PAGE",

      /**
       * This topic is published to indicate that data needs to be uploaded. This is typically list based data but can
       * be used by other widgets.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.34
       */
      RELOAD_DATA_TOPIC: "ALF_DOCLIST_RELOAD_DATA",

      /**
       * This topic can be published to request to reload the current page
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.35
       *
       * @event module:alfresco/core/topics~RELOAD_PAGE
       */
      RELOAD_PAGE: "ALF_RELOAD_PAGE",

      /**
       * Called to start off the archiving process.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      REQUEST_ARCHIVE: "ALF_ARCHIVE_REQUEST",

      /**
       * Called to trigger a request to check progress
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      REQUEST_ARCHIVE_PROGRESS: "ALF_ARCHIVE_PROGRESS_REQUEST",

      /**
       * Called to trigger a delayed request to check progress
       * delay is set in archiveProgressUpdateFailureInterval
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      REQUEST_DELAYED_ARCHIVE_PROGRESS: "ALF_ARCHIVE_DELAYED_PROGRESS_REQUEST",

      /**
       * Published to indicate that list data requests have been completed. Typically used to track whether or not
       * XHR requests for data are in progress.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.36
       *
       * @event module:alfresco/core/topics~REQUEST_FINISHED_TOPIC
       */
      REQUEST_FINISHED_TOPIC: "ALF_DOCLIST_REQUEST_FINISHED",

      /**
       * <p>This topic is used to indicate that a navigable collection has been scrolled to
       * "near" its bottom. Since its creation, this topic's meaning has extended to go beyond
       * just scrolling (sometimes it's clicking arrows) and to not necessarily being the
       * bottom (sometimes it's a horizontal navigation), however in order to preserve backward
       * compatibility, this has been left unchanged.</p>
       * 
       * <p><em>NOTE: In future this is very likely to be deprecated and eventually removed,
       * so be sure to use the constant (not its value) and to watch out for deprecated
       * references in your codebase.</em></p>
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.32
       */
      SCROLL_NEAR_BOTTOM: "ALF_SCROLL_NEAR_BOTTOM",

      /**
       * Used to indicate the list of currently selected documents has changed and provides the details of those items.
       * 
       * @instance
       * @type {string} 
       * @default
       * @since 1.0.35
       * 
       * @event module:alfresco/core/topics~SELECTED_DOCUMENTS_CHANGED
       * @parameter {object[]} selectedItems - The items that are selected
       */
      SELECTED_DOCUMENTS_CHANGED: "ALF_SELECTED_FILES_CHANGED",

      /**
       * This topic can be published to set a user preference. It is typically handled by 
       * the [PreferenceService]{@link module:alfresco/services/PreferenceService}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.34
       */
      SET_PREFERENCE: "ALF_PREFERENCE_SET",

      /**
       * This topic can be used to publish a request to change the title of a page. It is subscribed to by the
       * [Title widget]{@link module:alfresco/header/Title} and published by the 
       * [SetTitle widget]{@link module:alfresco/header/SetTitle}
       *
       * @instance
       * @type {string}
       * @default
       */
      UPDATE_PAGE_TITLE: "ALF_UPDATE_PAGE_TITLE",

      /**
       * This topic can be published to display a dialog that allows users to select one or more files
       * to upload and the location to upload them to. This is typically handled by the 
       * [ContentService]{@link module:alfresco/services/ContentService}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.34
       */
      UPLOAD_TO_UNKNOWN_LOCATION: "ALF_UPLOAD_TO_UNKNOWN_LOCATION",

      /**
       * This topic is published to indicate that widget processing has been completed. It is typically
       * fired by widgets that dynamically render widget models.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.35
       */
      WIDGET_PROCESSING_COMPLETE: "ALF_WIDGET_PROCESSING_COMPLETE"
   };
});
