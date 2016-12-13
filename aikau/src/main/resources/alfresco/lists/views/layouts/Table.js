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
 * Use this widget to render a table of [rows]{@link module:alfresco/lists/views/layouts/Row}
 *
 * @module alfresco/lists/views/layouts/Table
 * @extends module:aikau/core/BaseWidget
 * @mixes module:alfresco/lists/views/layouts/_LayoutMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/lists/views/layouts/_LayoutMixin"],
        function(declare, BaseWidget, _LayoutMixin) {

   return declare([BaseWidget, _LayoutMixin], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Table.css"}]
       */
      cssRequirements: [{cssFile:"./css/Table.css"}],

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_lists_views_layouts_Table__createWidgetDom() {
         this.containerNode = this.domNode = document.createElement("table");
         this.domNode.classList.add("alfresco-lists-views-layouts-Table");
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       *
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_Table__postCreate() {
         if (this.widgets)
         {
            this.createChildren({
               widgets: this.widgets,
               targetNode: this.containerNode
            });
         }
      }
   });
});