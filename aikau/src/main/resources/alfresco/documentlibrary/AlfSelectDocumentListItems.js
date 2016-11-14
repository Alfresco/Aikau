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
 * Specialization of the [AlfSelectDocumentListItems]{@link module:alfresco/menus/AlfMenuBarSelectItems] to define
 * the menu item widgets for "All", "None", "Invert", "Documents" & "Folders".
 * 
 * @module alfresco/documentlibrary/AlfSelectDocumentListItems
 * @extends module:alfresco/menus/AlfMenuBarSelectItems
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarSelectItems",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/core/topics",
        "dojo/_base/lang"], 
        function(declare, AlfMenuBarSelectItems, _AlfDocumentListTopicMixin, topics, lang) {
   
   return declare([AlfMenuBarSelectItems, _AlfDocumentListTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfSelectDocumentListItems.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfSelectDocumentListItems.properties"}],
      
      /**
       * Overrides the default icon class for when the menu loads.
       * @instance
       * @type {string}
       * @default
       */
      iconClass: "alf-noneselected-icon",
      
      /**
       * The topic that is subscribed to in order to count the number of individual items that
       * are selected.
       *
       * @instance
       * @type {string}
       * @default
       */
      documentSelectionTopic: topics.DOCUMENT_SELECTED,

      /**
       * The topic that is subscribed to in order to count the number of individual items that
       * are de-selected.
       *
       * @instance
       * @type {string}
       * @default
       */
      documentDeselectionTopic: topics.DOCUMENT_DESELECTED,
      
      /**
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfSelectDocumentListItems__postCreate() {
         this.selectionTopic = this.selectedDocumentsChangeTopic;
         this.alfSubscribe(this.documentsLoadedTopic, lang.hitch(this, this.onDocumentsLoaded));
         this.inherited(arguments);

         // Subscribe to topics for detecting individual changes...
         this.alfSubscribe(this.documentSelectionTopic, lang.hitch(this, this.onDocumentSelected));
         this.alfSubscribe(this.documentDeselectionTopic, lang.hitch(this, this.onDocumentDeselected));
      },
      
      /**
       * Keeps track of the number of documents that are available for selection. This attribute is updated
       * by the 'onDocumentsLoaded' function and is used by the 'determineSelection' function.
       * 
       * @instance
       * @type {integer}
       * @default
       */
      documentsAvailable: 0,

      /**
       * Keeps track of the number of documents that are currently selected. This attribute is updated
       * by the 'onDocumentsLoaded' function and is used by the 'determineSelection' function.
       * 
       * @instance
       * @type {integer}
       * @default
       */
      documentsSelected: 0,
      
      /**
       * Handles the selection of an individual document
       *
       * @instance
       * @param {object} payload The details of the selected document
       */
      onDocumentSelected: function alfresco_documentlibrary_AlfSelectDocumentListItems__onDocumentSelected(/*jshint unused:false*/ payload) {
         this.documentsSelected++;
         if (this.documentsSelected > this.documentsAvailable)
         {
            this.documentsSelected = this.documentsAvailable;
         }
         this.determineSelection({
            selectedItems: {
               length: this.documentsSelected
            }
         });
      },

      /**
       * Handles the deselection of an individual document
       *
       * @instance
       * @param {object} payload The details of the selected document
       */
      onDocumentDeselected: function alfresco_documentlibrary_AlfSelectDocumentListItems__onDocumentDeselected(/*jshint unused:false*/ payload) {
         this.documentsSelected--;
         if (this.documentsSelected < 0)
         {
            this.documentsSelected = 0;
         }
         this.determineSelection({
            selectedItems: {
               length: this.documentsSelected
            }
         });
      },

      /**
       * This method is used to keep track of the number of documents that are available for selection.
       * 
       * @instance
       * @param {object} payload The details of the documents loaded.
       */
      onDocumentsLoaded: function alfresco_documentlibrary_AlfSelectDocumentListItems__onDocumentsLoaded(payload) {
         this.alfLog("log", "New Documents Loaded", payload);
         if (payload && payload.documents && (payload.documents.length || payload.documents.length === 0))
         {
            this.documentsAvailable = payload.documents.length;
         }
         this.set("disabled", (payload && (payload.totalRecords === 0 || payload.totalRecords === -1)));
      },
      
      /**
       * Overrides the default to use the current number of documents to decide on how to render the menu
       * icon (e.g. to indicate all, some or none selected).
       * 
       * @instance
       * @param {object} payload The publication of the selected item change.
       */
      determineSelection: function alfresco_menus_AlfMenuBarSelectItems__determineSelection(payload) {
         if (payload.selectedItems && (payload.selectedItems.length || payload.selectedItems.length === 0))
         {
            if (this.documentsAvailable === 0 || payload.selectedItems.length === 0)
            {
               this.renderNoneSelected();
               this.documentsSelected = 0;
            }
            else if (this.documentsAvailable > payload.selectedItems.length)
            {
               this.renderSomeSelected();
            }
            else if (this.documentsAvailable === payload.selectedItems.length)
            {
               this.renderAllSelected();
               this.documentsSelected = this.documentsAvailable;
            }
         }
      },
      
      /**
       * The default set of widget menu items for selecting from the document list.
       * @instance
       * @type {object[]}
       */
      widgets: [
         {
            name: "alfresco/menus/AlfMenuGroup",
            config: {
               widgets: [
                  {
                     name: "alfresco/menus/AlfMenuItem",
                     config: {
                        label: "select.all.label",
                        publishTopic: topics.DOCUMENT_SELECTION_UPDATE,
                        publishPayload: {
                           label: "select.all.label",
                           value: "selectAll"
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuItem",
                     config: {
                        label: "select.none.label",
                        publishTopic: topics.DOCUMENT_SELECTION_UPDATE,
                        publishPayload: {
                           label: "select.none.label",
                           value: "selectNone"
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuItem",
                     config: {
                        label: "invert.selection.label",
                        publishTopic: topics.DOCUMENT_SELECTION_UPDATE,
                        publishPayload: {
                           label: "invert.selection.label",
                           value: "selectInvert"
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuItem",
                     config: {
                        label: "select.documents.label",
                        publishTopic: topics.DOCUMENT_SELECTION_UPDATE,
                        publishPayload: {
                           label: "select.documents.label",
                           value: "selectDocuments"
                        }
                     }
                  },
                  {
                     name: "alfresco/menus/AlfMenuItem",
                     config: {
                        label: "select.folders.label",
                        publishTopic: topics.DOCUMENT_SELECTION_UPDATE,
                        publishPayload: {
                           label: "select.folders.label",
                           value: "selectFolders"
                        }
                     }
                  }
               ]
            }
         }
      ]
   });
});