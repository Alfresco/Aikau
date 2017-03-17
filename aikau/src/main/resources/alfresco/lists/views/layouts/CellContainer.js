/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/lists/views/layouts/_LayoutMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @since 1.0.44
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/lists/views/layouts/_LayoutMixin",
        "alfresco/core/Core",
        "dojo/text!./templates/CellContainer.html",
        "dojo/_base/event",
        "dojo/_base/lang",
        "dojo/dom-style"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _PublishPayloadMixin, _LayoutMixin, Core, 
                 template, event, lang, domStyle) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _PublishPayloadMixin, _LayoutMixin, Core], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/CellContainer.css"}]
       */
      cssRequirements: [{cssFile:"./css/CellContainer.css"}],
      
      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,
      
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
            this.processWidgets(this.widgets, this.widgetsNode);
         }
      }
   });
});