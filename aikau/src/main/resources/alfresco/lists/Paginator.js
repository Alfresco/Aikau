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
 * <p>This module is intended to provide pagination controls for working with the
 * [AlfSortablePaginatedList]{@link module:alfresco/lists/AlfSortablePaginatedList} (and its
 * descendant widgets). It provides controls for selecting specific pages of data as well as
 * navigating back and forward between specific pages of data. It provides the ability to
 * select from a [configurable array]{@link module:alfresco/lists/Paginator#pageSizes} of page sizes.</p>
 * <p>If using with a [AlfSortablePaginatedList]{@link module:alfresco/lists/AlfSortablePaginatedList}
 * it is important to ensure that the [initial page size]{@link module:alfresco/lists/Paginator#documentsPerPage}
 * configured for the paginator matches that of the 
 * [list]{@link module:alfresco/lists/AlfSortablePaginatedList#currentPageSize} to ensure they are initially
 * in sync.</p>
 * <p>A [compact mode]{@link module:alfresco/lists/Paginator#compactMode} is provided that only rendered
 * the back and forward controls and omits the page size selection menu.</p>
 * 
 * @example <caption>Basic configuration using default page sizes:</caption>
 * {
 *    "name": "alfresco/lists/Paginator"
 * }
 *
 * @example <caption>Basic configuration using custom page sizes:</caption>
 * {
 *    "name": "alfresco/lists/Paginator",
 *    "config": {
 *       "documentsPerPage": 10,
 *       "pageSizes": [5,10,20]"
 *    }
 * }
 *
 * @example <caption>Configuration for compact mode:</caption>
 * {
 *    "name": "alfresco/lists/Paginator",
 *    "config": {
 *       "compactMode": true
 *    }
 * }
 * 
 * @module alfresco/lists/Paginator
 * @extends module:alfresco/menus/AlfMenuBar
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBar",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/menus/AlfMenuBarItem",
        "alfresco/menus/AlfMenuBarSelect",
        "alfresco/menus/AlfMenuGroups",
        "alfresco/menus/AlfMenuGroup",
        "alfresco/menus/AlfCheckableMenuItem",
        "dijit/registry",
        "dojo/dom-class",
        "dojo/Deferred",
        "dojo/when"], 
        function(declare, AlfMenuBar, _AlfDocumentListTopicMixin, _PreferenceServiceTopicMixin, lang, array, 
                 AlfMenuBarItem, AlfMenuBarSelect, AlfMenuGroups, AlfMenuGroup, AlfCheckableMenuItem, registry, domClass, Deferred, when) {

   return declare([AlfMenuBar, _AlfDocumentListTopicMixin, _PreferenceServiceTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Paginator.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Paginator.properties"}],
      
      /**
       * The label for the page back menu item.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.64
       */
      backLabel: "list.paginator.back.label",

      /**
       * Indicates whether the paginator should be displayed in "compact" mode where only
       * the back and forward buttons are displayed.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      compactMode: false,

      /**
       * Used to keep track of the current page number in the current data set
       * 
       * @instance
       * @type {number} 
       * @default
       */
      currentPage: null,

      /**
       * The style of current page number. The default is "NUMBER" which indicates that just the
       * page number should be displayed. The only alternative in the current version is
       * "X_OF_Y" which will render the label in the form "1 of 4" (as in page 1 of 4).
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.64
       */
      currentPageLabelStyle: "NUMBER",
      
      /**
       * The number of documents to show per page.
       * 
       * @instance
       * @type {number}
       * @default
       */
      documentsPerPage: 25,
      
      /**
       * The label for the page forward menu item.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.64
       */
      forwardLabel: "list.paginator.next.label",

      /**
       * This indicates whether or not the pagination controls should be hidden whilst data is being
       * loaded.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      hideWhenLoading: false,

      /**
       * This is the topic that is expected to be published when data requests are made. This is only
       * used when [hideWhenLoading]{@link module:alfresc/lists/Paginator#hideWhenLoading} is configured
       * to be true and is used to set up visibility configuration so that the pagination controls
       * can be hidden on data load requests.
       *
       * @instance
       * @type {string}
       * @default 
       */
      loadDataPublishTopic: null,

      /**
       * This is the scope that data requests are expected to be published on. It is the empty string by
       * default as this is equivilent to the global scope. This is only used when 
       * [hideWhenLoading]{@link module:alfresc/lists/Paginator#hideWhenLoading} is configured to be true.
       *
       * @instance
       * @type {string}
       */
      loadDataPublishScope: "",

      /**
       * @instance
       * @type {string}
       * @default
       */
      pageBackTopic: "ALF_PAGE_BACK",
      
      /**
       * @instance 
       * @type {string}
       * @default
       */
      pageForwardTopic: "ALF_PAGE_FORWARD",

      /**
       * This will be initialised to be a select menu for the current page.
       * 
       * @instance
       * @type {object}
       * @default
       */
      pageSelector: null,
      
      /**
       * This will be the group into which page selection item can be added.
       * 
       * @instance
       * @type {object}
       * @default
       */
      pageSelectorGroup: null,
      
      /**
       * The name of the property to access in order to retrieve the page-size preference for this widget
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.46
       */
      pageSizePreferenceName: "org.alfresco.share.documentList.documentsPerPage",

      /**
       * This can be used to configure an array of page sizes that should be displayed in the paginator.
       * If left as the default of null then an array will automatically created containing page sizes of
       * 25, 50, 75 and 100. The array should be a simple list of numbers.
       * 
       * @instance
       * @type {array}
       * @default
       */
      pageSizes: null,

      /**
       * Indicates whether or not the page selector menu should be displayed.
       * 
       * @instance
       * @type {boolean}
       * @default 
       * @since 1.0.64
       */
      showPageSelector: true,

      /**
       * The property in the response that indicates the starting index of overall data to request.
       *
       * @instance
       * @type {string}
       * @default
       */
      startIndexProperty: "startIndex",

      /**
       * Used to keep track of the total number of pages in the current data set
       * 
       * @instance
       * @type {number} 
       * @default
       */
      totalPages: null,
      
      /**
       * Used to keep track of the total number of documents in the current data set
       * 
       * @instance
       * @type {number} 
       * @default
       */
      totalRecords: null,
      
      /**
       * The property in the response that indicates the total number of results available.
       *
       * @instance
       * @type {string}
       * @default
       */
      totalResultsProperty: "totalRecords",

      /**
       * Since this widget is an implementation of an [AlfMenuBar]{@link module:alfresco/menus/AlfMenuBar} it is 
       * perfectly reasonable to add additional menu widgets (such as [menu items]{@link module:alfresco/menus/AlfMenuBarItem}
       * or [drop-down menus]{@link module:alfresco/menus/AlfMenuBarPopup}) after the main pagination controls. This
       * can be configured to be an array of such menu widgets to be displayed.
       *
       * @instance
       * @type {array}
       * @default
       */
      widgetsAfter: null,

      /**
       * Since this widget is an implementation of an [AlfMenuBar]{@link module:alfresco/menus/AlfMenuBar} it is 
       * perfectly reasonable to add additional menu widgets (such as [menu items]{@link module:alfresco/menus/AlfMenuBarItem}
       * or [drop-down menus]{@link module:alfresco/menus/AlfMenuBarPopup}) before the main pagination controls. This
       * can be configured to be an array of such menu widgets to be displayed.
       *
       * @instance
       * @type {array}
       * @default
       */
      widgetsBefore: null,

      /**
       * @instance
       * @listens documentsLoadedTopic
       * @listens docsPerpageSelectionTopic
       * @listens pageBackTopic
       * @listens pageForwardTopic
       */
      postMixInProperties: function alfresco_lists_Paginator__postMixInProperties() {
         this.alfSubscribe(this.documentsLoadedTopic, lang.hitch(this, this.onDocumentsLoaded));
         this.alfSubscribe(this.docsPerpageSelectionTopic, lang.hitch(this, this.onDocumentsPerPageChange));
         this.alfSubscribe(this.pageBackTopic, lang.hitch(this, this.onPageBack));
         this.alfSubscribe(this.pageForwardTopic, lang.hitch(this, this.onPageForward));
         this.alfSubscribe(this.documentLoadFailedTopic, lang.hitch(this, this.hideControls));

         if (this.hideWhenLoading === true && !this.visibilityConfig && !this.invisibilityConfig)
         {
            var loadRequestTopic = this.loadDataPublishScope + this.loadDataPublishTopic;
            var loadResponseTopic = loadRequestTopic + "_SUCCESS";
            this.visibilityConfig = {
               rules: [
                  {
                     topic: loadResponseTopic,
                     attribute: "alfTopic",
                     is: [loadResponseTopic],
                     strict: false
                  }
               ]
            };
            this.invisibilityConfig = {
               rules: [
                  {
                     topic: loadRequestTopic,
                     attribute: "alfTopic",
                     is: [loadRequestTopic],
                     strict: false
                  }
               ]
            };
         }

         // We're setting up a promise here primarily to ensure that any attempt to work with the
         // controls (e.g. if data fails to be loaded and we want to hide the controls) will wait
         // until after the controls have been created.
         this._controlsLoaded = new Deferred();
      },
      
      /**
       * Handles updates to the number of 
       * [documents to display per page]{@link module:alfresco/lists/Paginator#documentsPerPage}. The 
       * [documents to display per page]{@link module:alfresco/lists/Paginator#documentsPerPage} will only be
       * updated if the requested value is present in the [pageSizes array]{@link module:alfresco/lists/Paginator#pageSizes}.
       * 
       * @instance
       * @param {object} payload
       */
      onDocumentsPerPageChange: function alfresco_lists_Paginator__onDocumentsPerPageChange(payload) {
         if (payload && payload.value && payload.value !== this.documentsPerPage && this.isValidPageSize(payload.value))
         {
            this.documentsPerPage = payload.value;
            this.alfServicePublish(this.setPreferenceTopic, {
               preference: this.pageSizePreferenceName,
               value: this.documentsPerPage
            });
            
            // need to clear any page selector menu items
            if (this.compactMode === false && this.showPageSelector)
            {
                array.forEach(this.pageSelectorGroup.getChildren(), function(widget) {
                    this.pageSelectorGroup.removeChild(widget);
                    widget.destroy();
                }, this);
            }
         }
      },
      
      /**
       * Handles requests to go back a page.
       * 
       * @instance
       * @param {object} payload
       * @fires pageSelectionTopic
       */
      onPageBack: function alfresco_lists_Paginator__onPageBack(payload) {
         // jshint unused:false
         var label, pageStart, pageEnd;
         
         // pageBack is only disabled in processLoadedDocuments so user could trigger it again during load
         // prevent passing first page
         if (this.currentPage > 1)
         {
             this.currentPage--;
             
             pageStart = (this.currentPage - 1) * parseInt(this.documentsPerPage, 10) + 1;
             pageEnd = pageStart + parseInt(this.documentsPerPage, 10) - 1; // Deduct 1 because it's 1 - 25 (not 1 - 26!)
             label = this.message("list.paginator.page.label", {0: pageStart, 1: pageEnd, 2: this.totalRecords});
             
             this.alfPublish(this.pageSelectionTopic, {
                label: label,
                value: this.currentPage,
                selected : true
             });
         }
      },
      
      /**
       * Handles requests to go forward a page.
       * 
       * @instance
       * @param {object} payload
       * @fires pageSelectionTopic
       */
      onPageForward: function alfresco_lists_Paginator__onPageForward(payload) {
         // jshint unused:false
         var label, pageStart, pageEnd;
         
         // pageForward is only disabled in processLoadedDocuments so user could trigger it again during load
         // prevent passing last page
         if (this.currentPage !== this.totalPages)
         {
             this.currentPage++;
             
             pageStart = (this.currentPage - 1) * parseInt(this.documentsPerPage, 10) + 1;
             if (this.currentPage === this.totalPages)
             {
                 // ...for the last page just count up to the last document
                 pageEnd = this.totalRecords;
             }
             else
             {
                 pageEnd = pageStart + parseInt(this.documentsPerPage, 10) - 1; // Deduct 1 because it's 1 - 25 (not 1 - 26!)
             }
             label = this.message("list.paginator.page.label", {0: pageStart, 1: pageEnd, 2: this.totalRecords});
             
             this.alfPublish(this.pageSelectionTopic, {
                label: label,
                value: this.currentPage,
                selected : true
             });
         }
      },
      
      /**
       * @instance
       * @param {object} payload The details of the documents that have been loaded
       */
      onDocumentsLoaded: function alfresco_lists_Paginator__onDocumentsLoaded(payload) {
         this.alfLog("log", "New Documents Loaded", payload);
         if (payload !== null)
         {
            if (this.__paginationControlsAvailable === true)
            {
               this.processLoadedDocuments(payload);
            }
            else
            {
               this.__deferredLoadedDocumentData = payload;
            }
         }
      },

      /**
       * Hides all the pagination controls.
       *
       * @instance
       * @param  {object} payload Any payload included with the publication (not required)
       */
      hideControls: function alfresco_lists_Paginator__hideControls(/*jshint unused:false*/ payload) {
         when(this._controlsLoaded, lang.hitch(this, function() {
            if (this.pageSelector)
            {
               domClass.add(this.pageSelector.domNode, "hidden");
            }
            domClass.add(this.pageBack.domNode, "hidden");
            domClass.add(this.pageMarker.domNode, "hidden");
            domClass.add(this.pageForward.domNode, "hidden");
            if (this.resultsPerPageGroup)
            {
               domClass.add(this.resultsPerPageGroup.domNode, "hidden");
            }
         }));
      },

      /**
       * This function processes the loaded document data to set the appropriate data in the paginator
       * widgets.
       *
       * @instance
       * @param {object} payload The data to use to update the widgets
       */
      processLoadedDocuments: function alfresco_lists_Paginator__processLoadedDocuments(payload) {
         // jshint maxcomplexity:false,unused:false,maxstatements:false
         var totalRecords = lang.getObject(this.totalResultsProperty, false, payload);
         var startIndex = lang.getObject(this.startIndexProperty, false, payload);
         var oldCurrentPage = this.currentPage;
         
         if (payload && 
             (totalRecords || totalRecords === 0) && 
             (startIndex || startIndex === 0))
         {
            if (totalRecords === 0 || startIndex > totalRecords)
            {
               // Hide pagination controls when there are no results...
               // Or if the startIndex is greater than the number of available results
               this.hideControls();
            }
            else
            {
               // Make sure the pagination controls aren't hidden...
               // domClass.remove(this.domNode, "hidden");
               if (this.pageSelector)
               {
                  domClass.remove(this.pageSelector.domNode, "hidden");
               }
               domClass.remove(this.pageBack.domNode, "hidden");
               domClass.remove(this.pageMarker.domNode, "hidden");
               domClass.remove(this.pageForward.domNode, "hidden");
               if (this.resultsPerPageGroup)
               {
                  domClass.remove(this.resultsPerPageGroup.domNode, "hidden");
               }
               
               this.totalRecords = totalRecords;
               this.totalPages = Math.ceil(totalRecords/this.documentsPerPage);
               this.currentPage = ((startIndex - (startIndex % this.documentsPerPage))/this.documentsPerPage) + 1;

               // Update the page back action to disable if on the first page...
               if (this.pageBack)
               {
                  this.pageBack.set("disabled", this.currentPage === 1);
               }
               
               // Update the page forward action to disable if on the last page...
               if (this.pageForward)
               {
                  this.pageForward.set("disabled", this.currentPage === this.totalPages);
               }
               
               // Update the page marker to show the current page...
               if (this.pageMarker)
               {
                  switch (this.currentPageLabelStyle) {
                     case "X_OF_Y": 
                        this.pageMarker.set("label", this.message("list.paginator.currentPage.label", {
                           "0": this.currentPage.toString(),
                           "1": this.totalPages.toString()
                        }));
                        break;

                     default:
                        this.pageMarker.set("label", this.currentPage.toString());
                  }
                  
                  domClass.remove(this.pageMarker.domNode, "dijitDisabled dijitMenuItemDisabled");
               }
               
               // in case load was triggered externally (i.e. hash update) we must ensure any
               // page menu items already initialised are (un)checked according to current state
               if (this.compactMode === false && this.showPageSelector)
               {
                   var pageStart = (this.currentPage - 1) * parseInt(this.documentsPerPage, 10) + 1;
                   var pageEnd;
                   if (this.currentPage === this.totalPages)
                   {
                       // ...for the last page just count up to the last document
                       pageEnd = this.totalRecords;
                   }
                   else
                   {
                       pageEnd = pageStart + parseInt(this.documentsPerPage, 10) - 1; // Deduct 1 because it's 1 - 25 (not 1 - 26!)
                   }
                   var label = this.message("list.paginator.page.label", {0: pageStart, 1: pageEnd, 2: this.totalRecords});
                   
                   this.alfPublish(this.pageSelectionTopic, {
                      label: label,
                      value: this.currentPage,
                      selected : true
                   });
               }
            }
         }
      },
      
      /**
       * This function is called to create a new [AlfCheckableMenuItem]{@link module:alfresco/menus/AlfCheckableMenuItem}
       * for each page size configured in the [pageSizes array]{@link module:alfresco/lists/Paginator#pageSizes}.
       * 
       * @instance
       * @param {array} pageSizeMenuItems The array to add the new menu item to.
       * @param {number} pageSize The page size to add to create a menu item for.
       */
      createPageSizeMenuItem: function alfresco_lists_Paginator__createPageSizeMenuItem(pageSizeMenuItems, pageSize) {
         var label = this.message("list.paginator.perPage.label", {0: pageSize});
         var menuItem = {
            name: "alfresco/menus/AlfCheckableMenuItem",
            config: {
               label: label,
               value: pageSize,
               group: "DOCUMENTS_PER_PAGE_GROUP",
               checked: this.documentsPerPage === pageSize,
               publishTopic: this.docsPerpageSelectionTopic,
               publishPayload: {
                  label: label,
                  value: pageSize
               }
            }
         };
         pageSizeMenuItems.push(menuItem);
      },

      /**
       * Checks whether or not a particular page size is valid or not. A page size is valid if it is defined
       * in the [pageSizes array]{@link module:alfresco/lists/Paginator#pageSizes}.
       *
       * @instance
       * @param {number} requestedPageSize The page size to check for
       */
      isValidPageSize: function alfresco_lists_Paginator__isValidPageSize(requestedPageSize) {
         return array.some(this.pageSizes, function(pageSize) {
            return requestedPageSize.toString() === pageSize.toString();
         }, this);
      },

      /**
       * <p>Calls the [createPageSizeMenuItem function]{@link module:alfresco/lists/Paginator#createPageSizeMenuItem} 
       * for each item in the [pageSizes array]{@link module:alfresco/lists/Paginator#pageSizes} to build the page
       * size selection menu. If a [pageSizes array]{@link module:alfresco/lists/Paginator#pageSizes} has not been
       * configured then it will create a default array containing the sizes 25,50,75 and 100.</p>
       *
       * <p>It then constructs a widget model containing the menus and buttons that provide the pagination controls</p>
       * 
       * @instance
       */
      postCreate: function alfresco_lists_Paginator__postCreate() {
         // Create defaults if none have been configured...
         if (!this.pageSizes || this.pageSizes.length === 0)
         {
            this.pageSizes = [25,50,75,100];
         }

         if (!this.isValidPageSize(this.documentsPerPage))
         {
            this.documentsPerPage = this.pageSizes[0];
         }

         // Build the page size menu items...
         var pageSizeMenuItems = [];
         array.forEach(this.pageSizes, lang.hitch(this, this.createPageSizeMenuItem, pageSizeMenuItems));


         this.widgets = [
            {
               name: "alfresco/menus/AlfMenuBarItem",
               config: {
                  id: this.id + "_PAGE_BACK",
                  label: this.message(this.backLabel),
                  publishTopic: this.pageBackTopic
               }
            },
            {
               name: "alfresco/menus/AlfMenuBarItem",
               config: {
                  id: this.id + "_PAGE_MARKER",
                  label: "1",
                  disabled: true
               }
            },
            {
               name: "alfresco/menus/AlfMenuBarItem",
               config: {
                  id: this.id + "_PAGE_FORWARD",
                  label: this.message(this.forwardLabel),
                  publishTopic: this.pageForwardTopic
               }
            }
         ];

         if (this.compactMode === false)
         {
            this.widgets.splice(3,0, {
               name: "alfresco/menus/AlfMenuBarSelect",
               config: {
                  id: this.id + "_RESULTS_PER_PAGE_SELECTOR",
                  label: this.message("list.paginator.docsPerPageSelect.label"),
                  selectionTopic: this.docsPerpageSelectionTopic,
                  widgets: [
                     {
                        name: "alfresco/menus/AlfMenuGroup",
                        config: {
                           widgets: pageSizeMenuItems
                        }
                     }
                  ]
               }
            });
         }

         // Note showPageSelector is trumped by compactMode
         if (this.compactMode === false && this.showPageSelector)
         {
            this.widgets.splice(0, 0, {
               name: "alfresco/menus/AlfMenuBarSelect",
               config: {
                  id: this.id + "_PAGE_SELECTOR",
                  label: this.message("list.paginator.pageSelect.label"),
                  selectionTopic: this.pageSelectionTopic,
                  widgets: [
                     {
                        name: "alfresco/menus/AlfMenuGroup"
                     }
                  ]
               }
            });
         }

         // Prepend and append any widgets requested to go before or after the pagination controls...
         this.widgets = (this.widgetsBefore || []).concat(this.widgets, (this.widgetsAfter || []));

         this.inherited(arguments);
      },
      
      /**
       * Handles the creation of the paginator widgets and creates references to some of them (such
       * as the page back and forward controls, etc) so that they can be easily referenced in other functions.
       * 
       * @instance
       */
      allWidgetsProcessed: function alfresco_lists_Paginator__allWidgetsProcessed() {
         this.inherited(arguments);

         this.__paginationControlsAvailable = true;
         
         // This next line will work providing that the widgets attribute has been created as defined in the
         // postCreate function...
         if (this.compactMode === false && this.showPageSelector)
         {
            this.pageSelector = registry.byId(this.id + "_PAGE_SELECTOR");
            var popupChildren = this.pageSelector.popup.getChildren();
            this.pageSelectorGroup = popupChildren[popupChildren.length-1];
            
            this.pageSelector.popup.onOpen = lang.hitch(this, this.checkAndUpdatePageSelectionMenu);
         }
         
         this.pageBack = registry.byId(this.id + "_PAGE_BACK");
         this.pageForward = registry.byId(this.id + "_PAGE_FORWARD");
         this.pageMarker = registry.byId(this.id + "_PAGE_MARKER");
         this.resultsPerPageGroup = registry.byId(this.id + "_RESULTS_PER_PAGE_SELECTOR");

         // Decorate the paginator elements with appropriate classes
         var paginatorClass = "alfresco-lists-Paginator";
         this.pageSelector && domClass.add(this.pageSelector.domNode, paginatorClass + "__page-selector");
         domClass.add(this.pageBack.domNode, paginatorClass + "__page-back");
         domClass.add(this.pageForward.domNode, paginatorClass + "__page-forward");
         domClass.add(this.pageMarker.domNode, paginatorClass + "__page-marker");
         if (this.compactMode === false) {
            domClass.add(this.resultsPerPageGroup.domNode, paginatorClass + "__results-per-page");
         }

         // Check to see if any document data was provided before widget instantiation completed and
         // if so process it with the now available widgets...
         if (this.__deferredLoadedDocumentData)
         {
            this.processLoadedDocuments(this.__deferredLoadedDocumentData);
         }
         delete this.__deferredLoadedDocumentData;
         this._controlsLoaded.resolve();
      },
      
      /**
       *  Handles initialization and necessary updates of the page selection menu items when the popup is opened.
       * 
       *  @instance
       *  @since 1.0.82
       *  @param {object} position the position of the selection menu popup when opened
       */
      checkAndUpdatePageSelectionMenu : function alfresco_lists_Paginator__checkAndUpdatePageSelectionMenu() {
          var firstPage, lastPreloadedPage, pageStart, pageEnd, i, label, menuItem;

          // only need to act if not initialized yet or change occurred
          firstPage = 0;
          lastPreloadedPage = -1;
          
          // Delete the (obsolete) previous page selector group contents...
          array.forEach(this.pageSelectorGroup.getChildren(), function(widget, index, arr) {
              var virtPageEnd;
              
              // need to destroy every existing menu item if documentsPerPage has changed
              // or state hasn't been fully initialized yet
              if (this._pageSelectionDocsPerPage === undefined ||
                      this._pageSelectionDocsPerPage !== this.documentsPerPage ||
                      this._pageSelectionTotalRecords === undefined)
              {
                  this.pageSelectorGroup.removeChild(widget);
                  widget.destroy();
              }
              // otherwise if totalRecords changed we need to destroy last page and any obsolete page before
              // calculate pageEnd for existing page and compare
              else if (this._pageSelectionTotalRecords !== this.totalRecords)
              {
                  virtPageEnd = (index + 1) * parseInt(this.documentsPerPage, 10);
                  if (index === arr.length - 1 || virtPageEnd > this.totalRecords)
                  {
                      this.pageSelectorGroup.removeChild(widget);
                      widget.destroy();
                      
                      // mark the first page that needs re-creation
                      if (firstPage === 0)
                      {
                         firstPage = index; 
                      }
                  }
                  else
                  {
                      lastPreloadedPage = index;
                  }
              }
              else
              {
                  lastPreloadedPage = index;
              }
           }, this);

          // Create the page labels, which for English will be along the lines of 1-25
          firstPage = firstPage || (lastPreloadedPage + 1);
          pageStart = firstPage * parseInt(this.documentsPerPage, 10) + 1;
          for (i = firstPage; i < this.totalPages; i++)
          {
             // Comments below assume 25 docs per page...
             if (i+1 !== this.totalPages)
             {
                // If we're not getting the labels for the last page...
                pageEnd = pageStart + parseInt(this.documentsPerPage, 10) - 1; // Deduct 1 because it's 1 - 25 (not 1 - 26!)
             }
             else
             {
                // ...for the last page just count up to the last document
                pageEnd = this.totalRecords;
             }

             label = this.message("list.paginator.page.label", {0: pageStart, 1: pageEnd, 2: this.totalRecords});
             menuItem = new AlfCheckableMenuItem({
                label: label,
                value: i+1,
                group: "PAGE_SELECTION_GROUP",
                checked: this.currentPage === i+1,
                pubSubScope : this.pubSubScope,
                publishTopic: this.pageSelectionTopic,
                publishPayload: {
                   label: label,
                   value: i+1
                }
             });
             
             this.pageSelectorGroup.addChild(menuItem);

             pageStart = pageEnd + 1; // Add the 1 back on because the next page starts at 26
          }
          
          this._pageSelectionDocsPerPage = this.documentsPerPage;
          this._pageSelectionTotalRecords = this.totalRecords;
      }
   });
});