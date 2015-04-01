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
       * Emitted when an item value is updated
       *
       * @instance
       * @type {String}
       * @default "onAlfItemSaved"
       */
      itemSavedEvent: "onAlfItemSaved",

      /**
       * Emitted when a draggable item is selected.
       *
       * @instance
       * @type {String}
       * @default "onAlfItemSelected"
       */
      itemSelectedEvent: "onAlfItemSelected",

      /**
       * Emitted when an item requested additional configuration options from an item it has been dropped into.
       *
       * @instance
       * @type {string}
       * @default "onAlfItemAdditionalConfigRequest"
       */
      requestAdditionalConfigEvent: "onAdditionalConfigRequest",

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
       * This topic is published when using a modelling service render the widgets that allow
       * the user to configure the dropped item using options provided from the item that the 
       * widget has been dropped into.
       *
       * @instance
       * @type {string}
       * @default "ALF_DND_REQUEST_WIDGETS_FOR_NESTED_CONFIG"
       */
      requestWidgetsForNestedConfigTopic: "ALF_DND_REQUEST_WIDGETS_FOR_NESTED_CONFIG",

      /**
       * This topic is published when using the keyboard to insert a node. It requests the node
       * to be inserted.
       *
       * @instance
       * @type {string}
       * @default "ALF_DND_REQUEST_ITEM_TO_ADD"
       */
      requestItemToAddTopic: "ALF_DND_REQUEST_ITEM_TO_ADD",

      /**
       * This topic is published whenever an item in a [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
       * widget is selected. This is intended to cover the scenario where multiple 
       * [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems} widgets are included on the same page.
       *
       * @instance
       * @type {String}
       * @default "ALF_DND_SOURCE_ITEM_SELECTED"
       */
      itemSelectedTopic: "ALF_DND_SOURCE_ITEM_SELECTED",

      /**
       * This topic is published by a [DroppedItemWrapper]{@link module:alfresco/dnd/DroppedItemWrapper} whenever a 
       * dropped item is deleted. This topic is subscribed to by [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
       * that are configured to only allow an item to be used so that the deleted item can be reinstated.
       *
       * @instance
       * @type {String}
       * @default "ALF_DND_DROPPED_ITEM_DELETED"
       */
      itemDeletedTopic: "ALF_DND_DROPPED_ITEM_DELETED",
   };
});