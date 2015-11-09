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
 * <p>This mixin provides functions that allow files to be uploaded by dragging and dropping them
 * onto the widget. It also provides functions that control highlighting the widget when 
 * files are dragged over the widget.</p>
 * <p><b>NOTE: Highlighting of items provided by this module is not supported for any version of Internet
 * Explorer prior to version 10</b></p>
 * 
 * @module alfresco/documentlibrary/_AlfDndDocumentUploadMixin
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @mixes module:alfresco/core/PathUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/core/PathUtils",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/mouse",
        "dojo/on",
        "dijit/registry",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dojo/dom-style",
        "dojo/dom",
        "dojo/_base/window"], 
        function(declare, AlfCore, _AlfDocumentListTopicMixin, PathUtils, lang, array, mouse, on, registry, domClass, 
                 domConstruct, domGeom, domStyle, dom, win) {
   
   return declare([AlfCore, _AlfDocumentListTopicMixin, PathUtils], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/_AlfDndDocumentUploadMixin.properties"}]
       * @since 1.0.41
       */
      i18nRequirements: [{i18nFile: "./i18n/_AlfDndDocumentUploadMixin.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/_AlfDndDocumentUploadMixin.css"}]
       * @since 1.0.41
       */
      cssRequirements: [{cssFile:"./css/_AlfDndDocumentUploadMixin.css"}],
      
      /**
       * Indicates whether drag and drop is enabled. 
       * 
       * @instance
       * @type {boolean} 
       * @default
       */
      dndUploadEnabled: false,
      
      /**
       * Indicates whether or not the browser is capable of drag and drop file upload. This is set in the constructor.
       * 
       * @instance
       * @type {boolean} 
       * @default
       */
      dndUploadCapable: false, 

      /**
       * Keeps track of the DOM node that the drag-and-drop events are listened on.
       * 
       * @instance
       * @type {object}
       * @default
       */
      dragAndDropNode: null,
      
      /**
       * 
       * @instance
       * @type {element}
       * @default
       * @since 1.0.41
       */
      dragAndDropOverlayNode: null,

      /**
       * @instance
       * @type {object[]}
       * @default
       */
      dndUploadEventHandlers: null,
      
      /**
       * This is the length of time (in milliseconds) that the highlight will be displayed on the screen without the mouse 
       * moving over any element within the element on which the highlight can be applied. This exists so 
       * that if the drag moves out of the browser without leaving the element (i.e. if it is moved onto
       * an overlapping window) the highlight will not remain displayed forever.
       *
       * @instance
       * @type {number}
       * @default
       * @since 1.0.42
       */
      dndUploadHighlightDebounceTime: 2500,

      /**
       * The image to use for the upload highlighting. Currently the only other option apart from the default is
       * "elipse-cross.png"
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.41
       */
      dndUploadHighlightImage: "large-folder-icon.png",

      /**
       * The text to display for upload highlighting. If configured or overridden to be null or the
       * empty string then no text will be displayed.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.41
       */
      dndUploadHighlightText: "dnd.upload.highlight.label",

      /**
       * This is used as a reference for a timeout handle that will remove the highlight if the mouse
       * does not move over an element within the element that the upload highlight can be applied to.
       * 
       * @instance
       * @type {number}
       * @default
       * @since 1.0.42
       */
      dndUploadHighlightTimeout: null,

      /**
       * Indicates whether or not the mixing module should take advantage of the drag-and-drop uploading capabilities. 
       * This makes it possible to "opt-out" through configuration or extension.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.39
       */
      suppressDndUploading: false,
    
      /**
       * Determines whether or not the browser supports drag and drop file upload.
       * 
       * @instance
       */
      constructor: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__constructor() {
         this.dndUploadCapable = ("draggable" in document.createElement("span"));
      },
      
      /**
       * Removes HTML5 drag and drop listeners from the supplied DOM node
       *
       * @instance
       * @param {object} domNode The DOM node to remove drag and drop capabilities from
       */
      removeUploadDragAndDrop: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__removeUploadDragAndDrop(/*jshint unused:false*/ domNode) {
         this.alfLog("log", "Removing drag and drop upload handlers");
         
         // Clean up any previously created event handlers...
         if (this.dndUploadEventHandlers)
         {
            array.forEach(this.dndUploadEventHandlers, function(handle){ handle.remove(); });
         }
         this.dndUploadEventHandlers = [];
      },

      /**
       * Adds subscriptions to topics providing information on the changes to the current node being represented. This 
       * has been primarily added to support widgets that change the displayed view.
       * 
       * @instance
       */
      subscribeToCurrentNodeChanges: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__subscribeToCurrentNodeChanges(domNode) {
         if (this.dndUploadCapable && !this.suppressDndUploading)
         {
            // Handle updates to the metadata (this is required in order for the view to know what
            // root Node it represents is)
            this.dragAndDropNode = domNode;
            this.alfSubscribe(this.metadataChangeTopic, lang.hitch(this, this.onCurrentNodeChange));
            this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onFilterChange));
         }
      },

      /**
       * Handles changes to the the current node that is represented by the widget that mixes in this module. For example
       * when the path that a view is displaying changes.
       * 
       * @instance
       * @param {object} payload The published payload
       */
      onCurrentNodeChange: function alfresco_documentlibrary___AlfDndDocumentUploadMixin__onCurrentNodeChange(payload) {
         if (payload && payload.node)
         {
            this.alfLog("log", "Updating current nodeRef to: ", payload.node);
            this._currentNode = payload.node;

            // Check that the current user can create children on the current node to determine
            // whether or not DND upload should be supported...
            var canCreateChildren = lang.getObject("node.parent.permissions.user.CreateChildren", false, payload);
            if (canCreateChildren === true)
            {
               this.addUploadDragAndDrop(this.dragAndDropNode);
            }
            else
            {
               this.removeUploadDragAndDrop(this.dragAndDropNode);
            }
         }
         else
         {
            this.alfLog("error", "A request was made to update the current NodeRef, but no 'node' property was provided in the payload: ", payload);
         }
      },

      /**
       * Handles changes the current filter. If the filter isn't path based then drag and drop uploading is disabled.
       * 
       * @instance
       * @param {object} payload The published payload
       */
      onFilterChange: function alfresco_documentlibrary___AlfDndDocumentUploadMixin__onFilterChange(payload) {
         var path = lang.getObject("path", false, payload);
         if (!path)
         {
            this.removeUploadDragAndDrop(this.dragAndDropNode);
         }
         else
         {
            this.addUploadDragAndDrop(this.dragAndDropNode);
         }
      },

      /**
       * This function is used to check whether the currentItem supports upload for the permissions
       * held by the current user. By default this assumes that the currentItem is a Node that defines
       * all the relevant permissions. It looks to see whether the Node is a container that the user
       * can create a children on or is not a container that the user can write to.
       *
       * @instance
       */
      hasUploadPermissions: function alfresco_documentlibrary___AlfDndDocumentUploadMixin__hasUploadPermissions() {
         var isContainer = lang.getObject("currentItem.node.isContainer", false, this);
         var userPermissions = lang.getObject("currentItem.node.permissions.user", false, this);

         return userPermissions &&
                ((isContainer === true && userPermissions.CreateChildren === true) ||
                 (isContainer === false && userPermissions.Write === true));
      },

      /**
       * Adds HTML5 drag and drop listeners to the supplied DOM node
       *
       * @instance
       * @param {object} domNode The DOM node to add drag and drop listeners to
       */
      addUploadDragAndDrop: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__addUploadDragAndDrop(domNode) {
         if (this.dndUploadCapable && !this.suppressDndUploading)
         {
            this.alfLog("log", "Adding DND upload capabilities", this);
            try
            {
               // Add listeners to the HTML5 drag and drop events
               this.dndUploadEnabled = true;
               this.dragAndDropNode = domNode;

               // Adding the base class will set an invisible border that can then be "coloured" in when
               // dragging and item over the node (this prevents the display "jumping")...
               domClass.add(this.dragAndDropNode, "alfresco-documentlibrary-_AlfDndDocumentUploadMixin");

               // Reset the handlers...
               this.removeDndUploadHandlers();
               this.addDndUploadHandlers();
            }
            catch(exception)
            {
               this.alfLog("error", "The following exception occurred adding Drag and Drop event handlers: ", exception);
            }
         }
         else
         {
            this.alfLog("log", "Cannot add DND upload capabilities because the browser does not have the required capabilities", this);
         }
      },

      /**
       * Sets up the handlers for the drag and drop events. These handlers are all added to the
       * [dndUploadEventHandlers]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#dndUploadEventHandlers}
       * array so that they can be easily cleaned up by
       * [removeDndUploadHandlers]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#removeDndUploadHandlers} 
       * 
       * @instance
       * @since 1.0.41
       */
      addDndUploadHandlers: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__removeDndUploadHandlers() {
         this.dndUploadEventHandlers.push(on(win.body(), "dragenter", lang.hitch(this, this.onDndUploadDragEnter)));
         this.dndUploadEventHandlers.push(on(this.dragAndDropNode, "dragover", lang.hitch(this, this.onDndUploadDragOver)));
         this.dndUploadEventHandlers.push(on(this.dragAndDropNode, "drop", lang.hitch(this, this.onDndUploadDrop)));
      },

      /**
       * 
       *
       * @instance
       * @param {object} e HTML5 drag and drop event
       */
      onDndUploadDragEnter: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__onDndUploadDragEnter(e) {
         if (dom.isDescendant(e.target, this.dragAndDropNode) &&
             this.checkApplicable(e.target, "onDndUploadDragEnter"))
         {
            this.addDndHighlight();

            // We want to set a timeout for showing the highlight, if a timeout has previously been set we want
            // to clear it, and then set a new timeout for this highlight. This is done in order to prevent the
            // highlight remaining displayed when the drag event leaves the element by going onto an overlaid window
            if (this.dndUploadHighlightTimeout)
            {
               clearTimeout(this.dndUploadHighlightTimeout);
            }
            this.dndUploadHighlightTimeout = setTimeout(lang.hitch(this, this.removeDndHighlight), this.dndUploadHighlightDebounceTime);
         }
         else
         {
            if (dom.isDescendant(e.target, this.dragAndDropOverlayNode))
            {
               this.alfLog("info", "Over the overlay!");
            }
            else
            {
               this.removeDndHighlight();
            }
         }
      },

      /**
       * This function is used to check that the event to be handled relates directly to the current widget. This check is needed
       * because it is possible that a widget that handles drag and drop could be a child of another widget that handles drag and 
       * drop.
       * 
       * It returns true if the supplied DOM node belongs to the current widget (e.g. "this") and that the widget has the same
       * function. This isn't a perfect solution as there is a possibility that another widget could have an identical function 
       * name but this should be unlikely. It would have been preferable to use the "isInstanceOf" function, but that would require
       * a reference to the class that this function is being declared as part of!
       * 
       * As long as the function stops the event then this should not be necessary.
       * 
       * @instance
       * @param {object} domNode The DOM node that the event has occurred on
       * @param {string} currentFunctionName The name of the function being processed
       * @returns true if the current function should be executed
       */
      checkApplicable: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__checkApplicable(domNode, currentFunctionName) {
         var applicable = false;
         var widget = registry.getEnclosingWidget(domNode);
         if (!widget)
         {
            // Something odd has happened. This should never really occur since in order for this function to be
            // called a widget must have DnD capabilities added!
            this.alfLog("log", "No widget found - unexpected behaviour: ", this);
         }
         else if (widget !== this && 
                  typeof widget[currentFunctionName] === "function" &&
                  widget.dndUploadEnabled === true)
         {
            // The event relates to a different widget
            this.alfLog("debug", "Related drag enter detected: ", this.id);
         }
         else
         {
            // The event relates to the current instance
            this.alfLog("debug", "Unrelated drag enter detected", this.id);
            applicable = true;
         }
         return applicable;
      },

      /**
       * Clean up any previously created event handlers stored in the 
       * [dndUploadEventHandlers]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#dndUploadEventHandlers}
       * array.
       * 
       * @instance
       * @since 1.0.41
       */
      removeDndUploadHandlers: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__removeDndUploadHandlers() {
         if (this.dndUploadEventHandlers)
         {
            array.forEach(this.dndUploadEventHandlers, function(handle){ handle.remove(); });
         }
         this.dndUploadEventHandlers = [];
      },

      /**
       * It's important that the drag over event is handled and that "preventDefault" is called on it. If this is 
       * not done then the "drop" event will not be processed.
       *
       * @instance
       * @param {object} e HTML5 drag and drop event
       */
      onDndUploadDragOver: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__onDndUploadDragOver(e) {
         e.stopPropagation();
         e.preventDefault();
      },
      
      /**
       * Fired when an object starts getting dragged. The event is swallowed because we only want to 
       * allow drag and drop events that begin outside the browser window (e.g. for files). This prevents
       * users attempting to drag and drop the document and folder images as if they could re-arrange
       * the document lib structure.
       *
       * @instance
       * @param {object} e HTML5 drag and drop event
       */
      swallowDragStart: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__swallowDragStart(e) {
         e.stopPropagation();
         e.preventDefault();
      },  
      
      /**
       * Fired when an object is dragged onto any node in the document body (unless the node has
       * been explicitly overridden to invoke another function). Swallows the event.
       *
       * @instance
       * @param {object} e HTML5 drag and drop event
       * 
       */
      swallowDragEnter: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__swallowDragEnter(e) {
         e.stopPropagation();
         e.preventDefault();
      },

      /**
       * Fired when an object is dragged over any node in the document body (unless the node has
       * been explicitly overridden to invoke another function). Updates the drag behaviour to
       * indicate that drops are not allowed and then swallows the event.
       *
       * @instance
       * @param {object} e HTML5 drag and drop event
       */
      swallowDragOver: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__swallowDragOver(e) {
         e.dataTransfer.dropEffect = "none";
         e.stopPropagation();
         e.preventDefault();
      },

      /**
       * Fired when an object is dropped onto any node in the document body (unless the node has
       * been explicitly overridden to invoke another function). Swallows the event to prevent
       * default browser behaviour (i.e. attempting to open the file).
       *
       * @instance
       * @param e {object} HTML5 drag and drop event
       */
      swallowDrop: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__swallowDrop(e) {
         this.alfLog("log", "Swallowing drop");
         e.stopPropagation();
         e.preventDefault();
      },

      /**
       * This should be overridden to add highlighting when an item is dragged over the target.
       * 
       * @instance
       */
      addDndHighlight: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__addDragEnterHighlight() {
         if (this.dragAndDropNode)
         {
            // Create a new node for indicating that a drag and drop upload is possible.
            if (!this.dragAndDropOverlayNode)
            {
               // NOTE: We are deliberately creating an svg element here in order to retain IE10 support.
               //       Firefox, Chrome and IE11 would support pointer-events none on any element, but IE10
               //       only supports this on SVG elements.
               this.dragAndDropOverlayNode = domConstruct.create("svg", {
                  className: "alfresco-documentlibrary-_AlfDndDocumentUploadMixin__overlay"
               }, win.body());

               var pNode = domConstruct.create("p", {
                  className: "alfresco-documentlibrary-_AlfDndDocumentUploadMixin__overlay__info"
               }, this.dragAndDropOverlayNode);

               if (this.dndUploadHighlightText)
               {
                  domConstruct.create("span", {
                     className: "alfresco-documentlibrary-_AlfDndDocumentUploadMixin__overlay__info__title",
                     innerHTML: this.message(this.dndUploadHighlightText)
                  }, pNode);
                  domConstruct.create("br", {}, pNode);
               }
               domConstruct.create("img", {
                  className: "alfresco-documentlibrary-_AlfDndDocumentUploadMixin__overlay__info__icon",
                  src: require.toUrl("alfresco/documentlibrary/css/images/") + this.dndUploadHighlightImage
               }, pNode);
            }
            
            this.setDndHighlightDimensions();
            domClass.add(this.dragAndDropNode, "alfresco-documentlibrary-_AlfDndDocumentUploadMixin--dndHighlight");
            domClass.add(this.dragAndDropOverlayNode, "alfresco-documentlibrary-_AlfDndDocumentUploadMixin__overlay--display");
         }
      },

      /**
       * This sets the position and dimensions of the 
       * [dragAndDropOverlayNode]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#dragAndDropOverlayNode}
       * 
       * @instance
       * @overridable
       * @since 1.0.42
       */
      setDndHighlightDimensions: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__setDndHighlightDimensions() {
         var computedStyle = domStyle.getComputedStyle(this.dragAndDropNode);
         var dndNodeDimensions = domGeom.getMarginBox(this.dragAndDropNode, computedStyle);
         var dndNodePosition = domGeom.position(this.dragAndDropNode);
         domStyle.set(this.dragAndDropOverlayNode, {
            height: dndNodeDimensions.h + "px",
            width: dndNodeDimensions.w + "px",
            top: dndNodePosition.y + "px",
            left: dndNodePosition.x + "px"
         });
      },
      
      /**
       * This should be overridden to remove highlighting when an item is dragged out of the target
       * 
       * @instance
       */
      removeDndHighlight: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__addDragEnterHighlight() {
         if (this.dragAndDropNode)
         {
            domClass.remove(this.dragAndDropNode, "alfresco-documentlibrary-_AlfDndDocumentUploadMixin--dndHighlight");
            if (this.dragAndDropOverlayNode)
            {
               domClass.remove(this.dragAndDropOverlayNode, "alfresco-documentlibrary-_AlfDndDocumentUploadMixin__overlay--display");
            }
         }
      },
      
      /**
       * Fired when an object is dropped onto the DocumentList DOM element.
       * Checks that files are present for upload, determines the target (either the current document list or
       * a specific folder rendered in the document list and then calls on the DNDUpload singleton component
       * to perform the upload.
       *
       * @instance
       * @param {object} evt HTML5 drag and drop event
       */
      onDndUploadDrop: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__onDndUploadDrop(evt) {
         try
         {
            // Only perform a file upload if the user has *actually* dropped some files!
            this.alfLog("log", "Upload drop detected", evt);
            if (evt.dataTransfer.files !== undefined && evt.dataTransfer.files !== null && evt.dataTransfer.files.length > 0)
            {
               this.removeDndHighlight();
               var destination = this._currentNode ? this._currentNode.nodeRef : null;
               var config = this.getUploadConfig();
               var defaultConfig = {
                  destination: destination,
                  siteId: null,
                  containerId: null,
                  uploadDirectory: null,
                  updateNodeRef: null,
                  description: "",
                  overwrite: false,
                  thumbnails: "doclib",
                  username: null
               };
               var updatedConfig = lang.mixin(defaultConfig, config);

               // Check to see whether or not the generated upload configuration indicates
               // that an existing node will be created or not. If node is being updated then
               // we need to generate an intermediary step to capture version and comments...
               if (updatedConfig.overwrite === false)
               {
                  // Set up a response topic for receiving notifications that the upload has completed...
                  var responseTopic = this.generateUuid();
                  this._uploadSubHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onFileUploadComplete), true);

                  this.alfPublish("ALF_UPLOAD_REQUEST", {
                     alfResponseTopic: responseTopic,
                     files: evt.dataTransfer.files,
                     targetData: updatedConfig
                  }, true);
               }
               else
               {
                  // TODO: Check that only one file has been dropped and issue error...
                  this.publishUpdateRequest(updatedConfig, evt.dataTransfer.files);
               }
            }
            else
            {
               this.alfLog("error", "A drop event was detected, but no files were present for upload: ", evt.dataTransfer);
            }
         }
         catch(exception)
         {
            this.alfLog("error", "The following error occurred when files were dropped onto the Document List: ", exception);
         }
         // Remove the drag highlight...
         this.removeDndHighlight();

         // Destroy the overlay node (required for views that will re-render all the contents)...
         domConstruct.destroy(this.dragAndDropOverlayNode);
         this.dragAndDropOverlayNode = null;

         evt.stopPropagation();
         evt.preventDefault();
      },

      /**
       * This function publishes an update version request. It will request that a new dialog
       * be displayed containing the form controls defined in
       * [widgetsForUpdate]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#widgetsForUpdate}.
       *
       * @instance
       * @param {object} uploadConfig
       *
       * @fires ALF_CREATE_FORM_DIALOG_REQUEST
       */
      publishUpdateRequest: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__publishUpdateRequest(uploadConfig, files) {
         // TODO: Work out the next minor and major increment versions...
         // TODO: Localization required...

         // Set up a response topic for receiving notifications that the upload has completed...
         var responseTopic = this.generateUuid();
         this._uploadSubHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onFileUploadComplete), true);

         // To avoid the issue with processing payloads containing files with native
         // code in them, it is necessary to temporarily store the files in the data model...
         var filesRef = this.generateUuid();
         this.alfSetData(filesRef, files);

         this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
            dialogTitle: "Update",
            dialogConfirmationButtonTitle: "Continue Update",
            dialogCancellationButtonTitle: "Cancel",
            formSubmissionTopic: "ALF_UPLOAD_REQUEST",
            formSubmissionPayloadMixin: {
               alfResponseTopic: responseTopic,
               filesRefs: filesRef,
               targetData: uploadConfig
            },
            fixedWidth: true,
            widgets: lang.clone(this.widgetsForUpdate)
         }, true);
      },

      /**
       * This defines the form controls to include in an update version dialog that 
       * is displayed whenever a user attempts to drag and drop a new version onto
       * an existing node.
       *
       * @instance
       * @type {array}
       */
      widgetsForUpdate: [
         {
            name: "alfresco/forms/controls/RadioButtons",
            config: {
               label: "This version has",
               name: "targetData.majorVersion",
               value: "false",
               optionsConfig: {
                  fixed: [
                     { label: "Minor changes", value: "false" },
                     { label: "Major changes", value: "true" }
                  ]
               }
            }
         },
         {
            name: "alfresco/forms/controls/TinyMCE",
            config: {
               label: "Comments",
               name: "targetData.description",
               value: ""
            }
         }
      ],
      
      /**
       * This function makes a best guess at constructing upload configuration, but it can be overridden if required or if the attempt
       * at configuration construction is not appropriate. 
       * 
       * When overriding the function should return an object with the following
       * attributes:
       * - uploadDirectoryName
       * - destination (optional - required if siteId, containerId and uploadDirectory are not provided)
       * - siteId (optional - required if destination is not provide)
       * - containerId (optional - required if destination is not provide)
       * - uploadDirectory (optional - required if destination is not provide)
       * 
       * 
       * @instance
       * @returns {object}
       */
      getUploadConfig: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__getUploadConfig() {
         var config = null;
         if (this.currentItem &&
             this.currentItem.jsNode &&
             this.currentItem.jsNode.isContainer)
         {
            // Best guess configuration for a container node...
            try
            {
               config = {
                  destination: this.currentItem.node.nodeRef
               };
            }
            catch (e)
            {
               this.alfLog("warn", "Failed to generate upload configuration", e);
            }
         }
         else if (this.currentItem &&
                  this.currentItem.jsNode &&
                  this.currentItem.jsNode.isContainer === false)
         {
            // Best guess configuration for a node...
            try
            {
               config = {
                  updateNodeRef: this.currentItem.node.nodeRef,
                  overwrite: true,
                  majorVersion: false,
                  destination: null
               };
            }
            catch (e)
            {
               this.alfLog("warn", "Failed to generate upload configuration", e);
            }
         }
         else if (this._currentNode &&
                  this._currentNode.parent &&
                  this._currentNode.parent.nodeRef)
         {
            try
            {
               // Best guess for document list view...
               config = {
                  destination: this._currentNode.parent.nodeRef
               };
            }
            catch (e)
            {
               this.alfLog("warn", "Failed to generate upload configuration", e);
            }
            
         }
         return config;
      },
      
      /**
       * This function is called once the document upload is complete. It publishes a request to reload the
       * current document list data.
       * 
       * @instance
       */
      onFileUploadComplete: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__onFileUploadComplete() {
         this.alfLog("log", "Upload complete");
         this.alfUnsubscribeSaveHandles([this._uploadSubHandle]);

         // Intentionally pass publishGlobal as false, global publication will still occur if publishToParent
         // is true (and parentPubSubScope is global) or publishToParent is false and pubSubScope is global.
         // This has been added as a work around specifically to address the issue of Thumbnail uploads that 
         // need to generate payloads and set scopes *before* clicks occur to maintain "open in new tab" support
         this.alfPublish(this.reloadDataTopic, {}, false, this.publishToParent);
      }
   });
});