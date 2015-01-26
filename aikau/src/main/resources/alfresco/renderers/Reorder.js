/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * <p>This renderer was originally written for the faceted search configuration page. It provides
 * the ability to render up and down arrows for each item in a list and performs publications
 * when those arrows are clicked (or actioned by the keyboard).</p>
 * <p>The [propertyToRender]{@link module:alfresco/renderers/Reorder#propertyToRender} attribute is
 * used for alt-text and title messages that attempt to create meaningful messages for visually
 * impaired users so it should be set accordingly - e.g. to the identifier of the item being rendered.
 * The message itself can be overridden by modifying the [upAltText]{@link module:alfresco/renderers/Reorder#upAltText}
 * and [downAltText]{@link module:alfresco/renderers/Reorder#downAltText} attributes.</p>
 * <p>The default up and down arrow images can be overridden by modifying the 
 * [upArrowImg]{@link module:alfresco/renderers/Reorder#upArrowImg}
 * and [downArrowImg]{@link module:alfresco/renderers/Reorder#downArrowImg} attributes.</p>
 * <p>Example model configuration:</p>
 * 
 * <p><pre>name: "alfresco/renderers/Reorder",
 * config: {
 *    propertyToRender: "displayName",
 *    moveUpPublishTopic: "",
 *    moveUpPublishPayloadType: "PROCESS",
 *    moveUpPublishPayloadModifiers: ["processCurrentItemTokens"],
 *    moveUpPublishPayloadItemMixin: true,
 *    moveUpPublishPayload: {
 *       url: "api/solr/facet-config/{filterID}?relativePos=-1"
 *    },
 *    moveDownPublishTopic: "ALF_CRUD_UPDATE",
 *    moveDownPublishPayloadType: "PROCESS",
 *    moveDownPublishPayloadModifiers: ["processCurrentItemTokens"],
 *    moveDownPublishPayloadItemMixin: true,
 *    moveDownPublishPayload: {
 *       url: "api/solr/facet-config/{filterID}?relativePos=1"
 *   }
 * }</pre></p>
 *
 * @module alfresco/renderers/Reorder
 * @extends module:alfresco/renderers/Property
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/text!./templates/Reorder.html",
        "alfresco/core/Core",
        "dojo/on",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _PublishPayloadMixin, template, AlfCore, on, lang, domClass) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, AlfCore, _PublishPayloadMixin], {
      
      /**
       * The array of file(s) containing internationalised strings.
       *
       * @instance
       * @type {object}
       * @default [{i18nFile: "./i18n/Reorder.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Reorder.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Reorder.css"}]
       */
      cssRequirements: [{cssFile:"./css/Reorder.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * This is the file name of the image to use for the icon that when clicked will move the rendered item
       * higher in the current order.
       *
       * @instance
       * @type {string}
       * @default "move-up.png"
       */
      upArrowImg: "move-up.png",

      /**
       * This is the file name of the image to use for the icon that when clicked will move the rendered item
       * higher in the current order.
       *
       * @instance
       * @type {string}
       * @default "move-down.png"
       */
      downArrowImg: "move-down.png",

      /**
       * This defines the topic that will be published on when the up icon is clicked. The payload will be
       * the "currentItem" attribute.
       *
       * @instance
       * @type {string}
       * @default "ALF_REORDER_UP"
       */
      upPublishTopic: "ALF_REORDER_UP",

      /**
       * This defines the topic that will be published on when the up icon is clicked. The payload will be
       * the "currentItem" attribute.
       *
       * @instance
       * @type {string}
       * @default "ALF_REORDER_DOWN"
       */
      downPublishTopic: "ALF_REORDER_DOWN",

      /**
       * This is the message or message key that will be used for the alt text attribute on the up arrow
       *
       * @instance
       * @type {string}
       * @default "reorder.moveup.altText"
       */
      upAltText: "reorder.moveup.altText",

      /**
       * This is the message or message key that will be used for the alt text attribute on the up arrow
       *
       * @instance
       * @type {string}
       * @default "reorder.movedown.altText"
       */
      downAltText: "reorder.movedown.altText",

      /**
       * This is the property of the current item to embed in the alt text and title of the up and down arrows.
       * It is important for accessibility reasons that the arrow alt-text contains useful information about which
       * item is to be moved.
       *
       * @instance
       * @type {string}
       * @default "displayName"
       */
      propertyToRender: "displayName",

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Reorder__postMixInProperties() {
         if (this.upArrowImageSrc == null || this.upArrowImageSrc == "")
         {
            this.upArrowImageSrc = require.toUrl("alfresco/renderers") + "/css/images/" + this.upArrowImg;
         }
         if (this.downArrowImageSrc == null || this.downArrowImageSrc == "")
         {
            this.downArrowImageSrc = require.toUrl("alfresco/renderers") + "/css/images/" + this.downArrowImg;
         }

         // Localize the alt text...
         this.upAltText = this.message(this.upAltText, {
            0: this.currentItem[this.propertyToRender]
         });
         this.downAltText = this.message(this.downAltText, {
            0: this.currentItem[this.propertyToRender]
         });
      },

      /**
       * Checks that the current item has an index attribute and checks the index to determine whether or not
       * the up or down arrow should be hidden.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_Reorder__postCreate() {
         if (this.currentItem.index === 0)
         {
            domClass.add(this.upNode, "invisible");
         }
         if (this.currentItem.isLastItem === true)
         {
            domClass.add(this.downNode, "invisible");
         }
      },

      /**
       * Publishes a payload for moving the current item up a place. The payload is generated
       * by calling the [generatePayload]{@link module:alfresco/renderers/_PublishPayloadMixin#generatePayload}
       * function using the "moveUpPublishPayload", "moveUpPublishPayloadType", "moveUpPublishPayloadItemMixin"
       * and "moveUpPublishPayloadModifiers" attributes.
       *
       * @instance
       * @param {object} evt The click event object
       */
      onUpClick: function alfresco_renderers_Reorder__onUpClick(evt) {
         this.alfLog("log", "Moving item up", this);
         var payload = this.generatePayload(this.moveUpPublishPayload, 
                                            this.currentItem, 
                                            null, 
                                            this.moveUpPublishPayloadType, 
                                            this.moveUpPublishPayloadItemMixin, 
                                            this.moveUpPublishPayloadModifiers);
         var message = this.message("reorder.moveup.success", {
            0: this.currentItem[this.propertyToRender]
         });
         payload.successMessage = message;
         this.alfPublish(this.moveUpPublishTopic, payload);
      },

      /**
       * Publishes a payload for moving the current item down a place. The payload is generated
       * by calling the [generatePayload]{@link module:alfresco/renderers/_PublishPayloadMixin#generatePayload}
       * function using the "moveDownPublishPayload", "moveDownPublishPayloadType", "moveDownPublishPayloadItemMixin"
       * and "moveDownPublishPayloadModifiers" attributes.
       * 
       * @instance
       * @param {object} evt The click event object
       */
      onDownClick: function alfresco_renderers_Reorder__onDownClick(evt) {
         this.alfLog("log", "Moving item down", this);
         var payload = this.generatePayload(this.moveDownPublishPayload, 
                                            this.currentItem, 
                                            null, 
                                            this.moveDownPublishPayloadType, 
                                            this.moveDownPublishPayloadItemMixin, 
                                            this.moveDownPublishPayloadModifiers);
         var message = this.message("reorder.movedown.success", {
            0: this.currentItem[this.propertyToRender]
         });
         payload.successMessage = message;
         this.alfPublish(this.moveDownPublishTopic, payload);
      }
   });
});