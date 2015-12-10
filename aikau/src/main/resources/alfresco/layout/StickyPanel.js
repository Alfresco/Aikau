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
 * @module alfresco/layout/StickyPanel
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Martin Doyle
 */
define([
      "alfresco/core/Core",
      "alfresco/core/CoreWidgetProcessing",
      "dijit/_WidgetBase",
      "dijit/_TemplatedMixin",
      "dojo/_base/declare",
      "dojo/dom-class",
      "dojo/text!./templates/StickyPanel.html",
   ],
   function(AlfCore, CoreWidgetProcessing, _WidgetBase, _TemplatedMixin, declare, domClass, template) {

      return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {

         /**
          * An array of the CSS files to use with this widget
          * 
          * @instance
          * @type {object[]}
          * @default [{cssFile:"./css/StickyPanel.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/StickyPanel.css"
         }],

         /**
          * The HTML template to use for the widget
          * 
          * @instance
          * @type {string}
          */
         templateString: template,

         /**
          * The main class for this widget
          *
          * @instance
          * @type {string}
          * @default
          */
         baseClass: "alfresco-layout-StickyPanel",

         /**
          * The title to display in the title-bar of the panel
          *
          * @instance
          * @type {string}
          * @default
          */
         title: "Information panel",

         /**
          * Run after widget created, but before sub-widgets
          *
          * @instance
          * @override
          */
         postCreate: function() {

            // Extend the method
            this.inherited(arguments);

            // Move the widget to the root node
            document.body.appendChild(this.domNode);

            // Set the title
            this.titleNode.appendChild(document.createTextNode(this.title));

            // Add child widgets
            this.processWidgets(this.widgets, this.widgetsNode);
         },

         onClickMinimiseRestore: function() {
            domClass.toggle(this.domNode, this.baseClass + "--minimised");
         }
      });
   });