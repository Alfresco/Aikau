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
 * This extends the [DragAndDropTarget]{@link module:alfresco/dnd/DragAndDropTarget} to provide support for
 * nested configuration. This is where an item dropped into another item can inherit configuration options
 * that only apply to items dropped into that parent (e.g. the configuration is meaningless otherwise)
 * 
 * @module alfresco/dnd/DragAndDropNestedTarget
 * @extends module:alfresco/dnd/DragAndDropTarget
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/dnd/DragAndDropTarget",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/dnd/Constants",
        "dojo/on"], 
        function(declare, DragAndDropTarget, lang, array, Constants, on) {
   
   return declare([DragAndDropTarget], {
      
      /**
       * An additional widgets configuration model (expected to be form controls) that are inherited from 
       * the [DroppedNestedItemWrapper]{@link module:alfresco/dnd/DroppedNestedItemWrapper} that this 
       * widget is expected to be used by.
       *
       * @instance
       * @type {array}
       * @default null
       */
      widgetsForNestedConfig: null,

      /**
       * Extends the [inherited function]{@link module:alfresco/dnd/DragAndDropTarget#postCreate}
       * to capture save events emitted by nested items.
       * 
       * @instance
       */
      postCreate: function alfresco_dnd_DragAndDropNestedTarget__postCreate() {
         this.inherited(arguments);
         on(this.domNode, Constants.itemSavedEvent, lang.hitch(this, this.onItemSaved));
      },

      /**
       * Called whenever an item is dragged out of the current drop target. This is emits an event
       * to indicating that this has occurred to enabled nested drop targets to be supported.
       * 
       * @instance
       */
      onItemDraggedOver: function alfresco_dnd_DragAndDropNestedTarget__onItemDraggedOver() {
         this.inherited(arguments);
         on.emit(this.domNode, Constants.nestedDragOverEvent, {
            bubbles: true,
            cancelable: true
         });
      },
      
      /**
       * Called whenever an item is dragged out of the current drop target. This is emits an event
       * to indicating that this has occurred to enabled nested drop targets to be supported.
       * 
       * @instance
       */
      onItemDraggedOut: function alfresco_dnd_DragAndDropNestedTarget__onItemDraggedOut() {
         this.inherited(arguments);
         on.emit(this.domNode, Constants.nestedDragOutEvent, {
            bubbles: true,
            cancelable: true
         });
      },

      /**
       * This handles [save events]{@link module:alfresco/dnd/Constants#itemSavedEvent} on any items 
       * that are nested within it. It stops the event and then emits a
       * [update items event]{@link module:alfresco/dnd/Constants#updateItemsEvent} to indicate
       * that its overall value has been updated.
       *
       * @instance
       * @param {object} evt The save event
       */
      onItemSaved: function alfresco_dnd_DragAndDropNestedTarget__onItemSaved(evt) {
         if (typeof evt.stopPropagation === "function")
         {
            evt.stopPropagation();
         }
         if (typeof evt.preventDefault === "function")
         {
            evt.preventDefault();
         }
         on.emit(this.domNode, Constants.updateItemsEvent, {
            bubbles: true,
            cancelable: true,
            targetWidget: this
         });
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/core/CoreWidgetProcessing#allWidgetsProcessed} to 
       * update all processed widgets to have the [widgetsForNestedConfig]{@link module:alfresco/dnd/DragAndDropNestedTarget#widgetsForNestedConfig}
       *
       * @instance
       * @param {Array} widgets An array of all the widgets that have been processed
       */
      allWidgetsProcessed: function alfresco_dnd_DragAndDropNestedTarget__allWidgetsProcessed(widgets) {
         this.inherited(arguments);
         array.forEach(widgets, lang.hitch(this, this.updateProcessedWidget));
      },

      /**
       * Sets the [widgetsForNestedConfig]{@link module:alfresco/dnd/DragAndDropNestedTarget#widgetsForNestedConfig} on
       * the processed widget.
       *
       * @instance
       * @param  {array} widget The widget to update
       */
      updateProcessedWidget: function alfresco_dnd_DragAndDropNestedTarget__updateProcessedWidgets(widget) {
         widget.widgetsForNestedConfig = this.widgetsForNestedConfig || [];
         widget.targetProperty = this.targetProperty;
      },

      /**
       * The widget model used to wrap each dropped item.
       * 
       * @instance
       * @type {array}
       */
      widgetsForWrappingDroppedItems: [
         {
            name: "alfresco/dnd/DroppedNestingItemWrapper",
            config: {
               label: "{label}",
               value: "{value}",
               widgets: [
                  {
                     name: "alfresco/dnd/DragAndDropNestedTarget",
                     config: {
                        label: "Widgets", // TODO: NLS
                        targetProperty: "config.widgets"
                     }
                  }
               ]
            }
         }
      ]
   });
});