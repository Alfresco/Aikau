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
 * <p>This is an extension to the 'alfresco/renderers/Actions' widget that adds a secondary "off" state where no 
 * actions are available. Clicking the button toggles the widget into the "on" state and allows the actions menu 
 * to be displayed. The original use case for this widget was in sharing documents - the "off" state was the document 
 * not being shared, clicking the button would share the document (and move it into the "on" state) and provide 
 * additional actions in the drop-down menu.</p>
 *
 * @example <caption>Basic Example</caption>
 * {
 *   name: "alfresco/renderers/ToggleStateActions",
 *   config: {
 *     itemKeyProperty: "nodeRef",
 *     toggleOnWhenPropertySet: true,
 *     toggleStateProperty: "node.properties.qshare:sharedId",
 *     toggleOnStateLabel: "Shared",
 *     toggleOffStateLabel: "Share",
 *     toggleOnRequestTopic: "SHARE",
 *     toggleOnSuccessTopic: "SHARE",
 *     toggleOffSuccessTopic: "UNSHARED",
 *     customActions: [
 *        {
 *           label: "Copy Link",
 *           publishTopic: "COPY"
 *        },
 *        {
 *           label: "E-Mail Link",
 *           publishTopic: "EMAIL"
 *        },
 *        {
 *           label: "Stop sharing",
 *           publishTopic: "UNSHARED"
 *        }
 *     ]
 *   }
 * }
 *
 * @module alfresco/renderers/ToggleStateActions
 * @extends module:alfresco/renderers/Actions
 * @author Dave Draper
 * @since 1.0.64
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Actions",
        "alfresco/core/topics",
        "dojo/dom-class",
        "dojo/_base/lang"], 
        function(declare, Actions, topics, domClass, lang) {

   return declare([Actions], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/ToggleStateActions.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/ToggleStateActions.properties"}],
      
      /**
       * The property of the current item that uniquely identifies it. This attribute is used
       * to check that any published 
       * [toggleOnSuccessTopic]{@link module:alfresco/renderers/ToggleStateActions#toggleOnSuccessTopic}
       * relates to the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}. 
       * This allows the state to be toggled by an external widget.
       * 
       * @instance
       * @type {string}
       * @default
       */
      itemKeyProperty: "node.nodeRef",

      /**
       * This is the label to display on the button when toggled to the "on" state.
       * 
       * @instance
       * @type {string}
       * @default
       */
      toggleOnStateLabel: "toggle.state.on.label",

      /**
       * This is the topic that is published when the button is clicked when in the "off" state.
       * It makes a request to update the toggle state. Typically this topic would be subscribed
       * to by a service that would indicate a successful change in state by publishing on the
       * [toggleOnSuccessTopic]{@link module:alfresco/renderers/ToggleStateActions#toggleOnSuccessTopic}.
       * However, it is possible to skip this intermediate step and configure the 
       * [toggleOnSuccessTopic]{@link module:alfresco/renderers/ToggleStateActions#toggleOnSuccessTopic}
       * to have an idential value.
       * 
       * @instance
       * @type {string}
       * @default [TOGGLE_ON]{@link module:alfresco/core/topics#TOGGLE_ON}
       * @event
       */
      toggleOnRequestTopic: topics.TOGGLE_ON,

      /**
       * This is the topic that should be published to toggle from the "off" state to the "on" state.
       * Typically it would be published by a service that handles requests to change the toggle state
       * of an item. However, it is possible to skip this intermediate step and configure the 
       * [toggleOnRequestTopic]{@link module:alfresco/renderers/ToggleStateActions#toggleOnRequestTopic}
       * to have an idential value. The only requirement is that the 
       * [itemKeyProperty]{@link module:alfresco/renderers/ToggleStateActions#itemKeyProperty}
       * exists in the published payload to match requests against the appropriate instance of the widget.
       * 
       * @instance
       * @type {string}
       * @default [TOGGLE_ON]{@link module:alfresco/core/topics#TOGGLE_ON}
       * @event
       */
      toggleOnSuccessTopic: topics.TOGGLE_ON,

      /**
       * This is the topic that should be published to toggle from the "on" state to the "off" state.
       * It should be published either by one of the actions displayed in the drop-down menu
       * when the button is "on" state or from a service that handles requests to change the toggle state
       * of an item. It could also be published by an entirely unrelated widget or service if necessary.
       * The only requirement is that the 
       * [itemKeyProperty]{@link module:alfresco/renderers/ToggleStateActions#itemKeyProperty}
       * exists in the published payload to match requests against the appropriate instance of the widget.
       * 
       * @instance
       * @type {string}
       * @default [TOGGLE_OFF]{@link module:alfresco/core/topics#TOGGLE_OFF}
       * @event
       */
      toggleOffSuccessTopic: topics.TOGGLE_OFF,

      /**
       * This is the label to display on the button when toggled to the "off" state.
       * 
       * @instance
       * @type {string}
       * @default
       */
      toggleOffStateLabel: "toggle.state.off.label",

      /**
       * This is the value that the 
       * [toggleStateProperty]{@link module:alfresco/renderers/ToggleStateActions#toggleStateProperty}
       * must be in order for the button to be in toggled "on" state when first loaded.
       * 
       * @instance
       * @type {string}
       * @default
       */
      toggleStateOnValue: "node.properties.qshare:sharedId",

      /**
       * This is the property to compare against the 
       * [toggleStateOnValue]{@link module:alfresco/renderers/ToggleStateActions#toggleStateOnValue} to
       * determine whether or not the button is in the toggled "on" state. If 
       * [toggleOnWhenPropertySet]{@link module:alfresco/renderers/ToggleStateActions#toggleOnWhenPropertySet}
       * is configured to be true then the button will be toggled to the "on" state if the property
       * exists.
       * 
       * @instance
       * @type {string}
       * @default
       */
      toggleStateProperty: null,

      /**
       * If this is configured to be true then the 
       * [toggleStateProperty]{@link module:alfresco/renderers/ToggleStateActions#toggleStateProperty} only needs
       * to exist in order for the button to be toggled to the "on" state.
       * 
       * @instance
       * @type {string}
       * @default
       */
      toggleOnWhenPropertySet: false,

      /**
       * Private attribute used to determine whether or not the actions are enabled (actions are enabled
       * when the button is toggled to the "on" state).
       * 
       * @instance
       * @type {string}
       * @default
       */
      _actionsEnabled: true,

      /**
       * The unique value that uniquely identifies the item. This is set once in 
       * [postCreate]{@link module:alfresco/renderers/ToggleStateActions#postCreate} using the value of
       * [itemKeyProperty]{@link module:alfresco/renderers/ToggleStateActions#itemKeyProperty} from the
       * [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}.
       * 
       * @instance
       * @type {object}
       * @default
       */
      _itemKey: null,

      /**
       * Extends the [inherited function]{@link module:alfresco/renderers/Actions#postCreate} to 
       * retrieve the [itemKeyProperty]{@link module:alfresco/renderers/ToggleStateActions#itemKeyProperty} 
       * from the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}, set
       * the initial toggle state and to update the label, topic and payload of the associated button.
       * 
       * @instance
       * @listens module:alfresco/renderers/ToggleStateActions#toggleOnSuccessTopic
       * @listens module:alfresco/renderers/ToggleStateActions#toggleOffSuccessTopic
       */
      postCreate: function alfresco_renderers_ToggleStateActions__postCreate() {
         this.inherited(arguments);

         // Set the item key so that we can compare it against the toggle publications to
         // check whether or not the publication relates to this widget...
         this._itemKey = lang.getObject(this.itemKeyProperty, false, this.currentItem);

         // Set the initial state...
         if (this.toggleStateProperty)
         {
            if (this.toggleOnWhenPropertySet)
            {
               this._actionsEnabled = lang.exists(this.toggleStateProperty, this.currentItem);
            }
            else
            {
               var toggleState = lang.getObject(this.toggleStateProperty, false, this.currentItem);
               this._actionsEnabled = (toggleState === this.toggleStateOnValue);
            }
         }

         // Set up subscriptions to the success topics...
         this.alfSubscribe(this.toggleOnSuccessTopic, lang.hitch(this, this.toggleOn));
         this.alfSubscribe(this.toggleOffSuccessTopic, lang.hitch(this, this.toggleOff));

         // Update the button as necessary...
         this._button.publishTopic = this.toggleOnRequestTopic;
         lang.setObject("publishPayload." + this.itemKeyProperty, this._itemKey, this._button);
         this.updateButtonLabel();
      },

      /**
       * Extends the function inherited from dijit/_HasDropDown to only allow the drop-down actions
       * menu to be displayed when [_actionsEnabled]{@link module:alfresco/renderers/ToggleStateActions#_actionsEnabled}
       * is set to true.
       * 
       * @instance
       */
      toggleDropDown: function alfresco_renderers_ToggleStateActions__toggleDropDown() {
         if (this._actionsEnabled)
         {
            this.inherited(arguments);
         }
      },

      /** 
       * Handles requests to toggle the state of the button to off. The payload is checked
       * that the [_itemKey]{@link module:alfresco/renderers/ToggleStateActions#_itemKey}
       * matches the [itemKeyProperty]{@link module:alfresco/renderers/ToggleStateActions#itemKeyProperty}.
       * 
       * @instance
       * @param {object} payload The payload published requesting to toggle to the off state
       */
      toggleOn: function alfresco_renderers_ToggleStateActions__toggleOn(payload) {
         var targetItemKey = lang.getObject(this.itemKeyProperty, false, payload);
         if (targetItemKey === this._itemKey)
         {
            this._actionsEnabled = true;
            this.updateButtonLabel();
         }
      },

      /** 
       * Handles requests to toggle the state of the button to off. The payload is checked
       * that the [_itemKey]{@link module:alfresco/renderers/ToggleStateActions#_itemKey}
       * matches either the [itemKeyProperty]{@link module:alfresco/renderers/ToggleStateActions#itemKeyProperty}
       * or the [itemKeyProperty]{@link module:alfresco/renderers/ToggleStateActions#itemKeyProperty} prefixed
       * by "document.". This latter condition exists to satisfy the case where there is not intermediate
       * service between toggle request and response where the action menu item includes the
       * [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} assigned to 
       * the "document" attribute in the published payload.
       * 
       * @instance
       * @param {object} payload The payload published requesting to toggle to the off state
       */
      toggleOff: function alfresco_renderers_ToggleStateActions__toggleOn(payload) {
         var extTargetItemKey = lang.getObject(this.itemKeyProperty, false, payload);
         var intTargetItemKey = lang.getObject("document." + this.itemKeyProperty, false, payload);
         if (extTargetItemKey === this._itemKey || intTargetItemKey === this._itemKey)
         {
            this._actionsEnabled = false;
            this.updateButtonLabel();
         }
      },

      /** 
       * Sets the label of the button with either the
       * [toggleOnStateLabel]{@link module:alfresco/renderers/ToggleStateActions#toggleOnStateLabel}
       * or the [toggleOffStateLabel]{@link module:alfresco/renderers/ToggleStateActions#toggleOffStateLabel}
       * depending upon the value of 
       * [_actionsEnabled]{@link module:alfresco/renderers/ToggleStateActions#_actionsEnabled}.
       * 
       * @instance
       * @param {object} payload The payload published requesting to toggle to the off state
       */
      updateButtonLabel: function alfresco_renderers_ToggleStateActions__updateButtonLabel() {
         if (this._actionsEnabled)
         {
            this._button.set("label", this.message(this.toggleOnStateLabel));
            domClass.add(this._button.domNode, "call-to-action");
         }
         else
         {
            this._button.set("label", this.message(this.toggleOffStateLabel));
            domClass.remove(this._button.domNode, "call-to-action");
         }
      }
   });
});