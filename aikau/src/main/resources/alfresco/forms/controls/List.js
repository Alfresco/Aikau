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
 * [currentData]{@link module:alfresco/lists/AlfList#currentData} as its value. 
 * 
 * @module alfresco/forms/controls/List
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @mixes module:aikau/core/ChildProcessing
 * @author Dave Draper
 * @since 1.0.102
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "aikau/core/ChildProcessing",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, BaseFormControl, ChildProcessing, lang, domClass) {
   
   return declare([BaseFormControl, ChildProcessing], {
      
      /**
       * Widgets to be created before the [list]{@link module:alfresco/lists/AlfList}.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsBeforeList: null,

      /**
       * This should be configured to be the model rendered as the 
       * [wrapped widget]{@link module:alfresco/forms/controls/BaseFormControl#wrappedWidget}. 
       * It is expected to be an array containing a single object element defining a 
       * [list]{@link module:alfresco/lists/AlfList} (or one of its descendents).
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsForList: null,

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_List__getWidgetConfig() {
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
      createFormControl: function alfresco_forms_controls_List__createFormControl(config, /*jshint unused:false*/ domNode) {
         var list = null;
         if (this.widgetsBeforeList)
         {
            this.createChildren({
               widgets: this.widgetsBeforeList,
               targetNode: this._controlNode,
               targetPosition: "first"
            });
         }
         if (this.widgetsForList && this.widgetsForList.length)
         {
            list = this.createWidget(this.widgetsForList[0]);
            domClass.add(this.domNode, "alfresco-forms-controls-List");
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
      getValue: function alfresco_forms_controls_List__getValue() {
         var value = null;
         if (this.wrappedWidget)
         {
            value = this.wrappedWidget.currentData;
         }
         return value;
      },
      
      /**
       * Requests to set the value of the list are ignored. The list data should be
       * requested by configuring the 
       * [loadDataPublishTopic]{@link module:alfresco/lists/AlfList#loadDataPublishTopic}
       * attribute in the [list]{@link module:alfresco/lists/AlfList} defined in the
       * [widgetsForList]{@link module:alfresco/forms/controls/List#widgetsForList} model.
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_List__setValue() {
         // No action by default
      },

      /**
       * Overrides the inherited function to listen to watch for changes to the selected items in the list. 
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_List__setupChangeEvents() {
         if (this.wrappedWidget)
         {
            this.alfSubscribe(this.wrappedWidget.requestFinishedTopic, lang.hitch(this, function() {
               this.onValueChangeEvent(this.name, null, this.wrappedWidget.currentData);
            }));
         }
      }
   });
});