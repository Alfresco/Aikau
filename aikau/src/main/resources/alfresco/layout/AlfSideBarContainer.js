/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * <p>This layout widget provides a resizeable sidebar that can be snapped open and closed into which widgets
 * can be placed. Each widget in the <b>widgets</b> array can given an optional <b>align</b> attribute that if set to
 * <b>"sidebar"</b> will result in that widget being placed into the sidebar (widgets without an <b>align</b> attribute
 * or with the <b>align</b> attribute set to any other value will be placed into the main panel).</p>
 * <p>If you don't want the sidebar to be resizeable then you can set the
 * [isResizable]{@link module:alfresco/layout/AlfSideBarContainer#isResizable} to be false. This will result in a simple
 * border separating the sidebar and main areas.</p>
 *
 * @example <caption>Example configuration placing one widget in the sidebar and the other in the main panel</caption>
 * {
 *    name: "alfresco/layout/AlfSideBarContainer",
 *    config: {
 *       widgets: [
 *          {
 *             name: "alfresco/html/Label",
 *             align: "sidebar",
 *             config: {
 *                label: "This is in the sidebar"
 *             }
 *          },
 *          {
 *             name: "alfresco/html/Label",
 *             config: {
 *                label: "This is in the main panel"
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Example configuration where the sidebar cannot be resized (with custom width)</caption>
 * {
 *    name: "alfresco/layout/AlfSideBarContainer",
 *    config: {
 *       isResizable: false,
 *       initialSidebarWidth: 250,
 *       widgets: [
 *          {
 *             name: "alfresco/html/Label",
 *             align: "sidebar",
 *             config: {
 *                label: "This is in the sidebar"
 *             }
 *          },
 *          {
 *             name: "alfresco/html/Label",
 *             config: {
 *                label: "This is in the main panel"
 *             }
 *          }
 *       ]
 *    }
 * }
 *
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
        "alfresco/core/ResizeMixin",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "dojo/text!./templates/AlfSideBarContainer.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dijit/layout/BorderContainer",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/on",
        "dojo/dom-geometry",
        "dojo/window",
        "jquery",
        "jqueryui"],
        function(declare, _WidgetBase, _TemplatedMixin, ResizeMixin, _PreferenceServiceTopicMixin, template, AlfCore,
                 CoreWidgetProcessing, BorderContainer, lang, array, domStyle, domClass, on, domGeom, win, $) {

   return declare([_WidgetBase, _TemplatedMixin, ResizeMixin, _PreferenceServiceTopicMixin, AlfCore, CoreWidgetProcessing], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfSideBarContainer.css"}]
       */
      cssRequirements: [{cssFile:"/js/lib/jquery-ui-1.12.1/jquery-ui.css"},
                        {cssFile:"./css/AlfSideBarContainer.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * It is possible to optionally provide an array of events that the widget should
       * subscribe to that trigger resize events. This has initially been added to address the problem that occurred when the
       * alfresco/wrapped/DocumentList widget would resize itself after the initial sizing causing the sidebar to render incorrectly.
       * By allowing custom events to be subscribed to it is possible to work around issues such as these.
       *
       * @instance
       * @type {array}
       * @default
       */
      customResizeTopics: null,

      /**
       * This property allows the height of the sidebar to accommodate a "sticky" footer. The height is otherwise calculated as
       * the height of the view port minus the top position of the side bar (unless either side bar or main content are larger).
       * By setting this property it is possible to also deduct the height of a sticky footer.
       *
       * @instance
       * @type {integer}
       * @default
       */
      footerHeight: 0,

      /**
       * @instance
       * @type {integer}
       */
      hiddenSidebarWidth: null,

      /**
       * The initial width (in pixels) of the sidebar
       * @instance
       * @type {number}
       * @default
       */
      initialSidebarWidth: 350,

      /**
       * Indicates whether or not the sidebar should be resizable or not.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      isResizable: true,

      /**
       * The last registered width (in pixels) of the sidebar (needed for window resize events)
       * @instance
       * @type {number}
       * @default
       */
      lastSidebarWidth: null,

      /**
       * The minimum width (in pixels) for the sidebar
       * @instance
       * @type {number}
       * @default
       */
      minSidebarWidth: 150,

      /**
       * This will be set to the resize drag handle
       *
       * @instance
       * @type {element}
       * @default
       */
      resizeHandlerNode: null,

      /**
       * Indicates whether or not to show the sidebar when initially rendered.
       * @instance
       * @type {boolean}
       */
      showSidebar: true,

      /**
       * This is the dot-notation property to use in the user preferences object to retrieve and persist
       * the preferred width of the sidebar.
       *
       * @instance
       * @type {string}
       * @default
       */
      showSidebarPreferenceId: "org.alfresco.share.documentList.showSidebar",

      /**
       * This is the dot-notation property to use in the user preferences object to retrieve and persist
       * the preferred width of the sidebar.
       *
       * @instance
       * @type {string}
       * @default
       */
      sidebarWidthPreferenceId: "org.alfresco.share.sideBarWidth",

      /**
       * Makes a request to get the users sidebar width preference.
       *
       * @instance
       */
      postMixInProperties: function alfresco_layout_AlfSideBarContainer__postMixInProperties() {
         this.alfPublish(this.getPreferenceTopic, {
            preference: this.sidebarWidthPreferenceId,
            callback: this.setSideBarWidth,
            callbackScope: this
         });
      },

      /**
       * Sets the initial sidebar width from the users saved preferences.
       *
       * @instance
       * @param {number} value The saved width preference
       */
      setSideBarWidth: function alfresco_layout_AlfSideBarContainer__setSideBarWidth(value) {
         if (value || value === 0)
         {
            this.initialSidebarWidth = value;
         }
      },

      /**
       * Adds widgets to the sidebar and main container node and sets up the event handlers for
       * resize events.
       *
       * @instance
       */
      postCreate: function alfresco_layout_AlfSideBarContainer__postCreate() {
         if (this.widgets)
         {
            array.forEach(this.widgets, lang.hitch(this, this.addWidget));
         }

         // Set up the resizer that allows the sidebar to be dynamically made larger or smaller...
         var size = parseInt(domStyle.get(this.domNode, "width"), 10);
         var max = (size - this.minSidebarWidth);
         if (max < this.minSidebarWidth)
         {
            max = null;
         }

         if (this.isResizable)
         {
            $(this.sidebarNode).resizable({
               handles: {
                  "e": ".resize-handle"
               },
               minWidth: this.minSidebarWidth,
               maxWidth: max,
               resize: lang.hitch(this, this.resizeHandler),
               stop: lang.hitch(this, this.endResizing)
            });

            on(this.resizeHandlerButtonNode, "click", lang.hitch(this, this.onResizeHandlerClick));
         }
         else
         {
            domClass.add(this.domNode, "alfresco-layout-AlfSideBarContainer--resize-disabled");
         }

         // We need to subscribe after the resize widget has been created...
         this.alfSubscribe("ALF_DOCLIST_SHOW_SIDEBAR", lang.hitch(this, this.showEventListener));

         // Subscribe to all the configured custom resize topics...
         if (this.customResizeTopics && this.customResizeTopics.length)
         {
            array.forEach(this.customResizeTopics, function(topic) {
               this.alfSubscribe(topic, lang.hitch(this, this.resizeHandler));
            }, this);
         }

         // Keep track of the overall browser window changing in size...
         this.alfSetupResizeSubscriptions(this.resizeHandler, this);
         this.addResizeListener(this.mainWidgets, this.domNode.parentNode);
         this.addResizeListener(this.sidebarWidgets, this.domNode.parentNode);

         // Perform the initial rendering...
         this.lastSidebarWidth = this.initialSidebarWidth;
         this.resizeHandler({width: this.lastSidebarWidth});
         this.render(this.showSidebar);
      },

      /**
       *
       * @instance
       * @param {object} widget The widget to add
       * @param {integer} index The index of the widget
       */
      addWidget: function alfresco_layout_AlfSideBarContainer__addWidget(widget, /*jshint unused:false*/ index) {
         var domNode = null;
         if (widget.align === "sidebar")
         {
            domNode = this.createWidgetDomNode(widget, this.sidebarWidgets);
         }
         else
         {
            domNode = this.createWidgetDomNode(widget, this.mainWidgets);
         }
         this.createWidget(widget, domNode);
      },

      /**
       *
       * @instance
       * @param {object} evt The resize event object
       * @param {object} ui The data about the resize
       */
      resizeHandler: function alfresco_layout_AlfSideBarContainer__resizeHandler(evt, ui) {

         // Adjust the widths
         var size = parseInt(domStyle.get(this.domNode, "width"), 10);
         var newWidth = this.lastSidebarWidth; // Initialise to last known width of the sidebar (needed for window resize events)
         var passedInWidth = lang.getObject("size.width", false, ui);
         if (passedInWidth || passedInWidth === 0)
         {
            newWidth = passedInWidth;
            this.lastSidebarWidth = newWidth;
         }
         domStyle.set(this.mainNode, "width", (size - newWidth - 16) + "px");
         if (!this.isResizable)
         {
            domStyle.set(this.sidebarNode, "width", newWidth + "px");
         }

         // Calculate the min-heights
         var scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0,
            widgetRect = this.domNode.getBoundingClientRect(),
            offsetTop = widgetRect.top + scrollTop,
            minHeight = window.innerHeight - offsetTop - this.footerHeight,
            newHeight = Math.max(minHeight, this.sidebarWidgets.offsetHeight, this.mainWidgets.offsetHeight),
            nodes = [this.sidebarNode, this.mainNode];
         array.forEach(nodes, function(node) {
            domStyle.set(node, "minHeight", newHeight + "px");
         });

         // Fire a custom event to let contained objects know that the node has been resized.
         this.alfPublishResizeEvent(this.mainNode);
         this.alfPublishResizeEvent(this.sidebarNode);
      },

      /**
       * Calls [resizeHandler]{@link module:alfresco/layout/AlfSideBarContainer#resizeHandler} and then
       * saves the new width as a user preference.
       *
       * @instance
       * @param {object} evt The resize event
       */
      endResizing: function alfresco_layout_AlfSideBarContainer__endResizing(evt, ui) {
         this.resizeHandler(evt, ui);
         this.alfPublish(this.setPreferenceTopic, {
            preference: this.sidebarWidthPreferenceId,
            value: this.lastSidebarWidth
         }, true);
         this.hiddenSidebarWidth = this.lastSidebarWidth;
      },

      /**
       *
       * @instance
       * @param {object} payload The payload published on the subscribed topic
       */
      showEventListener: function alfresco_layout_AlfSidebarContainer__showEventListener(payload) {
         this.alfLog("log", "Handle show request", payload);
         if (payload)
         {
            this.render(payload.selected);
            this.alfPublish(this.setPreferenceTopic, {
               preference: this.showSidebarPreferenceId,
               value: payload.selected
            }, true);
         }
      },

      /**
       * Handles a user explicitly clicking on the resize handle node to toggle the sidebar being shown
       *
       * @instance
       * @param {object} evt The click event
       */
      onResizeHandlerClick: function alfresco_layout_AlfSidebarContainer__onResizeHandlerClick(/*jshint unused:false*/ evt) {
         if (this.resizeHandlerButtonNode)
         {
            // Render the sidebar depending upon whether or not the sidebar is currently being shown or
            // not. We're using the classes applied to the drag handle node to determine whether or not
            // to show or hide the sidebar.
            this.alfPublish("ALF_DOCLIST_SHOW_SIDEBAR", {
               selected: domClass.contains(this.sidebarNode, "alfresco-layout-AlfSideBarContainer__sidebar--closed")
            });
         }
      },

      /**
       * Renders the sidebar container (basically controls whether or not the side bar is displayed or not).
       *
       * @instance
       * @param {boolean} show Indicates whether or not to show the sidebar
       */
      render: function alfresco_layout_AlfSidebarContainer__showSidebar(show) {
         if (show)
         {
            // Hide all the child nodes of the side bar (except for the resize handle)...
            for (var i=0; i<this.sidebarNode.children.length - 1; i++)
            {
               if (this.sidebarNode.children[i] !== this.resizeHandlerNode)
               {
                  domClass.remove(this.sidebarNode.children[i], "share-hidden");
               }
            }

            // Show the sidebar...
            if (this.isResizable)
            {
               $(this.sidebarNode).resizable("enable"); // Unlock the resizer when the sidebar is not shown...
            }

            var width = (this.hiddenSidebarWidth) ? this.hiddenSidebarWidth : this.initialSidebarWidth;
            domStyle.set(this.sidebarNode, "width", width + "px");

            this.lastSidebarWidth = width;
            this.resizeHandler();

            domClass.remove(this.sidebarNode, "alfresco-layout-AlfSideBarContainer__sidebar--closed");
         }
         else
         {
            // Hide the sidebar...
            domStyle.set(this.sidebarNode, "width", "9px");

            this.lastSidebarWidth = 9;
            this.resizeHandler();
            $(this.sidebarNode).resizable("disable"); // Lock the resizer when the sidebar is not shown...

            domClass.add(this.sidebarNode, "alfresco-layout-AlfSideBarContainer__sidebar--closed");
         }
      }
   });
});