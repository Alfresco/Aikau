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
 * This is an extension of the basic [DroppedItemWrapper]{@link module:alfresco/dnd/DroppedItemWrapper}
 * and should be used when the item dropped can contain one or more nested 
 * [DragAndDropTargets]{@link module:alfresco/dnd/DragAndDropTarget}.
 * 
 * @module alfresco/dnd/DroppedNestingItemWrapper
 * @extends module:alfresco/dnd/DroppedItemWrapper
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/dnd/DroppedItemWrapper",
        "alfresco/dnd/Constants",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/Deferred",
        "dijit/registry"], 
        function(declare, DroppedItemWrapper, Constants, lang, array, on, Deferred, registry) {
   
   return declare([DroppedItemWrapper], {
      
      /**
       * Extends the [inherited function]{@link module:alfresco/dnd/DroppedItemWrapper#postCreate}
       * to listen to events generated when an item is dropped into a nested target.
       * 
       * @instance
       */
      postCreate: function alfresco_dnd_DroppedNestingItemWrapper__postCreate() {
         // Provide any additional configuration that the nested item might use...
         var promise = new Deferred();
         promise.then(lang.hitch(this, this.onNestedConfig));
         this.alfPublish(Constants.requestWidgetsForNestedConfigTopic, {
            value: this.value,
            promise: promise
         });

         this.inherited(arguments);
         on(this.domNode, Constants.updateItemsEvent, lang.hitch(this, this.onNestedTargetUpdated));
      },

      /**
       * Updates the display items with the nested widget configuration model. The widgets processed are expected
       * to be [DragAndDropNestedTarget]{@link module:alfresco/dnd/DragAndDropNestedTarget} widgets that will be
       * able to pass this additional configuration onto the items that are dropped into them.
       *
       * @instance
       * @param {array} widgets The widgets processed.
       */
      allWidgetsProcessed: function alfresco_dnd_DroppedNestingItemWrapper__allWidgetsProcessed(widgets) {
         this.inherited(arguments);
         array.forEach(widgets, function(widget) {
            widget.widgetsForNestedConfig = this._widgetsForNestedConfig;

            // Ensure that nested items are rendered if values are available for them...
            if (widget.targetProperty)
            {
               var value = lang.getObject(widget.targetProperty, false, this.value);
               if (value && typeof widget.setValue === "function")
               {
                  widget.setValue(value);
               }
            }
         }, this);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/dnd/DroppedItemWrapper#onItemDelete} to to iterate
       * over all the nested items an individually delete them to ensure that any items that are configured for
       * single use only are ultimately returned to the [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
       * widget from which they were originally sourced.
       *
       * @instance
       * @param {object} evt The deletion event
       */
      onItemDelete: function alfresco_dnd_DroppedNestingItemWrapper__onItemDelete(/* jshint unused:false */ evt) {
         array.forEach(this._renderedWidgets, function(widget) {
            if (widget.previewTarget && typeof widget.previewTarget.getAllNodes === "function")
            {
               var nodes = widget.previewTarget.getAllNodes.call(widget.previewTarget);
               array.forEach(nodes, function(node) {
                  var w = registry.byNode(node);
                  if (w && typeof w.onItemDelete === "function") {
                     w.onItemDelete.call(w);
                  }
               });
            }
         });
         this.inherited(arguments);
      },

      /**
       * Handles items being dropped into nested targets.
       * 
       * @instance
       * @param {object} evt The drop event.
       */
      onNestedTargetUpdated: function alfresco_dnd_DroppedNestingItemWrapper__onNestedTargetUpdated(evt) {
         if (typeof evt.stopPropagation === "function")
         {
            evt.stopPropagation();
         }
         if (typeof evt.preventDefault === "function")
         {
            evt.preventDefault();
         }

         // Attempt to mix the updated target value into the wrapped value...
         if (evt.targetWidget)
         {
            if (evt.targetWidget.targetProperty && typeof evt.targetWidget.getValue === "function")
            {
               lang.setObject(evt.targetWidget.targetProperty, evt.targetWidget.getValue(), this.value);
            }
            else
            {
               this.alfLog("warn", "The 'targetWidget' has no 'targetProperty' or no 'getValue' function", evt.targetWidget, this);
            }
         }
         else
         {
            this.alfLog("warn", "The update event contains no 'targetWidget' attribute", evt, this);
         }
      },

      /**
       * Retrieves additional configuration data from a [DndModellingService]{@link module:alfresco/services/DragAndDropModellingService}
       * that can then be passed onto the child widget.
       * 
       * @instance
       * @param {object} targetWidget The target widget to update with the additional configuration
       * @param {promise} resolvedPromise A resolved promise that is expected to contain a widgets array
       */
      onNestedConfig: function alfresco_dnd_DroppedNestingItemWrapper__onNestedConfig(resolvedPromise) {
         if (resolvedPromise.widgets)
         {
            this._widgetsForNestedConfig = resolvedPromise.widgets;
         }
         else
         {
            this.alfLog("warn", "Wigets were not provided in the resolved promise", resolvedPromise, this);
         }
      },

      /**
       * Extends the inherited function to add in any nested configuration widgets.
       * 
       * @param {object} item The current item being edited.
       * @param {promise} resolvedPromise A resolved promise that is expected to contain a widgets array
       */
      onEditConfig: function alfresco_dnd_DroppedNestingItemWrapper__onEditConfig(item, resolvedPromise) {
         if (resolvedPromise.widgets && this.widgetsForNestedConfig)
         {
            resolvedPromise.widgets = this.widgetsForNestedConfig.concat(resolvedPromise.widgets);
         }
         this.inherited(arguments);
      }
   });
});