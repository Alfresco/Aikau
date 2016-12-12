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
 * @module alfresco/renderers/Toggle
 * @extends module:aikau/core/BaseWidget
 * @mixes module:alfresco/renderers/_JsNodeMixin
 * @mixes module:alfresco/renderers/_ItemLinkMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/renderers/_JsNodeMixin",
        "alfresco/renderers/_ItemLinkMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, BaseWidget, _JsNodeMixin, _ItemLinkMixin, _PublishPayloadMixin,
                 _OnDijitClickMixin, lang, domClass) {

   return declare([BaseWidget, _JsNodeMixin, _ItemLinkMixin, _PublishPayloadMixin, _OnDijitClickMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Toggle.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Toggle.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Toggle.css"}]
       */
      cssRequirements: [{cssFile:"./css/Toggle.css"}],
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string}
       * @default
       */
      onLabel: "toggle.on.label",
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string} 
       * @default
       */
      offLabel: "toggle.off.label",
      
      /**
       * The tooltip to show when the toggle is on
       * @instance
       * @type {string}
       * @default
       */
      onTooltip: "toggle.on.tooltip",
      
      /**
       * The tooltip to show when the toggle is on
       * @instance
       * @type {string} 
       * @default
       */
      offTooltip: "toggle.off.tooltip",
      
      /**
       * The property of the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} to 
       * use as the identifier in the tooltips.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       */
      tooltipIdProperty: null,

      /**
       * The CSS class to apply for the on display
       * @instance
       * @type {string} 
       * @default
       */
      toggleClass: "",
      
      /**
       * The topic to publish on when the toggle is switched "on"
       * @instance
       * @type {string}
       * @default
       */
      toggleOnTopic: null,
      
      /**
       * The topic to subscribe to for successful toggle "on" events
       * @instance
       * @type {string} 
       * @default
       * @event
       */
      toggleOnSuccessTopic: null,
      
      /**
       * The topic to subscribe to for failed toggle "on" events
       * @instance
       * @type {string} 
       * @default
       * @event
       */
      toggleOnFailureTopic: null,
      
      /**
       * The topic to publish on when the toggle is switched "off"
       * @instance
       * @type {string} 
       * @default
       * @event
       */
      toggleOffTopic: null,
      
      /**
       * The topic to subscribe to for successful toggle "off" events
       * @instance
       * @type {string} 
       * @default
       * @event
       */
      toggleOffSuccessTopic: null,
      
      /**
       * The topic to subscribe to for failure toggle "off" events
       * 
       * @instance
       * @type {string} 
       * @default
       * @event
       */
      toggleOffFailureTopic: null,

      /**
       * The payload to publish when toggling to the on state.
       * 
       * @instance
       * @type {object}
       * @default
       * @since 1.0.86
       */
      toggleOnPublishPayload: null,

      /**
       * The type of payload being published when toggling to the on state.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       */
      toggleOnPublishPayloadType: null,

      /**
       * Whether or not to publish globally when toggling to the on state.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.86
       */
      toggleOnPublishGlobal: false,

      /**
       * Whether or not to publish on the global scope when toggling to the on state.
       *
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.86
       */
      toggleOnPublishToParent: false,

      /**
       * A custom scope to publish on when toggling to the on state.
       * 
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.86
       */
      toggleOnPublishScope: null,

      /**
       * The modifiers to apply to the payload published when toggling to the on state (on applies when
       * the [toggleOnPublishPayloadType]{@link module:alfresco/renderers/Toggle#toggleOnPublishPayloadType}
       * is configured to be "PROCESS").
       * 
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.86
       */
      toggleOnPublishPayloadModifiers: false,

      /**
       * Indicates whether or not the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}
       * should be mixed into the payload published when toggling to the on state.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.86
       */
      toggleOnPublishPayloadItemMixin: false,

      /**
       * The payload to publish when toggling to the off state.
       * 
       * @instance
       * @type {object}
       * @default
       * @since 1.0.86
       */
      toggleOffPublishPayload: null,

      /**
       * The type of payload being published when toggling to the off state.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       */
      toggleOffPublishPayloadType: null,

      /**
       * Whether or not to publish globally when toggling to the off state.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.86
       */
      toggleOffPublishGlobal: false,

      /**
       * Whether or not to publish on the global scope when toggling to the off state.
       *
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.86
       */
      toggleOffPublishToParent: false,

      /**
       * A custom scope to publish on when toggling to the off state.
       * 
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.86
       */
      toggleOffPublishScope: null,

      /**
       * The modifiers to apply to the payload published when toggling to the off state (on applies when
       * the [toggleOffPublishPayloadType]{@link module:alfresco/renderers/Toggle#toggleOffPublishPayloadType}
       * is configured to be "PROCESS").
       * 
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.86
       */
      toggleOffPublishPayloadModifiers: false,

      /**
       * Indicates whether or not the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}
       * should be mixed into the payload published when toggling to the off state.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.86
       */
      toggleOffPublishPayloadItemMixin: false,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_Toggle__createWidgetDom() {
         // jshint maxstatements:false
         this.domNode = document.createElement("span");
         this.domNode.classList.add("alfresco-renderers-Toggle");
         this._attach(this.domNode, "ondijitclick", lang.hitch(this, this.onClick));

         this.processingNode = document.createElement("span");
         this.processingNode.classList.add("processing");
         this.processingNode.classList.add(this.toggleClass);
         this.processingNode.classList.add("hidden");

         this.onNode = document.createElement("a");
         this.onNode.classList.add("on");
         this.onNode.classList.add(this.toggleClass);
         this.onNode.classList.add("hidden");
         this.onNode.classList.add("enabled");
         this.onNode.setAttribute("title", this.onTooltip);
         this.onNode.setAttribute("alt", this.onTooltip);
         this.onNode.setAttribute("tabindex", "0");
         this.onNode.textContent = this.onLabel;

         this.offNode = document.createElement("a");
         this.offNode.classList.add("off");
         this.offNode.classList.add(this.toggleClass);
         this.offNode.classList.add("hidden");
         this.offNode.setAttribute("title", this.offTooltip);
         this.offNode.setAttribute("alt", this.offTooltip);
         this.offNode.setAttribute("tabindex", "0");
         this.offNode.textContent = this.offLabel;

         this.warningNode = document.createElement("span");
         this.warningNode.classList.add("warning");
         this.warningNode.classList.add(this.toggleClass);
         this.warningNode.classList.add("hidden");

         this.domNode.appendChild(this.processingNode);
         this.domNode.appendChild(this.onNode);
         this.domNode.appendChild(this.offNode);
         this.domNode.appendChild(this.warningNode);
      },

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Toggle__postMixInProperties() {
         this.onLabel = this.message(this.onLabel);
         this.offLabel = this.message(this.offLabel);

         var tooltipId = "";
         if (this.tooltipIdProperty)
         {
            tooltipId = lang.getObject(this.tooltipIdProperty, false, this.currentItem);
         }
         this.onTooltip = this.message(this.onTooltip, {
            0: tooltipId || ""
         });
         this.offTooltip = this.message(this.offTooltip, {
            0: tooltipId || ""
         });
         
         /* Check to see if topics are set for toggling on and off. If there is toggle topic
          * for publishing events but not for subscriptions (e.g. to check success or failures)
          * then set them to be the publish topic with "_SUCCESS" and "_FAILURE" appended respectively
          * as this matches the pattern provided by the generic handlers of "alfresco/core/CoreXhr".
          * (obviously if they have been set then leave them as they are).
          */
         if (this.toggleOnTopic)
         {
            if (!this.toggleOnSuccessTopic)
            {
               this.toggleOnSuccessTopic = this.toggleOnTopic + "_SUCCESS";
            }
            if (!this.toggleOnFailureTopic)
            {
               this.toggleOnFailureTopic = this.toggleOnTopic + "_FAILURE";
            }
         }
         if (this.toggleOffTopic)
         {
            if (!this.toggleOffSuccessTopic)
            {
               this.toggleOffSuccessTopic = this.toggleOffTopic + "_SUCCESS";
            }
            if (!this.toggleOffFailureTopic)
            {
               this.toggleOffFailureTopic = this.toggleOffTopic + "_FAILURE";
            }
         }
      },
      
      /**
       * @instance
       */
      isToggleOn: null,
      
      /**
       * This should be set to the dot-notation property in the current item to use to render the 
       * state.
       *
       * @instance
       * @type {string}
       * @default
       */
      propertyToRender: null,

      /**
       * Override this to select the item property to toggle on.
       * 
       * @instance
       * @returns {boolean} Indicating the initial state of the toggle.
       */
      getInitialState: function alfresco_renderers_Toggle__getInitialState() {
         if (this.propertyToRender)
         {
            return (lang.getObject(this.propertyToRender, false, this.currentItem) === true);
         }
         else
         {
            return false;
         }
      },
      
      /**
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_Toggle__postCreate() {
         this.isToggleOn = this.getInitialState();
         if (this.isToggleOn)
         {
            domClass.remove(this.onNode, "hidden");
         }
         else
         {
            domClass.remove(this.offNode, "hidden");
         }
      },
      
      /**
       * Toggle between the on and off states
       * 
       * @instance
       */
      onClick: function alfresco_renderers_Toggle__onClick() {
         if (this.isToggleOn)
         {
            this.renderToggledOff();
            this.toggledOff();
         }
         else
         {
            this.renderToggledOn();
            this.toggledOn();
         }
      },
      
      /**
       * Renders the appearance of the toggle when in the "on" position
       * 
       * @instance
       */
      renderToggledOn: function alfresco_renderers_Toggle__renderToggledOn() {
         domClass.add(this.warningNode, "hidden");
         domClass.add(this.offNode, "hidden");
         domClass.remove(this.processingNode, "hidden");
      },
      
      /**
       * Renders the appearance of the toggle when in the "off" position
       * 
       * @instance
       */
      renderToggledOff: function alfresco_renderers_Toggle__renderToggledOff() {
         domClass.add(this.warningNode, "hidden");
         domClass.add(this.onNode, "hidden");
         domClass.remove(this.processingNode, "hidden");
      },
      
      /**
       * This function is called whenever the toggle is switched to the "on" state. It publishes
       * on the "toggleOnTopic" attribute.
       * 
       * @instance
       */
      toggledOn: function alfresco_renderers_Toggle__toggledOn() {
         var responseTopic = this.generateUuid();
         this._successHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onToggleOnSuccess), true);
         this._failureHandle = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onToggleOnFailure), true);
         if (this.toggleOnPublishPayload)
         {
            var publishPayload = this.generatePayload(this.toggleOnPublishPayload, 
                                                      this.currentItem, 
                                                      null, 
                                                      this.toggleOnPublishPayloadType, 
                                                      this.toggleOnPublishPayloadItemMixin, 
                                                      this.toggleOnPublishPayloadModifiers);
            publishPayload.alfResponseTopic = responseTopic;
            publishPayload.alfSuccessTopic = responseTopic + "_SUCCESS";
            publishPayload.alfFailureTopic = responseTopic + "_FAILURE";
            this.alfPublish(this.toggleOnTopic, publishPayload, this.toggleOnPublishGlobal, this.toggleOnPublishToParent, this.toggleOnPublishScope);
         }
         else
         {
            this.alfPublish(this.toggleOnTopic, {
               alfResponseTopic: responseTopic,
               alfSuccessTopic: responseTopic + "_SUCCESS",
               alfFailureTopic: responseTopic + "_FAILURE",
               node: this.currentItem
            }, true);
         }
      },
      
      /**
       * This function is called whenever the toggle is switched to the "off" state. It publishes
       * on the "toggleOffTopic" attribute.
       * 
       * @instance
       */
      toggledOff: function alfresco_renderers_Toggle__toggledOff() {
         var responseTopic = this.generateUuid();
         this._successHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onToggleOffSuccess), true);
         this._failureHandle = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onToggleOffFailure), true);
         if (this.toggleOffPublishPayload)
         {
            var publishPayload = this.generatePayload(this.toggleOffPublishPayload, 
                                                      this.currentItem, 
                                                      null, 
                                                      this.toggleOffPublishPayloadType, 
                                                      this.toggleOffPublishPayloadItemMixin, 
                                                      this.toggleOffPublishPayloadModifiers);
            publishPayload.alfResponseTopic = responseTopic;
            publishPayload.alfSuccessTopic = responseTopic + "_SUCCESS";
            publishPayload.alfFailureTopic = responseTopic + "_FAILURE";
            this.alfPublish(this.toggleOffTopic, publishPayload, this.toggleOffPublishGlobal, this.toggleOffPublishToParent, this.toggleOffPublishScope);
         }
         else
         {
            this.alfPublish(this.toggleOffTopic, {
               alfResponseTopic: responseTopic,
               alfSuccessTopic: responseTopic + "_SUCCESS",
               alfFailureTopic: responseTopic + "_FAILURE",
               node: this.currentItem
            }, true);
         }
      },
      
      /**
       * Handles removing subscription handles setup during requests to toggle on or off
       * 
       * @instance
       */
      removeSubscriptionHandles: function alfresco_renderers_Toggle__removeSubscriptionHandles() {
         if (this._successHandle)
         {
            this.alfUnsubscribe(this._successHandle);
         }
         if (this._failureHandle)
         {
            this.alfUnsubscribe(this._failureHandle);
         }
      },

      /**
       * Called whenever the "toggleOnSuccessTopic" attribute is published on
       * @instance
       */
      onToggleOnSuccess: function alfresco_renderers_Toggle__onToggleOnSuccess(/*jshint unused:false*/ payload) {
         this.removeSubscriptionHandles();
         this.isToggleOn = true;
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.onNode, "hidden");
      },
      
      /**
       * Called whenever the "toggleOnFailureTopic" attribute is published on
       * @instance
       */
      onToggleOnFailure: function alfresco_renderers_Toggle__onToggleOnFailure(/*jshint unused:false*/ payload) {
         this.removeSubscriptionHandles();
         this.isToggleOn = false;
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.offNode, "hidden");
         domClass.remove(this.warningNode, "hidden");
      },
      
      /**
       * Called whenever the "toggleOffSuccessTopic" attribute is published on
       * @instance
       */
      onToggleOffSuccess: function alfresco_renderers_Toggle__onToggleOffSuccess(/*jshint unused:false*/ payload) {
         this.removeSubscriptionHandles();
         this.isToggleOn = false;
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.offNode, "hidden");
      },
      
      /**
       * Called whenever the "toggleOffFailureTopic" attribute is published on
       * @instance
       */
      onToggleOffFailure: function alfresco_renderers_Toggle__onToggleOffFailure(/*jshint unused:false*/ payload) {
         this.removeSubscriptionHandles();
         this.isToggleOn = true;
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.onNode, "hidden");
         domClass.remove(this.warningNode, "hidden");
      }
   });
});