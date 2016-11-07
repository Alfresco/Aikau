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
 * <p>This form control wraps a [navigation tree]{@link module:alfresco/navigation/Tree} in order to
 * allow users to select a value from within a tree like structure. In order to popuplate the tree
 * it is necessary to set the "optionsConfig.publishTopic" configuration to publish a topic that
 * will result in data being requested for the children of each tree node expanded.</p>
 * <p>The value of the control will be either the selected object or the property of the selected
 * item defined by the [valueProperty]{@link module:alfresco/forms/controls/Tree#valueProperty}</p>
 * 
 * @example <caption>Example configuration</caption>
 * {
 *   id: "CLOUD_SYNC_CONTAINER",
 *   name: "alfresco/forms/controls/Tree",
 *   config: {
 *     fieldId: "CLOUD_SYNC_CONTAINER",
 *     name: "targetFolderNodeRef",
 *     label: "cloud-sync.dialog.path.label",
 *     valueProperty: "nodeRef",
 *     optionsConfig: {
 *        publishTopic: topics.GET_FORM_VALUE_DEPENDENT_OPTIONS,
 *        publishPayload: {
 *           publishTopic: topics.GET_CLOUD_PATH
 *        },
 *        publishGlobal: false
 *     },
 *   }
 * },
 * 
 * @module alfresco/forms/controls/Tree
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 * @since 1.0.39
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/navigation/Tree",
        "dojo/_base/lang"], 
        function(declare, BaseFormControl, Tree, lang) {
   
   return declare([BaseFormControl], {
      
      /**
       * The value to retrieve from the selected tree node. If left as null then the entire
       * selected object will be used as the value.
       * 
       * @instance
       * @type {string}
       * @default
       */
      valueProperty: null,

      /**
       * This will be assigned a UUID value by the [createFormControl]{@link module:alfresco/forms/controls/Tree#createFormControl}
       * and used to publish the selection of nodes in the tree.
       * 
       * @instance
       * @type {string}
       * @default
       */
      _treeNodeSelectedTopic: null,

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_Tree__getWidgetConfig() {
         return {
            id : this.generateUuid(),
            name: this.name
         };
      },
      
      /**
       * Sets up the subscriptions to handling tree node selection and then calls 
       * [createTree]{@link module:alfresco/forms/controls/Tree#createTree} to create the tree to 
       * be used as the form control.
       * 
       * @instance
       * @param {object} config The configuration to use when instantiating the form control
       */
      createFormControl: function alfresco_forms_controls_Tree__createFormControl(/*jshint unused:false*/ config) {
         this._treeNodeSelectedTopic = this.generateUuid();
         this.alfSubscribe(this._treeNodeSelectedTopic, lang.hitch(this, this.onTreeNodeSelected));
         return this.createTree();
      },

      /**
       * This creates a new [tree]{@link module:alfresco/navigation/Tree}.
       * 
       * @instance
       * @return {object} A new tree instance
       */
      createTree: function alfresco_forms_controls_Tree__createTree() {
         return new Tree({
            id: this.id + "_TREE",
            pubSubScope: this.pubSubScope,
            publishTopic: this._treeNodeSelectedTopic,
            childRequestPublishTopic: this.optionsConfig.publishTopic,
            childRequestPublishPayload: this.optionsConfig.publishPayload,
            childRequestPublishGlobal: this.optionsConfig.publishGlobal,
            treeNodeDisablementConfig: this.treeNodeDisablementConfig
         });
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#getPubSubOptions}
       * to destroy any existing tree and then re-create it. This is necessary because new options effectively mean
       * a new tree. The tree is only destroyed if it already exists to accomodate the form control creation workflow.
       *
       * @instance
       * @param {object} config The options config (which is ignored)
       */
      getPubSubOptions: function alfresco_forms_controls_Tree__getPubSubOptions(/*jshint unused:false*/ config) {
         if (this.wrappedWidget)
         {
            this.wrappedWidget.destroy();
            this.wrappedWidget = this.createTree();
            this.placeWidget();
         }
      },

      /**
       * This function is called whenever the user selects a node in the tree. It calls 
       * [onValueChangeEvent]{@link module:alfresco/forms/controls/BaseFormControl#onValueChangeEvent}
       * to ensure that the form value is updated and can be validated (and potentially
       * trigger changes in other fields).
       * 
       * @instance
       * @param {object} payload The selected tree node value.
       */
      onTreeNodeSelected: function alfresco_forms_controls_Tree__onTreeNodeSelected(payload) {
         this.alfLog("info", "Tree node selected", payload);
         var value = payload;
         if (this.valueProperty)
         {
            value = lang.getObject(this.valueProperty, false, payload);
         }
         this.value = value;
         this.onValueChangeEvent(this.name, this.value, value);
      },
      
      /**
       * Gets the value of the currently selected node in the tree.
       * 
       * @instance
       * @returns {boolean} The checked state of the checkbox
       */
      getValue: function alfresco_forms_controls_Tree__getValue() {
         return this.value;
      },
      
      /**
       * Currently it is not possible to set a tree node value.
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_Tree__setValue(value) {
         // jshint unused:false
         // Not possible to set a value currently
      },
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setupChangeEvents}
       * to make it a no-op. All value handling is done by
       * [onTreeNodeSelected]{@link module:alfresco/forms/controls/Tree#onTreeNodeSelected} 
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_Tree__setupChangeEvents() {
         // No action required
      }
   });
});