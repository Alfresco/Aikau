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
 * <p>The purpose of this renderer is to provide a simple action that publishes an action 
 * based on the rendered item. It was created for use in the [DocumentListPicker]{@link module:alfresco/pickers/DocumentListPicker}
 * and [PickedItems]{@link module:alfresco/pickers/PickedItems} widgets to allow items to be
 * selected and unselected.</p>
 *
 * @module alfresco/renderers/PublishAction
 * @extends module:aikau/core/BaseWidget
 * @mixes external:dijit/_OnDijitClickMixin
 * @mixes module:alfresco/renderers/_JsNodeMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_JsNodeMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/enums/urlTypes", 
        "alfresco/util/urlUtils",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/_base/event"], 
        function(declare, BaseWidget, _OnDijitClickMixin, _JsNodeMixin, _PublishPayloadMixin, 
                 urlTypes, urlUtils, lang, domClass, event) {

   return declare([BaseWidget, _OnDijitClickMixin, _JsNodeMixin, _PublishPayloadMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/PublishAction.css"}]
       */
      cssRequirements: [{cssFile:"./css/PublishAction.css"}],

      /**
       * The alt-text for the action.
       *
       * @instance
       * @type {string}
       * @default
       */
      altText: "",

      /**
       * This property has been superseded by the [src]{@link module:alfresco/renderers/PublishAction#src} and
       * [srcType]{@link module:alfresco/renderers/PublishAction#srcType} properties, however it continues to
       * work as it did previously, which is that the name of an icon (e.g. "add-icon-16") can be specified
       * which is resolved according to the pattern `alfresco/renderers/css/images/${this.iconClass}.png`.
       *
       * @instance
       * @type {string}
       * @default
       */
      iconClass: null,

      /**
       * This property is auto-populated and will be injected into the template.
       *
       * @instance
       * @type {String}
       * @default
       * @since 1.0.68
       */
      imageSrc: null,

      /**
       * Indicates that this should only be displayed when the item (note: NOT the renderer) is
       * hovered over.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.70
       */
      onlyShowOnHover: false,

      /**
       * This defines the topic that will be published on when the associated image is clicked. The payload will be
       * the "currentItem" attribute.
       *
       * @instance
       * @type {string}
       * @default
       */
      publishTopic: "ALF_ITEM_SELECTED",

      /**
       * The URL of the image to use (this is used in conjunction with the
       * [srcType]{@link module:alfresco/renderers/PublishAction#srcType}
       * property).
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.68
       */
      src: "alfresco/renderers/css/images/add-icon-16.png",

      /**
       * The type of URL to use (see [urlTypes]{@link module:alfresco/enums/urlTypes}
       * for possible values).
       *
       * @instance
       * @type {string}
       * @default {@link module:alfresco/enums/urlTypes#REQUIRE_PATH}
       * @since 1.0.68
       */
      srcType: urlTypes.REQUIRE_PATH,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_PublishAction__createWidgetDom() {
         this.domNode = document.createElement("span");
         this.domNode.classList.add("alfresco-renderers-PublishAction");
         this.domNode.setAttribute("tabindex", "0");
         this._attach(this.domNode, "ondijitclick", lang.hitch(this, this.onClick));

         var imageNode = document.createElement("img");
         imageNode.classList.add("alfresco-renderers-PublishAction__image");
         imageNode.setAttribute("src", this.imageSrc);
         imageNode.setAttribute("alt", this.altText);
         imageNode.setAttribute("title", this.altText);

         var labelNode = document.createElement("span");
         labelNode.classList.add("alfresco-renderers-PublishAction__label");
         labelNode.textContent = this.label;

         this.domNode.appendChild(imageNode);
         this.domNode.appendChild(labelNode);
      },

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_PublishAction__postMixInProperties() {
         if (this.label) 
         {
            this.label = this.message(this.label);
         } 
         else 
         {
            this.label = "";
         }

         if (this.iconClass)
         {
            this.src = "alfresco/renderers/css/images/" + this.iconClass + ".png";
         }
         this.imageSrc = urlUtils.convertUrl(this.src, this.srcType);

         // Localize the alt text...
         var altTextId = this.currentItem ? this.currentItem[this.propertyToRender] : "";
         this.altText = this.message(this.altText, {
            0: altTextId
         });
      },

      /**
       * Ensures that CSS classes are correctly applied.
       * 
       * @instance
       * @since 1.0.70
       */
      postCreate: function alfresco_renderers_PublishAction__postCreate() {
         this.inherited(arguments);
         if (this.onlyShowOnHover === true) 
         {
            domClass.add(this.domNode, "alfresco-renderers-PublishAction--show-on-hover");
         }
      },

      /**
       * Called when the user clicks on the associated image. It publishes the current item on the 
       * [publishTopic]{@link module:alfresco/renderers/PublishAction#publishTopic} attribute.
       *
       * @instance
       * @param {object} evt The click event object
       */
      onClick: function alfresco_renderers_PublishAction__onClick(evt) {
         evt && event.stop(evt);

         this.publishPayload = this.getGeneratedPayload();
         this.alfPublish(this.publishTopic, this.publishPayload, !!this.publishGlobal, !!this.publishToParent);
      }
   });
});
