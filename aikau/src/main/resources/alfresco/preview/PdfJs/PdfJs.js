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
 * <p>This is a plugin for the [AlfDocumentPreview]{@link module:alfresco/preview/AlfDocumentPreview}
 * widget that provides the ability to render PDF documents using the Mozilla pdf.js project 
 * (https://github.com/mozilla/pdf.js).</p>
 * <p>The code was adapted from a YUI2 based code that was originally a Share Extras (http://share-extras.github.io/)
 * project and was then integrated into Alfresco Share for version 5.0. It has since be updated to
 * remove the YUI2 dependencies and work independently of Alfresco Share.</p>
 * 
 * @module alfresco/preview/PdfJs/PdfJs
 * @extends module:alfresco/preview/AlfDocumentPreviewPlugin
 * @mixes module:alfresco/core/ResizeMixin 
 * @mixes module:alfresco/core/FileSizeMixin
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/core/ObjectProcessingMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @author Will Abson
 * @author Peter Löfgren
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "alfresco/preview/AlfDocumentPreviewPlugin", 
        "alfresco/core/FileSizeMixin",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/core/Core",
        "service/constants/Default",
        "alfresco/preview/PdfJs/PdfJsConstants",
        "alfresco/preview/PdfJs/DocumentView",
        "alfresco/preview/PdfJs/PDFFindController",
        "alfresco/core/WidgetsCreator",
        "alfresco/layout/AlfTabContainer",
        "dojo/_base/lang",
        "dojo/dom-geometry", 
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/html",
        "dojo/sniff",
        "dojo/io-query",
        "dojo/window",
        "dojo/on",
        "jquery"], 
        function(declare, AlfDocumentPreviewPlugin, FileSizeMixin, CoreWidgetProcessing, ObjectProcessingMixin, AlfCore, AlfConstants, 
                 PdfJsConstants, DocumentView, PDFFindController, WidgetsCreator, AlfTabContainer, lang, domGeom, 
                 domConstruct, domClass, domStyle, html, has, ioQuery, win, on, $) {
   
   return declare([AlfDocumentPreviewPlugin, CoreWidgetProcessing, ObjectProcessingMixin, FileSizeMixin, AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/PdfJs.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/PdfJs.properties"}],


      /**
       * Declares the dependencies on PdfJs dependencies.
       * 
       * @instance
       * @type {String[]}
       */
      nonAmdDependencies: ["/js/lib/pdfjs/compatibility.js",
                           "/js/lib/pdfjs/pdf.js",
                           "/js/lib/pdfjs/pdf.worker.js",
                           "/js/lib/3rd-party/spin.js"],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/PdfJs.css"}]
       */
      cssRequirements: [{cssFile:"./css/PdfJs.css"}],

      /**
       * Configuration attributes
       * 
       * @property attributes
       * @type object
       */
      attributes: {

         /**
          * Decides if the node's content or one of its thumbnails shall be
          * displayed. Leave it as it is if the node's content shall be used. Set
          * to a custom thumbnail definition name if the node's thumbnail contains
          * the PdfJs to display.
          * 
          * @instance
          * @type {String}
          * @default null
          */
         src : null,

         /**
          * Maximum file size in bytes which should be displayed. Note that this refers to 
          * the size of the original file and not the PDF rendition, which may be larger or 
          * smaller than this value. Empty or non-numeric string means no limit.
          * 
          * @instance
          * @type String
          * @default ""
          */
         srcMaxSize: "",

         /**
          * Skipbrowser test, mostly for developer to force test loading. Valid
          * options "true" "false" as String.
          * 
          * @instance
          * @type String
          * @default "false"
          */
         skipbrowsertest : "false",

         /**
          * Default zoom level for new documents
          * 
          * @instance
          * @type String
          * @default "auto"
          */
         defaultScale : "auto",

         /**
          * Multipler for zooming in/out
          * 
          * @instance
          * @type String
          * @default "1.1"
          */
         scaleDelta : "1.1",

         /**
          * Minimum scale level to use when auto-scaling a document
          * 
          * @instance
          * @type String
          * @default "0.65"
          */
         autoMinScale : "0.65",
         autoMinScaleMobile: "0.525",

         /**
          * Maximum scale level to use when auto-scaling a document
          * 
          * @instance
          * @type String
          * @default "1.25"
          */
         autoMaxScale : "1.25",

         /**
          * Layout to use to display pages, "single" (one page per row) or "multi" (multiple pages per row)
          * 
          * @instance
          * @type String
          * @default "multi"
          */
         pageLayout : "multi",

         /**
          * Whether text overlays on pages should be disabled. Overlays allow users to select text
          * content in their browser but reduce rendering performance.
          * 
          * @instance
          * @type String
          * @default "false"
          */
         disableTextLayer : "false",

         /**
          * Whether to use HTML5 browser storage to persist the page number and zoom level of previously-viewed documents
          * 
          * @instance
          * @type String
          * @default "true"
          */
         useLocalStorage : "true",

         /**
          * If the user came from the search page, should the search feature be automatically triggered?
          * 
          * @instance
          * @type String
          * @default "true"
          */
         autoSearch : "false",

         /**
          * Should progresse loading be used?
          *
          * @instance
          * @type String
          * @default "false"
          */
         progressiveLoading: "false",

         /**
          * Disabled page Linking.
          * Page linking should only be enabled on specific pages
          *
          * @instance
          * @type boolean
          * @default true
          */
         disabledPageLinking: true
      },

      /**
       * Cached PDF document, once loaded from the server
       * 
       * @instance
       * @type {object}
       * @default null
       */
      pdfDocument : null,

      /**
       * Current page number
       * 
       * @instance
       * @type int
       * @default 1
       */
      pageNum : 1,

      /**
       * Cached pages from the PDF doc
       * 
       * @instance
       * @type {array}
       * @default []
       */
      pages : [],

      /**
       * Cached page text from the document, for searching purposes
       * 
       * @instance
       * @type {array}
       * @default []
       */
      pageText : [],

      /**
       * Total number of pages in the current document
       * 
       * @instance
       * @type int
       * @default 0
       */
      numPages : 0,

      /**
       * 
       * 
       * @instance
       * @type object
       * @default {}
       */
      widgets : {},

      /**
       * Whether the page view is maximised within the client
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      maximized : false,

      /**
       * Stored configuration for this particular document, including page number and zoom level. Persisted to local browser storage.
       * 
       * @instance
       * @type {object}
       * @default {}
       */
      documentConfig : {},

      /**
       * Whether the previewer is embedded in a dashlet
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      inDashlet : false,

      /**
       * Store the pdf.js url for use with PDFJS.workerSrc (4.2 Specific).
       *
       * @instance
       * @type {string}
       * @default empty string
       */
      workerSrc : "",
      
      /**
       * Current scale selection from the drop-down scale menu
       * 
       * @instance
       * @type {string}
       * @default null
       */
      currentScaleSelection: null,

      /**
       * Tests if the plugin can be used in the users browser.
       * 
       * @instance
       * @return {String} Returns nothing if the plugin may be used, otherwise
       *         returns a message containing the reason it cant be used as a
       *         string.
       */
      report: function alfresco_preview_PdfJs_PdfJs__report() {
         var isBrowserSupported = true,
            skipBrowserTest = this.attributes.skipbrowsertest === "true",
            srcMaxSize = this.attributes.srcMaxSize;

         if (srcMaxSize.match(/^\d+$/) && this.previewManager.size > parseInt(srcMaxSize, 10))
         {
            return this.previewManager.message("PdfJs.tooLargeFile", Alfresco.util.formatFileSize(this.previewManager.size), parseInt(srcMaxSize, 10));
         }

         if (!skipBrowserTest)
         {
            // Test if canvas is supported
            if (this._isCanvasSupported())
            {
               // Do some engine test as well, some support canvas but not the
               // rest for full html5
               if (has("webkit") > 0 && has("webkit") < 534)
               {
                  // http://en.wikipedia.org/wiki/Google_Chrome
                  // Guessing for the same for safari
                  isBrowserSupported = false;
               }
               // It actually works with ie9, but lack fo support for typed
               // arrays makes performance terrible.
               if (has("ie") > 0 && has("ie") < 10)
               {
                  isBrowserSupported = false;
               }
               if (has("mozilla") > 0 && has("mozilla") < 5)
               {
                  // http://en.wikipedia.org/wiki/Gecko_(layout_engine)
                  // NOTE: Was originally a YAHOO check for Gecko, now a Dojo check for Mozilla
                  isBrowserSupported = false;
               }
            }
            else
            {
               isBrowserSupported = false;
            }
         }

         // If browser is not supported then report this, and we should fall back to another viewer
         if (!isBrowserSupported)
         {
            return this.previewManager.message("label.browserReport", "&lt;canvas&gt; element");
         }
      },

      /**
       * Sniff test to determine if the browser supports the canvas element
       * 
       * <p>Based on http://stackoverflow.com/questions/2745432/best-way-to-detect-that-html5-canvas-is-not-supported</p>
       * 
       * @instance
       */
      _isCanvasSupported: function alfresco_preview_PdfJs_PdfJs___isCanvasSupported() {
         var elem = document.createElement("canvas");
         return !!(elem.getContext && elem.getContext("2d"));
      },

      /**
       * Display the node.
       * 
       * @instance
       */
      display: function alfresco_preview_PdfJs_PdfJs__display() {
         this.inherited(arguments);

         // this.inDashlet = Dom.getAncestorByClassName(this.previewManager.getPreviewerElement(), "body") != null ||
         //                  Dom.getAncestorByClassName(this.previewManager.getPreviewerElement(), "yui-panel") != null;
         this.inDashlet = false;

         // Remove the annoying 'Setting up Previewer' message
         this.previewManager.getPreviewerElement().innerHTML = "";

         this.workerSrc = AlfConstants.URL_CONTEXT + "res/js/lib/pdfjs/pdf.worker.js";
         this._loadDocumentConfig();

         // Setup display options, page linking only works for specific pages
         // TODO: Need to fix this because the PAGEID information isn't readily available!
         // this.attributes.disabledPageLinking = (Alfresco.constants.PAGEID==='document-details') ? false : true;
         this.attributes.disabledPageLinking = true;

         // Set page number
         if (this.disabledPageLinking)
         {
            this.pageNum = this.documentConfig.pageNum ? parseInt(this.documentConfig.pageNum, 10) : this.pageNum;
         }
         else
         {
            var uri = window.location.hash.replace("#", ""); // NOTE: Not sure why we do this, just following the ported code...
            var query = uri.substring(uri.indexOf("?") + 1, uri.length);
            var urlParams = ioQuery.queryToObject(query);
            // var urlParams = Alfresco.util.getQueryStringParameters(window.location.hash.replace("#", ""));
            this.pageNum = urlParams.page || (this.documentConfig.pageNum ? parseInt(this.documentConfig.pageNum, 10) : this.pageNum);
         }
         this.pageNum = parseInt(this.pageNum, 10); // If value from urlParams.page is used it's a string
         this.onViewerLoaded();

         // Window resize behaviour
         this.alfSetupResizeSubscriptions(this.onRecalculatePreviewLayout, this);

         // // Hash change behaviour
         // Event.addListener(window, "hashchange", this.onWindowHashChange, this, true);

         // // Window unload behaviour
         // Event.addListener(window, "beforeunload", this.onWindowUnload, this, true);
      },

      /**
       * Handler for successful load of the viewer markup webscript
       * 
       * @instance
       */
      onViewerLoaded: function alfresco_preview_PdfJs_PdfJs__onViewerLoaded(p_obj) {
         // jshint unused:false
         // This is the construction of a previewer elements...
         this.controls = domConstruct.create("div", {"class": "controls"}, this.previewManager.getPreviewerElement());
         this.sidebar = domConstruct.create("div", {"class": "sidebar"}, this.previewManager.getPreviewerElement());
         this.viewer = domConstruct.create("div", {"class": "viewer documentView"}, this.previewManager.getPreviewerElement());

         // Set up viewer
         if (this.attributes.pageLayout === "multi")
         {
            domClass.add(this.viewer, "multiPage");
         }
         domClass.add(this.previewManager.getPreviewerElement(), "alfresco-preview-PdfJs");
         
         // Clone the widgets for controls model and then process any instance tokens, primarily this is done
         // to ensure that sensible IDs are given to each of the components, e.g. IDs that are prefixed by the
         // ID of this widget...
         var clonedWidgets = lang.clone(this.widgetsForControls);
         this.processObject(["processInstanceTokens"], clonedWidgets); 
         this.processWidgets(lang.clone(clonedWidgets), this.controls);

         this.alfSubscribe(PdfJsConstants.SHOW_SIDEBAR_TOPIC, lang.hitch(this, this.onSidebarToggle));
         this.alfSubscribe(PdfJsConstants.ZOOM_SET_TOPIC, lang.hitch(this, this.onZoomChange));
         this.alfSubscribe(PdfJsConstants.ZOOM_OUT_TOPIC, lang.hitch(this, this.onZoomOut));
         this.alfSubscribe(PdfJsConstants.ZOOM_IN_TOPIC, lang.hitch(this, this.onZoomIn));
         this.alfSubscribe(PdfJsConstants.PREVIOUS_PAGE_TOPIC, lang.hitch(this, this.onPagePrevious));
         this.alfSubscribe(PdfJsConstants.NEXT_PAGE_TOPIC, lang.hitch(this, this.onPageNext));
         this.alfSubscribe(PdfJsConstants.SET_PAGE_REQUEST_TOPIC, lang.hitch(this, this.onSetPageRequest));
         this.alfSubscribe(PdfJsConstants.SET_PAGE_CONFIRMATION_TOPIC, lang.hitch(this, this.onSetPageConfirmation));
         this.alfSubscribe(PdfJsConstants.SHOW_SEARCH_TOOLS_TOPIC, lang.hitch(this, this.onToggleSearchBar));
         this.alfSubscribe(PdfJsConstants.SHOW_LINK_INFO_TOPIC, lang.hitch(this, this.onLinkClick));
         this.alfSubscribe(PdfJsConstants.UPDATE_LINK_URL_REQUEST_TOPIC, lang.hitch(this, this.onLinkUpdateRequest));
         this.alfSubscribe(PdfJsConstants.FIND_TOPIC, lang.hitch(this, this.onFindQuery));
         this.alfSubscribe(PdfJsConstants.FIND_NEXT_TOPIC, lang.hitch(this, this.onFindNext));
         this.alfSubscribe(PdfJsConstants.FIND_PREVIOUS_TOPIC, lang.hitch(this, this.onFindPrevious));
         this.alfSubscribe(PdfJsConstants.HIGHLIGHT_ALL_TOPIC, lang.hitch(this, this.onFindChangeHighlight));
         this.alfSubscribe(PdfJsConstants.MATCH_CASE_TOPIC, lang.hitch(this, this.onFindChangeMatchCase));
         this.alfSubscribe(PdfJsConstants.DOWNLOAD_ORIGINAL_TOPIC, lang.hitch(this, this.onDownloadClick));
         this.alfSubscribe(PdfJsConstants.DOWNLOAD_PDF_TOPIC, lang.hitch(this, this.onDownloadPDFClick));
         this.alfSubscribe(PdfJsConstants.VIEWER_SCROLL_TOPIC, lang.hitch(this, this.onViewerScroll));
         this.alfSubscribe("ALF_FULL_WINDOW", lang.hitch(this, this.onMaximizeClick));
         this.alfSubscribe("ALF_FULL_SCREEN", lang.hitch(this, this.onMaximizeClick));
         this.alfSubscribe(PdfJsConstants.PASSWORD_RELOAD, lang.hitch(this, this._passwordReload));
         this.alfSubscribe(PdfJsConstants.SHOW_INTERFACE_TOPIC, lang.hitch(this, this.onInterfaceToggle));
         this.alfSubscribe(PdfJsConstants.SHOW_NOTIFICATION_TOPIC, lang.hitch(this, this.onNotificationToggle));

         // Set height of the container and the viewer area
         this._setPreviewerElementHeight();
         this._setViewerHeight();

         // Load the PDF itself
         this._loadPdf();

         // TODO: Reinstate as appropriate...
         // // Keyboard shortcuts
         // if (Alfresco.constants.PAGEID === 'document-details')
         // {
         //    var findShortcutHandler = function findShortcutHandler(type, args) {
         //       var e = args[1];
         //       if ((e.ctrlKey || e.metaKey) && this.widgets.searchBarToggle)
         //       {
         //          Event.stopEvent(e);
         //          e.newValue = (!this.widgets.searchDialog || !this.widgets.searchDialog.cfg.getProperty("visible"));
         //          this.widgets.searchBarToggle.set("checked", !this.widgets.searchBarToggle.get("checked"));
         //       }
         //    }
         //    var fullscreenShortcutHandler = function fullscreenShortcutHandler(type, args) {
         //       var e = args[1];
         //       if (e.ctrlKey || e.metaKey)
         //       {
         //          Event.stopEvent(e);
         //          this.onFullScreen(e);
         //       }
         //    }
            
         //    new YAHOO.util.KeyListener(document, { keys: 37 }, { // left arrow
         //       fn : this.onPagePrevious,
         //       scope : this,
         //       correctScope : true
         //    }).enable();
         //    new YAHOO.util.KeyListener(document, { keys: 39 }, { // right arrow
         //       fn : this.onPageNext,
         //       scope : this,
         //       correctScope : true
         //    }).enable();
         //    new YAHOO.util.KeyListener(document, { keys: 70, ctrl: true }, { // Ctrl+F
         //       fn : findShortcutHandler,
         //       scope : this,
         //       correctScope : true
         //    }).enable();
         //    new YAHOO.util.KeyListener(document, { keys: 13, ctrl: true }, { // Ctrl+Enter
         //       fn : fullscreenShortcutHandler,
         //       scope : this,
         //       correctScope : true
         //    }).enable();
            
         //    if (YAHOO.env.ua.os == "macintosh")
         //    {
         //       new YAHOO.util.KeyListener(document, { keys: 13 }, { // Cmd+Enter
         //          fn : fullscreenShortcutHandler,
         //          scope : this,
         //          correctScope : true
         //       }).enable();
         //       new YAHOO.util.KeyListener(document, { keys: 70 }, { // Cmd+F
         //          fn : findShortcutHandler,
         //          scope : this,
         //          correctScope : true
         //       }).enable();
         //    }
            
         //    Event.addListener(window, "fullscreenchange", this.onFullScreenChange, this, true);
         //    Event.addListener(window, "mozfullscreenchange", this.onFullScreenChange, this, true);
         //    Event.addListener(window, "webkitfullscreenchange", this.onFullScreenChange, this, true);
         // }
         // new YAHOO.util.KeyListener(document, { keys: 27 }, { // escape
         //    fn: function (e) {
         //       if (this.maximized)
         //       {
         //          this.onMaximizeClick();
         //       }
         //    },
         //    scope : this,
         //    correctScope : true
         // }).enable();
      },

      /**
       * Set the height of the viewer area where content is displayed, so that it occupies the height of the parent previewer element
       * minus the menu bar.
       * 
       * @instance
       */
      _setViewerHeight: function alfresco_preview_PdfJs_PdfJs__setViewerHeight() {

         var computedStyle = domStyle.getComputedStyle(this.viewer.parentNode);
         var previewRegion = domGeom.getContentBox(this.viewer.parentNode, computedStyle);
         computedStyle = domStyle.getComputedStyle(this.controls);
         var controlRegion = domGeom.getContentBox(this.controls, computedStyle);
         var controlHeight = !this.fullscreen ? controlRegion.h : 0;
         var newHeight = previewRegion.h - controlHeight -1; // Allow for bottom border
         
         if (newHeight === 0)
         {
            if (!this.maximized)
            {
               // var dialogPane;
               var previewHeight;
               var docHeight = $(document).height(),
                   clientHeight = $(window).height();
               // Take the smaller of the two
               previewHeight = ((docHeight < clientHeight) ? docHeight : clientHeight) - 220;
               // Leave space for header etc.
               newHeight = previewHeight - 10 - controlHeight -1; // Allow for bottom border of 1px
            }
            else
            {
               newHeight = $(window).height() - controlHeight - 1;
            }
         }
         
         if (!this.fullscreen)
         {
            this.alfLog("log","Setting viewer height to " + newHeight + "px (toolbar " + controlHeight + "px, container " + previewRegion.h + "px");
            domStyle.set(this.viewer, "height", newHeight.toString() + "px");
            domStyle.set(this.sidebar, "height", newHeight.toString() + "px");
         }
         else
         {
            this.alfLog("log","Setting viewer height to 100% (full-screen)");
            domStyle.set(this.viewer, "height", "100%");
         }
      },

      /**
       * Removes the Spinner indicating that the PDF document is being loaded. Also removes the
       * subscription created to listen for the PDF loading event (as this should only occur once).
       * 
       * @instance
       */
      removeSpinner: function alfresco_preview_PdfJs_PdfJs__removeSpinner() {
         this.spinner.stop();
         this.alfUnsubscribe(this.waitForPdfHandle);
      },

      /**
       * Fetch the PDF content and display it
       * 
       * @instance
       */
      _loadPdf: function alfresco_preview_PdfJs_PdfJs___loadPdf(params) {
         // Workaround for ALF-17458
         this.previewManager.name = this.previewManager.name.replace(/[^\w_\-\. ]/g, "");
         var fileurl = this.attributes.src ? this.previewManager.getThumbnailUrl(this.attributes.src) : this.previewManager.getContentUrl();
         
         // Add the full protocol + host as pdf.js require this
         if (fileurl.substr(0, 4).toLowerCase() !== "http")
         {
            fileurl = window.location.protocol + "//" + window.location.host + fileurl;
         }

         params = params || {};
         params.url = fileurl;

         // Protect against Spinner not being loaded
         if (typeof window.Spinner === "function")
         {
            // Add the loading spinner to the viewer area
            this.spinner = new Spinner({
               lines: 13, // The number of lines to draw
               length: 7, // The length of each line
               width: 4, // The line thickness
               radius: 10, // The radius of the inner circle
               corners: 1, // Corner roundness (0..1)
               rotate: 0, // The rotation offset
               color: "#666", // #rgb or #rrggbb
               speed: 1, // Rounds per second
               trail: 60, // Afterglow percentage
               shadow: false, // Whether to render a shadow
               hwaccel: false, // Whether to use hardware acceleration
               className: "spinner", // The CSS class to assign to the spinner
               zIndex: 2e9, // The z-index (defaults to 2000000000)
               top: "auto", // Top position relative to parent in px
               left: "auto" // Left position relative to parent in px
            }).spin(this.viewer);
            this.waitForPdfHandle = this.alfSubscribe(PdfJsConstants.PDF_LOADED_TOPIC, lang.hitch(this, this.removeSpinner));
         }
         else
         {
            this.alfLog("error","spinner.js is not loaded!");
         }

         // Set the worker source
         PDFJS.workerSrc = this.workerSrc;
         // Set the char map source dir
         PDFJS.cMapUrl = "/cmaps/";
         PDFJS.cMapPacked = true;

         // PDFJS range request for progessive loading
         // We also test if it may already be set to true by compatibility.js tests, some browsers do not support it.
         if (this.attributes.progressiveLoading === "true" && PDFJS.disableRange !== true)
         {
             PDFJS.disableRange = false;
             // disable autofetch - retrieve just the ranges needed to display
             PDFJS.disableAutoFetch = false;
         }
         else
         {
             PDFJS.disableRange = true;
         }

         this.alfLog("log","Using PDFJS.disableRange=" + PDFJS.disableRange + " PDFJS.disableAutoFetch:" + PDFJS.disableAutoFetch);
         this.alfLog("log","Loading PDF file from " + fileurl);

         PDFJS.getDocument(params).then
         (
            lang.hitch(this, this._onGetDocumentSuccess),
            lang.hitch(this, this._onGetDocumentFailure)
         );
      },
      
      /**
       * PDF document retieved successfully
       * 
       * @instance
       */
      _onGetDocumentSuccess: function alfresco_preview_PdfJs_PdfJs___onGetDocumentSuccess(pdf) {
         this.pdfDocument = pdf;
         this.numPages = this.pdfDocument.numPages;
         this.alfLog("log","Rendering PDF with fingerprint " + pdf.fingerprint + " for " + this.previewManager.name);
         this._renderPdf();
         this._updatePageControls();
         this.alfPublish(PdfJsConstants.PDF_LOADED_TOPIC, {});
      },

      /**
       * TODO: Need to handle failures (e.g. replace YUI/Share code calls)
       * Error encountered retrieving PDF document
       * 
       * @instance
       */
      _onGetDocumentFailure: function alfresco_preview_PdfJs_PdfJs___onGetDocumentFailure(exception) {

         // Stop the spinner
         if (this.spinner)
         {
            this.spinner.stop();
         }

         if(exception)
         {
            
            this.alfLog("warn","Could not load PDF due to error " + exception.name + " (code " + exception.code + ")");

            // We have a password exception
            if (exception.name === "PasswordException") {

               // Hide the interface
               this.alfPublish(PdfJsConstants.SHOW_INTERFACE_TOPIC);

               // Show a notification
               this.alfPublish(PdfJsConstants.SHOW_NOTIFICATION_TOPIC, {
                  message: this.message("pdfjs.error.pdfpassword")
               });

               // Password required - launch AlfDialog
               this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
                  dialogTitle: exception.code === PDFJS.PasswordResponses.NEED_PASSWORD ? "pdfjs.password.dialog.title.required" : "pdfjs.password.dialog.title.incorrect",
                  dialogConfirmationButtonTitle: "pdfjs.password.dialog.confirmation",
                  dialogCancellationButtonTitle: "pdfjs.password.dialog.cancellation",
                  formSubmissionTopic: PdfJsConstants.PASSWORD_RELOAD,
                  widgets: [
                     {
                        name: "alfresco/forms/controls/Password",
                        config: {
                           id: this.id + "_PASSWORD_BOX",
                           label: "pdfjs.password.dialog.password.label",
                           description: "pdfjs.password.dialog.password.description",
                           name: "password",
                           requirementConfig: {
                              initialValue: true
                           }
                        }
                     }
                  ],
                  fixedWidth: true
               }, true);

            }

            // Any other exception
            else
            {

               var loadingErrorMessage = this.message("pdfjs.error.pdfload");
               if (exception.name === "InvalidPDFException") {
                  loadingErrorMessage = this.message("pdfjs.error.invalidpdf");
               }

               // Hide the interface
               this.alfPublish(PdfJsConstants.SHOW_INTERFACE_TOPIC);

               // Show a notification
               this.alfPublish(PdfJsConstants.SHOW_NOTIFICATION_TOPIC, {
                  message: loadingErrorMessage
               });

               // Display an error using the notification service
               this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
                  message: loadingErrorMessage
               });
            }
         }
      },

      /**
       * Function to reload the pdf with a password supplied
       * 
       * @instance
       * @param  {string} password
       */
      _passwordReload: function alfresco_preview_PdfJs_PdfJs___passwordReload(payload) {
         var password = lang.getObject("password", false, payload);
         if (password && password.length > 0)
         {
            // Hide the notification
            this.alfPublish(PdfJsConstants.SHOW_NOTIFICATION_TOPIC);

            // Show the interface
            this.alfPublish(PdfJsConstants.SHOW_INTERFACE_TOPIC);

            this._loadPdf({
               password: password
            });
         }
      },

      /**
       * Function to toggle interface elements
       * 
       * @instance
       */
      onInterfaceToggle: function alfresco_preview_PdfJs_PdfJs__onInterfaceToggle() {
         var display = (domStyle.get(this.controls, "display") === "block") ? "none" : "block";
         domStyle.set(this.controls, "display", display);
         domStyle.set(this.sidebar, "display", display);
         domStyle.set(this.viewer, "display", display);
      },

      /**
       * Function to display and or toggle a notification element
       * 
       * @instance
       * @param {object} payload
       */
      onNotificationToggle: function alfresco_preview_PdfJs_PdfJs__onNotificationToggle(payload) {
         var message = lang.getObject("message", false, payload);
         if(!this.notification)
         {
            this.notification = domConstruct.create("div", {"class": "notification", "style": "display:none;"}, this.previewManager.domNode, "first");
         }
         if(message && message.length)
         {
            html.set(this.notification, message);
         }
         var display = (domStyle.get(this.notification, "display") === "block") ? "none" : "block";
         domStyle.set(this.notification, "display", display);
      },

      /**
       * Display the PDF content in the container
       * 
       * @instance
       */
      _renderPdf : function alfresco_preview_PdfJs_PdfJs___renderPdf() {
         // TODO: look at only retrieving first N pages until they are displayed
         var pagePromises = [], pagesRefMap = {}, pagesCount = this.numPages;
         for ( var i = 1; i <= pagesCount; i++)
         {
            pagePromises.push(this.pdfDocument.getPage(i));
         }
         var pagesPromise = Promise.all(pagePromises);
         var destinationsPromise = this.pdfDocument.getDestinations();

         var renderPageContainer = lang.hitch(this, this.renderPageContainer, pagesRefMap);
         var setDestinations = lang.hitch(this, function (destinations) {
            this.destinations = destinations;
         });
         pagesPromise.then(renderPageContainer);
         this.pagesRefMap = pagesRefMap;

         destinationsPromise.then(setDestinations);

         // outline view depends on destinations and pagesRefMap
         Promise.all([ pagesPromise, destinationsPromise ]); // .then(setupOutline);
      },

      /**
       * 
       * 
       * @instance
       * @param {object} pagesRefMap
       * @param {array} promisedPages
       */
      renderPageContainer: function alfresco_preview_PdfJs_PdfJs__renderPageContainer(pagesRefMap, promisedPages) {
         this.documentView = this.createWidget({
            name: "alfresco/preview/PdfJs/DocumentView",
            config: {
               id: this.id + "-viewer",
               name: "documentView",
               pageLayout: this.attributes.pageLayout,
               currentScale: PdfJsConstants.K_UNKNOWN_SCALE,
               defaultScale: this.documentConfig.scale ? this.documentConfig.scale : this.attributes.defaultScale,
               disableTextLayer: this.attributes.disableTextLayer === "true" || has("ios") || has("android"),
               autoMinScale : parseFloat($(window).width() > 1024 ? this.attributes.autoMinScale : this.attributes.autoMinScaleMobile),
               autoMaxScale: parseFloat(this.attributes.autoMaxScale),
               pdfJsPlugin: this,
               pdfDocument: this.pdfDocument
            }
         }, this.viewer);

         // Defer rendering
         this.thumbnailView = null;

         this.pages = promisedPages;
         this.documentView.addPages(promisedPages);

         for (var i = 0; i < promisedPages.length; i++)
         {
            var page = promisedPages[i], pageRef = page.ref;
            pagesRefMap[pageRef.num + " " + pageRef.gen + " R"] = i;
         }

         this.documentView.render();

         // Make sure we do not have a page number greater than actual pages
         if (this.pageNum > this.pdfDocument.numPages)
         {
             this.pageNum = this.pdfDocument.numPages;
             this._updatePageControls();
         }

         // Scroll to the current page, this will force the visible content to render
         this.documentView.scrollTo(this.pageNum);
         this.documentView.setActivePage(this.pageNum);

         // Update toolbar
         this._updateZoomControls();
         
         // NOTE: This section has been removed, we may or may not want to re-instate it at a later date...
         // If the user clicked through to the document details from the search page, open
         // the search dialog and perform a search for that term
         // if (this.attributes.autoSearch == "true" && document.referrer && document.referrer.indexOf("/search?") > 0)
         // {
         //    var st = Alfresco.util.getQueryStringParameter("t", document.referrer);
         //    if (st)
         //    {
         //       this.widgets.searchBarToggle.set("checked", true); // Toggle the search box on
         //       Dom.get(this.previewManager.id + "-findInput").value = st;
         //       this.onFindChange("find");
         //    }
         // }
      },

      /**
       * Handles publications from the associated [DocumentView]{@link module:alfresco/preview/PdfJs/DocumentView}
       * indicating that the viewer has been scrolled so that the page number and active page can be updated.
       * 
       * @instance
       * @param {object} payload This is expected to be an empty object.
       */
      onViewerScroll: function alfresco_preview_PdfJs_PdfJs__onViewerScroll(payload) {
         // jshint unused:false
         var newPn = this.documentView.getScrolledPageNumber();
         if (this.pageNum !== newPn)
         {
            this.pageNum = newPn;
            this._updatePageControls();
            this.documentView.setActivePage(this.pageNum);
         }
      },

      /**
       * Updates the paging controls shown in the toolbar by publishing the page number information
       * so that the "set page" menu item label can be updated (e.g. to show "1 / 20", etc) and 
       * publishing on topics to enable or disable the previous and next page menu items depending 
       * upon whether or not the first or last page of the PDF is being viewed.
       * 
       * @instance
       */
      _updatePageControls: function alfresco_preview_PdfJs_PdfJs___updatePageControls() {
         this.alfPublish(PdfJsConstants.SET_PAGE_INFO_TOPIC, {
            label: this.pageNum + " / " + this.numPages
         });
         this.alfPublish(PdfJsConstants.DISABLE_PREVIOUS_BUTTON_TOPIC, {
            value: (this.pageNum <= 1)
         });
         this.alfPublish(PdfJsConstants.DISABLE_NEXT_BUTTON_TOPIC, {
            value: (this.pageNum >= this.pdfDocument.numPages)
         });
      },

      /**
       * Update the zoom controls shown in the toolbar by publishing on topics to enable
       * and disable the zoom in an out menu items as the limits of zoom scale are reached
       * as well as publishing on a topic to update the label of "set zoom level" menu item
       * to show the current scale (as a percentage).
       * 
       * @instance
       */
      _updateZoomControls: function alfresco_preview_PdfJs_PdfJs___updateZoomControls() {
         // Update zoom controls
         var scale = this.documentView.currentScale;
         this.alfPublish(PdfJsConstants.DISABLE_ZOOM_IN_BUTTON_TOPIC, {
            value: (scale * this.attributes.scaleDelta >PdfJsConstants. K_MAX_SCALE)
         });
         this.alfPublish(PdfJsConstants.DISABLE_ZOOM_OUT_BUTTON_TOPIC, {
            value: (scale / this.attributes.scaleDelta < PdfJsConstants.K_MIN_SCALE)
         });
         var zoomLevel = Math.round(scale * 100) + "%";
         this.alfPublish(PdfJsConstants.ZOOM_SET_TOPIC, {
            value: scale,
            label: zoomLevel
         });
      },

      /**
       * Scrolls the displayed PDF to the specified page.
       * 
       * @instance
       * @param {int} n Number of the page to scroll to, must be 1 or greater.
       */
      _scrollToPage: function alfresco_preview_PdfJs_PdfJs___scrollToPage(n) {
         // Disable the documentView onScroll event temporarily
         this.documentView.removeScrollListener();

         this.documentView.scrollTo(n);
         this.documentView.setActivePage(n);
         this.pageNum = n;

         // Update toolbar controls
         this._updatePageControls();

         // Update sidebar, if visible
         // TODO define an isRendered() method on the view object
         if (this.thumbnailView && this.thumbnailView.pages && this.thumbnailView.pages[0] && this.thumbnailView.pages[0].container)
         {
            this.thumbnailView.setActivePage(this.pageNum);
         }

         // Re-add the documentView onScroll event
         if (this.scrollToPageTimeout)
         {
            clearTimeout(this.scrollToPageTimeout);
         }
         this.scrollToPageTimeout = setTimeout(lang.hitch(this.documentView, this.documentView.addScrollListener), 50);
      },

      /**
       * Navigate the viewer to the specified document outline item
       * 
       * @instance
       * @param {object} dest outline object item, from the document outline
       */
      _navigateTo: function alfresco_preview_PdfJs_PdfJs___navigateTo(dest) {
         if (typeof dest === "string")
         {
            dest = this.destinations[dest];
         }
         if (dest instanceof Array)
         {
            // dest array looks like that: <page-ref> </XYZ|FitXXX> <args..>
            var destRef = dest[0];
            var pageNumber = destRef instanceof Object ?
            this.pagesRefMap[destRef.num + " " + destRef.gen + " R"] : (destRef + 1);
            if (pageNumber > this.documentView.pages.length - 1)
            {
               pageNumber = this.documentView.pages.length - 1;
            }
            if (typeof pageNumber === "number")
            {
               this._scrollToPage(pageNumber + 1);
            }
         }
      },

      /**
       * Load configuration for the current document
       * 
       * @instance
       */
      _loadDocumentConfig: function alfresco_preview_PdfJs_PdfJs___loadDocumentConfig() {
         if (this.attributes.useLocalStorage !== "true" || !this._browserSupportsHtml5Storage())
         {
            this.documentConfig = {};
         }
         else
         {
            var base = "org.alfresco.pdfjs.document." + this.previewManager.nodeRef.replace(":/", "").replace("/", ".") + ".";
            this.documentConfig = {
               pageNum : window.localStorage[base + "pageNum"],
               scale : window.localStorage[base + "scale"]
            };
            if (this.documentConfig.scale === "null")
            {
               this.documentConfig.scale = null;
            }
         }
      },

      /**
       * Check if the web browser supports local storage
       * 
       * @instance
       * @returns {boolean} true if local storage is available, false otherwise
       */
      _browserSupportsHtml5Storage: function alfresco_preview_PdfJs_PdfJs___browserSupportsHtml5Storage() {
         try
         {
            return "localStorage" in window && window.localStorage !== null;
         }
         catch (e)
         {
            return false;
         }
      },

      /**
       * Toggle sidebar button click handler
       * 
       * @method onSidebarToggle
       */
      onSidebarToggle: function alfresco_preview_PdfJs_PdfJs__onSidebarToggle(payload) {
         // jshint unused:false
         var sbshown = domStyle.get(this.sidebar, "display") === "block";
         domStyle.set(this.sidebar, "display", sbshown ? "none" : "block");
         if (sbshown)
         {
            domClass.remove(this.viewer, "sideBarVisible");
         }
         else
         {
            // Create the tab container the first time the sidebar is displayed...
            if (!this.tabContainer)
            {
               // TODO: Break the widget model out into an instance variable for configurability...
               var tabNode = domConstruct.create("div", {}, this.sidebar);
               var wc = new WidgetsCreator({
                  widgets: [
                     {
                        name: "alfresco/layout/AlfTabContainer",
                        config: {
                           pubSubScope: this.pubSubScope,
                           parentPubSubScope: this.parentPubSubScope,
                           currentItem: this.currentItem,
                           currentMetadata: this.currentMetadata,
                           groupMemberships: this.groupMemberships,
                           dataScope: this.dataScope,
                           widgets: [
                              {
                                 title: "pdfjs.sidebar.thumbnails.title",
                                 name: "alfresco/preview/PdfJs/DocumentView",
                                 assignTo: "thumbnailView",
                                 config: {
                                    id: this.id + "-thumbnails",
                                    name: "thumbnailView",
                                    pageLayout: "single",
                                    defaultScale: "page-width",
                                    disableTextLayer: true,
                                    pdfJsPlugin: this,
                                    pagesToAdd: this.pages
                                 }
                              },
                              {
                                 title: "pdfjs.sidebar.outline.title",
                                 name: "alfresco/preview/PdfJs/Outline",
                                 assignTo: "outlineView",
                                 config: {
                                    pdfJsPlugin: this
                                 }
                              }
                           ]
                        }
                     }
                  ],
                  callback: lang.hitch(this, this.renderThumbnails)
               });
               wc.buildWidgets(tabNode);
            }
            domClass.add(this.viewer, "sideBarVisible");
         }
         this.documentView.alignRows();
         this.documentView.setScale(this.documentView.parseScale(this.currentScaleSelection ? this.currentScaleSelection : this.attributes.defaultScale));
         this._scrollToPage(this.pageNum);
         this.documentView.renderVisiblePages();
      },

      /**
       * Callback when the tab container is created. This will render the initial view of thumbnails.
       *
       * @instance
       * @param {array} widgets The array of widgets that were created when processing the sidebar
       */
      renderThumbnails: function alfresco_preview_PdfJs_PdfJs__renderThumbnails(widgets) {
         this.tabContainer = widgets[0];
         this.thumbnailView = lang.getObject("0.thumbnailView", false, widgets);
         if (this.thumbnailView && this.thumbnailView.pages.length > 0 && !this.thumbnailView.pages[0].container)
         {
            this.thumbnailView.render();
            for ( var i = 0; i < this.thumbnailView.pages.length; i++)
            {
               on(this.thumbnailView.pages[i].container, "click", lang.hitch(this, this.onThumbnailClicked, {pn: i+1}));
            }
            // Scroll to the current page, this will force the visible content to render
            this.thumbnailView.scrollTo(this.pageNum);
            this.thumbnailView.setActivePage(this.pageNum);
         }
      },

      /**
       * This function is called whenever an individual thumbnail in the sidebar is clicked. It will automatically
       * navigate the user to the page in the PDF represented by that thumbnail image.
       *
       * @instance
       */
      onThumbnailClicked: function alfresco_preview_PdfJs_PdfJs__onThumbnailClicked(obj) {
         this.thumbnailView.setActivePage(obj.pn);
         this.documentView.scrollTo(obj.pn);
      },

      /**
       * This function is called when the user clicks on the set page menu item. It will display a dialog
       * containing a form control that allows the page number to be set. Only valid page numbers can be 
       * entered.
       *
       * @instance
       * @param {object} payload The payload from the menu item click.
       */
      onSetPageRequest: function alfresco_preview_PdfJs_PdfJs__onSetPageRequest(payload) {
         // jshint unused:false
         this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
            dialogTitle: "pdfjs.page.set.dialog.title",
            dialogConfirmationButtonTitle: "pdfjs.page.set.dialog.confirmation",
            dialogCancellationButtonTitle: "pdfjs.page.set.dialog.cancellation",
            formSubmissionTopic: this.pubSubScope + PdfJsConstants.SET_PAGE_CONFIRMATION_TOPIC,
            widgets: [
               {
                  name: "alfresco/forms/controls/NumberSpinner",
                  config: {
                     id: this.id + "_SET_PAGE_CONTROL",
                     label: "pdfjs.page.set.textbox.label",
                     description: "pdfjs.page.set.textbox.description",
                     name: "pageNumber",
                     min: 1,
                     max: this.numPages,
                     value: this.pageNum
                  }
               }
            ],
            fixedWidth: true
         }, true);
      },

      /**
       * This will be called when the user has selected the page that they wish to jump to.
       *
       * @instance
       * @param {object} payload The payload containing the details of the page to skip to.
       */
      onSetPageConfirmation: function alfresco_preview_PdfJs_PdfJs__onSetPageConfirmation(payload) {
         var pn = lang.getObject("pageNumber", false, payload);
         if (!pn || pn < 1 || pn > this.numPages)
         {
            // This will require that the alfresco/service/NotificationService is on the page
            this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
               message: this.previewManager.message("error.badpage")
            }, true);
         }
         else
         {
            this.pageNum = pn;
            this._scrollToPage(this.pageNum);
         }
      },

      /**
       * Previous page button or key clicked
       * 
       * @instance
       */
      onPagePrevious: function alfresco_preview_PdfJs_PdfJs__onPagePrevious(e_obj) {
         // jshint unused:false
         if (this.pageNum <= 1)
         {
            return;
         }
         this.pageNum--;
         this._scrollToPage(this.pageNum);
      },

      /**
       * Next button or key clicked
       * 
       * @instance
       */
      onPageNext : function alfresco_preview_PdfJs_PdfJs__onPageNext(e_obj) {
         // jshint unused:false
         if (this.pageNum < this.pdfDocument.numPages)
         {
            this.pageNum++;
            this._scrollToPage(this.pageNum);
         }
      },

      /**
       * The first time that the [onToggleSearchBar]{@link module:alfresco/preview/PdfJs/PdfJs#onToggleSearchBar}
       * function is called this will be instantiated with a new instance of a [PDFFindController]
       * {@link module:alfresco/preview/PdfJs/PDFFindController} that can then be used to search the document.
       *
       * @instance
       * @type {object}
       * @default null
       */
      _findController: null,

      /**
       * Handles requests to show and hide the search tools bar. The first time this is called requesting that
       * the search tools be displayed, [_findController]{@link module:alfresco/preview/PdfJs/PdfJs#_findController}
       * will be instantiated with a new [PDFFindController]{@link module:alfresco/preview/PdfJs/PDFFindController}.
       * 
       * @instance
       */
      onToggleSearchBar: function alfresco_preview_PdfJs_PdfJs__onToggleSearchBar(payload) {
         if (payload.value === "show")
         {
            if (!this._findController)
            {
               this._findController = new PDFFindController({
                  pdfPageSource: this.documentView
               });
               this._findController.resolveFirstPage();
            }
            this._findController.reset();
            this._findController.extractText();
         }
         else if (this._findController)
         {
            this._searchReset();
            this._findController.active = false;
         }
         this.onRecalculatePreviewLayout();
      },

      /**
       * This function resets the highlights by searching for nothing
       * 
       * @instance
       */
      _searchReset: function alfresco_preview_PdfJs_PdfJs___searchReset() {
         this.alfPublish(PdfJsConstants.FIND_TOPIC, {"query":""});
      },

      /**
       * The query to use for searching within the PDF text.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      _query: null,

      /**
       * 
       * 
       * @instance
       * @param {object} payload The payload indicating whether or not to match case on search
       */
      onFindQuery: function alfresco_preview_PdfJs_PdfJs__onFindQuery(payload) {
         if (payload.query === this._query)
         {
            this.onFindChange("findagain");
         }
         else
         {
            this._query = payload.query;
            this.onFindChange("find");
         }
      },

      /**
       * Indicates whether or not to search backwards through the PDF when finding the next hit
       * that matches the current query.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      _findPrevious: false,

      /**
       * 
       * 
       * @instance
       * @param {object} payload
       */
      onFindNext: function alfresco_preview_PdfJs_PdfJs__onFindNext(payload) {
         // jshint unused:false
         this._findPrevious = false;
         this.onFindChange("findagain");
      },

      /**
       * 
       * 
       * @instance
       * @param {object} payload
       */
      onFindPrevious: function alfresco_preview_PdfJs_PdfJs__onFindPrevious(payload) {
         // jshint unused:false
         this._findPrevious = true;
         this.onFindChange("findagain");
      },

      /**
       * Indicates whether or not case should be matched when searching the PDF.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      _matchCase: false,

      /**
       * 
       * 
       * @instance
       * @param {object} payload The payload indicating whether or not to match case on search
       */
      onFindChangeMatchCase: function alfresco_preview_PdfJs_PdfJs__onFindChangeMatchCase(payload) {
         this._matchCase = (payload.value === true);
         this.onFindChange("findcasesensitivitychange");
      },

      /**
       * Indicates whether or not all search hits should be highlighted when searching.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      _highlightAll: false,

      /**
       * 
       * 
       * @instance
       * @param {object} payload The payload indicating whether or not to highlight all search hits
       */
      onFindChangeHighlight: function alfresco_preview_PdfJs_PdfJs__onFindChangeHighlight(payload){
         this._highlightAll = (payload.value === true);
         this.onFindChange("findhighlightallchange");
      },

      /**
       * Text value changed in Find text input field
       * 
       * @instance
       */
      onFindChange: function alfresco_preview_PdfJs_PdfJs__onFindChange(eventid) {
         if (this._query)
         {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventid, true, true, {
               query: this._query,
               caseSensitive: this._matchCase,
               highlightAll: this._highlightAll,
               findPrevious: this._findPrevious
            });
            window.dispatchEvent(event);
         }
      },

      /**
       * Zoom out menu item clicked. This will calculate a new zoom scale which will then be
       * applied to the [DocumentView]{@link module:alfresco/preview/PdfJs/DocumentView}.
       * 
       * @instance
       * @param {object} payload The payload from the zoom out menu item
       */
      onZoomOut: function alfresco_preview_PdfJs_PdfJs__onZoomOut(payload) {
         // jshint unused:false
         var newScale = Math.max(PdfJsConstants.K_MIN_SCALE, this.documentView.currentScale / this.attributes.scaleDelta);
         this.documentView.setScale(this.documentView.parseScale(newScale));
         this._scrollToPage(this.pageNum);
         this._updateZoomControls();
      },

      /**
       * Zoom in menu item clicked. This will calculate a new zoom scale which will then be
       * applied to the [DocumentView]{@link module:alfresco/preview/PdfJs/DocumentView}.
       * 
       * @instance
       * @param {object} payload The payload from the zoom in menu item
       */
      onZoomIn : function alfresco_preview_PdfJs_PdfJs__onZoomIn(payload) {
         // jshint unused:false
         var newScale = Math.min(PdfJsConstants.K_MAX_SCALE, this.documentView.currentScale * this.attributes.scaleDelta);
         this.documentView.setScale(this.documentView.parseScale(newScale));
         this._scrollToPage(this.pageNum);
         this._updateZoomControls();
      },

      /**
       * Zoom level changed via the zoom menu button
       * 
       * @instance
       * @param {object} payload The payload containing the details of the new zoom level
       */
      onZoomChange : function alfresco_preview_PdfJs_PdfJs__onZoomChange(payload) {
         if (this.currentScaleSelection !== payload.value)
         {
            this.currentScaleSelection = payload.value;
            this.documentView.setScale(this.documentView.parseScale(payload.value));
            this._scrollToPage(this.pageNum);
            this._updateZoomControls();
         }
      },

      /**
       * Download Original document menu link click handler
       * 
       * @instance
       */
      onDownloadClick : function alfresco_preview_PdfJs_PdfJs__onDownloadClick(p_obj) {
         // jshint unused:false
         this.alfPublish("ALF_NAVIGATE_TO_PAGE", { url: this.previewManager.getContentUrl(true).replace("api/node","slingshot/node"),
                                                   type: "FULL_PATH",
                                                   target: "CURRENT"}, true);
      },

      /**
       * Download PDF click handler (for thumbnailed content only)
       * 
       * @instance
       */
      onDownloadPDFClick : function alfresco_preview_PdfJs_PdfJs__onDownloadPDFClick(p_obj) {
         // jshint unused:false
         this.alfPublish("ALF_NAVIGATE_TO_PAGE", { url: this.previewManager.getThumbnailUrl(this.attributes.src) + "&a=true",
                                                   type: "FULL_PATH",
                                                   target: "CURRENT"}, true);
      },

      /**
       * Called on selection of either full screen or full window modes. This function does not
       * actually handle the full screen or full window capability (this is achieved by placing the
       * main [AlfDocumentPreview]{@link module:alfresco/preview/AlfDocumentPreview} widget into
       * a [FullScreenWidgets]{@link module:alfresco/layout/FullScreenWidgets} widget). Instead this
       * simply handles the associated document resizing for the new container.
       * 
       * @instance
       * @param {object} payload Indicates whether or not maximize has been enabled or disabled.
       */
      onMaximizeClick : function alfresco_preview_PdfJs_PdfJs__onMaximizeClick(payload) {
         this.maximized = payload.selected;
         this._setPreviewerElementHeight();
         this._setViewerHeight();
         this.documentView.setScale(this.documentView.parseScale(this.currentScaleSelection ? this.currentScaleSelection : this.attributes.defaultScale));
         this._scrollToPage(this.pageNum);
         this.documentView.alignRows();
         this.documentView.renderVisiblePages();
         if (this.thumbnailView)
         {
            this.thumbnailView.renderVisiblePages();
         }
      },

      /**
       * This function is called whenever the link control bar is displayed or hidden and calls 
       * [onRecalculatePreviewLayout]{@link module:alfresco/preview/PdfJs/PdfJs#onRecalculatePreviewLayout}
       * to re-render the main PDF display and then calls [onLinkUpdateRequest]
       * {@link module:alfresco/preview/PdfJs/PdfJs#onLinkUpdateRequest} to ensure that the displayed link
       * reflects the currently selected page.
       * 
       * @instance
       * @param {object} payload The payload from the show/hide link controls toggle.
       */
      onLinkClick : function alfresco_preview_PdfJs_PdfJs__onLinkClick(payload) {
         // jshint unused:false
         this.onRecalculatePreviewLayout();
         this.onLinkUpdateRequest();
      },

      /**
       * This function handles requests to update the link URL value to reflect the currently selected
       * page in the PDF.
       *
       * @instance
       */
      onLinkUpdateRequest: function alfresco_preview_PdfJs_PdfJs__onLinkUpdateRequest(payload) {
         // jshint unused:false
         var link = window.location.href.replace(window.location.hash, "") + "#page=" + this.pageNum;
         this.alfPublish(PdfJsConstants.SET_LINK_URL_TOPIC, {
            value: link
         });
      },

      /**
       * Handler for window resize event
       * 
       * @instance
       */
      onRecalculatePreviewLayout: function alfresco_preview_PdfJs_PdfJs__onRecalculatePreviewLayout() {
         if (this.documentView)
         {
            this.alfLog("log","onRecalculatePreviewLayout");
            this._setPreviewerElementHeight();
            this._setViewerHeight();
            this.documentView.onResize();
            this.documentView.setScale(this.documentView.parseScale(this.currentScaleSelection ? this.currentScaleSelection : this.attributes.defaultScale));
            this._scrollToPage(this.pageNum);
            this.documentView.alignRows();
            this.documentView.renderVisiblePages();
         }
         if (this.thumbnailView)
         {
            this.thumbnailView.renderVisiblePages();
         }
      },

      /**
       * Handler for window hashchange event
       * 
       * See http://caniuse.com/#search=hash
       * 
       * @instance
       */
      onWindowHashChange: function alfresco_preview_PdfJs_PdfJs__onWindowHashChange(p_obj) {
         // jshint unused:false
         if(this.disabledPageLinking)
         {
            // Ignore page hash change
         }
         else
         {    
            // Set page number
            var urlParams = Alfresco.util.getQueryStringParameters(window.location.hash.replace("#", ""));
            var pn = urlParams.page;
            if (pn)
            {
               if (pn > this.pdfDocument.numPages)
               {
                   pn = this.pdfDocument.numPages;
               }
               else if(pn < 1)
               {
                   pn = 1;
               }

               this.pageNum = parseInt(pn, 10);
               this._scrollToPage(this.pageNum);
            }
         }
      },

      /**
       * Window unload event handler to save document configuration to local storage
       * 
       * @instance
       */
      onWindowUnload: function alfresco_preview_PdfJs_PdfJs__onWindowUnload() {
         if (this.attributes.useLocalStorage === "true" && this._browserSupportsHtml5Storage() && this.documentView)
         {
            var base = "org.alfresco.pdfjs.document." + this.previewManager.nodeRef.replace(":/", "").replace("/", ".") + ".";
            if (this.pageNum)
            {
               window.localStorage[base + "pageNum"] = this.pageNum;
            }
            if (this.documentView.lastScale)
            {
               window.localStorage[base + "scale"] = this.documentView.lastScale;
            }
            if (this.widgets.sidebarButton)
            {
               window.localStorage[base + "sidebar-enabled"] = this.widgets.sidebarButton.get("checked");
            }
         }
      },

      /**
       * The widget model for building the plugin controls.
       *
       * @instance
       * @type {array}
       */
      widgetsForControls: [
         {
            name: "alfresco/layout/VerticalWidgets",
            config: {
               widgets: [
                  {
                     name: "alfresco/menus/AlfMenuBar",
                     config: {
                        widgets: [
                           {
                              id: "{id}_SHOW_SIDEBAR",
                              name: "alfresco/menus/AlfMenuBarToggle",
                              config: {
                                 checked: true,
                                 subscriptionTopic: PdfJsConstants.SHOW_SIDEBAR_TOPIC,
                                 subscriptionAttribute: "value",
                                 checkedValue: "show",
                                 onConfig: {
                                    // label: "pdfjs.sidebar.show.label",
                                    title: "pdfjs.sidebar.show.title",
                                    iconClass: "alf-pdfjs-sidebar-off-icon",
                                    publishTopic: PdfJsConstants.SHOW_SIDEBAR_TOPIC,
                                    publishPayload: {
                                       value: "show"
                                    }
                                 },
                                 offConfig: {
                                    // label: "pdfjs.sidebar.hide.label",
                                    title: "pdfjs.sidebar.hide.title",
                                    iconClass: "alf-pdfjs-sidebar-on-icon",
                                    publishTopic: PdfJsConstants.SHOW_SIDEBAR_TOPIC,
                                    publishPayload: {
                                       value: "hide"
                                    }
                                 }
                              }
                           },
                           {
                              id: "{id}_PREVIOUS_PAGE",
                              name: "alfresco/menus/AlfMenuBarItem",
                              config: {
                                 label: "pdfjs.page.previous.label",
                                 title: "pdfjs.page.previous.title",
                                 iconClass: "alf-pdfjs-previous-icon",
                                 disablementTopic: PdfJsConstants.DISABLE_PREVIOUS_BUTTON_TOPIC,
                                 publishTopic: PdfJsConstants.PREVIOUS_PAGE_TOPIC
                              }
                           },
                           {
                              id: "{id}_NEXT_PAGE",
                              name: "alfresco/menus/AlfMenuBarItem",
                              config: {
                                 label: "pdfjs.page.next.label",
                                 title: "pdfjs.page.next.title",
                                 iconClass: "alf-pdfjs-next-icon",
                                 disablementTopic: PdfJsConstants.DISABLE_NEXT_BUTTON_TOPIC,
                                 publishTopic: PdfJsConstants.NEXT_PAGE_TOPIC
                              }
                           },
                           {
                              id: "{id}_SET_PAGE",
                              name: "alfresco/menus/AlfMenuBarItem",
                              config: {
                                 label: "pdfjs.page.set.label",
                                 title: "pdfjs.page.set.title",
                                 publishTopic: PdfJsConstants.SET_PAGE_REQUEST_TOPIC,
                                 selectionTopic: PdfJsConstants.SET_PAGE_INFO_TOPIC
                              }
                           },
                           {
                              id: "{id}_ZOOM_OUT",
                              name: "alfresco/menus/AlfMenuBarItem",
                              config: {
                                 label: "pdfjs.zoom.out.label",
                                 title: "pdfjs.zoom.out.title",
                                 iconClass: "alf-pdfjs-zoom-out-icon",
                                 disablementTopic: PdfJsConstants.DISABLE_ZOOM_OUT_BUTTON_TOPIC,
                                 publishTopic: PdfJsConstants.ZOOM_OUT_TOPIC
                              }
                           },
                           {
                              id: "{id}_ZOOM_IN",
                              name: "alfresco/menus/AlfMenuBarItem",
                              config: {
                                 label: "pdfjs.zoom.in.label",
                                 title: "pdfjs.zoom.out.title",
                                 iconClass: "alf-pdfjs-zoom-in-icon",
                                 disablementTopic: PdfJsConstants.DISABLE_ZOOM_IN_BUTTON_TOPIC,
                                 publishTopic: PdfJsConstants.ZOOM_IN_TOPIC
                              }
                           },
                           {
                              id: "{id}_ZOOM_SET_SELECT_MENU",
                              name: "alfresco/menus/AlfMenuBarSelect",
                              config: {
                                 title: "pdfjs.zoom.select.title",
                                 selectionTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                 widgets: [
                                    {
                                       name: "alfresco/menus/AlfMenuGroup",
                                       config: {
                                          widgets: [
                                             {
                                                id: "{id}_ZOOM_25",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "25%",
                                                   title: "pdfjs.zoom.25.title",
                                                   value: "0.25",
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "25%"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_50",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "50%",
                                                   title: "pdfjs.zoom.50.title",
                                                   value: "0.5",
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "50%"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_75",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "75%",
                                                   title: "pdfjs.zoom.75.title",
                                                   value: "0.75",
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "75%"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_100",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "100%",
                                                   title: "pdfjs.zoom.100.title",
                                                   value: "1",
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "100%"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_125",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "125%",
                                                   title: "pdfjs.zoom.125.title",
                                                   value: "1.25",
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "125%"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_150",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "150%",
                                                   title: "pdfjs.zoom.150.title",
                                                   value: "1.5",
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "150%"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_200",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "200%",
                                                   title: "pdfjs.zoom.200.title",
                                                   value: "2",
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "200%"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_400",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "400%",
                                                   title: "pdfjs.zoom.400.title",
                                                   value: "4",
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "400%"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_PAGE_WIDTH",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "pdfjs.zoom.page-width.label",
                                                   title: "pdfjs.zoom.page-width.title",
                                                   value: PdfJsConstants.ZOOM_LEVEL_PAGE_WIDTH,
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "pdfjs.zoom.page-width.label"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_TWO_PAGE_WIDTH",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "pdfjs.zoom.two-page-width.label",
                                                   title: "pdfjs.zoom.two-page-width.title",
                                                   value: PdfJsConstants.ZOOM_LEVEL_TWO_PAGE_WIDTH,
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "pdfjs.zoom.two-page-width.label"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_PAGE_FIT",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "pdfjs.zoom.page-fit.label",
                                                   title: "pdfjs.zoom.page-fit.title",
                                                   value: PdfJsConstants.ZOOM_LEVEL_PAGE_FIT,
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "pdfjs.zoom.page-fit.label"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_TWO_PAGE_FIT",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "pdfjs.zoom.two-page-fit.label",
                                                   title: "pdfjs.zoom.two-page-fit.title",
                                                   value: PdfJsConstants.ZOOM_LEVEL_TWO_PAGE_FIT,
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "pdfjs.zoom.two-page-fit.label"
                                                   }
                                                }
                                             },
                                             {
                                                id: "{id}_ZOOM_AUTO",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "pdfjs.zoom.auto.label",
                                                   title: "pdfjs.zoom.auto.title",
                                                   value: PdfJsConstants.ZOOM_LEVEL_AUTO,
                                                   group: "ALF_PDFJS_ZOOM_GROUP",
                                                   publishTopic: PdfJsConstants.ZOOM_SET_TOPIC,
                                                   checked: false,
                                                   publishPayload: {
                                                      label: "pdfjs.zoom.auto.label"
                                                   }
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              id: "{id}_MAXIMISE_MENU",
                              name: "alfresco/menus/AlfMenuBarPopup",
                              config: {
                                 label: "pdfjs.maximise.menu.label",
                                 title: "pdfjs.maximise.menu.title",
                                 widgets: [
                                    {
                                       name: "alfresco/menus/AlfMenuGroup",
                                       config: {
                                          widgets: [
                                             {
                                                id: "{id}_FULL_WINDOW",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "pdfjs.maximise.full-window.label",
                                                   title: "pdfjs.maximise.full-window.title",
                                                   iconClass: "alf-fullscreen-icon",
                                                   group: "PDFJS_MAXIMISE_GROUP",
                                                   checked: false,
                                                   publishTopic: "ALF_FULL_WINDOW"
                                                }
                                             },
                                             {
                                                id: "{id}_FULL_SCREEN",
                                                name: "alfresco/menus/AlfCheckableMenuItem",
                                                config: {
                                                   label: "pdfjs.maximise.full-screen.label",
                                                   title: "pdfjs.maximise.full-screen.title",
                                                   iconClass: "alf-fullscreen-icon",
                                                   group: "PDFJS_MAXIMISE_GROUP",
                                                   checked: false,
                                                   publishTopic: "ALF_FULL_SCREEN"
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              id: "{id}_DOWNLOAD_MENU",
                              name: "alfresco/menus/AlfMenuBarPopup",
                              config: {
                                 label: "pdfjs.download.menu.label",
                                 title: "pdfjs.download.menu.title",
                                 iconClass: "alf-pdfjs-download-icon",
                                 widgets: [
                                    {
                                       name: "alfresco/menus/AlfMenuGroup",
                                       config: {
                                          widgets: [
                                             {
                                                id: "{id}_DOWNLOAD_ORIGINAL",
                                                name: "alfresco/menus/AlfMenuItem",
                                                config: {
                                                   label: "pdfjs.download.original.label",
                                                   title: "pdfjs.download.original.title",
                                                   publishTopic: PdfJsConstants.DOWNLOAD_ORIGINAL_TOPIC
                                                }
                                             },
                                             {
                                                id: "{id}_DOWNLOAD_PDF",
                                                name: "alfresco/menus/AlfMenuItem",
                                                config: {
                                                   label: "pdfjs.download.pdf.label",
                                                   title: "pdfjs.download.pdf.title",
                                                   publishTopic: PdfJsConstants.DOWNLOAD_PDF_TOPIC,
                                                   renderFilter: [
                                                      {
                                                         target: "attributes",
                                                         property: "src",
                                                         values: ["pdf"]
                                                      }
                                                   ]
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              id: "{id}_SHOW_LINK",
                              name: "alfresco/menus/AlfMenuBarToggle",
                              config: {
                                 checked: true,
                                 subscriptionTopic: PdfJsConstants.SHOW_LINK_INFO_TOPIC,
                                 subscriptionAttribute: "value",
                                 checkedValue: "hide",
                                 onConfig: {
                                    // label: "pdfjs.link.show.label",
                                    title: "pdfjs.link.show.title",
                                    iconClass: "alf-pdfjs-link-icon",
                                    publishTopic: PdfJsConstants.SHOW_LINK_INFO_TOPIC,
                                    publishPayload: {
                                       value: "hide"
                                    }
                                 },
                                 offConfig: {
                                    // label: "pdfjs.link.hide.label",
                                    title: "pdfjs.link.hide.title",
                                    iconClass: "alf-pdfjs-link-icon",
                                    publishTopic: PdfJsConstants.SHOW_LINK_INFO_TOPIC,
                                    publishPayload: {
                                       value: "show"
                                    }
                                 }
                              }
                           },
                           {
                              id: "{id}_SHOW_SEARCH",
                              name: "alfresco/menus/AlfMenuBarToggle",
                              config: {
                                 checked: true,
                                 subscriptionTopic: PdfJsConstants.SHOW_SEARCH_TOOLS_TOPIC,
                                 subscriptionAttribute: "value",
                                 checkedValue: "hide",
                                 onConfig: {
                                    // label: "pdfjs.search.show.label",
                                    title: "pdfjs.search.show.title",
                                    iconClass: "alf-pdfjs-search-icon",
                                    publishTopic: PdfJsConstants.SHOW_SEARCH_TOOLS_TOPIC,
                                    publishPayload: {
                                       value: "hide"
                                    }
                                 },
                                 offConfig: {
                                    // label: "pdfjs.search.hide.label",
                                    title: "pdfjs.search.hide.title",
                                    iconClass: "alf-pdfjs-search-icon",
                                    publishTopic: PdfJsConstants.SHOW_SEARCH_TOOLS_TOPIC,
                                    publishPayload: {
                                       value: "show"
                                    }
                                 }
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "{id}_SEARCH_CONTROLS",
                     name: "alfresco/layout/LeftAndRight",
                     config: {
                        additionalCssClasses: "search-controls",
                        visibilityConfig: {
                           initialValue: false,
                           rules: [
                              {
                                 topic: PdfJsConstants.SHOW_SEARCH_TOOLS_TOPIC,
                                 attribute: "value",
                                 is: ["show"]
                              }
                           ]
                        },
                        widgetMarginLeft: "5",
                        widgetMarginRight: "5",
                        widgets: [
                           {
                              id: "{id}_SEARCH_FORM",
                              name: "alfresco/forms/SingleTextFieldForm",
                              config: {
                                 useHash: true,
                                 okButtonLabel: "pdfjs.search.find.label", // TODO: Localization
                                 okButtonPublishTopic: PdfJsConstants.FIND_TOPIC,
                                 okButtonPublishGlobal: false,
                                 okButtonIconClass: "alf-white-search-icon",
                                 okButtonClass: "call-to-action",
                                 textFieldName: "query",
                                 textBoxIconClass: "alf-search-icon",
                                 textBoxCssClasses: "hiddenlabel"
                              }
                           },
                           {
                              name: "alfresco/menus/AlfMenuBar",
                              config: {
                                 widgets: [
                                    {
                                       id: "{id}_FIND_PREVIOUS",
                                       name: "alfresco/menus/AlfMenuBarItem",
                                       config: {
                                          label: "pdfjs.search.find.previous.label",
                                          title: "pdfjs.search.find.previous.title",
                                          iconClass: "alf-pdfjs-previous-icon",
                                          publishTopic: PdfJsConstants.FIND_PREVIOUS_TOPIC
                                       }
                                    },
                                    {
                                       id: "{id}_FIND_NEXT",
                                       name: "alfresco/menus/AlfMenuBarItem",
                                       config: {
                                          label: "pdfjs.search.find.next.label",
                                          title: "pdfjs.search.find.next.title",
                                          iconClass: "alf-pdfjs-next-icon",
                                          publishTopic: PdfJsConstants.FIND_NEXT_TOPIC
                                       }
                                    },
                                    {
                                       id: "{id}_HIGHLIGHT",
                                       name: "alfresco/menus/AlfMenuBarToggle",
                                       config: {
                                          checked: true,
                                          subscriptionTopic: PdfJsConstants.HIGHLIGHT_ALL_TOPIC,
                                          subscriptionAttribute: "value",
                                          checkedValue: false,
                                          onConfig: {
                                             label: "pdfjs.search.highlight-all.label",
                                             title: "pdfjs.search.highlight-all.title",
                                             iconClass: "alf-pdfjs-highlight-all-off-icon",
                                             publishTopic: PdfJsConstants.HIGHLIGHT_ALL_TOPIC,
                                             publishPayload: {
                                                value: false
                                             }
                                          },
                                          offConfig: {
                                             label: "pdfjs.search.highlight-one.label",
                                             title: "pdfjs.search.highlight-one.title",
                                             iconClass: "alf-pdfjs-highlight-all-on-icon",
                                             publishTopic: PdfJsConstants.HIGHLIGHT_ALL_TOPIC,
                                             publishPayload: {
                                                value: true
                                             }
                                          }
                                       }
                                    },
                                    {
                                       id: "{id}_MATCH_CASE",
                                       name: "alfresco/menus/AlfMenuBarToggle",
                                       config: {
                                          checked: true,
                                          subscriptionTopic: PdfJsConstants.MATCH_CASE_TOPIC,
                                          subscriptionAttribute: "value",
                                          checkedValue: false,
                                          onConfig: {
                                             label: "pdfjs.search.match-case.label",
                                             title: "pdfjs.search.match-case.title",
                                             iconClass: "alf-pdfjs-case-sensitive-off-icon",
                                             publishTopic: PdfJsConstants.MATCH_CASE_TOPIC,
                                             publishPayload: {
                                                value: false
                                             }
                                          },
                                          offConfig: {
                                             label: "pdfjs.search.ignore-case.label",
                                             title: "pdfjs.search.ignore-case.title",
                                             iconClass: "alf-pdfjs-case-sensitive-on-icon",
                                             publishTopic: PdfJsConstants.MATCH_CASE_TOPIC,
                                             publishPayload: {
                                                value: true
                                             }
                                          }
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "{id}_LINK_CONTROLS",
                     name: "alfresco/layout/VerticalWidgets",
                     config: {
                        additionalCssClasses: "link-controls",
                        visibilityConfig: {
                           initialValue: false,
                           rules: [
                              {
                                 topic: PdfJsConstants.SHOW_LINK_INFO_TOPIC,
                                 attribute: "value",
                                 is: ["show"]
                              }
                           ]
                        },
                        widgetMarginLeft: "5",
                        widgetMarginRight: "5",
                        widgets: [
                           {
                              id: "{id}_LINK",
                              name: "alfresco/forms/controls/DojoValidationTextBox",
                              config: {
                                 label: "pdfjs.link.label",
                                 description: "pdfjs.link.description",
                                 valueSubscriptionTopic: PdfJsConstants.SET_LINK_URL_TOPIC
                              }
                           },
                           {
                              id: "{id}_UPDATE_LINK",
                              name: "alfresco/buttons/AlfButton",
                              config: {
                                 label: "pdfjs.link.update.label",
                                 publishTopic: PdfJsConstants.UPDATE_LINK_URL_REQUEST_TOPIC,
                                 additionalCssClasses: "call-to-action"
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ]
   });
});