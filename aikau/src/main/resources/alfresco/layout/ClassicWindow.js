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
 * This is a simple layout structure that allows for a title and description to be specified as properties and for the
 * configured widgets to be placed underneath. 
 * 
 * @module alfresco/layout/ClassicWindow
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/ClassicWindow.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/dom-class"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, domClass) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/ClassicWindow"}]
       */
      cssRequirements: [{cssFile:"./css/ClassicWindow.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * The title to be rendered
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      title: "",

      /**
       * Ensures that the title and description are converted from key to localised message.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_layout_ClassicWindow__postMixInProperties() {
         if (this.title !== "")
         {
            this.title = this.message(this.title);
         }
      },
      
      /**
       * Processes the widgets into the content node.
       * 
       * @instance
       */
      postCreate: function alfresco_layout_ClassicWindow__postCreate() {
         domClass.add(this.domNode, (this.additionalCssClasses != null ? this.additionalCssClasses : ""));
         if (this.widgets != null)
         {
            this.processWidgets(this.widgets, this.contentNode);
         }
      }
   });
});