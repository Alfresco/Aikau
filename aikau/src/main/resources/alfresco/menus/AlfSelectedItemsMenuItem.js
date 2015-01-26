/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This menu item is intended to be used a child of a [AlfSelectedItemsMenuBarPopup]
 * {@link module:alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup} widget as it extends the standard
 * [AlfMenuItem]{@link module:alfresco/menus/AlfMenuItem} to create subscriptions to the 
 * [selectedDocumentsChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#selectedDocumentsChangeTopic}
 * that is published whenever items are selected.
 * 
 * @module alfresco/menus/AlfSelectedItemsMenuItem
 * @extends module:alfresco/menus/AlfMenuItem
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuItem",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang"], 
        function(declare, AlfMenuItem, _AlfDocumentListTopicMixin, lang) {
   
   return declare([AlfMenuItem, _AlfDocumentListTopicMixin], {
      
      /**
       * Extends the [inherited function]{@link module:alfresco/menus/AlfMenuItem#postCreate} to set up the
       * subscription to receive notification of selected items.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfSelectedItemsMenuItem__postCreate() {
         this.inherited(arguments);
         this.alfSubscribe(this.selectedDocumentsChangeTopic, lang.hitch(this, this.onItemsSelected));
      },

      /**
       * When items are selected this function will be called to update the publication payload with the details
       * of the items that have been selected.
       * 
       * @instance
       * @param {object} payload A publication payload containing the details of the selected items.
       */
      onItemsSelected: function alfresco_menus_AlfSelectedItemsMenuItem__onItemsSelected(payload) {
         if (payload.selectedItems != null)
         {
            if (this.publishPayload == null)
            {
               this.publishPayload = {};
            }
            this.publishPayload.selectedItems = payload.selectedItems;
         }
      },

      /**
       * When this is true a payload will be published indicating that the currently selected items
       * should be cleared. The default value is false.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      clearSelectedItemsOnClick: false, 

      /**
       * Extends the [inherited function]{@link module:alfresco/menus/_AlfMenuItemMixin#onClick} to publish
       * a request to clear selected items if [clearSelectedItemsOnClick]
       * {@link module:alfresco/menus/AlfSelectedItemsMenuItem#clearSelectedItemsOnClick} is set to true.
       *
       * @instance
       * @param {object} evt The click event
       */
      onClick: function alfresco_menus_AlfSelectedItemsMenuItem__onClick(evt) {
         this.inherited(arguments);
         if (this.clearSelectedItemsOnClick === true)
         {
            this.alfPublish("ALF_CLEAR_SELECTED_ITEMS", {
               label: "select.none.label",
               value: "selectNone"
            });
            this.alfPublish("ALF_DOCLIST_FILE_SELECTION", {
               label: "select.none.label",
               value: "selectNone"
            });
         }
      }
   });
});