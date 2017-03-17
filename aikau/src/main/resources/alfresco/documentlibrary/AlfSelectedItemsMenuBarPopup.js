/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * Extends the [AlfMenuBarPopup]{@link module:alfresco/menus/AlfMenuBarPopup} widget to listen to publications
 * that indicate that documents have been selected and disables the menu bar if nothing is selected. This widget
 * actively monitors the state of selected items so that any 
 * [menu items]{@link modulealfresco/documentlibrary/AlfDocumentActionMenuItem} contained in the pop-up menu that
 * are used will have the selected nodes "attached" to their payload by the 
 * [onSelectedDocumentsAction]{@link module:alfresco/menus/AlfMenuBarPopup#onSelectedDocumentsAction} function. If
 * [processActionPayloads]{@link module:alfresco/menus/AlfMenuBarPopup#processActionPayloads} is configured to be true then 
 * this function will also process the action payload and swap out any "{nodes}" tokens with the array of selected
 * nodes.
 * 
 * @module alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup
 * @extends module:alfresco/menus/AlfMenuBarPopup
 * @mixes module:alfresco/lists/SelectedItemStateMixin
 * @mixes module:alfresco/core/ObjectProcessingMixin
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarPopup",
        "alfresco/lists/SelectedItemStateMixin",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/core/topics",
        "dojo/_base/lang"], 
        function(declare, AlfMenuBarPopup, SelectedItemStateMixin, ObjectProcessingMixin, _AlfDocumentListTopicMixin, topics, lang) {
   
   return declare([AlfMenuBarPopup, SelectedItemStateMixin, ObjectProcessingMixin, _AlfDocumentListTopicMixin], {
      
      /**
       * Controls whether or not this widget actively tracks the selected items or passively subscribes
       * to topics that indicate the items that have been selected. It is NOT passive by default.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      passive: true,

      /**
       * Overrides the default to initialise as disabled.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      disabled: true,

      /**
       * Overrides the [inherited default]{@link module:alfresco/lists/SelectedItemStateMixin#disableWhenNothingSelected}
       * to ensure that the popup is disabled when no items are selected.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.39
       */
      disableWhenNothingSelected: true,
      
      /**
       * This can be configured so that action payloads are processed for the existence of a "{nodes}" token. If
       * one is found then it will be swapped out with the array of selected nodes.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.38
       */
      processActionPayloads: false,

      /**
       * Extends the [superclass function]{@link module:alfresco/menus/AlfMenuBarPopup#postCreate} to subscribe to
       * the [selectedDocumentsChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#selectedDocumentsChangeTopic}
       * topic which is handled by [onFilesSelected]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup#onFilesSelected}.
       * However, when [passive]{@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup#passive} is configured as false
       * then it subscribes to the topics to track item selection and deselection
       * 
       * @instance
       * @listens module:alfresco/core/topics#SELECTED_DOCUMENTS_ACTION
       */
      postCreate: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__postCreate() {
         if (this.passive === true)
         {
            this.alfSubscribe(this.selectedDocumentsChangeTopic, lang.hitch(this, this.onFilesSelected));
         }
         else
         {
            this.createSelectedItemSubscriptions();
         }

         this.alfSubscribe(topics.SELECTED_DOCUMENTS_ACTION, lang.hitch(this, this.onSelectedDocumentsAction));
         this.inherited(arguments);
      },
      
      /**
       * Called when [selectedDocumentsChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#selectedDocumentsChangeTopic} is
       * published on and disables the popup menu if no files have been selected. 
       * 
       * @instance
       * @param {object} payload The details of the selected files.
       */
      onFilesSelected: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__onFilesSelected(payload) {
         this.set("disabled", (payload && payload.selectedItems && payload.selectedItems.length === 0));
         this.selectedItems = payload.selectedItems;
      },

      /**
       * This function handles requests to perform actions on the currently selected documents. It takes the 
       * provided payload and updates it with the 
       *
       * @instance
       * @param {object} payload The payload containing the details of the action being requested
       * @fires alfresco/core/topics#MULTIPLE_ITEM_ACTION_REQUEST
       */
      onSelectedDocumentsAction: function alfresco_documentlibrary_AlfSelectedItemsMenuBarPopup__onSelectedDocumentsAction(payload) {
         payload.documents = this.selectedItems;
         if (this.processActionPayloads)
         {
            // There are circumstances where the requested action might need access to the selected nodes *within*
            // the payload. This can be achieved by referencing the {nodes} token with the payload and using the standard
            // object processing mixin.
            this.currentItem = {
               nodes: this.selectedItems
            };
            var clonedPayload = lang.clone(payload);
            this.processObject(["processCurrentItemTokens"], clonedPayload);
            this.alfServicePublish(topics.MULTIPLE_ITEM_ACTION_REQUEST, clonedPayload);
         }
         else
         {
            this.alfServicePublish(topics.MULTIPLE_ITEM_ACTION_REQUEST, payload);
         }
      }
   });
});