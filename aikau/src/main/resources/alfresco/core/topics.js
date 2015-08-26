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
       * Event topic to trigger the cancel the editing of a checkout document
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      CANCEL_EDIT: "ALF_DOC_CANCEL_EDITING",

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
       * This topic can be used to publish a request to change the title of a page. It is subscribed to by the
       * [Title widget]{@link module:alfresco/header/Title} and published by the 
       * [SetTitle widget]{@link module:alfresco/header/SetTitle}
       *
       * @instance
       * @type {string}
       * @default
       */
      UPDATE_PAGE_TITLE: "ALF_UPDATE_PAGE_TITLE"
   };
});
