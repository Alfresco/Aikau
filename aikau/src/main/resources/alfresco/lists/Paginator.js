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
      totalDocuments: null,
      
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
       * Handles updates to the number of documents to display per page.
       * 
       * @instance
       * @param {object} payload
       */
      onDocumentsPerPageChange: function alfresco_lists_Paginator__onDocumentsPerPageChange(payload) {
         if (payload && payload.value && payload.value !== this.documentsPerPage)
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
       * This function processes the loaded document data to set the appropriate data in the paginator
       * widgets.
       *
       * @instance
       * @param {object} payload The data to use to update the widgets
       */
      processLoadedDocuments: function alfresco_lists_Paginator__processLoadedDocuments(payload) {
         // jshint maxcomplexity:false,unused:false,maxstatements:false
         if (payload && payload.totalDocuments !== null && payload.startIndex !== null)
         {
            if (payload.totalDocuments === 0)
            {
               // Hide pagination controls when there are no results...
               domClass.add(this.domNode, "hidden");
            }
            else
            {
               // Make sure the pagination controls aren't hidden...
               domClass.remove(this.domNode, "hidden");
               
               this.totalDocuments = payload.totalDocuments;
               this.totalPages = Math.ceil(payload.totalDocuments/this.documentsPerPage);
               this.currentPage = ((payload.startIndex - (payload.startIndex % this.documentsPerPage))/this.documentsPerPage) + 1;

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
                        pageEnd = pageStart + this.documentsPerPage - 1; // Deduct 1 because it's 1 - 25 (not 1 - 26!)
                     }
                     else
                     {
                        // ...for the last page just count up to the last document
                        pageEnd = this.totalDocuments;
                     }
                     
                     var label = this.message("list.paginator.page.label", {0: pageStart, 1: pageEnd, 2: this.totalDocuments});
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
       * @instance
       */
      postCreate: function alfresco_lists_Paginator__postCreate() {
         var label25 = this.message("list.paginator.perPage.label", {0: 25}),
             label50 = this.message("list.paginator.perPage.label", {0: 50}),
             label75 = this.message("list.paginator.perPage.label", {0: 75}),
             label100 = this.message("list.paginator.perPage.label", {0: 100});
         
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
                           widgets: [
                              {
                                 name: "alfresco/menus/AlfCheckableMenuItem",
                                 config: {
                                    label: label25,
                                    value: 25,
                                    group: "DOCUMENTS_PER_PAGE_GROUP",
                                    checked: this.documentsPerPage === 25,
                                    publishTopic: this.docsPerpageSelectionTopic,
                                    publishPayload: {
                                       label: label25,
                                       value: 25
                                    }
                                 }
                              },
                              {
                                 name: "alfresco/menus/AlfCheckableMenuItem",
                                 config: {
                                    label: label50,
                                    value: 50,
                                    group: "DOCUMENTS_PER_PAGE_GROUP",
                                    checked: this.documentsPerPage === 50,
                                    publishTopic: this.docsPerpageSelectionTopic,
                                    publishPayload: {
                                       label: label50,
                                       value: 50
                                    }
                                 }
                              },
                              {
                                 name: "alfresco/menus/AlfCheckableMenuItem",
                                 config: {
                                    label: label75,
                                    value: 75,
                                    group: "DOCUMENTS_PER_PAGE_GROUP",
                                    checked: this.documentsPerPage === 75,
                                    publishTopic: this.docsPerpageSelectionTopic,
                                    publishPayload: {
                                       label: label75,
                                       value: 75
                                    }
                                 }
                              },
                              {
                                 name: "alfresco/menus/AlfCheckableMenuItem",
                                 config: {
                                    label: label100,
                                    value: 100,
                                    group: "DOCUMENTS_PER_PAGE_GROUP",
                                    checked: this.documentsPerPage === 100,
                                    publishTopic: this.docsPerpageSelectionTopic,
                                    publishPayload: {
                                       label: label100,
                                       value: 100
                                    }
                                 }
                              }
                           ]
                        }
                     }
                  ]
               }
            });
         }
         this.inherited(arguments);
      },
      
      /**
       * @instance
       */
      allWidgetsProcessed: function alfresco_lists_Paginator__allWidgetsProcessed() {
         this.inherited(arguments);

         this.__paginationControlsAvailable = true;
         
         // This next line will work providing that the widgets attribute has been created as defined in the
         // postCreate function...
         if (this.compactMode === false)
         {
            var popupChildren = this._menuBar.getChildren()[0].popup.getChildren();
            this.pageSelectorGroup = popupChildren[popupChildren.length-1];
         }
         
         this.pageBack = registry.byId(this.id + "_PAGE_BACK");
         this.pageForward = registry.byId(this.id + "_PAGE_FORWARD");
         this.pageMarker = registry.byId(this.id + "_PAGE_MARKER");

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