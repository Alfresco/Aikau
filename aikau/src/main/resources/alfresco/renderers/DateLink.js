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
 * Extends the Date renderer ({@link module:alfresco/renderers/Date}) to provide a linked date.
 * 
 * @module alfresco/renderers/DateLink
 * @extends alfresco/renderers/Date
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Date",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/navigation/LinkClickMixin",
        "dojo/_base/event",
        "dojo/_base/lang"], 
        function(declare, Date, _OnDijitClickMixin, _PublishPayloadMixin, LinkClickMixin, event, lang) {

   return declare([Date, _OnDijitClickMixin, _PublishPayloadMixin, LinkClickMixin], {

      /**
       * If this is set to true then the current item will be published when the link is clicked. If set to
       * false then the payload will be generated from the configured value.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      useCurrentItemAsPayload: true,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_DateLink__createWidgetDom() {
         this.renderedValueNode = this.domNode = document.createElement("span");
         this.domNode.classList.add("alfresco-renderers-DateLink");

         var innerNode = document.createElement("span");
         innerNode.classList.add("inner");
         innerNode.setAttribute("tabindex", "0");
         this._attach(innerNode, "ondijitclick", lang.hitch(this, this.onLinkClick));

         var label = document.createElement("span");
         label.classList.add("label");
         label.textContent = this.label;

         var value = document.createElement("span");
         value.classList.add("value");
         value.innerHTML = this.renderedValue;

         innerNode.appendChild(label);
         innerNode.appendChild(value);
         this.domNode.appendChild(innerNode);
      },

      /**
       * Handles the date being clicked. This stops the click event from propogating
       * further through the DOM (to prevent any wrapping anchor elements from triggering
       * browser navigation) and then publishes the configured topic and payload.
       *
       * @instance
       * @param {object} evt The details of the click event
       */
      onLinkClick: function alfresco_renderers_DateLink__onLinkClick(evt) {
         event.stop(evt);
         var publishTopic = this.getPublishTopic();
         if (!publishTopic || !lang.trim(publishTopic))
         {
            this.alfLog("warn", "No publishTopic provided for DateLink", this);
         }
         else
         {
            var payload = this.getPublishPayload();
            this.processMiddleOrCtrlClick(evt, publishTopic, payload);
            var publishGlobal = this.publishGlobal || false;
            var publishToParent = this.publishToParent || false;
            this.alfPublish(publishTopic, payload, publishGlobal, publishToParent);
         }
      },

      /**
       * Gets the topic to be published on. This has been abstracted to a separate function
       * so that it can be easily overridden, an example of this is the 
       * [SearchResultPropertyLink]{@link module:alfresco/search/SearchResultPropertyLink}
       *
       * @instance
       * @returns {string} The configured publishTopic
       */ 
      getPublishTopic: function alfresco_renderers_DateLink__getPublishTopic() {
         return this.publishTopic;
      },

      /**
       * Gets the topic to be published on. This has been abstracted to a separate function
       * so that it can be easily overridden, an example of this is the 
       * [SearchResultPropertyLink]{@link module:alfresco/search/SearchResultPropertyLink}
       *
       * @instance
       * @returns {string} The currentItem being renderered.
       */ 
      getPublishPayload: function alfresco_renderers_DateLink__getPublishTopic() {
         if (this.useCurrentItemAsPayload === true)
         {
            return this.currentItem;
         }
         else
         {
            return this.generatePayload(this.publishPayload, this.currentItem, null, this.publishPayloadType, this.publishPayloadItemMixin, this.publishPayloadModifiers);
         }
      },

      /**
       * Sets the default behaviour to prevent the currentItem from being mixed into the publishPayload.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      publishPayloadItemMixin: false,

      /**
       * Sets the default publishPayload generation to be "PROCESS" which will apply the modifier functions
       * defined in the [publishPayloadModifiers]{@link module:alfresco/renderers/PropertyLink#publishPayloadModifiers}
       * array.
       *
       * @instance
       * @type {string}
       * @default
       */
      publishPayloadType: "PROCESS",

      /**
       * Sets the default modifiers to use. These will automatically perform token substitution with values
       * from the current item and replace any colons with underscores. These modifiers will only be applied 
       * if the [publishPayloadType]{@link module:alfresco/renderers/PropertyLink#publishPayloadType} is not 
       * changed from "PROCESS".
       *
       * @instance
       * @type {array}
       * @default ["processCurrentItemTokens", "replaceColons"]
       */
      publishPayloadModifiers: ["processCurrentItemTokens", "replaceColons"]
   });
});