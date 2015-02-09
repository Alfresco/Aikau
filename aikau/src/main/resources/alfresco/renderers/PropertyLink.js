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
 * Extends the Property renderer ({@link module:alfresco/renderers/Property}) to provide a linked property.
 * 
 * @module alfresco/renderers/PropertyLink
 * @extends alfresco/renderers/Property
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Property",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/text!./templates/PropertyLink.html",
        "dojo/_base/event",
        "dojo/_base/lang"], 
        function(declare, Property, _OnDijitClickMixin, _PublishPayloadMixin, template, event, lang) {

   return declare([Property, _OnDijitClickMixin, _PublishPayloadMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/PropertyLink.css"}]
       */
      cssRequirements: [{cssFile:"./css/PropertyLink.css"}],

      /**
       * Overriddes the default HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * If this is set to true then the current item will be published when the link is clicked. If set to
       * false then the payload will be generated from the configured value.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      useCurrentItemAsPayload: true,

      /**
       * Handles the property being clicked. This stops the click event from propogating
       * further through the DOM (to prevent any wrapping anchor elements from triggering
       * browser navigation) and then publishes the configured topic and payload.
       *
       * @instance
       * @param {object} evt The details of the click event
       */
      onLinkClick: function alfresco_renderers_PropertyLink__onLinkClick(evt) {
         event.stop(evt);
         var publishTopic = this.getPublishTopic();
         if (publishTopic == null || lang.trim(publishTopic) == "")
         {
            this.alfLog("warn", "No publishTopic provided for PropertyLink", this);
         }
         else
         {
            var publishGlobal = (this.publishGlobal != null) ? this.publishGlobal : false;
            var publishToParent = (this.publishToParent != null) ? this.publishToParent : false;
            this.alfPublish(publishTopic, this.getPublishPayload(), publishGlobal, publishToParent);
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
      getPublishTopic: function alfresco_renderers_PropertyLink__getPublishTopic() {
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
      getPublishPayload: function alfresco_renderers_PropertyLink__getPublishPayload() {
         if (this.useCurrentItemAsPayload == true)
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
       * @default false
       */
      publishPayloadItemMixin: false,

      /**
       * Sets the default publishPayload generation to be "PROCESS" which will apply the modifier functions
       * defined in the [publishPayloadModifiers]{@link module:alfresco/renderers/PropertyLink#publishPayloadModifiers}
       * array.
       *
       * @instance
       * @type {string}
       * @default "PROCESS"
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
       * @default []
       */
      publishPayloadModifiers: ["processCurrentItemTokens", "replaceColons"]
   });
});