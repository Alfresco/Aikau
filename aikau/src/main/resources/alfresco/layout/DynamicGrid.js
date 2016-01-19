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
 * @module alfresco/layout/DynamicGrid
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/DynamicGrid.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/dom-construct",
        "jquery"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, AlfConstants,
                 lang, domClass, domConstruct, $) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/DynamicGrid"}]
       */
      cssRequirements: [{cssFile:"./css/DynamicGrid.css"},
                        {cssFile:"/js/lib/gridster/dist/jquery.gridster.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      _gridManager: null,

      buildGrid: function alfresco_layout_DynamicGrid__buildGrid() {
         this._gridManager = $(".gridster").gridster({
            widget_base_dimensions: [100, 55],
            widget_margins: [5, 5],
            autogrow_cols: true,
            resize: {
               enabled: true
            }
         }).data("gridster");

         if (this.widgets)
         {
            this.processWidgets(this.widgets);
         }
      },

      createWidgetDomNode: function alfresco_core_CoreWidgetProcessing__createWidgetDomNode(widget, rootNode, rootClassName) {
         var addedElements = this._gridManager.add_widget("<div class='alfresco-layout-DynamicGrid__cell'></div>",3,3);
         var domNode = addedElements[0];
         return domConstruct.create("div", {}, domNode);
      },

      /**
       * Processes the widgets into the content node.
       * 
       * @instance
       */
      postCreate: function alfresco_layout_DynamicGrid__postCreate() {
         require([AlfConstants.URL_RESCONTEXT + "js/lib/gridster/dist/jquery.gridster.js"], lang.hitch(this, this.buildGrid));
      }
   });
});