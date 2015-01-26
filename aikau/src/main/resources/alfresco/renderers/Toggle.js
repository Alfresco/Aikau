/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/renderers/_ItemLinkMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/renderers/_JsNodeMixin",
        "dojo/text!./templates/Toggle.html",
        "alfresco/core/Core",
        "alfresco/renderers/_ItemLinkMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, _WidgetBase, _TemplatedMixin, _JsNodeMixin, template, AlfCore, _ItemLinkMixin, _OnDijitClickMixin, lang, domClass) {

   return declare([_WidgetBase, _TemplatedMixin, _JsNodeMixin, AlfCore, _ItemLinkMixin, _OnDijitClickMixin], {
      
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
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string}
       * @default "toggle.on.label"
       */
      onLabel: "toggle.on.label",
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string} 
       * @default "toggle.off.label"
       */
      offLabel: "toggle.off.label",
      
      /**
       * The tooltip to show when the toggle is on
       * @instance
       * @type {string}
       * @default "toggle.on.tooltip"
       */
      onTooltip: "toggle.on.tooltip",
      
      /**
       * The tooltip to show when the toggle is on
       * @instance
       * @type {string} 
       * @default "toggle.off.tooltip"
       */
      offTooltip: "toggle.off.tooltip",
      
      /**
       * The CSS class to apply for the on display
       * @instance
       * @type {string} 
       * @default ""
       */
      toggleClass: "",
      
      /**
       * The topic to publish on when the toggle is switched "on"
       * @instance
       * @type {string}
       * @default null
       */
      toggleOnTopic: null,
      
      /**
       * The topic to subscribe to for successful toggle "on" events
       * @instance
       * @type {string} 
       * @default null
       */
      toggleOnSuccessTopic: null,
      
      /**
       * The topic to subscribe to for failed toggle "on" events
       * @instance
       * @type {string} 
       * @default null
       */
      toggleOnFailureTopic: null,
      
      /**
       * The topic to publish on when the toggle is switched "off"
       * @instance
       * @type {string} 
       * @default null
       */
      toggleOffTopic: null,
      
      /**
       * The topic to subscribe to for successful toggle "off" events
       * @instance
       * @type {string} 
       * @default null
       */
      toggleOffSuccessTopic: null,
      
      /**
       * The topic to subscribe to for failure toggle "off" events
       * @instance
       * @type {string} 
       * @default null
       */
      toggleOffFailureTopic: null,
      
      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Toggle__postMixInProperties() {
         this.onLabel = this.message(this.onLabel);
         this.offLabel = this.message(this.offLabel);
         this.onTooltip = this.message(this.onTooltip);
         this.offTooltip = this.message(this.offTooltip);
         
         /* Check to see if topics are set for toggling on and off. If there is toggle topic
          * for publishing events but not for subscriptions (e.g. to check success or failures)
          * then set them to be the publish topic with "_SUCCESS" and "_FAILURE" appended respectively
          * as this matches the pattern provided by the generic handlers of "alfresco/core/CoreXhr".
          * (obviously if they have been set then leave them as they are).
          */
         if (this.toggleOnTopic != null)
         {
            if (this.toggleOnSuccessTopic == null)
            {
               this.toggleOnSuccessTopic = this.toggleOnTopic + "_SUCCESS";
            }
            if (this.toggleOnFailureTopic == null)
            {
               this.toggleOnFailureTopic = this.toggleOnTopic + "_FAILURE";
            }
         }
         if (this.toggleOffTopic != null)
         {
            if (this.toggleOffSuccessTopic == null)
            {
               this.toggleOffSuccessTopic = this.toggleOffTopic + "_SUCCESS";
            }
            if (this.toggleOffFailureTopic == null)
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
       * @default null
       */
      propertyToRender: null,

      /**
       * Override this to select the item property to toggle on.
       * 
       * @instance
       * @returns {boolean} Indicating the initial state of the toggle.
       */
      getInitialState: function alfresco_renderers_Toggle__getInitialState() {
         if (this.propertyToRender != null)
         {
            return (lang.getObject(this.propertyToRender, false, this.currentItem) == true);
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
         var responseTopic = this.pubSubScope + this.generateUuid();
         this._successHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onToggleOnSuccess), true);
         this._failureHandle = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onToggleOnFailure), true);
         this.alfPublish(this.toggleOnTopic, {
            alfResponseTopic: responseTopic,
            node: this.currentItem
         }, true);
      },
      
      /**
       * This function is called whenever the toggle is switched to the "off" state. It publishes
       * on the "toggleOffTopic" attribute.
       * 
       * @instance
       */
      toggledOff: function alfresco_renderers_Toggle__toggledOff() {
         var responseTopic = this.pubSubScope + this.generateUuid();
         this._successHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onToggleOffSuccess), true);
         this._failureHandle = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onToggleOffFailure), true);
         this.alfPublish(this.toggleOffTopic, {
            alfResponseTopic: responseTopic,
            node: this.currentItem
         }, true);
      },
      
      /**
       * Handles removing subscription handles setup during requests to toggle on or off
       * 
       * @instance
       */
      removeSubscriptionHandles: function alfresco_renderers_Toggle__removeSubscriptionHandles() {
         if (this._successHandle != null)
         {
            this.alfUnsubscribe(this._successHandle);
         }
         if (this._failureHandle != null)
         {
            this.alfUnsubscribe(this._failureHandle);
         }
      },

      /**
       * Called whenever the "toggleOnSuccessTopic" attribute is published on
       * @instance
       */
      onToggleOnSuccess: function alfresco_renderers_Toggle__onToggleOnSuccess(payload) {
         this.removeSubscriptionHandles();
         this.isToggleOn = true;
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.onNode, "hidden");
      },
      
      /**
       * Called whenever the "toggleOnFailureTopic" attribute is published on
       * @instance
       */
      onToggleOnFailure: function alfresco_renderers_Toggle__onToggleOnFailure(payload) {
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
      onToggleOffSuccess: function alfresco_renderers_Toggle__onToggleOffSuccess(payload) {
         this.removeSubscriptionHandles();
         this.isToggleOn = false;
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.offNode, "hidden");
      },
      
      /**
       * Called whenever the "toggleOffFailureTopic" attribute is published on
       * @instance
       */
      onToggleOffFailure: function alfresco_renderers_Toggle__onToggleOffFailure(payload) {
         this.removeSubscriptionHandles();
         this.isToggleOn = true;
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.onNode, "hidden");
         domClass.remove(this.warningNode, "hidden");
      }
   });
});