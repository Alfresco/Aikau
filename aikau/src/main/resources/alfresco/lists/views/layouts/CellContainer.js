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
 * This widget has been created to be used as a widget container within a
 * [list view]{@link module:alfresco/lists/views/AlfListView} that uses a 
 * [grid renderer]{@link module:alfresco/lists/views/layouts/Grid} such as the
 * [AlfGalleryView]{@link module:alfresco/documentlibrary/AlfGalleryView}.
 * 
 * @module alfresco/lists/views/layouts/CellContainer
 * @extends module:aikau/core/BaseWidget
 * @mixes external:dijit/_OnDijitClickMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @mixes module:alfresco/lists/views/layouts/_LayoutMixin
 * @author Dave Draper
 * @since 1.0.44
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/lists/views/layouts/_LayoutMixin",
        "dojo/_base/event",
        "dojo/_base/lang",
        "dojo/dom-style"], 
        function(declare, BaseWidget, _OnDijitClickMixin, _PublishPayloadMixin, _LayoutMixin, 
                 event, lang, domStyle) {

   return declare([BaseWidget, _OnDijitClickMixin, _PublishPayloadMixin, _LayoutMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/CellContainer.css"}]
       */
      cssRequirements: [{cssFile:"./css/CellContainer.css"}],
      
      /**
       * The minimum height for each container in pixels.
       *
       * @instance
       * @type {number}
       * @default
       */
      minHeight: 100,

      /**
       * The widgets model to render.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      widgets: null,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_lists_views_layouts_CellContainer__createWidgetDom() {
         this.containerNode = this.domNode = document.createElement("tr");
         this.domNode.classList.add("alfresco-lists-views-layouts-CellContainer");
         this._attach(this.domNode, "ondijitclick", lang.hitch(this, this.onClick));

         this.widgetsNode = document.createElement("div");
         this.widgetsNode.classList.add("alfresco-lists-views-layouts-CellContainer__widgets");

         this.domNode.appendChild(this.widgetsNode);
      },

      /**
       * 
       *
       * @instance
       * @param  {object} evt The click event
       */
      onClick: function alfresco_lists_views_layouts_CellContainer__onClick(evt) {
         event.stop(evt);
         if (!this.publishTopic || lang.trim(this.publishTopic) === "")
         {
            this.alfLog("warn", "No publishTopic provided for CellContainer click", this);
         }
         else
         {
            var publishGlobal = this.publishGlobal || false;
            var publishToParent = this.publishToParent || false;
            var payload = this.generatePayload(this.publishPayload, this.currentItem, null, this.publishPayloadType, this.publishPayloadItemMixin, this.publishPayloadModifiers);
            this.alfPublish(this.publishTopic, payload, publishGlobal, publishToParent);
         }
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets} with the
       * configured [widgets model]{@link module:alfresco/lists/views/layouts/CellContainer#widgets}.
       * 
       * @instance
       */
      postCreate: function alfresco_lists_views_layouts_CellContainer__postCreate() {
         domStyle.set(this.domNode, "minHeight", this.minHeight + "px");
         if (this.widgets)
         {
            this.createChildren({
               widgets: this.widgets,
               targetNode: this.widgetsNode
            });
         }
      }
   });
});