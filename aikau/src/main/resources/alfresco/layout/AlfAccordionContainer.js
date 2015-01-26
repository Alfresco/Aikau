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
 * @module alfresco/layout/AlfSideBarContainer
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfAccordionContainer.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dijit/layout/AccordionContainer",
        "dijit/layout/ContentPane",
        "dojo/dom-construct",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, AccordionContainer, ContentPane, domConstruct, lang, array) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfAccordionContainer.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfAccordionContainer.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * This will hold a reference to the accordion widget.
       *
       * @instance
       * @type {object}
       * @default null
       */
      accordionWidget: null,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_layout_AlfAccordionContainer__postCreate() {
         this.accordionWidget = new AccordionContainer({}, this.accordionNode);
         this.accordionWidget.startup();
         if (this.widgets)
         {
            array.forEach(this.widgets, lang.hitch(this, "addWidget"));
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} widget The widget to add
       * @param {integer} index The index of the widget
       */
      addWidget: function alfresco_layout_AlfAccordionContainer__addWidget(widget, index) {
         var domNode = domConstruct.create("div", {});
         var widgetNode = this.createWidgetDomNode(widget, domNode);
         var w = this.createWidget(widget, widgetNode);

         // It's necessary to add a content pane in order to get the title from the widget to appear
         // and the widget is added into the content pane...
         var cp = new ContentPane({
            title: widget.title,
            content: ""
         });
         cp.addChild(w);
         this.accordionWidget.addChild(cp);
      }
   });
});