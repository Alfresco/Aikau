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
 * <p>The purpose of this renderer is to provide a simple action that publishes an action 
 * based on the rendered item. It was created for use in the [DocumentListPicker]{@link module:alfresco/pickers/DocumentListPicker}
 * and [PickedItems]{@link module:alfresco/pickers/PickedItems} widgets to allow items to be
 * selected and unselected.</p>
 *
 * @module alfresco/renderers/PublishAction
 * @extends module:alfresco/renderers/Property
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_JsNodeMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/text!./templates/PublishAction.html",
        "alfresco/core/Core",
        "service/constants/Default"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _JsNodeMixin, _PublishPayloadMixin, template, AlfCore, AlfConstants) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _JsNodeMixin, _PublishPayloadMixin, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/PublishAction.css"}]
       */
      cssRequirements: [{cssFile:"./css/PublishAction.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * This should be set to the icon to use. Currently this is just mapped to an actual image that is located
       * in the css/images folder however it should ultimately map to a CSS selector that defines a section of 
       * an image sprite.
       *
       * @instance
       * @type {string}
       * @default "add-icon-16"
       */
      iconClass: "add-icon-16",

      /**
       * The alt-text for the action.
       *
       * @instance
       * @type {string}
       * @default ""
       */
      altText: "",

      /**
       * This defines the topic that will be published on when the associated image is clicked. The payload will be
       * the "currentItem" attribute.
       *
       * @instance
       * @type {string}
       * @default "ALF_ITEM_SELECTED"
       */
      publishTopic: "ALF_ITEM_SELECTED",

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_PublishAction__postMixInProperties() {
         if (this.iconClass == null || this.iconClass === "")
         {
            this.imageSrc = require.toUrl("alfresco/renderers") + "/css/images/add-icon-16.png";
         }
         else
         {
            this.imageSrc = require.toUrl("alfresco/renderers") + "/css/images/" + this.iconClass + ".png";
         }

         // Localize the alt text...
         this.altText = this.message(this.altText, {
            0: (this.currentItem != null ? this.currentItem[this.propertyToRender] : "")
         });

         this.publishPayload = this.getGeneratedPayload();
         this.publishGlobal = (this.publishGlobal != null) ? this.publishGlobal : false;
         this.publishToParent = (this.publishToParent != null) ? this.publishToParent : false;
      },

      /**
       * Called when the user clicks on the associated image. It publishes the current item on the 
       * [publishTopic]{@link module:alfresco/renderers/PublishAction#publishTopic} attribute.
       *
       * @instance
       * @param {object} evt The click event object
       */
      onClick: function alfresco_renderers_PublishAction__onClick(evt) {
         this.alfPublish(this.publishTopic, this.publishPayload, this.publishGlobal, this.publishToParent);
      }
   });
});