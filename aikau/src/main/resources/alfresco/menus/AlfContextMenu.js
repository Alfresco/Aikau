/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * @module alfresco/menus/AlfContextMenu
 * @extends external:dijit/Menu
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfContextMenu.html",
        "dijit/Menu",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/menus/AlfMenuItemWrapper",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/_base/event",
        "dojo/on"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, Menu, AlfCore, CoreWidgetProcessing, AlfMenuItemWrapper, array, domClass, event, on) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfContextMenu.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfContextMenu.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * A reference to the dijit/Menu that will be created.
       *
       * @instance
       * @type {object}
       * @default null
       */
      _contextMenu: null,

      /**
       * Updates the default template with some additional CSS class information and then processes
       * the widgets supplied.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfContextMenu__postCreate() {
         
         if (this.targetNodeIds == null)
         {
            this._contextMenu = new Menu({
               targetNodeIds: [this.domNode.parentNode]
            });
         }
         else
         {
            this._contextMenu = new Menu({
               targetNodeIds: this.targetNodeIds
            });
         }

         // this.inherited(arguments);
         
         // Add a custom class to the container node (this has been done to prevent us overriding the default
         // template unnecessarily and risk losing updates)...
         domClass.add(this._contextMenu.domNode, "alfresco-menus-AlfContextMenu");
         
         // Process all the widgets which in this case will become menu items...
         if (this.widgets)
         {
            this.processWidgets(this.widgets);
         }
      },
      
      /**
       * Callback implementation following instantiation of all of the widgets defined in by the "widgets"
       * instance property. 
       * 
       * @instance
       * @param {array} widgets An array of the instantiated widgets (as defined by the widgets instance property).
       */
      allWidgetsProcessed: function alfresco_menus_AlfContextMenu__allWidgetsProcessed(widgets) {
         array.forEach(widgets, function(widget, i) {
             // Add the widget to the drop down menu...
             this._contextMenu.addChild(widget);
         }, this);
      }
   });
});