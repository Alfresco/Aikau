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
 * <p>This form control can be used for constructing form data through a drag and drop interface. Include
 * this widget in a [form]{@link module:alfresco/forms/Form} and it will render a 
 * [DragAndDropTarget]{@link module:alfresco/dnd/DragAndDropTarget} that can be used to drop items dragged from a
 * [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems} widget.</p>
 * <p>When configured the control you can choose whether or not to [use a modelling service]{@link module:alfresco/form/controls/DragAndDropTargetControl#useModellingService}
 * (recommended for finer control) as well as overriding the 
 * [widget model for wrapping dropped items]{@link module:alfresco/form/controls/DragAndDropTargetControl#widgetsForWrappingDroppedItems}
 * and the [widget model for rendering each dropped item]{@link module:alfresco/form/controls/DragAndDropTargetControl#widgetsForDroppedItems}} (although the latter
 * configuration might get overriden by your modelling service configuration).</p>
 * 
 * @module alfresco/forms/controls/DragAndDropTargetControl
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/dnd/DragAndDropTarget",
        "dojo/_base/lang",
        "dojo/on",
        "alfresco/dnd/Constants"], 
        function(declare, BaseFormControl, CoreWidgetProcessing, DragAndDropTarget, lang, on, Constants) {
   
   return declare([BaseFormControl, CoreWidgetProcessing], {
      
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
       * An optional model to override the default widgets used for rendering the wrapper around
       * a dropped item.
       * 
       * @instance
       * @type {array}
       * @default null
       */
      widgetsForWrappingDroppedItems: null,

      /**
       * An optional model to override the default widgets used for rendering a dropped item.
       * 
       * @instance
       * @type {array}
       * @default null
       */
      widgetsForDroppedItems: null,
      
      /**
       * Return the configuration for the widget
       * 
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_DragAndDropTargetControl__getWidgetConfig() {
         var config = {
            id : this.generateUuid(),
            name: this.name,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.pubSubScope,
            acceptTypes: this.acceptTypes,
            useModellingService: this.useModellingService
         };
         if (this.widgetsForWrappingDroppedItems)
         {
            config.widgetsForWrappingDroppedItems = this.widgetsForWrappingDroppedItems;
         }
         if (this.widgetsForDroppedItems)
         {
            config.widgetsForDroppedItems = this.widgetsForDroppedItems;
         }
         return config;
      },
      
      /**
       * Instantiates a new [DragAndDropTarget]{@link module:alfresco/dnd/DragAndDropTarget} widget.
       * 
       * @instance
       * @param {config} config The configuration to instantiate the control with.
       */
      createFormControl: function alfresco_forms_controls_DragAndDropTargetControl__createFormControl(config, /*jshint unused:false*/ domNode) {
         if (this.widgetsForControl && this.widgetsForControl.length && this.widgetsForControl[0].name)
         {
            return this.createWidget({
               name: this.widgetsForControl[0].name,
               config: config
            });
         }
         else
         {
            return new DragAndDropTarget(config);
         }
      },

      /**
       * This can be set to be an array containing a single widget definition. The array structure is used in order
       * for Surf dynamic-dependency analysis to include the required widget resources on the page. Only the "name"
       * attribute of the first widget in the page will be used, other configuration will be ignored.
       *
       * @instance
       * @type {array}
       * @default null
       */
      widgetsForControl: null,
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setupChangeEvents}
       * to listen to update events generated when items are added or removed from the control.
       * 
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