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
        "alfresco/dnd/Constants",
        "dijit/registry"], 
        function(declare, BaseFormControl, CoreWidgetProcessing, DragAndDropTarget, lang, on, Constants, registry) {
   
   return declare([BaseFormControl, CoreWidgetProcessing], {
      
      /**
       * Defines a topic to subscribe to that if published on will result in all of the dropped items being
       * deleted. The difference between this topic and the 
       * [clearDroppedItemsTopic]{@link module:alfresco/forms/controls/DragAndDropTargetControl#clearDroppedItemsTopic}
       * is that single-use items that have been used will NOT be returned to the 
       * [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems#items} widget from which they were dragged.
       * 
       * @instance
       * @type {string}
       * @default
       */
      clearTopic: null,
      
      /**
       * Defines a topic to subscribe to that if published on will result in all of the dropped items being
       * deleted. The difference between this topic and the 
       * [clearTopic]{@link module:alfresco/forms/controls/DragAndDropTargetControl#clearTopic}
       * is that single-use items that have been used WILL be returned to the 
       * [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems#items} widget from which they were dragged.
       * 
       * @instance
       * @type {string}
       * @default
       */
      clearDroppedItemsTopic: null,

      /**
       * Indicates whether or not to use a modelling service to render the dropped items.
       * This will result in publications being made to request the widgets to use for each
       * dropped item based on the value of the dropped item.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      useModellingService: false,

      /**
       * An optional model to override the default widgets used for rendering the wrapper around
       * a dropped item.
       * 
       * @instance
       * @type {array}
       * @default
       */
      widgetsForWrappingDroppedItems: null,

      /**
       * An optional model to override the default widgets used for rendering a dropped item.
       * 
       * @instance
       * @type {array}
       * @default
       */
      widgetsForDroppedItems: null,

      /**
       * Indicates whether or not dragging should be done with handles.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      withHandles: true,

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
            useModellingService: this.useModellingService,
            withHandles: this.withHandles
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
       * Creates subscriptions to the [clearTopic]{@link module:alfresco/forms/controls/DragAndDropTargetControl#clearTopic}
       * and [clearDroppedItemsTopic]{@link module:alfresco/forms/controls/DragAndDropTargetControl#clearDroppedItemsTopic}
       * topics (if configured) in order 
       * 
       * @instance
       */
      startup: function alfresco_dnd_DragAndDropFormControlTarget__startup() {
         if(this.clearTopic)
         {
            this.alfSubscribe(this.clearTopic, lang.hitch(this, this.onClear));
         }
         if(this.clearDroppedItemsTopic)
         {
            this.alfSubscribe(this.clearDroppedItemsTopic, lang.hitch(this, this.onClearDroppedItems));
         }
      },

      /**
       * This function wipes the canvas, discarding nodes it contains.
       * 
       * @instance
       */
      onClear: function cmm_forms_controls_DragAndDropTargetControl__onClear() {
         var canvas = lang.getObject("wrappedWidget.previewTarget", false, this);
         if (canvas)
         {
            canvas.selectAll().deleteSelectedNodes();
         }
      },

      /**
       * This function wipes the canvas by running the deletion process of any nodes it contains. The 
       * nodes will therefore return to their palettes of origin if required.
       * 
       * @instance
       */
      onClearDroppedItems: function cmm_forms_controls_DragAndDropTargetControl__onClearDroppedItems() {
         var nodes = lang.getObject("wrappedWidget.previewTarget.map", false, this);
         for (var node in nodes)
         {
            if (nodes.hasOwnProperty(node))
            {
               var widget = registry.byId(node);
               if(widget && typeof widget.onItemDelete === "function")
               {
                  widget.onItemDelete();
               }
            }
         }
      },

      /**
       * This can be set to be an array containing a single widget definition. The array structure is used in order
       * for Surf dynamic-dependency analysis to include the required widget resources on the page. Only the "name"
       * attribute of the first widget in the page will be used, other configuration will be ignored.
       *
       * @instance
       * @type {array}
       * @default
       */
      widgetsForControl: null,
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setupChangeEvents}
       * to listen to update events generated when items are added or removed from the control.
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_DragAndDropTargetControl__setupChangeEvents() {
         this.own(on(this.domNode, Constants.updateItemsEvent, lang.hitch(this, this.onDragAndDropTargetUpdated)));
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