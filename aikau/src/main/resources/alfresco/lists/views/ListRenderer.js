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
 * This module has been created to ensure that keyboard navigation (via the dijit/_KeyNavContainer) can be used
 * without impacting the rest of the view. An instance of this module should be created within each 
 * [document list view]{@link module:alfresco/lists/views/AlfListView} (unless a view requires 
 * a specific renderer implementation).
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
        "dojo/dom-construct",
        "dojo/dom-class",
        "dijit/registry"], 
        function(declare, _WidgetBase, _TemplatedMixin, _KeyNavContainer, template, _MultiItemRendererMixin, 
                 AlfCore, JsNode, lang, array, on, keys) {
   
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
       */
      postCreate: function alfresco_lists_views_ListRenderer__postCreate() {
         this.inherited(arguments);
         this.setupKeyboardNavigation();
         on(this.domNode, "onSuppressKeyNavigation", lang.hitch(this, this.onSuppressKeyNavigation));
         on(this.domNode, "onItemFocused", lang.hitch(this, this.onItemFocused));
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
      _onContainerKeydown: function alfresco_lists_views_ListRenderer___onContainerKeydown(evt) {
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
      _onContainerKeypress: function alfresco_lists_views_ListRenderer___onContainerKeypress(evt) {
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
      }
   });
});