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
 * Use this widget to render a column. Every widget rendered within it will be "stacked" vertically.
 * 
 * @module alfresco/lists/views/layouts/Column
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Column.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, domConstruct) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Column.css"}]
       */
      cssRequirements: [{cssFile:"./css/Column.css"}],
      
      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_Column__postCreate() {
         if (this.widgets)
         {
            this.processWidgets(this.widgets, this.containerNode);
         }
      },
      
      /**
       * Overrides the superclass implementation to add an additional TR element to get the column effect.
       * 
       * @instance
       * @param {Object} widget The widget definition to create the DOM node for
       * @param {element} rootNode The DOM node to create the new DOM node as a child of
       * @param {String} rootClassName A string containing one or more space separated CSS classes to set on the DOM node
       * @returns {element} A new DOM node for a processed widget to attach to
       */
      createWidgetDomNode: function alfresco_renderers_Column__createWidgetDomNode(widget, rootNode, rootClassName) {
         var nodeToAdd = domConstruct.create("TR", {}, rootNode);
         return domConstruct.create("TD", {}, nodeToAdd);
      }
   });
});