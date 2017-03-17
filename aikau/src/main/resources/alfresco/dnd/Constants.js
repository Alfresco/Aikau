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
       * @default
       */
      deleteItemEvent: "onAlfDndItemDelete",

      /**
       * Emitted when an item is dropped or deleted.
       *
       * @instance
       * @type {String}
       * @default
       */
      updateItemsEvent: "onAlfItemsUpdated",

      /**
       * Emitted when an item is moved up or down within its parent
       *
       * @instance
       * @type {String}
       * @default
       */
      reorderItemsEvent: "onAlfItemsReordered",

      /**
       * Emitted when an item value is updated
       *
       * @instance
       * @type {String}
       * @default
       */
      itemSavedEvent: "onAlfItemSaved",

      /**
       * Emitted when a draggable item is selected.
       *
       * @instance
       * @type {String}
       * @default
       */
      itemSelectedEvent: "onAlfItemSelected",

      /**
       * Emitted when an item requested additional configuration options from an item it has been dropped into.
       *
       * @instance
       * @type {string}
       * @default
       */
      requestAdditionalConfigEvent: "onAdditionalConfigRequest",

      /**
       * Emitted when a item is dragged over a [DragAndDropNestedTarget]{@link module:alfresco/dnd/DragAndDropNestedTarget}.
       * 
       * @instance
       * @type {string}
       * @default
       */
      nestedDragOverEvent: "onNestedDragOverEvent",

      /**
       * Emitted when a item is dragged out of a [DragAndDropNestedTarget]{@link module:alfresco/dnd/DragAndDropNestedTarget}.
       * 
       * @instance
       * @type {string}
       * @default
       */
      nestedDragOutEvent: "onNestedDragOutEvent",

      /**
       * This topic is published when using a modelling service to render the dropped items.
       * It is published to request the widgets to display for a given value.
       *
       * @instance
       * @type {string}
       * @default
       */
      requestWidgetsForDisplayTopic: "ALF_DND_REQUEST_WIDGETS_FOR_DISPLAY",

      /**
       * This topic is published when using a modelling service render the widgets that allow
       * the user to configure the dropped item.
       *
       * @instance
       * @type {string}
       * @default
       */
      requestWidgetsForConfigTopic: "ALF_DND_REQUEST_WIDGETS_FOR_CONFIG",

      /**
       * This topic is published when using a modelling service render the widgets that allow
       * the user to configure the dropped item using options provided from the item that the 
       * widget has been dropped into.
       *
       * @instance
       * @type {string}
       * @default
       */
      requestWidgetsForNestedConfigTopic: "ALF_DND_REQUEST_WIDGETS_FOR_NESTED_CONFIG",

      /**
       * This topic is published when using the keyboard to insert a node. It requests the node
       * to be inserted.
       *
       * @instance
       * @type {string}
       * @default
       */
      requestItemToAddTopic: "ALF_DND_REQUEST_ITEM_TO_ADD",

      /**
       * This topic is published whenever an item in a [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
       * widget is selected. This is intended to cover the scenario where multiple 
       * [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems} widgets are included on the same page.
       *
       * @instance
       * @type {String}
       * @default
       */
      itemSelectedTopic: "ALF_DND_SOURCE_ITEM_SELECTED",

      /**
       * This topic is published by a [DroppedItemWrapper]{@link module:alfresco/dnd/DroppedItemWrapper} whenever a 
       * dropped item is deleted. This topic is subscribed to by [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
       * that are configured to only allow an item to be used so that the deleted item can be reinstated.
       *
       * @instance
       * @type {String}
       * @default
       */
      itemDeletedTopic: "ALF_DND_DROPPED_ITEM_DELETED",

      /**
       * This topic is published by a [DragAndDropTarget]{@link module:alfresco/dnd/DragAndDropTarget} whenever a 
       * dropped item is inserted into a target. This topic is subscribed to by [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
       * that are configured to only allow an item to be used so that the deleted item can be reinstated.
       *
       * @instance
       * @type {String}
       * @default
       */
      itemAddedTopic: "ALF_DND_ITEM_ADDED"
   };
});