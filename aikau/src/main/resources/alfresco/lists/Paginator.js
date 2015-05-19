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
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/menus/AlfMenuBarSelect",
        "alfresco/menus/AlfMenuGroups",
        "alfresco/menus/AlfMenuGroup",
        "alfresco/menus/AlfCheckableMenuItem",
        "dijit/registry",
        "dojo/dom-class"], 
        function(declare, AlfMenuBar, _AlfDocumentListTopicMixin, lang, array, AlfMenuBarSelect, AlfMenuGroups, 
                 AlfMenuGroup, AlfCheckableMenuItem, registry, domClass) {

   return declare([AlfMenuBar, _AlfDocumentListTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Paginator.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Paginator.properties"}],
      
      /**
       * The number of documents to show per page.
       * 
       * @instance
       * @type {number}
       * @default 25
       */
      documentsPerPage: 25,
      
      /**
       * Used to keep track of the total number of documents in the current data set
       * 
       * @instance
       * @type {number} 
       * @default null
       */
      totalRecords: null,
      
      /**
       * Used to keep track of the total number of pages in the current data set
       * 
       * @instance
       * @type {number} 
       * @default null
       */
      totalPages: null,
      
      /**
       * Used to keep track of the current page number in the current data set
       * 
       * @instance
       * @type {number} 
       * @default null
       */
      currentPage: null,
      
      /**
       * @instance
       * @type {string}
       * @default "ALF_PAGE_BACK"
       */
      pageBackTopic: "ALF_PAGE_BACK",
      
      /**
       * @instance 
       * @type {string}
       * @default "ALF_PAGE_FORWARD"
       */
      pageForwardTopic: "ALF_PAGE_FORWARD",
      
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
         this.currentPage--;
         this.alfPublish(this.pageSelectionTopic, {
            value: this.currentPage
         });
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
         this.currentPage++;
         this.alfPublish(this.pageSelectionTopic, {
            value: this.currentPage
         });
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
       * The property in the response that indicates the starting index of overall data to request.
       *
       * @instance
       * @type {string}
       * @default "startIndex"
       */
      startIndexProperty: "startIndex",

      /**
       * The property in the response that indicates the total number of results available.
       *
       * @instance
       * @type {string}
       * @default "totalRecords"
       */
      totalResultsProperty: "totalRecords",

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
         if (payload && 
             (totalRecords || totalRecords === 0) && 
             (startIndex || startIndex === 0))
         {
            if (totalRecords === 0)
            {
               // Hide pagination controls when there are no results...
               // domClass.add(this.domNode, "hidden");
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
                  this.pageMarker.set("label", this.currentPage.toString());
                  domClass.remove(this.pageMarker.domNode, "dijitDisabled dijitMenuItemDisabled");
               }
               
               // Delete the previous page selector group contents...
               if (this.pageSelectorGroup !== null)
               {
                  var _this = this;
                  array.forEach(this.pageSelectorGroup.getChildren(), function(widget) {
                     _this.pageSelectorGroup.removeChild(widget);
                     widget.destroy();
                  });
               }
               
               // Create the page labels, which for English will be along the lines of 1-25
               if (this.compactMode === false)
               {
                  var pageLabels = [];
                  var pageStart = 1;
                  for (var i=0; i<this.totalPages; i++)
                  {
                     // Comments below assume 25 docs per page...
                     var pageEnd;
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
                     
                     var label = this.message("list.paginator.page.label", {0: pageStart, 1: pageEnd, 2: this.totalRecords});
                     var menuItem = new AlfCheckableMenuItem({
                        label: label,
                        value: i+1,
                        group: "PAGE_SELECTION_GROUP",
                        checked: this.currentPage === i+1,
                        publishTopic: this.pubSubScope + this.pageSelectionTopic,
                        publishPayload: {
                           label: label,
                           value: i+1
                        }
                     });

                     if (this.pageSelectorGroup !== null)
                     {
                        this.pageSelectorGroup.addChild(menuItem);
                     }
                     else
                     {
                        if (this.__initialPageSelectorItems === null)
                        {
                           this.__initialPageSelectorItems = [];
                        }
                        this.__initialPageSelectorItems.push(menuItem);
                     }
                     
                     pageLabels.push();
                     pageStart = pageEnd + 1; // Add the 1 back on because the next page starts at 26
                  }
               }
            }
         }
      },
      
      /**
       * This will be initialised to be a select menu for the current page.
       * 
       * @instance
       * @type {object}
       * @default null 
       */
      pageSelector: null,
      
      /**
       * This will be the group into which page selection item can be added.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      pageSelectorGroup: null,
      
      /**
       * This is the minimum width the container node must be in order for the page size selector
       * to be displayed.
       *
       * @instance
       * @type {number}
       * @default 1024
       */
      hidePageSizeOnWidth: 1024,

      /**
       * Indicates whether the paginator should be displayed in "compact" mode where only
       * the back and forward buttons are displayed.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      compactMode: false,

      /**
       * This can be used to configure an array of page sizes that should be displayed in the paginator.
       * If left as the default of null then an array will automatically created containing page sizes of
       * 25, 50, 75 and 100. The array should be a simple list of numbers.
       * 
       * @instance
       * @type {array}
       * @default null
       */
      pageSizes: null,

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
       * Since this widget is an implementation of an [AlfMenuBar]{@link module:alfresco/menus/AlfMenuBar} it is 
       * perfectly reasonable to add additional menu widgets (such as [menu items]{@link module:alfresco/menus/AlfMenuBarItem}
       * or [drop-down menus]{@link module:alfresco/menus/AlfMenuBarPopup}) before the main pagination controls. This
       * can be configured to be an array of such menu widgets to be displayed.
       *
       * @instance
       * @type {array}
       * @default null
       */
      widgetsBefore: null,

      /**
       * Since this widget is an implementation of an [AlfMenuBar]{@link module:alfresco/menus/AlfMenuBar} it is 
       * perfectly reasonable to add additional menu widgets (such as [menu items]{@link module:alfresco/menus/AlfMenuBarItem}
       * or [drop-down menus]{@link module:alfresco/menus/AlfMenuBarPopup}) after the main pagination controls. This
       * can be configured to be an array of such menu widgets to be displayed.
       *
       * @instance
       * @type {array}
       * @default null
       */
      widgetsAfter: null,

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
                  label: this.message("list.paginator.back.label"),
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
                  label: this.message("list.paginator.next.label"),
                  publishTopic: this.pageForwardTopic
               }
            }
         ];

         if (this.compactMode === false)
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

            this.widgets.splice(4,0, {
               name: "alfresco/menus/AlfMenuBarSelect",
               config: {
                  id: this.id + "_RESULTS_PER_PAGE_SELECTOR",
                  label: this.message("list.paginator.docsPerPageSelect.label"),
                  selectionTopic: this.docsPerpageSelectionTopic,
                  minRwdWidth: this.hidePageSizeOnWidth,
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
         if (this.compactMode === false)
         {
            this.pageSelector = registry.byId(this.id + "_PAGE_SELECTOR");
            var popupChildren = this.pageSelector.popup.getChildren();
            this.pageSelectorGroup = popupChildren[popupChildren.length-1];
         }
         
         this.pageBack = registry.byId(this.id + "_PAGE_BACK");
         this.pageForward = registry.byId(this.id + "_PAGE_FORWARD");
         this.pageMarker = registry.byId(this.id + "_PAGE_MARKER");
         this.resultsPerPageGroup = registry.byId(this.id + "_RESULTS_PER_PAGE_SELECTOR");

         // Check to see if any document data was provided before widget instantiation completed and
         // if so process it with the now available widgets...
         if (this.__deferredLoadedDocumentData)
         {
            this.processLoadedDocuments(this.__deferredLoadedDocumentData);
         }
         delete this.__deferredLoadedDocumentData;
      }
   });
});