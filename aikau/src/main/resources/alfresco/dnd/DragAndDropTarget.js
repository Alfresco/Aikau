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
 * <p>This widget represents a drop target for items dragged from a [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems} widget. When an item is dropped onto this
 * widget it will render that item using the configured [widgetsForWrappingDroppedItems]{@link module:alfresco/dnd/DragAndDropTarget#widgetsForWrappingDroppedItems} and
 * [widgetsForDroppedItems]{@link module:alfresco/dnd/DragAndDropTarget#widgetsForDroppedItems} 
 * unless it has been configured to [use a modelling service]{@link module:alfresco/dnd/DragAndDropTarget#useModellingService}
 * (in which case the [service]{@link module:alfresco/services/DragAndDropModellingService} will provide the widget models).</p>
 * 
 * @module alfresco/dnd/DragAndDropTarget
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/text!./templates/DragAndDropTarget.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dijit/registry",
        "dojo/dnd/Source",
        "dojo/dnd/Target",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/aspect",
        "dojo/on",
        "alfresco/dnd/Constants",
        "dojo/Deferred",
        "dojo/_base/event",
        "dojo/keys",
        "dojo/dnd/Manager"], 
        function(declare, _Widget, _Templated, CoreWidgetProcessing, ObjectProcessingMixin, template, AlfCore, 
                 lang, array, registry, Source, Target, domConstruct, domClass, aspect, on, Constants, Deferred, Event, keys, DndManager) {
   
   return declare([_Widget, _Templated, CoreWidgetProcessing, ObjectProcessingMixin, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/DragAndDropTarget.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * @instance
       * @type {boolean}
       * @default false
       */
      horizontal: false,
      
      /**
       * The target for dropping widgets onto.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      previewTarget: null,
      
      /**
       * A list of the initial items to add to the drop zone when it is first created.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      initialItems: null,
      
      /**
       * The types that this drop zone will accept. By default this is set to null but if not specified
       * in the configuration this will be initialised to ["widget"].
       *
       * @instance
       * @type {string[]}
       * @default null
       */
      acceptTypes: null,

      /**
       * Indicates whether or not dragging should be done with handles.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      withHandles: true,

      /**
       * An optional label to provide for the target.
       *
       * @instance
       * @type {string}
       * @default null
       */
      label: null,

      /**
       * @instance
       */
      postCreate: function alfresco_dnd_DragAndDropTarget__postCreate() {
         if (this.label)
         {
            domConstruct.create("div", {
               "class": "label",
               innerHTML: this.encodeHTML(this.message(this.label))
            }, this.domNode, "first");
         }

         if (this.acceptTypes === null)
         {
            this.acceptTypes = ["widget"];
         }
         
         this.previewTarget = new Source(this.previewNode, { 
            accept: this.acceptTypes,
            creator: lang.hitch(this, this.creator),
            withHandles: this.withHandles,
            horizontal: this.horizontal
         });

         // Capture wrappers being selected...
         aspect.after(this.previewTarget, "onMouseDown", lang.hitch(this, this.onWidgetSelected), true);
         
         // Capture widgets being dropped...
         aspect.after(this.previewTarget, "onDrop", lang.hitch(this, this.onItemsUpdated), true);
         
         // We need to make sure that when a previously dropped item is dragged to a new location
         // that the target it has been dragged out of is updated after a successful relocation
         aspect.after(this.previewTarget, "onDndDrop", function(source, nodes, copy, target) {
            var widget = registry.getEnclosingWidget(target.node);
            widget = registry.getEnclosingWidget(source.node);
            if (typeof widget.onItemsUpdated === "function")
            {
               widget.onItemsUpdated();
            }
         }, true);

         if (this.previewTarget)
         {
            this.previewTarget.onDraggingOut = lang.hitch(this, this.onItemDraggedOut);
            this.previewTarget.onDraggingOver = lang.hitch(this, this.onItemDraggedOver);
         }
         
         // Listen for widgets requesting to be deleted...
         on(this.previewNode, Constants.deleteItemEvent, lang.hitch(this, this.deleteItem));
         on(this.previewNode, Constants.nestedDragOutEvent, lang.hitch(this, this.onNestedDragOut));
         on(this.previewNode, Constants.nestedDragOverEvent, lang.hitch(this, this.onNestedDragOver));

         var _this = this;
         this.watch("value", function(name, oldValue, newValue) {
            _this.setValue(newValue);
         });
      },
      
      /**
       * The widget model used to wrap each dropped item.
       * 
       * @instance
       * @type {array}
       */
      widgetsForWrappingDroppedItems: [
         {
            name: "alfresco/dnd/DroppedItemWrapper",
            config: {
               label: "{label}",
               value: "{value}",
               widgets: "{widgets}"
            }
         }
      ],

      /**
       * This is the default widget model to use for each dropped item. It can be overridden if required
       * and will not be used if the data in the dropped item contains a "widgets" attribute.
       *
       * @instance
       * @type {array}
       */
      widgetsForDroppedItems: [
         {
            name: "alfresco/dnd/DroppedItem"
         }
      ],

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
       * This function is called from the [creator]{@link module:alfresco/dnd/DragAndDropTarget#creator} function
       * when [useModellingService]{@link module:alfresco/dnd/DragAndDropTarget#useModellingService} is set to true.
       * It publishes a request for a widget model for the value of the dropped item that is expected to 
       * be serviced by a modelling service (such as the [DndModellingService]{@link module:alfresco/services/DragAndDropModellingService}).
       * 
       * @instance
       * @param {object} item The dropped item
       */
      createViaService: function alfresco_dnd_DragAndDropTarget__createViaService(item, node) {
         var promise = new Deferred();
         promise.then(lang.hitch(this, this.createDroppedItemsWidgets, item, node));
         this.alfPublish(Constants.requestWidgetsForDisplayTopic, {
            value: item.value,
            promise: promise
         });
      },

      /**
       * This function is the callback for the promise published by the [createViaService]
       * {@link module:alfresco/dnd/DragAndDropTarget#createViaService} function. It will
       * render the model provided to wrap and represent the dropped item.
       *
       * @instance
       * @param {object} item The dropped item configuration
       * @param {element} node The dropped element
       * @param {object} resolvedPromise A resolved promise containing the widget models to render
       */
      createDroppedItemsWidgets: function alfresco_dnd_DragAndDropTarget__createDroppedItemsWidgets(item, node, resolvedPromise) {
         if (resolvedPromise.widgets)
         {
            var widgetModel = lang.clone(resolvedPromise.widgets);

            // Set the value to be processed...
            this.currentItem = {};
            this.currentItem.label = item.label || item.value.label; // If no label is provided on the item, check the value (See AKU-318)
            this.currentItem.value = item.value;
            this.processObject(["processCurrentItemTokens"], widgetModel);
            
            // Create the widgets...
            this.processWidgets(widgetModel, node);
         }
         else
         {
            this.alfLog("error", "Resolved promise did not contain a widget model", resolvedPromise, this);
         }
         
      },

      /**
       * This handles the creation of the widget in the preview panel.
       * 
       * @instance
       */
      creator: function alfresco_dnd_DragAndDropTarget__creator(item, /*jshint unused:false*/ hint) {
         var node = domConstruct.create("div");
         var clonedItem = lang.clone(item);
         if (clonedItem.value !== null && clonedItem.value !== undefined)
         {
            if (this.useModellingService === true)
            {
               this.createViaService(clonedItem, node);
            }
            else
            {
               var widgetModel = lang.clone(this.widgetsForWrappingDroppedItems);
            
               // Not sure this is the ideal solution, maybe currentItem shouldn't be abused like this?
               this.currentItem = {};

               // Set the value to be processed...
               this.currentItem.value = clonedItem.value;
               this.currentItem.label = clonedItem.label || clonedItem.value.label;

               // Check to see if a specific widget model has been requested for rendering the dropped item...
               // TODO Not sure that we actually care about this yet? If at all... shouldn't everything be part of the value?
               //      This might give flexibility though...
               if (clonedItem.widgets !== null && clonedItem.widgets !== undefined)
               {
                  this.currentItem.widgets = clonedItem.widgets;
               }
               else
               {
                  this.currentItem.widgets = lang.clone(this.widgetsForDroppedItems);
               }

               // TODO: processInstanceTokens needs an update to substitute entire objects for strings
               //       e.g. the value should be an object and not a string
               this.processObject(["processCurrentItemTokens"], widgetModel);
               
               // Create the widgets...
               this.processWidgets(widgetModel, node);
            }
         }

         // TODO: Specify type from item data
         // NOTE that the node returned is the firstChild of the element we created. This is because the widget is created
         // as a child of the node we passed
         return {node: node.firstChild, data: clonedItem, type: ["widget"]};
      },
      
      /**
       * An optional property that the target represents. This is expected to be used when a target is 
       * nested within the display of another dropped item.
       *
       * @instance
       * @type {string}
       * @default null
       */
      targetProperty: null,

      /**
       * Iterates over all the dropped nodes, finds the widget associated with each node and then calls
       * that widgets getValue function (if it has one). The resulting values are all pushed into an
       * array that is then returned.
       * 
       * @instance
       * @returns {array} The array of values represented by the dropped items.
       */
      getValue: function alfresco_dnd_DragAndDropTarget__getValue() {
         var value = [];
         var nodes = this.previewTarget.getAllNodes();
         array.forEach(nodes, function(node) {
            // Get the widgets for the node...
            var widget = registry.byNode(node);
            if (widget && typeof widget.getValue === "function")
            {
               value.push(widget.getValue());
            }
         }, this);
         return value;
      },

      /**
       * This will render new items for each value in the element array provided.
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_dnd_DragAndDropTarget__setValue(value) {
         if (value !== undefined && value !== null && value !== "")
         {
            array.forEach(value, function(item) {
               var data = {
                  type: this.acceptTypes,
                  value: item
               };
               var createdItem = this.creator(data);
               this.previewTarget.insertNodes(true, [createdItem.data]);
            }, this);
         }
      },
      
      /**
       * Handles requests to delete a previously dropped item.
       * 
       * @instance
       * @param {object} evt The event.
       */
      deleteItem: function alfresco_dnd_DragAndDropTarget__deleteItem(evt) {
         this.alfLog("log", "Delete widget request detected", evt);
         if (evt.target && 
             evt.target.id &&
             this.previewTarget.getItem(evt.target.id) &&
             evt.targetWidget) 
         {
            evt.targetWidget.destroyRecursive(false);
            // TODO: This is destroying the wrong widget - the wrapper, not the DroppedItem
            this.previewTarget.delItem(evt.target.id);
            
            // If the last item has just been deleted the add the dashed border back...
            if (this.previewTarget.getAllNodes().length === 0)
            {
               domClass.remove(this.previewNode, "containsItems");
            }
            // Emit the event to alert wrapping widgets to changes...
            this.onItemsUpdated();
         }
      },

      /**
       * Although this function's name suggests it handles an nodes selection, there is no guarantee
       * that a node has actually been selected. This is simply attached to the mouseDown event.
       * 
       * @instance
       * @param {object} evt The selection event
       */
      onWidgetSelected: function alfresco_dnd_DragAndDropTarget__onWidgetSelected(/*jshint unused:false*/evt) {
         var selectedNodes = this.previewTarget.getSelectedNodes();
         if (selectedNodes.length > 0 && selectedNodes[0] !== null)
         {
            var selectedItem = this.previewTarget.getItem(selectedNodes[0].id);
         }
      },

      /**
       * This function is called after a new item is dropped onto the page.
       *
       * @instance
       */
      onItemsUpdated: function alfresco_dnd_DragAndDropTarget__onItemsUpdated() {
         domClass.remove(this.previewNode, "alfresco-dnd-DragAndDropTarget--over");
         on.emit(this.domNode, Constants.updateItemsEvent, {
            bubbles: true,
            cancelable: true,
            targetWidget: this
         });

         // NOTE: This is needed to ensure that form controls are rendered correctly
         //       after being dropped onto the page...
         this.alfPublish("ALF_WIDGET_PROCESSING_COMPLETE", {}, true);
      },

      /**
       * Handles key presses when the drop target has focus. If the key pressed is the ENTER key
       * then a request will be published to request an item to insert. This is expected to be
       * the currently selected item in a [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
       * widget.
       * 
       * @instance
       * @param {object} evt The keypress event
       */
      onKeyPress: function alfresco_dnd_DragAndDropTarget__onKeyPress(evt) {
         if (evt.charOrCode === keys.ENTER)
         {
            evt && Event.stop(evt);
            var promise = new Deferred();
            promise.then(lang.hitch(this, this.addItem));
            this.alfPublish(Constants.requestItemToAddTopic, {
               promise: promise
            });
         }
      },

      /**
       * Inserts a new item provided by a resolved promise.
       *
       * @instance
       * @param {promise} resolvedPromise A resolved promise that is expected to contain an item to insert
       */
      addItem: function alfresco_dnd_DragAndDropTarget__addItem(resolvedPromise) {
         if (resolvedPromise.item)
         {
            var createdItem = this.creator(resolvedPromise.item);
            this.previewTarget.insertNodes(true, [createdItem.data]);
            if (typeof resolvedPromise.addCallback === "function")
            {
               resolvedPromise.addCallback.call(resolvedPromise.addCallbackScope || this, resolvedPromise.item);
            }
            this.onItemsUpdated();
         }
      },

      /**
       * Called whenever an item is dragged out of the current drop target. This is emits an event
       * to indicating that this has occurred to enabled nested drop targets to be supported.
       * 
       * @instance
       */
      onItemDraggedOver: function alfresco_dnd_DragAndDropTarget__onItemDraggedOver() {
         domClass.add(this.previewNode, "alfresco-dnd-DragAndDropTarget--over");
      },

      /**
       * Called whenever an item is dragged out of the current drop target. This is emits an event
       * to indicating that this has occurred to enabled nested drop targets to be supported.
       * 
       * @instance
       */
      onItemDraggedOut: function alfresco_dnd_DragAndDropTarget__onItemDraggedOut() {
         domClass.remove(this.previewNode, "alfresco-dnd-DragAndDropTarget--over");
      },

      /**
       * This function is called when a [DragAndDropNestedTarget]{@link module:alfresco/dnd/DragAndDropNestedTarget}
       * has an item dragged out of it. This function will then call the Dojo dojo.dnd.Manager singleton to let it know
       * that the item is currently over the current target. This is required because the Dojo drag and drop framework
       * that is used does not support nested targets.
       *
       * @instance 
       * @param {object} evt The drag out event
       */
      onNestedDragOut: function alfresco_dnd_DragAndDropTarget__onNestedDragOut(evt) {
         domClass.add(this.previewNode, "alfresco-dnd-DragAndDropTarget--over");
         evt && Event.stop(evt);
         var m = DndManager.manager();
         m.overSource(this.previewTarget);
      },

      /**
       * This function is called when a [DragAndDropNestedTarget]{@link module:alfresco/dnd/DragAndDropNestedTarget}
       * has an item dragged over it. This then updates the CSS classes to indicate that the item is no longer
       * the current target (because the nested target is the current target).
       *
       * @instance 
       * @param {object} evt The drag out event
       */
      onNestedDragOver: function alfresco_dnd_DragAndDropTarget__onNestedDragOver(evt) {
         // jshint unused:false
         domClass.remove(this.previewNode, "alfresco-dnd-DragAndDropTarget--over");
      }
   });
});