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
        "dojo/on"], 
        function(declare, DroppedItemWrapper, Constants, lang, on) {
   
   return declare([DroppedItemWrapper], {
      
      /**
       * Extends the [inherited function]{@link module:alfresco/dnd/DroppedItemWrapper#postCreate}
       * to listen to events generated when an item is dropped into a nested target.
       * 
       * @instance
       */
      postCreate: function alfresco_dnd_DroppedNestingItemWrapper__postCreate() {
         this.inherited(arguments);
         on(this.domNode, Constants.updateItemsEvent, lang.hitch(this, this.onNestedTargetUpdated));
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
      }
   });
});