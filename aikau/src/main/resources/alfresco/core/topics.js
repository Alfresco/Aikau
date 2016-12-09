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
       * This can be published to request to add a node or nodes as a favourite.
       *
       * @instance
       * @type {String}
       * @default
       * @since 1.0.38
       * @event
       * @property {object} node - The node to add as a favourite
       * @property {object[]} nodes - An array of nodes to add as a favourites
       */
      ADD_FAVOURITE_NODE: "ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE",

      /**
       * This can be published to request to add a site as a favourite.
       *
       * @instance
       * @type {String}
       * @default
       * @since 1.0.94
       * 
       * @event
       * @property {string} site The shortName of the site to add as a favourite
       * @property {string} user The username of the user to make the site a favourite of
       */
      ADD_FAVOURITE_SITE: "ALF_ADD_FAVOURITE_SITE",

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
       * @event
       * @property {object[]} nodes - The array of Nodes to start the workflow on
       * @property {object} currentTarget - The current Node in which the nodes reside
       */
      ASSIGN_WORKFLOW: "ALF_ASSIGN_WORKFLOW",

      /**
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.52
       *
       * @event
       * @property {string} site The site shortname to change the user role in
       * @property {string} [role=SiteManager] The role for the user to become
       * @property {string} [user] The userid to change the role for
       */
      BECOME_SITE_MANAGER: "ALF_BECOME_SITE_MANAGER",

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
       * Cancel an in-progress upload.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.56
       *
       * @event
       * @property {string} fileId The ID of the file to cancel
       */
      CANCEL_INPROGRESS_UPLOAD: "CANCEL_INPROGRESS_UPLOAD",

      /**
       * Cancel a request to join a site.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.58
       *
       * @event
       * @property {string} siteId The ID of the site
       * @property {string} siteTitle The "friendly" name of the site
       * @property {object} pendingInvite The object describing the pending invite
       * @property {string} pendingInvite.id The ID of the pending site-join request
       */
      CANCEL_JOIN_SITE_REQUEST: "ALF_CANCEL_JOIN_SITE_REQUEST",

      /**
       * This topic is published to request the options to change the type of a node. It doesn't perform the
       * actual change, but simply provides the type change options in a dialog.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.58
       * 
       * @event
       * @property {object} [node] An object representing the full metadata of the Node to change the type of
       * @property {string} [nodeRef] The NodeRef of the Node to retrieve the full metadata of in order to change its type
       */
      CHANGE_TYPE_REQUEST: "ALF_CHANGE_TYPE_REQUEST",

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
       * This can be published to request authentication to the Cloud for the purposes of sync'ing
       * Alfresco Repository content with the Alfresc Cloud.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       *
       * @event
       * @property {string} username The username to authenticate (this should be the e-mail address associated with the Cloud)
       * @property {string} password The password to authenticate with
       */
      CLOUD_AUTHENTICATION_REQUEST: "ALF_CLOUD_AUTHENTICATION_REQUEST",

      /**
       * This can be published to indicate that authentication to the Cloud for the purposes of sync'ing
       * Alfresco Repository content with the Alfresc Cloud has completed successfully.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       *
       * @event
       */
      CLOUD_AUTHENTICATION_SUCCESS: "ALF_CLOUD_AUTHENTICATION_SUCCESS",

      /**
       * This is fired when content is created (typically by the [ContentService]{@link module:alfresco/services/ContentService})
       * and was added to that [trees]{@link module:alfresco/navigation/PathTree} would be able to refresh themselves
       * following content creation.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.48
       *
       * @event
       * @property {string} parentNodeRef The nodeRef of the parent that the content was created within
       * @property {string} nodeRef The nodeRef of the created content
       */
      CONTENT_CREATED: "ALF_CONTENT_CREATED",

      /**
       * This is fired when content cannot be created (typically by the 
       * [ContentService]{@link module:alfresco/services/ContentService})
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.64
       *
       * @event
       */
      CONTENT_CREATION_FAILED: "ALF_CONTENT_CREATION_FAILURE",

      /**
       * This is fired when content is deleted (typically by the [ContentService]{@link module:alfresco/services/ContentService})
       * and was added to that [trees]{@link module:alfresco/navigation/PathTree} would be able to refresh themselves
       * following content deletion.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.48
       *
       * @event
       * @property {string[]} nodeRef The nodeRefs of the content that has been deleted.
       */
      CONTENT_DELETED: "ALF_CONTENT_DELETED",

      /**
       * This topic is published to launch the copying or moving of a node (or nodes) to another location.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.36
       * 
       * @event module:alfresco/core/topics~COPY_OR_MOVE
       * @property {object[]} documents The nodes/documents to be copied/moved
       * @property {boolean} [copy=false] Whether to copy the node(s) - default is to move
       * @property {boolean} [singleItemMode=true] The mode in which to launch the picker (to determine single or multiple destinations)
       * @property {string} [dialogTitle] The title of the picker dialog - default is the generic "copy" title
       * @property {string} [confirmButtonLabel] The label of the picker confirmation button - default is the generic "copy" button confirmation
       */
      COPY_OR_MOVE: "ALF_COPY_OR_MOVE_REQUEST",

      /**
       * This can be published to make a request to create content in the Alfresco Repository. It is 
       * typically handled by the [ContentService]{@link module:alfresco/services/ContentService}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.64
       *
       * @event
       * @param {object} [currentNode] The metadata about the node in which to create content
       * @param {string} [currentNode.nodeRef] The nodeRef of the node in which to create content
       * @param {string} [type="cm:content"] The type of content to create
       */
      CREATE_CONTENT_REQUEST: "ALF_CREATE_CONTENT_REQUEST",

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
       * Create a new tag
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.37
       *
       * @event
       * @property {string} tagName The name of the tag to create
       * @property {string} alfResponseTopic The topic on which to respond
       */
      CREATE_TAG: "ALF_CREATE_TAG",

      /**
       * This can be published to make a request to show a new dialog for creating sites. This is typically handled by
       * the [SiteService]{@link module:alfresco/services/SiteService}.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.55
       *
       * @event
       */
      CREATE_SITE: "ALF_CREATE_SITE",

      /**
       * This topic is published from the [DataListService]{@link module:alfresco/services/DataListService}
       * when a Data List has had it's title and/or description updated.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.85
       *
       * @event
       * @property {string} nodeRef The NodeRef of the Data List that has been updated
       * @property {string} title The new title of the Data List
       * @property {string} description The new description of the Data List
       */
      DATA_LIST_UPDATED: "ALF_DATA_LIST_UPDATED",

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
       * This topic is published to request the deletion of a Data List.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.85
       *
       * @event
       * @property {string} nodeRef The NodeRef of the Data List to delete
       */
      DELETE_DATA_LIST: "ALF_DELETE_DATA_LIST_REQUEST",

      /**
       * This topic is published when the user confirms that they wish to delete a Data List.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.85
       *
       * @event
       * @property {string} nodeRef The NodeRef of the Data List to delete
       */
      DELETE_DATA_LIST_CONFIRMATION: "ALF_DELETE_DATA_LIST_CONFIRMATION",

      /**
       * This topic is published when a Data List has been successfully deleted.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.85
       *
       * @event
       * @property {string} nodeRef The NodeRef of the Data List to delete
       */
      DELETE_DATA_LIST_SUCCESS: "ALF_DELETE_DATA_LIST_SUCCESS",

      /**
       * This topic is published to request the deletion of a itemS from a Data List.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       *
       * @event
       * @property {string[]} nodeRefs The NodeRef of the Data List to delete
       */
      DELETE_DATA_LIST_ITEMS: "ALF_DELETE_DATA_LIST_ITEMS_REQUEST",

      /**
       * This topic is published when the user confirms that they wish to delete items from a Data List.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       *
       * @event
       * @property {string} nodeRefs The NodeRefs of the items to delete
       */
      DELETE_DATA_LIST_ITEMS_CONFIRMATION: "ALF_DELETE_DATA_LIST_ITEMS_CONFIRMATION",

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
       * @property {string} [redirect.type=PAGE_RELATIVE] - The [type of navigation]{@link module:alfresco/enums/urlTypes}
       * @property {string} [redirect.target=CURRENT"] - Whether to use the current tab ("CURRENT") or open in a new tab ("NEW")
       */
      DELETE_SITE: "ALF_DELETE_SITE",

      /**
       * This topic is published to request a title change in the current, top-most dialog.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.52
       *
       * @event
       * @property {string} title The new title
       */
      DIALOG_CHANGE_TITLE: "ALF_DIALOG_CHANGE_TITLE",

      /**
       * This topic can be published to disabled the activity feed for a site.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.87
       *
       * @event
       * @parameter {string} siteId The shortName of the site to disable the activitiy feed for.
       */
      DISABLE_SITE_ACTIVITY_FEED: "ALF_DISABLE_SITE_ACTIVITY_FEED",

      /**
       * This topic can be published to request that a notification be displayed. It is subscribed to 
       * by the [NotificationService]{@link module:alfresco/services/NotificationService}.
       *
       * @instance
       * @type {string}
       * @default
       *
       * @event
       * @property {string} message The message to be displayed
       * @property {string} [autoClose=true] Whether the notification should automatically close itself
       * @property {number} [wordsPerSecond=5] How many words it is assumed one can read per second (decrease this
       *                                       number to increase the duration of the notification being displayed
       *                                       on-screen - assuming autoClose hasn't been disabled)
       * @property {object[]} [widgets] Widgets to be inserted into the notification below the message. Note that
       *                                any widgets required must be either statically declared in the page model
       *                                or in a widgets property of a custom widget/service, or be specifically
       *                                required by a custom widget/service.
       * @property {string} [closeTopic] If this topic is published to, then the notification will be closed
       * @property {string} [publishTopic] A topic to be published after the notification has closed
       * @property {object} [publishPayload] The payload to be published after the notification has closed
       * @property {boolean} [publishGlobal] Whether to publish the topic globally
       * @property {boolean} [publishToParent] Whether to publish the topic on the parent scope
       */
      DISPLAY_NOTIFICATION: "ALF_DISPLAY_NOTIFICATION",

      /**
       * This topic can be published to request that a prompt be displayed. It is subscribed to 
       * by the [NotificationService]{@link module:alfresco/services/NotificationService}.
       *
       * @instance
       * @type {string}
       * @default
       *
       * @event
       * @property {string} message The message to be displayed in the prompt
       * @property {string} [title] The title of the prompt
       */
      DISPLAY_PROMPT: "ALF_DISPLAY_PROMPT",

      /**
       * This topic can be published to request that a [StickyPanel]{@link module:alfresco/layout/StickyPanel} be
       * displayed. It is subscribed to by the [NotificationService]{@link module:alfresco/services/NotificationService}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.48
       *
       * @event
       * @property {object[]} widgets The widgets to appear in the panel
       * @property {string} [title=default.title] The title to display (uses i18n)
       * @property {string} [closeButtonLabel=Close this panel] The text-label that decorates the close button for accessibility reasons
       * @property {string} [minimiseButtonLabel=Minimize this panel] The text-label that decorates the minimise button for accessibility reasons
       * @property {string} [restoreButtonLabel=Restore this panel] The text-label that decorates the restore button for accessibility reasons
       * @property {number} [padding=10] The padding to be applied to the widgets area
       * @property {string|number} [width=50%] The width of the panel (CSS dimension or number of pixels)
       * @property {boolean} [warnIfOpen=true] Whether to put a warning in the console if the panel is
       *                                       already visible
       * @property {function} [callback] The function to call after panel created (or if it already exists)
       *                                 with the panel instance as the first and only argument
       */
      DISPLAY_STICKY_PANEL: "ALF_DISPLAY_STICKY_PANEL",

      /**
       * Publish this to indicate the de-selection of an individual item
       * 
       * @instance
       * @type {string} 
       * @default
       * @since 1.0.35
       *
       * @event module:alfresco/core/topics~DOCUMENT_DESELECTED
       * @property {object} value - The item de-selected
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
       * @property {object} value - The item selected
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
       * @property {string} [value=null] - The selection type, either "selectAll", "selectNone", "selectInvert", "selectFolders" or "selectDocuments"
       * @property {object[]} [selectedItems=null] A specific set of items to be selected
       */
      DOCUMENT_SELECTION_UPDATE: "ALF_DOCLIST_FILE_SELECTION",

      /**
       * Fired when a "document" has been tagged
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.37
       *
       * @event
       */
      DOCUMENT_TAGGED: "ALF_DOCUMENT_TAGGED",

      /**
       * Fired when a tag has been chosen to filter a document list.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.37
       *
       * @event
       * @property {string} description A textual description of this tag
       * @property {string} value The name of the tag on which to filter
       */
      DOCUMENTLIST_TAG_CHANGED: "ALF_DOCUMENTLIST_TAG_CHANGED",
      
      /**
       * This topic is published to request the download of a single document
       * 
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.43
       *
       * @event
       * @property {object} [node] - An object containing the node data.
       * @property {string} [node.contentURL] - The URL to use for the node to download
       */
      DOWNLOAD: "ALF_DOWNLOAD",

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
       * This topic subscribed to by the [DocumentService]{@link module:alfresco/services/DocumentService}
       * in order to trigger a download of a node that has just had its full metadata successfully
       * retrieved. This is not intended to be used by widgets or services other than the 
       * [DocumentService]{@link module:alfresco/services/DocumentService}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.43
       *
       * @event
       * @property {object} response The reponse from the XHR request to retrieve the node metadata
       * @property {object} response.item The metadata for the requested node
       */
      DOWNLOAD_ON_NODE_RETRIEVAL_SUCCESS: "ALF_DOWNLOAD_ON_NODE_RETRIEVAL_SUCCESS",

      /**
       * This topic can be published to display a dialog that allow the details of a site to be edited.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.55
       *
       * @event
       * @parameter {string} site The shortName of the site to be edited
       */
      EDIT_SITE: "ALF_EDIT_SITE",

      /**
       * This topic can be published to enable the activity feed for a site.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.87
       *
       * @event
       * @parameter {string} siteId The shortName of the site to be enable the activity feed for
       */
      ENABLE_SITE_ACTIVITY_FEED: "ALF_ENABLE_SITE_ACTIVITY_FEED",

      /**
       * This topic can be fired when the enter key is pressed (but normally is not by default).
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.49
       *
       * @event
       */
      ENTER_KEY_PRESSED: "ALF_ENTER_KEY_PRESSED",

      /**
       * This topic can be published to request that the current user follow the users provided.
       * 
       * @instance
       * @type {string}
       * @default
       * @since  1.0.86
       *
       * @event
       * @property {string[]} userNames An array of the userNames of the users to follow.
       */
      FOLLOW_USERS: "ALF_FOLLOW_USERS",

      /**
       * This topic can be published to request a list of authorities to be returned (e.g. users
       * or groups).
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.78
       *
       * @event
       * @param {string} [selectableType="cm:person"] The type of authority to retrieve
       * @param {string} [query=""] The search query to provide
       * @param {number} [size=1000] The maximum number of results to return
       */
      GET_AUTHORITIES: "ALF_GET_AUTHORITIES",

      /**
       * This topic can be used to request Cloud specific paths to use in an
       * [Tree form control]{@link module:alfresco/forms/controls/Tree}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       * @event
       * @property {string} remoteSiteId The site on the Cloud tenant from which to retrieve path data
       * @property {string} remoteTenantId The tenant on the Cloud on which the remoteSiteId can be found
       */
      GET_CLOUD_PATH: "ALF_GET_CLOUD_PATH",

      /**
       * This topic can be used from a [form control]{@link module:alfresco/form/controls/BaseFormControl}
       * such as a [Select]{@link module:alfresco/forms/controls/Select} as the optionsConfig.publishTopic
       * for retrieving the sites on a specified Cloud tenant (network) that the user has access to.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       * @event
       * @property {string} username The username to request site data for
       * @property {string} remoteTenantId The tenant on which to look for sites
       */
      GET_CLOUD_SITES: "ALF_GET_CLOUD_SITES",

      /**
       * This topic can be used from a [form control]{@link module:alfresco/form/controls/BaseFormControl}
       * such as a [Select]{@link module:alfresco/forms/controls/Select} as the optionsConfig.publishTopic
       * for retrieving the Cloud tenants (networks) that the user has access to.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       * @event
       */
      GET_CLOUD_TENANTS: "ALF_GET_CLOUD_TENANTS",

      /**
       * This topic can be used to request the Data Lists for the supplied site
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.85
       *
       * @event
       * @property {string} siteId The id of the site to get the Data Lists for
       */
      GET_DATA_LISTS: "ALF_GET_DATA_LISTS",

      /**
       * This topic can be used to request items for a particular Data Lists
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       *
       * @event
       * @property {string} nodeRef The NodeRef of the Data List to get items for
       */
      GET_DATA_LIST_ITEMS: "ALF_GET_DATA_LIST_ITEMS",

      /**
       * This topic can be used to handle requests to build a widget model for displaying a list
       * showing the items in a specific Data List
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.85
       *
       * @event
       * @property {string} nodeRef The NodeRef of the Data List to display
       * @property {string} itemType The type of Data List to display
       * @property {string} [alfResponseTopic] An optional topic to publish the widget model on.
       */
      GET_DATA_LIST_WIDGETS: "ALF_GET_DATA_LIST_WIDGETS",

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
       * This topic is typically published as a result of request to load documents by publishing
       * [GET_DOCUMENT_LIST]{@link module:alfresco/core/topics#GET_DOCUMENT_LIST}. It will contain
       * the results of the request and can have a varying payload depending upon the API being used.
       *
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.51
       */
      GET_DOCUMENT_LIST_SUCCESS: "ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS",

      /**
       * This topic can be published to request the generation of options for a 
       * [form control]{@link module:alfresco/forms/controls/BaseFormControl} such as
       * [Select]{@link module:alfresco/forms/controls/Select} or
       * [RadioButtons]{@link module:alfresco/forms/controls/RadioButtons}. By default it is
       * handled by the [OptionsService]{@link module:alfresco/services/OptionsService}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.98
       *
       * @event
       * @property {string} url The URL to retrieve the options from
       * @property {string} [itemsAttribute=""] The dot-notation address of items array (e.g. "data")
       * @property {string} labelAttribute The dot-notation for label within each item (e.g. "displayName")
       * @property {string} valueAttribute The dot-notation for value within each item (e.g. "fullName")
       * @property {string} [resultsProperty="response"] Required for form controls that use a ServiceStore
       * @property {string} responseTopic This will be automatically provided by the form controls
       */
      GET_FORM_CONTROL_OPTIONS: "ALF_GET_FORM_CONTROL_OPTIONS",

      /**
       * This topic is used by the [FormsRuntimeService]{@link module:alfresco/services/FormsRuntimeServce}
       * as a simple way of providing the MIME type data for mapped Share Forms Runtime controls. Specifically
       * the "/org/alfresco/components/form/controls/mimetype.ftl" control.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.77
       *
       * @event
       */
      GET_FORMS_FORMS_RUNTIME_MIMETYPES: "ALF_GET_FORMS_RUNTIME_MIMETYPE",

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
       * This topic can be published to retrieve a list of the sites that have marked as a favourite
       * of the current user. Unfortunately at the present time this cannot be used for requesting 
       * [form control]{@link module:alfresco/forms/controls/BaseFormControl} options.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.81
       *
       * @event
       */
      GET_FAVOURITE_SITES: "ALF_GET_FAVOURITE_SITES",

      /**
       * This can be published to request the list of users that the current user is following.
       *
       * @instance
       * @type {string}
       * @default
       *
       * @since 1.0.86
       * @event
       */
      GET_FOLLOWED_USERS: "ALF_GET_FOLLOWED_USERS",

      /**
       * This can be published to request the list of users that are following the current user.
       *
       * @instance
       * @type {string}
       * @default
       *
       * @since 1.0.86
       * @event
       */
      GET_FOLLOWING_USERS: "ALF_GET_FOLLOWING_USERS",

      /**
       * This topic can be published by a [form control]{@link module:alfresco/forms/controls/BaseFormControl}
       * when it needs to retrieve options that can only be determined from other values containined within the
       * form. This allows options to be dynamically requested that change as other form values are updated.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       * 
       * @event
       * @property {string} publishTopic The topic publish the payload once augmented with the form value.
       * @property {string[]} [publishPayloadModifiers=[]] Modifiers to apply to the payload
       */
      GET_FORM_VALUE_DEPENDENT_OPTIONS: "ALF_GET_FORM_VALUE_DEPENDENT_OPTIONS",

      /**
       * This topic can be published to retrieve the details of a single user.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       *
       * @event
       * @property {string} userName The userName of the user to retrieve
       */
      GET_USER: "ALF_GET_USER",

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
       * This topic can be published to retrieve a list of the sites that have recently been visited
       * by the current user. Unfortunately at the present time this cannot be used for requesting 
       * [form control]{@link module:alfresco/forms/controls/BaseFormControl} options.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.81
       *
       * @event
       */
      GET_RECENT_SITES: "ALF_GET_RECENT_SITES",

      /**
       * This topic can be published to retrieve a list of all the sites that are accessible to the
       * current user. Unfortunately at the present time this cannot be used for requesting 
       * [form control]{@link module:alfresco/forms/controls/BaseFormControl} options.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.81
       *
       * @event
       * @property {boolean} [includeFeedSettings=false] Indicates whether feed control data should be retrieved
       */
      GET_SITES: "ALF_GET_SITES",

      /**
       * This topic can be published to request a list of all available users in the Alfresco Repository.
       * This request is expected to be handled by the [UserService]{@link module:alfresco/services/UserService}.
       * The results are published on 'alfResponseTopic' provided, and are defined as an array as attribute "items"
       * in the published payload.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.60
       *
       * @event
       * @property {string} alfResponseTopic The topic on which to publish the users data
       */
      GET_USERS: "ALF_GET_USERS",

      /**
       * This topic can be published to get a list of the sites that a user belongs to.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.87
       *
       * @event
       */
      GET_USER_SITES: "ALF_GET_USER_SITES",

      /**
       * Can be published to initialise the creation of a synchronization between an on-premise node and
       * a location on the Alfresco Cloud.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       * @event
       */
      INIT_CLOUD_SYNC: "ALF_INIT_CLOUD_SYNC",

      /**
       * This is published by the [filtered list]{@link module:alfresco/lists/AlfFilteredList} to indicate
       * what filters have been applied to the list.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.54
       *
       * @event
       */
      FILTERS_APPLIED: "ALF_FILTERS_APPLIED",

      /**
       * This function is both published from and subcribed to by the [filter summary]{@link module:alfresco/lists/utilities/FilterSummary}
       * to request that all filters are cleared.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.54
       *
       * @event
       */
      FILTERS_CLEARED: "ALF_FILTERS_CLEARED",
      
      /**
       * Published when an a list filter is removed from the [filter summary]{@link module:alfresco/lists/utilities/FilterSummary}
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.54
       *
       * @event
       */
      FILTER_REMOVED: "ALF_FILTER_REMOVED",

      /**
       * Published when a filter is removed in order to allow form controls representing the filter to update their rendering
       * of the current filter value.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.54
       *
       * @event
       * @property {string} name The [name]{@link module:alfresco/forms/controls/BaseFormControl#name} of the form control to update
       * @property {string} value The value to set on the form control
       */
      FILTER_VALUE_CHANGE: "ALF_FILTER_VALUE_CHANGED",


      /**
       * This can be published to request that an action be performed on multiple selected items. The 
       * selected items are tracked by either the [ActionService]{@link module:alfresco/services/ActionService}
       * or preferrably a [AlfSelectedItemsMenuBarPopup]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup}.
       * 
       * @instance
       * @type {string}
       * @since 1.0.38
       *
       * @event
       * @property {string} action The action to perform (this should map to a function in the [ActionService]{@link module:alfresco/services/ActionService})
       * @property {string} actionTopic A topic to forward the action request on to. 
       */
      MULTIPLE_ITEM_ACTION_REQUEST: "ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST",

      /**
       * This topic can be published to request navigation to another URL.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.35
       *
       * @event
       * @property {string} url The URL to navigate to
       * @property {string} [type=PAGE_RELATIVE] The [type of navigation]{@link module:alfresco/enums/urlTypes}
       * @property {string} [target=CURRENT] Whether to use the "CURRENT" tab, open in a "NEW" tab, or use a "NAMED" tab
       * @property {string} [targetName] The name of the tab to create when using "NAMED" as the target value
       * @property {string} [modifyCurrent=false] Whether to modify the current hash (default is to completely replace it)
       */
      NAVIGATE_TO_PAGE: "ALF_NAVIGATE_TO_PAGE",

      /**
       * This topic is published from the [alfPublishResizeEvent]{@link module:alfresco/core/ResizeMixin#alfPublishResizeEvent} function.
       * To publish this this topic a widget should mixin the [ResizeMixin]{@link module:alfresco/core/ResizeMixin} and call that function
       * and to subscribe to it, a module should mixin the [ResizeMixin]{@link module:alfresco/core/ResizeMixin} and call the
       * [alfSetupResizeSubscriptions]{@link module:alfresco/core/ResizeMixin#alfSetupResizeSubscriptions} to set up callback handlers 
       * for resizing.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.36.1
       *
       * @event
       * @property {element} node The DOM node that has been resized
       */
      NODE_RESIZED: "ALF_NODE_RESIZED",

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
       * @property {string} [type=PAGE_RELATIVE] - The [type of navigation]{@link module:alfresco/enums/urlTypes}
       * @property {string} [target=CURRENT"] - Whether to use the current tab ("CURRENT") or open in a new tab ("NEW")
       * @property {object} [parameters={}] - The parameters to include in the POST
       */
      POST_TO_PAGE: "ALF_POST_TO_PAGE",

      /**
       * This topic is published when [preview models]{@link module:alfresco/prototyping/Preview} have finished rendering.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.54
       *
       * @event
       */
      PREVIEW_MODEL_RENDERED: "ALF_PREVIEW_MODEL_RENDERED",

      /**
       * Used to request the rendering of a model. Typically handled by the [preview widget]{@link module:alfresco/prototyping/Preview}.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.54
       *
       * @event
       * @property {object} pageDefinition The model to render
       * @property {boolean} pageDefinition.stringified Indicates whether the pageDefinition model is already stringified
       * @property {object[]} pageDefinition.publishOnReady Publications to make when the model has finished rendering
       * @property {object[]} pageDefinition.services The services to create
       * @property {object[]} pageDefinition.widgets The widgets to create
       */
      PREVIEW_MODEL_RENDER_REQUEST: "ALF_GENERATE_PAGE_PREVIEW",

      /**
       * This topic should be published when indicating what [previewers]{@link module:alfresco/preview/AlfDocumentPreview}
       * are currently displayed. This has been added to support the 
       * [DocumentCarousel]{@link module:alfresco/documentlibrary/views/layouts/DocumentCarousel} so that audio and video
       * previewers can automatically be stopped and started as they leave are hidden and displayed.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.51
       *
       * @event
       * @property {object[]} items An array of the items that have been displayed.
       */
      PREVIEWS_SHOWN: "ALF_PREVIEWS_SHOWN",

      /**
       * This topic can be used to denote that an activity has begun, for which a global progress indicator should be shown.
       * This can be called multiple times, and for each "ADD" a corresponding "REMOVE" should be called via the
       * [PROGRESS_INDICATOR_REMOVE_ACTIVITY topic]{@link module:alfresco/core/topics#PROGRESS_INDICATOR_REMOVE_ACTIVITY}.
       * When there are no remaining current activities, the indicator should be hidden.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.71
       *
       * @event
       */
      PROGRESS_INDICATOR_ADD_ACTIVITY: "ALF_PROGRESS_INDICATOR_ADD_ACTIVITY",

      /**
       * This topic can be used to denote that an activity has finished, and that the progress indicator can be removed if
       * no other activities are running. Calling this topic when no activities are running will have no effect.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.71
       *
       * @event
       */
      PROGRESS_INDICATOR_REMOVE_ACTIVITY: "ALF_PROGRESS_INDICATOR_REMOVE_ACTIVITY",

      /**
       * This topic can be used to immediately mark all activities as finished and to therefore remove the progress indicator.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.71
       *
       * @event
       */
      PROGRESS_INDICATOR_REMOVE_ALL_ACTIVITIES: "ALF_PROGRESS_INDICATOR_REMOVE_ALL_ACTIVITIES",

      /**
       * This topic is published to indicate that data needs to be uploaded. This is typically list based data but can
       * be used by other widgets.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.34
       *
       * @event
       * @property {string} [focusItemKey=null] An item to focus on if it is in the data that is reloaded
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
       * This can be published to request to remove a node or nodes from the list of favourites.
       *
       * @instance
       * @type {String}
       * @default
       * @since 1.0.38
       * 
       * @event
       * @property {object} node - The node to remove from favourites
       * @property {object[]} nodes - An array of nodes to remove from favourites
       */
      REMOVE_FAVOURITE_NODE: "ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE",

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
       * This can be published to request the user to confirm an action.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.85
       * 
       * @event
       * @property {string} [confirmationTitle="Please confirm"] The title to show in the dialog
       * @property {string} [confirmationPrompt="Are you sure?"] The prompt message to display in the dialog
       * @property {string} [confirmationButtonLabel="Yes"] The label for the confirmation button
       * @property {string} [cancellationButtonLabel="No"] The label for the cancellation button
       * @property {object} [confirmationPublication] The publication to make on confirmation
       * @property {string} [confirmationPublication.publishTopic] The topic to publish confirmation on
       * @property {object} [confirmationPublication.publishPayload] The payload to publish on confirmation
       * @property {boolean} [confirmationPublication.publishGlobal] Whether to publish confirmation globally
       * @property {boolean} [confirmationPublication.publishToParent] Whether to publish confirmation on the parent scope
       * @property {string} [confirmationPublication.publishScope] A custom scope to publish confirmation on
       * @property {object} [cancellationPublication] The publication to make on cancellation
       * @property {string} [cancellationPublication.publishTopic] The topic to publish cancellation on
       * @property {object} [cancellationPublication.publishPayload] The payload to publish on cancellation
       * @property {boolean} [cancellationPublication.publishGlobal] Whether to publish cancellation globally
       * @property {boolean} [cancellationPublication.publishToParent] Whether to publish cancellation on the parent scope
       * @property {string} [cancellationPublication.publishScope] A custom scope to publish cancellation on
       */
      REQUEST_CONFIRMATION_PROMPT: "ALF_REQUEST_CONFIRMATION_PROMPT",

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
       * This can be published to request a form model be retrieved from the forms runtime service.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.76
       *
       * @event
       * @property {string} itemKind The type of item for the form (e.g. "node")
       * @property {string} itemId The unique identifier for the item for the form (e.g. a NodeRef)
       * @property {string} [formId=null] The unique identifier of the form to be retrieved
       * @property {string} [alfDestination=null] A target NodeRef for the for data provided by the form
       * @property {string} mode The mode of form to retrieve (e.g. "view" or "edit")
       * @property {object} [formConfig=null] Some optional configuration for the form
       * @property {string} [formConfig.formId=null] The ID to give to the rendered form
       * @property {object} [formConfig.formSubmissionPayloadMixin] Some additional data to include in the form submission
       * @property {object} [formConfig.useDialog=null] Indicates whether or not the form should be displayed as a dialog
       * @property {object} [formConfig.dialogTitle=null] The title for the dialog when a dialog is being used
       */
      REQUEST_FORM: "ALF_FORM_REQUEST",

      /**
       * Retrieve the currently available tags
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.37
       *
       * @event
       * @property {string} alfResponseTopic The topic on which to publish the results
       * @property {object} [query] An optional query to pass through with the tags request
       */
      RETRIEVE_CURRENT_TAGS: "ALF_RETRIEVE_CURRENT_TAGS",

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
       * This topic can be used to publish a request to perform a search.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.51
       *
       * @event module:alfresco/core/topics~SEARCH_REQUEST
       * @property {string} term The term to search for
       * @property {number} [startIndex] The index in the search results to start the page of data from
       * @property {number} [pageSize] The number of results to include in the page of data
       * @property {string} [site] The shortName of a site to search within
       * @property {string} rootNode The nodeRef of the node to search within
       * @property {boolean} [repo] Indicates whether or not so search within the entire Alfresco Repository or just sites
       * @property {string} [facetFields] Comma delimited fields to facet on in the search
       * @property {string} [filters] Comma delimited facet filters to apply to the search
       * @property {boolean} [spellcheck] Indicates whether or not to perform alternative searches based on better spelling
       * @property {object} [query] Additinal query parameters to apply to the search
       * @property {string} [sortField] The field to sort the search results on
       * @property {boolean} [sortAscending] Indicates whether or not to sort the search results in ascending order
       */
      SEARCH_REQUEST: "ALF_SEARCH_REQUEST",

      /**
       * This topic should be published by [menu items]{@link module:alfresco/menus/AlfMenuItem} contained within
       * a [AlfSelectedItemsMenuBarPopup]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup} to
       * be forwarded onto the [ActionService]{@link module:alfresco/services/ActionService} in order to request
       * that the configured action be performed on the currently selected items.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       *
       * @event
       * @property {string} [action] The action to perform
       * @property {string} [actionTopic] The topic to re-publish the action request on
       */
      SELECTED_DOCUMENTS_ACTION: "ALF_SELECTED_DOCUMENTS_ACTION_REQUEST",

      /**
       * Used to indicate the list of currently selected documents has changed and provides the details of those items.
       * 
       * @instance
       * @type {string} 
       * @default
       * @since 1.0.35
       * 
       * @event module:alfresco/core/topics~SELECTED_DOCUMENTS_CHANGED
       * @property {object[]} selectedItems - The items that are selected
       */
      SELECTED_DOCUMENTS_CHANGED: "ALF_SELECTED_FILES_CHANGED",

      /**
       * Use by the [AlfGalleryViewSlider]{@link module:alfresco/documentlibrary/AlfGalleryViewSlider}
       * to publish changes in the number of columns that should be shown in the 
       * [AlfGalleryView]{@link module:alfresco/documentlibrary/views/AlfGalleryView}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.40
       *
       * @event
       * @property {number} value - The number of columns to display.
       */
      SET_COLUMNS: "ALF_DOCLIST_SET_GALLERY_COLUMNS",

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
       * Use by the [ThumbnailSizeSlider]{@link module:alfresco/documentlibrary/ThumbnailSizeSlider}
       * to publish changes to the size of the thumbnails that are shown in the 
       * [AlfGalleryView]{@link module:alfresco/documentlibrary/views/AlfGalleryView}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.40
       *
       * @event
       * @property {number} value - The size (in pixels) to make the thumbnails.
       */
      SET_THUMBNAIL_SIZE: "ALF_SET_THUMBNAIL_SIZE",

      /**
       * This topic is subscribed to by the [LightboxService]{@link module:alfresco/services/LightboxService}
       * in order to handle requests to display lightboxes that show an image preview of a Node.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.59
       *
       * @event
       * @property {string} title The title for the lightbox
       * @property {string} src The location of the image file to show in the lightbox
       */
      SHOW_LIGHTBOX: "ALF_DISPLAY_LIGHTBOX",

      /**
       * This topic is subscribed to by the [FilePreviewService]{@link module:alfresco/services/NodePreviewService}
       * in order to handle requests to display previews of nodes.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.59
       *
       * @event
       * @property {object} [node] The Node to show the preview for
       * @property {string} [nodeRef] The NodeRef of the Node to show the preview for
       */
      SHOW_NODE_PREVIEW: "ALF_SHOW_NODE_PREVIEW",

      /**
       * This topic can be published to perform the actual creation of a site. Unlike 
       * [CREATE_SITE]{@link module:alfresco/core/topics#CREATE_SITE} this requires a payload that includes the
       * details for the new site (as it performs the actual creation on the Alfresco Repository rather than
       * just showing a site creation dialog).
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.55
       *
       * @event
       * @property {string} title The display title of the site
       * @property {string} shortName The unique site identifier
       * @property {string} description The site description
       * @property {string} preset The Surf preset to use for the site
       * @property {string} visibility The visibility of the site ("PUBLIC" or "PRIVATE")
       * @property {boolean} moderated Indicates whether "PUBLIC" sites should have moderated membership
       */
      SITE_CREATION_REQUEST: "ALF_SITE_CREATION_REQUEST",

      /**
       * This topic is published in response to [SITE_CREATION_REQUEST]{@link module:alfresco/core/topics#SITE_CREATION_REQUEST}
       * to indicate that the site creation attempt was successful.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.55
       *
       * @event
       */
      SITE_CREATION_SUCCESS: "ALF_SITE_CREATION_SUCCESS",

      /**
       * This topic can be published to perform the actual creation of a site. Unlike 
       * [CREATE_SITE]{@link module:alfresco/core/topics#CREATE_SITE} this requires a payload that includes the
       * details for the new site (as it performs the actual creation on the Alfresco Repository rather than
       * just showing a site creation dialog).
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.55
       *
       * @event
       * @property {string} title The display title of the site
       * @property {string} shortName The unique site identifier
       * @property {string} description The site description
       * @property {string} visibility The visibility of the site ("PUBLIC" or "PRIVATE")
       * @property {boolean} moderated Indicates whether "PUBLIC" sites should have moderated membership 
       */
      SITE_EDIT_REQUEST: "ALF_SITE_EDIT_REQUEST",

      /**
       * This topic is published in response to [SITE_EDIT_REQUEST]{@link module:alfresco/core/topics#SITE_EDIT_REQUEST}
       * to indicate that the site edit attempt was successful.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.55
       *
       * @event
       */
      SITE_EDIT_SUCCESS: "ALF_SITE_EDIT_SUCCESS",

      /**
       * This can be published to request a "smart" download. It is smart because it will determine whether
       * or not to download a single item individually or multiple items as a ZIP.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.43
       *
       * @event
       * @property {object[]} nodes The node or nodes to download.
       */
      SMART_DOWNLOAD: "ALF_SMART_DOWNLOAD",

      /**
       * This can be published to request that a [list]{@link module:alfresco/lists/AlfSortablePaginatedList}
       * changes the way that its data is sorted.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.59
       *
       * @event
       * @property {string} direction Either "ascending" or "descending"
       * @property {string} value The field to sort on
       * @property {object} [requester] The widget making the request (include to avoid cycling publications).
       */
      SORT_LIST: "ALF_DOCLIST_SORT",

      /**
       * This can be called to close the StickyPanel.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.48
       *
       * @event
       */
      STICKY_PANEL_CLOSE: "ALF_STICKY_PANEL_CLOSE",

      /**
       * This is fired when the StickyPanel has been closed.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.48
       *
       * @event
       */
      STICKY_PANEL_CLOSED: "ALF_STICKY_PANEL_CLOSED",

      /**
       * This topic can be published to request that the close button on a [StickyPanel]{@link module:alfresco/layout/StickyPanel}
       * be disabled.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.54
       *
       * @event
       */
      STICKY_PANEL_DISABLE_CLOSE: "ALF_STICKY_PANEL_DISABLE_CLOSE",

      /**
       * This topic can be published to request that the close button on a [StickyPanel]{@link module:alfresco/layout/StickyPanel}
       * be enabled.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.54
       *
       * @event
       */
      STICKY_PANEL_ENABLE_CLOSE: "ALF_STICKY_PANEL_ENABLE_CLOSE",

      /**
       * This can be called to minimise the StickyPanel.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.55
       *
       * @event
       */
      STICKY_PANEL_MINIMISE: "ALF_STICKY_PANEL_MINIMISE",

      /**
       * This can be called to restore the StickyPanel from a minimised state.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.55
       *
       * @event
       */
      STICKY_PANEL_RESTORE: "ALF_STICKY_PANEL_RESTORE",

      /**
       * This can be called to set the title of the StickyPanel.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.48
       *
       * @event
       * @property {string} title The new title to use
       */
      STICKY_PANEL_SET_TITLE: "ALF_STICKY_PANEL_SET_TITLE",

      /**
       * This topic can be used to stop an XHR request that is in progress.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.75
       *
       * @event
       * @property {string} requestId The id of the request to be stopped
       */
      STOP_XHR_REQUEST: "ALF_STOP_XHR_REQUEST",

      /**
       * This topic is published in order to make the actual request to sync a node or nodes
       * with the Cloud.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       */
      SYNC_TO_CLOUD: "ALF_SYNC_TO_CLOUD",

      /**
       * This topic is published when a Cloud sync is successfully created.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       */
      SYNC_TO_CLOUD_SUCCESS: "ALF_SYNC_TO_CLOUD_SUCCESS",

      /**
       * This topic is used to request tags for a node and its descendants. The payload must container either siteId and containerId, or rootNode.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.37
       * @event
       * @property {function} callback The function to be called after the query has successfully executed
       * @property {object} callbackScope The scope within which to run the callback function
       * @property {int} [maxTags=100] The maxinum number of tags to retrieve
       * @property {string} [siteId] The site ID
       * @property {string} [containerId] The container ID within the site
       * @property {string} [rootNode] The root node
       */
      TAG_QUERY: "ALF_TAG_QUERY",

      /**
       * This topic is fired when a [TinyMCE editor]{@link module:alfresco/editors/TinyMCE} is given focus.
       * This is primarily used for testing purposes.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.46
       * @event
       */
      TINYMCE_EDITOR_FOCUSED: "ALF_TINYMCE_EDITOR_FOCUSED",

      /**
       * A generic topic used by the [ToggleStateActions]{@link module:alfresco/renderers/ToggleStateActions}
       * widget for making requests to toggle the widget to the off state. Typically this would be expected
       * to be overridden with a custom topic.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.64
       *
       * @event
       */
      TOGGLE_OFF: "ALF_TOGGLE_OFF",

      /**
       * A generic topic used by the [ToggleStateActions]{@link module:alfresco/renderers/ToggleStateActions}
       * widget for making requests to toggle the widget to the on state. Typically this would be expected
       * to be overridden with a custom topic.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.64
       *
       * @event
       */
      TOGGLE_ON: "ALF_TOGGLE_ON",

      /**
       * This topic is used by the [FormsRuntimeService]{@link module:alfresco/services/FormsRuntimeService}
       * as a way of allowing other form controls (notably [Transitions]{@link module:alfresco/forms/controls/Transitions})
       * to request that the form be published.
       * 
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.86
       *
       * @event
       */
      TRIGGER_FORM_SUBMISSION: "ALF_TRIGGER_FORM_SUBMISSION",

      /**
       * This topic can be published to request that the current user unfollow the users provided.
       * 
       * @instance
       * @type {string}
       * @default
       * @since  1.0.86
       *
       * @event
       * @property {string[]} userNames An array of the userNames of the users to unfollow.
       */
      UNFOLLOW_USERS: "ALF_UNFOLLOW_USERS",

      /**
       * This topic can be published to update the title and description of a Data List.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.85
       *
       * @event
       * @property {string} nodeRef The NodeRef of the the Data List to update
       * @property {string} title The new title of the Data List
       * @property {string} description The new description of the Data List
       */
      UPDATE_DATA_LIST: "ALF_UPDATE_DATA_LIST",

      /**
       * This can be published to change the current field being used to sort lists.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.59
       *
       * @event
       * @property {string}  direction Either "ascending" or "descending"
       * @property {string}  [label] A label that represents the field to be sorted on
       * @property {boolean} [sortable] Whether or not this field can be have the sort direction changed on it
       * @property {object}  [requester] The widget making the request (include to avoid cycling publications).
       */
      UPDATE_LIST_SORT_FIELD: "ALF_DOCLIST_SORT_FIELD_SELECTION",

      /**
       * This topic can be used to publish a request to change the title of a page. It is subscribed to by the
       * [Title widget]{@link module:alfresco/header/Title} and published by the 
       * [SetTitle widget]{@link module:alfresco/header/SetTitle}
       *
       * @instance
       * @type {string}
       * @default
       *
       * @event
       * @property {string}  [title] The new title for the browser window
       * @property {string}  [browserTitlePrefix] The new prefix for the title of the browser window
       * @property {boolean} [hideBrowserTitlePrefix] Indicates whether or not the title prefix should be hidden
       */
      UPDATE_PAGE_TITLE: "ALF_UPDATE_PAGE_TITLE",

      /**
       * This topic is published when the user acknowledges the completion of uploading files to the
       * repository
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.43
       *
       * @event
       */
      UPLOAD_COMPLETION_ACKNOWLEDGEMENT: "ALF_UPLOAD_DIALOG_OK_CLICK",

      /**
       * This topic is published to cancel any file uploads that are currently in progress.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.43
       *
       * @event
       */
      UPLOAD_CANCELLATION: "ALF_UPLOAD_DIALOG_CANCEL_CLICK",

      /**
       * This topic can be published to to request modification of a line-item in the
       * [UploadMonitor widget]{@link module:alfresco/upload/UploadMonitor}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.65
       *
       * @event
       * @property {String} uploadId The ID of the upload item to modify. This will be
       *                             passed by every configured action when it publishes
       *                             for a specific upload.
       * @property {String} action The desired action, which must be "REMOVE". More actions
       *                           will be added later.
       */
      UPLOAD_MODIFY_ITEM: "ALF_UPLOAD_MODIFY_ITEM",

      /**
       * This topic is published to request an upload.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.52
       *
       * @event
       * @property {object[]} files The files to upload
       * @property {string} [fileRefs] A dot-notation reference to the files in the context of
       *                               [alfGetData]{@link module:alfresco/core/Core#alfGetData}
       *                               which will override any included files
       * @property {object} targetData An object describing where to upload the files to
       * @property {string} alfResponseTopic The topic on which to respond after all files have
       *                                     uploaded (successfully or unsuccessfully)
       * @property {string} [responseScope] The scope of the response defined by the alfResponseTopic,
       *                                    defaults to the scope of the publish caller
       */
      UPLOAD_REQUEST: "ALF_UPLOAD_REQUEST",

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
       * This topic can be published to request whether or not a particular site identifier
       * (either the title or shortName) has already been used for a site.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.89
       *
       * @event
       * @property {string} [shortName] The shortName to validate
       * @property {string} [title] The title to validate
       */
      VALIDATE_SITE_IDENTIFIER: "ALF_VALIDATE_SITE_IDENTIFIER",

      /**
       * This topic is published by an [AlfList]{@link module:alfresco/lists/AlfList#showView}
       * when a view has completed rendering. It is used by the 
       * [InfiniteScrollArea]{@link module:alfresco/layout/InfiniteScrollArea} as a trigger to
       * check whether or not more data needs to be loaded to fill the area.
       * 
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.101
       *
       * @event
       */
      VIEW_RENDERING_COMPLETE: "ALF_VIEW_RENDERING_COMPLETE",

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
