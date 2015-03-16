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
 * Some constants used by multiple modules in the "alfresco/dnd" package.
 * 
 * @module alfresco/dnd/Constants
 * @author Dave Draper
 */
define([],function() {
   
   return {

      /**
       * Emitted when clicking on a [DroppedItemWrapper]{@link module:alfresco/dnd/DroppedItemWrapper} to delete 
       * that item.
       *
       * @instance
       * @type {String}
       * @default "onAlfDndItemDelete"
       */
      deleteItemEvent: "onAlfDndItemDelete",

      /**
       * Emitted when an item is dropped or deleted.
       *
       * @instance
       * @type {String}
       * @default "onItemsUpdated"
       */
      updateItemsEvent: "onAlfItemsUpdated",

      /**
       * Emitted when a draggable item is selected.
       *
       * @instance
       * @type {String}
       * @default "onAlfItemSelected"
       */
      itemSelectedEvent: "onAlfItemSelected",

      /**
       * This topic is published when using a modelling service to render the dropped items.
       * It is published to request the widgets to display for a given value.
       *
       * @instance
       * @type {string}
       * @default "ALF_DND_REQUEST_WIDGETS_FOR_DISPLAY"
       */
      requestWidgetsForDisplayTopic: "ALF_DND_REQUEST_WIDGETS_FOR_DISPLAY",

      /**
       * This topic is published when using a modelling service render the widgets that allow
       * the user to configure the dropped item.
       *
       * @instance
       * @type {string}
       * @default "ALF_DND_REQUEST_WIDGETS_FOR_CONFIG"
       */
      requestWidgetsForConfigTopic: "ALF_DND_REQUEST_WIDGETS_FOR_CONFIG",

      /**
       * This topic is published when using the keyboard to insert a node. It requests the node
       * to be inserted.
       *
       * @instance
       * @type {string}
       * @default "ALF_DND_REQUEST_ITEM_TO_ADD"
       */
      requestItemToAddTopic: "ALF_DND_REQUEST_ITEM_TO_ADD"
   };
});