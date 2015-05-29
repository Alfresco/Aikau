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
 * Makes a request to bring a specific item into view, i.e. so that a previously actioned item is displayed
 * when the list data updated. The payload contains a single attribute "item" that should be a value that
 * will map to the [itemKey]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin#itemKey}
 * of the renderer (which should be configured on the [view]{@link module:alfresco/lists/views/AlfListView#itemKey}).
 *
 * @event module:alfresco/lists/views/ListRenderer~ALF_BRING_ITEM_INTO_VIEW
 * @property {string} item - This is an attribute value of the item that uniquely identifies it.
 */

/**
 * <p>This module has been created to ensure that keyboard navigation (via the dijit/_KeyNavContainer) can be used
 * without impacting the rest of the view. An instance of this module should be created within each 
 * [list view]{@link module:alfresco/lists/views/AlfListView} (unless a view requires 
 * a specific renderer implementation).</p>
 * <p>This module can be extended if required to provide custom rendering of lists. In particular it may be necessary
 * to override the [bringItemIntoView]{@link module:alfresco/lists/views/ListRenderer#bringItemIntoView} function if
 * an extending module lays out item in a non-vertical style (as the default behaviour is simply to scroll down until
 * the requested item comes into view)</p>
 * 
 * @module alfresco/lists/views/ListRenderer
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_KeyNavContainer
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_KeyNavContainer",
        "dojo/text!./templates/ListRenderer.html",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/core/Core",
        "alfresco/core/JsNode",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/keys",
        "jquery",
        "jqueryui"], 
        function(declare, _WidgetBase, _TemplatedMixin, _KeyNavContainer, template, _MultiItemRendererMixin, 
                 AlfCore, JsNode, lang, array, on, keys, $) {
   
   return declare([_WidgetBase, _TemplatedMixin, _KeyNavContainer, _MultiItemRendererMixin, AlfCore], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * The widgets to be processed to generate each item in the rendered view.
       * 
       * @instance 
       * @type {object[]} 
       * @default null
       */
      widgets: null,
      
      /**
       * Implements the widget life-cycle method to add drag-and-drop upload capabilities to the root DOM node.
       * This allows files to be dragged and dropped from the operating system directly into the browser
       * and uploaded to the location represented by the document list. 
       * 
       * @instance
       * @listens module:alfresco/lists/views/ListRenderer~event:ALF_BRING_ITEM_INTO_VIEW
       */
      postCreate: function alfresco_lists_views_ListRenderer__postCreate() {
         this.inherited(arguments);
         this.setupKeyboardNavigation();
         on(this.domNode, "onSuppressKeyNavigation", lang.hitch(this, this.onSuppressKeyNavigation));
         on(this.domNode, "onItemFocused", lang.hitch(this, this.onItemFocused));

         if (this.itemKey)
         {
            this.alfSubscribe("ALF_BRING_ITEM_INTO_VIEW", lang.hitch(this, this.onBringItemIntoView));
         }
      },

      /**
       * The ability to suppress keyboard navigation (e.g. the ability to move around the rendered list of items using
       * the keyboard) has been added to support widgets that allow inline editing (such as the
       * [InlineEditProperty]{@link alfresco/renderers/InlineEditProperty} widget). In order to allow their keyboard
       * events to bubble up to the browser, this widget needs to stop searching for keyboard navigation matches.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      suppressKeyNavigation: false,

      /**
       * Updates the [suppressKeyNavigation]{@link module:alfresco/lists/views/ListRenderer#suppressKeyNavigation}
       * with the emitted event details
       *
       * @instance
       * @param {object} evt The emitted event.
       */
      onSuppressKeyNavigation: function alfresco_lists_views_ListRenderer__onSuppressKeyNavigation(evt) {
         this.suppressKeyNavigation = evt.suppress === true;
      },
      
      /**
       * This sets up the default keyboard handling for a view. The standard controls are navigation to the
       * next item by pressing the down key and navigation to the previous item by pressing the up key.
       * 
       * @instance
       */
      setupKeyboardNavigation: function alfresco_lists_views_ListRenderer__setupKeyboardNavigation() {
         this.connectKeyNavHandlers([keys.UP_ARROW], [keys.DOWN_ARROW]);
      },
      
      /**
       * Overrides the _KevNavContainer function to call the "blur" function of the widget that has lost
       * focus (assuming it has one).
       * 
       * @instance
       */
      _onChildBlur: function alfresco_lists_views_ListRenderer___onChildBlur(widget) {
         if (typeof widget.blur === "function")
         {
            widget.blur();
         }
      },

      /**
       * Extends the function mixed in from the dijit/_KeyNavContainer module to perform no action when
       * [suppressKeyNavigation]{@link module:alfresco/lists/views/ListRenderer#suppressKeyNavigation}
       * is set to true.
       * 
       * @instance
       * @param {object} evt The keyboard event
       */
      _onContainerKeydown: function alfresco_lists_views_ListRenderer___onContainerKeydown(/*jshint unused:false*/ evt) {
         if (this.suppressKeyNavigation === false)
         {
            this.inherited(arguments);
         }
      },

      /**
       * Extends the function mixed in from the dijit/_KeyNavContainer module to perform no action when
       * [suppressKeyNavigation]{@link module:alfresco/lists/views/ListRenderer#suppressKeyNavigation}
       * is set to true.
       * 
       * @instance
       * @param {object} evt The keyboard event
       */
      _onContainerKeypress: function alfresco_lists_views_ListRenderer___onContainerKeypress(/*jshint unused:false*/ evt) {
         if (this.suppressKeyNavigation === false)
         {
            this.inherited(arguments);
         }
      },

      /**
       * Handles requests to focus a specific child item that has been clicked on. This is a custom
       * event issued from a module mixing in the 
       * [_MultiItemRendererMixin]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin}.
       *
       * @instance
       * @param {object} evt The click event
       */
      onItemFocused: function alfresco_lists_views_ListRenderer__onItemFocused(evt) {
         this.focusChild(evt.item);
      },

      /**
       * This function is called whenever a parent [list]{@link module:alfresco/lists/AlfList} publishes a request
       * to bring a specfic item into view, e.g. to ensure that a requested item that is displayed off the page is
       * brought into view by automatically setting the scroll position. This function only checks to see whether or not
       * the current widget represents that item - it does not perform the actual action to bring the item into view.
       *
       * @instance
       * @param  {object} payload The details of the item to find
       */
      onBringItemIntoView: function alfresco_lists_views_ListRenderer__onBringItemIntoView(payload) {
         if (payload && (payload.item || payload.item === 0))
         {
            array.some(this._renderedItemWidgets, function(widgets) {
               return array.some(widgets, function(widget) {

                  var found = false;
                  if (widget && 
                      widget.currentItem && 
                      (widget.currentItem[this.itemKey] || widget.currentItem[this.itemKey] === 0) &&
                      widget.currentItem[this.itemKey].toString() === payload.item)
                  {
                     this.bringItemIntoView(widget);
                     found = true;
                  }
                  return found;
               }, this);
            }, this);
         }
      },

      /**
       * This function is called to bring a specific item into the users view. By default this is done by scrolling
       * the item into view.
       *
       * @instance
       * @param {object} widget The widget to bring into view.
       */
      bringItemIntoView: function alfresco_lists_views_ListRenderer__bringItemIntoView(widget) {
         if (widget.domNode)
         {
            // Find the scroll parent and check to see if it is the document, we need to special case scrolling within
            // the document as we need to animate the scrollTop of both the html and body elements.
            var scrollParent = $(widget.domNode).scrollParent();
            if (scrollParent.is("html"))
            {
               var offset = $(widget.domNode).offset();
               $("html, body").animate({
                  scrollTop: offset.top
               });
            }
            else
            {
               // When dealing with a scrollable element within the main document we just need to calculate the 
               // appropriate position to scroll to based on the position within the item and the current
               // scrollTop value...
               var position = $(widget.domNode).position();
               var currentScrollTop = $(widget.domNode).scrollParent().scrollTop();
               var scrollTo = currentScrollTop + position.top;
               $(widget.domNode).scrollParent().animate({
                  scrollTop: scrollTo
               });
            }
         }
      }
   });
});