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
 * This widget allows an array of [items]{@link module:alfresco/dnd/DragAndDropItems#items} to 
 * be rendered which can be dragged and dropped (e.g. onto a [DragAndDropTargetControl]{@link module:alfresco/form/controls/DragAndDropTargetControl}).
 * 
 * @module alfresco/dnd/DragAndDropItems
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/ObjectProcessingMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/text!./templates/DragAndDropItems.html",
        "alfresco/core/Core",
        "alfresco/dnd/Constants",
        "dojo/dnd/Source",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/string",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(declare, _Widget, _Templated, CoreWidgetProcessing, ObjectProcessingMixin, template, AlfCore, Constants, 
                 Source, lang, array, on, stringUtil, domConstruct, domClass) {
   
   return declare([_Widget, _Templated, CoreWidgetProcessing, ObjectProcessingMixin, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/DragAndDropItems.css"}],
      
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
      dragWithHandles: false,
      
      /**
       * If this is configured to be true then once an item has been used it will be removed 
       * so that it cannot be used again. If the item is deleted it will be reinstated.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      useItemsOnce: false,

      /**
       * When [items can only be used once]{@link module:alfresco/dnd/DragAndDropItems#useItemsOnce}
       * this is the dot-notation property to compare deleted items against the configured
       * [items]{@link module:alfresco/dnd/DragAndDropItems#items} to see if a deleted item should
       * be re-instated.
       *
       * @instance
       * @type {string}
       * @default "name"
       */
      useItemsOnceComparisonKey: "name",

      /**
       * Indicates that the items should be rendered immediately. This is a configurable option because
       * the [DragAndDropItemsListView]{@link module:alfresco/dnd/DragAndDropItemsListView} needs to be able
       * to prevent immediately rendering the item data.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      immediateRender: true,

      /**
       * Creates a palette of items that can be dragged (and dropped).
       * 
       * @instance
       */
      postCreate: function alfresco_dnd_DragAndDropItems__postCreate() {
         // Listen for items that are selected through key presses so that the currently selected item
         // can be inserted into a drop target when the drop target is actioned by the keyboard
         on(this.paletteNode, Constants.itemSelectedEvent, lang.hitch(this, this.onItemSelected));

         if (this.immediateRender)
         {
            this.renderData();
         }

         this.alfSubscribe(Constants.requestItemToAddTopic, lang.hitch(this, this.onItemToAddRequest));
         this.alfSubscribe(Constants.itemSelectedTopic, lang.hitch(this, this.onExternalItemSelected));

         if (this.useItemsOnce === true)
         {
            this.alfSubscribe(Constants.itemDeletedTopic, lang.hitch(this, this.onItemDeleted));
         }
      },

      /**
       * This function can be called to render the drag-and-drop items. It has this specific name so that
       * it can be used as the renderer in the [DragAndDropItemsListView]{@link module:alfresco/dnd/DragAndDropItemsListView}
       *
       * @instance
       */
      renderData: function alfresco_dnd_DragAndDropItems__renderData() {
         if (this.sourceTarget)
         {
            this.sourceTarget.destroy();
         }
         this.sourceTarget = new Source(this.paletteNode, {
            copyOnly: !this.useItemsOnce,
            selfCopy: false,
            creator: lang.hitch(this, this.creator),
            withHandles: this.dragWithHandles
         });
         this.sourceTarget.insertNodes(false, this.items);
      },

      /**
       * Handles items being deleted. If the item deleted is a deleted item from this widget then it will
       * be re-instated.
       *
       * @instance
       * @param  {object} payload A payload containing a deleted item
       */
      onItemDeleted: function alfresco_dnd_DragAndDropItems__onItemDeleted(payload) {
         if (payload && payload.item && this.useItemsOnceComparisonKey)
         {
            var a = lang.getObject(this.useItemsOnceComparisonKey, false, payload.item);
            if (a)
            {
               // NOTE: Using some to exit as soon as match is found
               array.some(this.items, function(item) {
                  var b = lang.getObject(this.useItemsOnceComparisonKey, false, item.value);
                  if (a === b)
                  {
                     this.sourceTarget.insertNodes(false, [item]);
                     return true;
                  }
                  return false;
               }, this);
            }
         }
      },

      /**
       * Handles the selection of an item. When an item is selected it will returned as the item to
       * insert into a drag target when requested.
       *
       * @instance
       * @param {object} evt The selection event
       */
      onItemSelected: function alfresco_dnd_DragAndDropItems__onItemToAddRequest(evt) {
         if (evt && evt.target && evt.target.parentNode)
         {
            var item = this.sourceTarget.getItem(evt.target.parentNode.id);
            if (item)
            {
               this._selectedItem = item;
               array.forEach(this.sourceTarget.getAllNodes(), function(node) {
                  domClass.remove(node.firstChild, "selected");
               });
               domClass.add(evt.target, "selected");

               // Publish the selected item so that other DragAndDropItems widgets can de-select
               // any selected items...
               this.alfPublish(Constants.itemSelectedTopic, {
                  widget: this
               });
            }
         }
      },

      /**
       * Handles publications indicating that another [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
       * widget publishing at the same scope has had an item selected. It checks that the publication didn't
       * originate from the current instance and if not deselects all the items.
       * 
       * @instance
       * @param {object} payload The payload containing the details of the widget that has had an item selected.
       */
      onExternalItemSelected: function alfresco_dnd_DragAndDropItems__onExternalItemSelected(payload) {
         if (payload && payload.widget !== this)
         {
            array.forEach(this.sourceTarget.getAllNodes(), function(node) {
               domClass.remove(node.firstChild, "selected");
            });
            this._selectedItem = null;
         }
      },

      /**
       * Handles requests to provide an item to insert into a [DragAndDropTarget]{@link module:alfresco/dnd/DragAndDropTarget}
       * 
       * @instance
       */
      onItemToAddRequest: function alfresco_dnd_DragAndDropItems__onItemToAddRequest(payload) {
         if (payload.promise && typeof payload.promise.resolve === "function")
         {
            if (this._selectedItem)
            {
               payload.promise.resolve({
                  item: lang.clone(this._selectedItem.data)
               });
            }
         }
      },
      
      /**
       * The widgets model to render as a drag-and-drop item.
       *
       * @instance
       * @type {array}
       */
      widgets: [
         {
            name: "alfresco/dnd/DragAndDropItem",
            config: {
               iconClass: "{iconClass}",
               title: "{title}"
            }
         }
      ],

      /**
       * Handles the creation of drag and drop avatars. This could check the supplied hint parameter
       * to see if an avatar is required, but since the source doesn't allow self-copying and is not
       * a target in itself then this is not necessary.
       * 
       * @instance
       * @param {object} item The configuration for the dragged item.
       */
      creator: function alfresco_dnd_DragAndDropItems__creator(item, hint) {
         // jshint unused: false
         var node = domConstruct.create("div");         
         var clonedItem = lang.clone(item);
         this.currentItem = {};
         this.currentItem.title = "";
         if (clonedItem.label)
         {
            this.currentItem.title = this.encodeHTML(this.message(clonedItem.label));
         }
         this.currentItem.iconClass = clonedItem.iconClass || "";
         var widgetModel = lang.clone(this.widgets);
         this.processObject(["processCurrentItemTokens"], widgetModel);
         this.processWidgets(widgetModel, node);
         return {node: node, data: clonedItem, type: clonedItem.type};
      },
      
      /**
       * The array of items to render as draggable entities. Each item should have a type array (indicating
       * what targets it can be dropped onto), a label (to indicate its purpose) and a value (which can
       * be any complex object).
       * 
       * @instance
       * @type {array}
       * @default null
       */
      items: null
   });
});