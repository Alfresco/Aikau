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
 * @module alfresco/layout/SlidingTabs
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/SlidingTabs.html",
        "dojo/text!./templates/SlidingTabSelector.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectTypeUtils",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/dom-geometry",
        "dojo/string",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/query",
        "dojo/NodeList-dom",
        "dojo/NodeList-traverse"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, tabTemplate, AlfCore, CoreWidgetProcessing, ObjectTypeUtils, lang, array, on, domGeom, stringUtil, domConstruct, domClass, domStyle, query) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SlidingTabs.css"}]
       */
      cssRequirements: [{cssFile:"./css/SlidingTabs.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * This is the HTML template used for constructing the tab headers.
       * 
       * @instance
       * @type {string}
       */
      tabTemplateString: tabTemplate,
      
      /**
       * The number of tabs available. This is incremented as tabs are added.
       * 
       * @instance
       * @type {number}
       * @default 0
       */
      tabCount: 0,
      
      /**
       * The width of content frame. This frame will "clip" all of the content items so that only one item is shown
       * at a time. The overall width of the node containing the tabs will be equal to this value multiplied by the
       * number of tabs.
       * 
       * @instance
       * @type {number}
       * @default 200
       */
      contentFrameWidth: 1000,
      
      /**
       * @instance
       */
      postCreate: function alfresco_layout_SlidingTabs__postCreate() {
         
         // Set the content frame width...
         domStyle.set(this.contentFrameNode, "width", this.contentFrameWidth + "px");
         if (ObjectTypeUtils.isArray(this.widgets))
         {
            this.processWidgets(this.widgets, this.contentItemsNode);
         }
         else
         {
            this.alfLog("warn", "'widgets' attribute pased was not an array. No tabs will be added", this.widgets);
         }
      },
      
      /**
       * Checks that a title has been provided (no title, no tab). Creates a DOM node for the widget and add it to the body
       * Creates a DOM node for the selector and add it as a content item. Increment a tab counter so sizes can be applied
       *
       * @instance
       * @param {Element} rootNode
       * @param {object} widgetConfig
       * @param {number} index
       */
      processWidget: function alfresco_layout_SlidingTabs__processWidget(rootNode, widgetConfig, index) {
         if (this.filterWidget(widgetConfig))
         {
            // Only add the widget if it has a title...
            if (widgetConfig.title != null && widgetConfig.title != "")
            {
               // Increment the count of tabs...
               this.tabCount++;
               
               // Generate a tab number...
               var index = (widgetConfig.index != null) ? widgetConfig.index.toString() : this.generateIndexText(this.tabCount);
               var tabClass = (widgetConfig.className != null) ? widgetConfig.className.toString() : "";
               
               // Create the 
               var tabSelector = domConstruct.toDom(stringUtil.substitute(tabTemplate, {
                  tabClass: tabClass,
                  index: index,
                  title: widgetConfig.title
               }));
               
               // Set up an event handler for clicking the node...
               on(tabSelector, "click", lang.hitch(this, "tabSelected", this.tabCount + 0));
               
               domConstruct.place(tabSelector, this.navigationNode);
               
               // Make the content-items node grow to accommodate a new item...
               domStyle.set(this.contentItemsNode, "width", (this.contentFrameWidth * this.tabCount) + "px");
               
               // Process the widget as normal into the template...
               var contentItemNode = domConstruct.create("div", {className: "content-item", style: {width: this.contentFrameWidth + "px"}}, rootNode);
               var domNode = this.createWidgetDomNode(widgetConfig, contentItemNode, widgetConfig.className);
               this.createWidget(widgetConfig, domNode, this._registerProcessedWidget, this);
            }
            else
            {
               this.alfLog("warn", "Cannot add a widget as a tab without a title", widgetConfig, this);
            }
         }
      },
      
      /**
       * Allows for the text construction of a default index (e.g. an index based off the current tab).
       * 
       * @instance
       */
      generateIndexText: function alfresco_layout_SlidingTabs__generateIndexText(index) {
         if (index < 10)
         {
            return "0" + index + ".";
         }
         else
         {
            return index + ".";
         }
      },
      
      /**
       * Sets the initially selected and next tabs.
       * 
       * @instance
       */
      allWidgetsProcessed: function alfresco_layout_SlidingTabs__allWidgetsProcessed(widgets) {
         // Initially set the first and second tabs as "selected" and "next"...
         // TODO: Set these based on a # filter...
         query(".navigation", this.domNode).children().first().addClass("selected").next().addClass("next");
      },
      
      /**
       * Handles a tab selector node being clicked. 
       * 
       * @instance
       */
      tabSelected: function alfresco_layout_SlidingTabs__tabSelected(tabIndex, evt) {
         this.alfLog("log", "Tab index selected", tabIndex);
         
         // Remove the "next" class from the tab it is currently applied to and move it to the 
         // next node. Then remove the "selected" tab from the currently selected tab and add
         // it to the current node.
         query(".navigation div.next", this.domNode).removeClass("next");
         query(evt.currentTarget).next().addClass("next");
         query(".navigation div.selected", this.domNode).removeClass("selected");
         query(evt.currentTarget).addClass("selected");
         
         // Update the content items node to place the currently selected content within the frame...
         var left = "-" + ((tabIndex-1) * this.contentFrameWidth) + "px";
         domStyle.set(this.contentItemsNode, "left", left);
      }
   });
});