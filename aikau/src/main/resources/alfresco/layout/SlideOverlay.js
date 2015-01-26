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
 * The SlideOverlay layout allows content to be placed in an always visible container where some additional overlaid 
 * content can be animated to slide in over the top of it. An example might be where you select an item in the main
 * content and you want a configuration overlay to appear.
 * 
 * When defining the widget model to be processed simply set an attribute of "align" to "overlay" for it to be placed
 * in the overlay container and everything else will be placed in the main (or underlay) container.
 * 
 * @module alfresco/layout/SlideOverlay
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/SlideOverlay.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ResizeMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/dom-geometry",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/fx",
        "dojo/_base/fx"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, ResizeMixin, 
                 lang, array, on, domGeom, domClass, domStyle, coreFx, baseFx) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, ResizeMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SlideOverlay.css"}]
       */
      cssRequirements: [{cssFile:"./css/SlideOverlay.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * This should be configured to be an array of Strings where each string represents a topic that
       * when published on will trigger the overlay to be displayed.
       * 
       * that 
       * @instance
       * @type {string[]}
       * @default null
       */
      showTopics: null,
      
      /**
       * This should be configured to be an array of Strings where each string represents a topic that
       * when published on will trigger the overlay to be hidden.
       * 
       * @instance
       * @type {string[]}
       * @default null
       */
      hideTopics: null,
      
      /**
       * This should be configured to be an array of Strings where each string represents a custom event (e.g. 
       * one that is triggered by calling the .emit() function) that will trigger the overlay to be displayed.
       * 
       * that 
       * @instance
       * @type {string[]}
       * @default null
       */
      showEvents: null,
      
      /**
       * This should be configured to be an array of Strings where each string represents a custom event (e.g. 
       * one that is triggered by calling the .emit() function) that will trigger the overlay to be hidden.
       * 
       * @instance
       * @type {string[]}
       * @default null
       */
      hideEvents: null,
      
      /**
       * This should be configured to be an array of Strings where each string represents a topic that
       * when published on will trigger the overall height to be updated.
       * 
       * that 
       * @instance
       * @type {string[]}
       * @default null
       */
      adjustHeightTopics: null,
      
      /**
       * This should be configured to be an array of Strings where each string represents a custom event (e.g. 
       * one that is triggered by calling the .emit() function) that will trigger the overall height to be updated.
       * 
       * that 
       * @instance
       * @type {string[]}
       * @default null
       */
      adjustHeightEvents: null,
      
      /**
       * Sets up the subscriptions and event handlers to showing and hiding the overlay and then processes all
       * the configured widets to place them into the correct DOM element (i.e the underlay or the overlay).
       * 
       * @instance
       */
      postCreate: function alfresco_layout_SlideOverlay__postCreate() {
         
         // Set up all the subscription and event handlers...
         array.forEach(this.showTopics, function(topic, i) {
            this.alfSubscribe(topic, lang.hitch(this, "showOverlay"));
         }, this);
         array.forEach(this.hideTopics, function(topic, i) {
            this.alfSubscribe(topic, lang.hitch(this, "hideOverlay"));
         }, this);
         array.forEach(this.showEvents, function(eventName) {
            on(this.domNode, eventName, lang.hitch(this, "showOverlay"));
         }, this);
         array.forEach(this.hideEvents, function(eventName) {
            on(this.domNode, eventName, lang.hitch(this, "hideOverlay"));
         }, this);
         array.forEach(this.adjustHeightTopics, function(topic, i) {
            this.alfSubscribe(topic, lang.hitch(this, "adjustHeight"));
         }, this);
         array.forEach(this.adjustHeightEvents, function(eventName) {
            on(this.domNode, eventName, lang.hitch(this, "adjustHeight"));
         }, this);

         // Process the widgets..
         if (this.widgets)
         {
            // Iterate over all the widgets in the configuration object and add them...
            this.processWidgets(this.widgets);
         }
         
         // A MutationObserver allows us to capture events that occur as the DOM model is updated. 
         // Unfortunately it is not supported in all browsers, but for those that do it is possible
         // to update the height of the widget much more accurately...
         if (typeof MutationObserver === "function")
         {
            var observer = new MutationObserver(lang.hitch(this, "adjustHeight")),
                config = { attributes: true, childList: true, characterData: true, subtree: true };
            observer.observe(this.overlayNode, config);
            observer.observe(this.underlayNode, config);
         }
         
      },
      
      /**
       * @instance
       * @param {Element} rootNode
       * @param {object} widgetConfig
       * @param {number} index
       */
      processWidget: function alfresco_layout_SlideOverlay__processWidget(rootNode, widgetConfig, index) {
         if (this.filterWidget(widgetConfig))
         {
            var domNode = null;
            if (widgetConfig.align == "overlay")
            {
               domNode = this.createWidgetDomNode(widgetConfig, this.overlayNode, widgetConfig.className);
            }
            else
            {
               domNode = this.createWidgetDomNode(widgetConfig, this.underlayNode, widgetConfig.className);
            }
            this.createWidget(widgetConfig, domNode, this._registerProcessedWidget, this);
         }
      },
      
      /**
       * Used to indicate whether or not the overlay is currently hidden.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      overlayHidden: true,
      
      /**
       * This displays the overlay by sliding it in over the main node. By default this will slide
       * to the middle of the main DOM node.
       * 
       * @instance
       */
      showOverlay: function alfresco_layout_SlideOverlay__showOverlay() {
         domClass.remove(this.overlayNode, "hide");
         this.overlayHidden = false;
         window.setTimeout(lang.hitch(this, function() {
            this.alfPublishResizeEvent(this.overlayNode);
         }), 100);
      },
      
      /**
       * Adjusts the height of the overall DOM node (through animation) to be as high as is required. This
       * will either be the height of the overlay or the height of the underlay depending upon which is greater.
       * 
       * @instance
       */
      adjustHeight: function alfresco_layout_SlideOverlay__adjustHeight() {
         
         // TODO:
         // 1) Does it make sense to set inherit as the dom node height when the overlay is not displayed (this allows the dom to be updated)
         // 2) How to adjust height of the overlay as it changes
         
         // Get the current computed heights of both the overlay and underlay...
         var overlayMarginBox = domGeom.getMarginBox(this.overlayNode),
             underlayMarginBox = domGeom.getMarginBox(this.underlayNode);

         // Pick the tallest and set it on the DOM node...
         var newHeight = (overlayMarginBox.h > underlayMarginBox.h) ? overlayMarginBox.h : underlayMarginBox.h;
         baseFx.animateProperty({
            node: this.domNode,
            properties: {
               height: newHeight
            }
         }).play();
      },
      
      /**
       * Hides the overlay.
       * 
       * @instance
       */
      hideOverlay: function alfresco_layout_SlideOverlay__hideOverlay() {
         domClass.add(this.overlayNode, "hide");
         this.overlayHidden = true;
      }
   });
});