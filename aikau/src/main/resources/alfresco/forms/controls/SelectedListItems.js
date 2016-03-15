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
 * This form control uses a [list]{@link module:alfresco/lists/AlfList} as its 
 * [wrapped widget]{@link module:alfresco/forms/controls/BaseFormControl#wrappedWidget} and uses the
 * [currently selected items]{@link module:alfresco/lists/SelectedItemStateMixin#selectedItems}
 * as its value. This relies on the view defined by the 
 * [configured widget model]{@link module:alfresco/forms/controls/SelectedListItems#widgets} to contain
 * [selectors]{@link module:alfresco/renderers/Selector} (or some other renderer that inherits from
 * [ItemSelectionMixin]{@link module:alfresco/lists/ItemSelectionMixin}) in order for the selected item
 * state to be both updated and represented.
 * 
 * @module alfresco/forms/controls/SelectedListItems
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 * @since 1.0.59
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-class",
        "alfresco/core/topics",
        "alfresco/lists/AlfList"], 
        function(declare, BaseFormControl, CoreWidgetProcessing, array, lang, domClass, topics) {
   
   return declare([BaseFormControl, CoreWidgetProcessing], {
      
      /**
       * This should be configured to be the model rendered as the 
       * [wrapped widget]{@link module:alfresco/forms/controls/BaseFormControl#wrappedWidget}. It is expected to
       * be an array containing a single object element defining a [list]{@link module:alfresco/lists/AlfList} 
       * (or one of its descendents).
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsForList: null,

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_SelectedListItems__getWidgetConfig() {
         return {
            id : this.generateUuid(),
            name: this.name
         };
      },
      
      /**
       * Create the form control using the [widgetsForList]{@link module:alfresco/forms/controls/SelectedListItems#widgetsForList}
       * configuration.
       * 
       * @instance
       * @listens module:alfresco/core/topics#REQUEST_FINISHED_TOPIC
       */
      createFormControl: function alfresco_forms_controls_SelectedListItems__createFormControl(config, /*jshint unused:false*/ domNode) {
         var list = null;
         if (this.widgetsForList && this.widgetsForList.length)
         {
            list = this.createWidget(this.widgetsForList[0]);
            this.alfSubscribe(topics.REQUEST_FINISHED_TOPIC, lang.hitch(this, function() {
               this._listRendered = true;
               this.selectItemsInList();
            }));
            domClass.add(this.domNode, "alfresco-forms-controls-SelectedListItems");
         }
         else
         {
            this.alfLog("error", "An unexpected widget model was configured as 'widgetsForList'", this);
         }
         return list;
      },
      
      /**
       * Gets the items that have been selected in the list.
       * 
       * @instance
       * @returns {boolean} The items selected in the list
       */
      getValue: function alfresco_forms_controls_SelectedListItems__getValue() {
         var value = null;
         if (this.wrappedWidget)
         {
            value = this.wrappedWidget.selectedItems;
         }
         return value;
      },
      
      /**
       * Sets the selected items in the list.
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_SelectedListItems__setValue(value) {
         if (this.deferValueAssigment)
         {
            this.inherited(arguments);
         }
         else
         {
            if (this.wrappedWidget)
            {
               this._valueForListSelection = value;
               if (this._listRendered)
               {
                  this.selectItemsInList();
               }
            }
         }
      },

      /**
       * This is called from [setValue]{@link module:alfresco/forms/controls/SelectedListItems#setValue} 
       * when a request is made to update the selected items and the list has been rendered. The array
       * of values is converted into a map which is assigned to
       * [previouslySelectedItems]{@link module:alfresco/lists/SelectedItemStateMixin#previouslySelectedItems} 
       * and then [retainPreviousItemSelectionState]{@link module:alfresco/lists/SelectedItemStateMixin#retainPreviousItemSelectionState}
       * is called.
       * 
       * @instance
       */
      selectItemsInList: function alfresco_forms_controls_SelectedListItems__selectItemsInList() {
         this.wrappedWidget.selectedItems = this._valueForListSelection;
         var itemKeyProperty = this.wrappedWidget.itemKeyProperty;
         var itemMap = {};
         array.forEach(this._valueForListSelection, function(item) {
            if (itemKeyProperty && item[itemKeyProperty])
            {
               itemMap[item[itemKeyProperty]] = item;
            }
         }, this);
         
         this.wrappedWidget.previouslySelectedItems = itemMap;
         this.wrappedWidget.retainPreviousItemSelectionState(this.wrappedWidget.currentData.items);
      },
      
      /**
       * Overrides the inherited function to listen to watch for changes to the selected items in the list. 
       * 
       * @instance
       * @listens module:alfresco/core/topics#DOCUMENT_SELECTED
       */
      setupChangeEvents: function alfresco_forms_controls_SelectedListItems__setupChangeEvents() {
         if (this.wrappedWidget)
         {
            this.alfSubscribe(this.wrappedWidget.documentSelectionTopic, lang.hitch(this, function(payload) {
               this.onValueChangeEvent(this.name, null, payload.selectedItems);
            }));
         }
      }
   });
});