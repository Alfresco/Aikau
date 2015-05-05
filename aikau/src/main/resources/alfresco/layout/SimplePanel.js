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
 * This layout widget provides a simple way in which content can have a constrained 
 * [height]{@link module:alfresco/layout/SimplePanel#height} and 
 * [width]{@link module:alfresco/layout/SimplePanel#width}.
 *
 * @example <caption>Example configuration:</caption>
 * {
 *   name: "alfresco/layout/SimplePanel",
 *     config: {
 *        height: "100px",
 *        width: "100px",
 *        handleOverflow: true,
 *        widgets: [
 *           {
 *              name: "alfresco/logo/Logo"
 *           }
 *        ]
 *     }
 *  }
 *  
 * @module alfresco/layout/SimplePanel
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/SimplePanel.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/dom-class",
        "dojo/dom-style"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, domClass, domStyle) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * The height of the panel.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      height: null,

      /**
       * The width of the panel.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      width: null,

      /**
       * Controls whether or not scroll bars will be displayed as the content of the panel
       * grows beyond its dimensions. Defaults to true, if the widgets within the panel
       * manage their own overflow then this should be set to false.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      handleOverflow: true,

      /**
       * Processes the widgets into the content node.
       * 
       * @instance
       */
      postCreate: function alfresco_layout_SimplePanel__postCreate() {
         domClass.add(this.domNode, this.additionalCssClasses || "");
         if (this.handleOverflow === false)
         {
            domStyle.set(this.domNode, "overflow", "hidden");
         }
         this.height && domStyle.set(this.domNode, "height", this.height);
         this.width && domStyle.set(this.domNode, "width", this.width);
         if (this.widgets)
         {
            this.processWidgets(this.widgets, this.domNode);
         }
      }
   });
});