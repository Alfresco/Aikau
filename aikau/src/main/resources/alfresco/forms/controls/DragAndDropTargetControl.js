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
 * @module alfresco/form/controls/DragAndDropTargetControl
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/dnd/DragAndDropTarget",
        "dojo/_base/lang",
        "dojo/on",
        "alfresco/dnd/Constants"], 
        function(declare, BaseFormControl, DragAndDropTarget, lang, on, Constants) {
   
   return declare([BaseFormControl], {
      
      /**
       * Indicates whether or not to use a modelling service to render the dropped items.
       * This will result in publications being made to request the widgets to use for each
       * dropped item based on the value of the dropped item.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      useModellingService: false,

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_DragAndDropTargetControl__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.pubSubScope,
            acceptTypes: this.acceptTypes,
            useModellingService: this.useModellingService
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_DragAndDropTargetControl__createFormControl(config, /*jshint unused:false*/ domNode) {
         return new DragAndDropTarget(config);
      },
      
      /**
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_DragAndDropTargetControl__setupChangeEvents() {
         on(this.domNode, Constants.updateItemsEvent, lang.hitch(this, this.onDragAndDropTargetUpdated));
      },

      /**
       * Handles the change in value for the current form control by publishing the details of the change and calling the
       * validate function to check that the new value is acceptable.
       * 
       * @instance
       * @param {string} name
       * @param {string} oldValue
       * @param {string} value
       */
      onDragAndDropTargetUpdated: function alfresco_forms_controls_DragAndDropTargetControl__onDragAndDropTargetUpdated(evt) {
         if (typeof evt.stopPropagation === "function")
         {
            evt.stopPropagation();
         }
         if (typeof evt.preventDefault === "function")
         {
            evt.preventDefault();
         }
         var updatedValue = this.getValue();
         this.formControlValueChange(name, null, updatedValue);
         this.validate();
      }
   });
});