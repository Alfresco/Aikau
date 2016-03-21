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
        "alfresco/core/ObjectTypeUtils",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/Deferred",
        "dijit/registry",
        "jquery"], 
        function(declare, DroppedItemWrapper, Constants, ObjectTypeUtils, lang, array, on, Deferred, registry, $) {
   
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
         on(this.domNode, Constants.reorderItemsEvent, lang.hitch(this, this.onNestedTargetReordered));
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
         // Need to get the index of the node BEFORE we delete it (otherwise it'll lost when we remove the node,
         // and the index is the best way of knowing what to delete from the underlying data model)...
         var deleteIndex = $(this.domNode).index();

         // Now remove the item...
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

         // We're deliberately NOT going to call the inherited function here, instead we'll ALMOST (but not quite)
         // duplicate it, because we want to include the deleteIndex we retrieved earlier...
         on.emit(this.domNode, Constants.deleteItemEvent, {
            bubbles: true,
            cancelable: true,
            targetWidget: this,
            deleteIndex: deleteIndex
         });
         this.alfPublish(Constants.itemDeletedTopic, {
            item: this.getValue()
         });
      },

      /**
       * Handles items being dropped into nested targets.
       * 
       * @instance
       * @param {object} evt The drop event.
       */
      onNestedTargetUpdated: function alfresco_dnd_DroppedNestingItemWrapper__onNestedTargetUpdated(evt) {
         if (evt.targetWidget === this)
         {
            // We've managed to catch our own emitted event, allow bubbling to continue...
         }
         else
         {
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
                  var listToReorder = lang.getObject(evt.targetWidget.targetProperty, false, this.value);
                  if (!ObjectTypeUtils.isArray(listToReorder))
                  {
                     // The target value will usually be an array, but just in case - just set the value as given...
                     lang.setObject(evt.targetWidget.targetProperty, evt.targetWidget.getValue(), this.value);
                     this.notifyParentOfChange();
                  }
                  else if (!isNaN(evt.index))
                  {
                     // Set the supplied index...
                     listToReorder[evt.index] = evt.targetWidget.getValue();
                     this.notifyParentOfChange();
                  }
                  else if (!isNaN(evt.deleteIndex))
                  {
                     // Delete an item...
                     listToReorder.splice(evt.deleteIndex, 1);
                     this.notifyParentOfChange();
                  }
                  else
                  {
                     // If all else fails, then we're just going to try and work out the new value based on the current
                     // value of the target widgets preview target. This is expected to be the case when items are dragged
                     // around in a target...
                     var value = [];
                     array.forEach(evt.targetWidget.previewTarget.getAllNodes(), function(node) {
                        var widget = registry.getEnclosingWidget(node);
                        if (widget && typeof widget.getValue === "function")
                        {
                           value.push(widget.getValue());
                        }
                     }, this);
                     lang.setObject(evt.targetWidget.targetProperty, value, this.value);
                     this.notifyParentOfChange();
                  }
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
         }
      },

      /**
       * Handles items in a target being reordered
       * 
       * @instance
       * @param {object} evt The drop event.
       */
      onNestedTargetReordered: function alfresco_dnd_DroppedNestingItemWrapper__onNestedTargetReordered(evt) {
         if (evt.targetWidget === this)
         {
            // We've managed to catch our own emitted event, allow bubbling to continue...
         }
         else
         {
            if (typeof evt.stopPropagation === "function")
            {
               evt.stopPropagation();
            }
            if (typeof evt.preventDefault === "function")
            {
               evt.preventDefault();
            }

            // Attempt to mix the updated target value into the wrapped value...
            if (evt.targetWidget && evt.targetWidget.targetProperty)
            {
               var listToReorder = lang.getObject(evt.targetWidget.targetProperty, false, this.value);
               if (!ObjectTypeUtils.isArray(listToReorder))
               {
                  this.alfLog("warn", "Can't reorder because the targetProperty does not exist or is not an array", evt.targetWidget.targetProperty, this.value, this);
               }
               else if (isNaN(evt.oldIndex) || isNaN(evt.newIndex))
               {
                  this.alfLog("warn", "Can't reorder because either the oldIndex or the newIndex (or both) are missing or are not numbers", evt, this);
               }
               else
               {
                  // Do the re-ordering...
                  var tmp1 = listToReorder[evt.oldIndex];
                  var tmp2 = listToReorder[evt.newIndex];
                  listToReorder[evt.oldIndex] = tmp2;
                  listToReorder[evt.newIndex] = tmp1;

                  // ...then emit an event to capture the new value...
                  this.notifyParentOfChange();
               }
            }
            else
            {
               this.alfLog("warn", "The update event contains no 'targetWidget' attribute", evt, this);
            }
         }
      },

      /**
       * This function can be called to update wrapping widgets that the current item has changed.
       *
       * @instance
       */
      notifyParentOfChange: function alfresco_dnd_DroppedNestingItemWrapper__notifyParentOfChange() {
         on.emit(this.domNode, Constants.updateItemsEvent, {
            bubbles: true,
            cancelable: true,
            targetWidget: this,
            index: $(this.domNode).index()
         });
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