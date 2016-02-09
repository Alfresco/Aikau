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
 * This widget is used by the [NotificationService]{@link module:alfresco/services/NotificationService}
 * to display a sticky panel attached to the bottom of the screen. It should not be instantiated
 * directly.
 * 
 * @module alfresco/layout/StickyPanel
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Martin Doyle
 * @since 1.0.48
 */
define(["alfresco/core/Core", 
        "alfresco/core/CoreWidgetProcessing", 
        "alfresco/core/topics", 
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin", 
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/dom-class", 
        "dojo/dom-style", 
        "dojo/text!./templates/StickyPanel.html"],
        function(AlfCore, CoreWidgetProcessing, topics, _WidgetBase, _TemplatedMixin, declare, lang, domClass, domStyle, template) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/StickyPanel.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/StickyPanel.properties"}],

      /**
       * An array of the CSS files to use with this widget
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/StickyPanel.css"}]
       */
      cssRequirements: [{cssFile: "./css/StickyPanel.css"}],

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
       * The width of the panel. Can be provided as a CSS dimension (e.g. 50%, 100px)
       * or a pure number, which will be treated as pixels.
       *
       * @instance
       * @type {string|number}
       * @default
       */
      panelWidth: "50%",

      /**
       * The title to display in the title-bar of the panel
       *
       * @instance
       * @type {string}
       * @default
       */
      title: "default.title",

      /**
       * The widgets to display inside the panel
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgets: null,

      /**
       * The padding to apply around the widgets, in pixels.
       *
       * @instance
       * @type {number}
       * @default
       */
      widgetsPadding: 10,

      /**
       * Mix in properties after instance created.
       *
       * @instance
       * @override
       */
      postMixInProperties: function alfresco_layout_StickyPanel__postMixInProperties() {
         this.inherited(arguments);
         this.title = this.message(this.title || "");
      },

      /**
       * Run after widget created, but before sub-widgets.
       *
       * @instance
       * @override
       */
      postCreate: function alfresco_layout_StickyPanel__postCreate() {
         this.inherited(arguments);
         this.setupSubscriptions();
         document.body.appendChild(this.domNode);
         this.setTitle();
         this.widgets && this.processWidgets(this.widgets, this.widgetsNode);
         if(this.widgetsPadding || this.widgetsPadding === 0) {
            domStyle.set(this.widgetsNode, "padding", this.widgetsPadding + "px");
         }
         this.sizePanel();
      },

      /**
       * Close the panel.
       *
       * @instance
       * @fires module:alfresco/core/topics#STICKY_PANEL_CLOSED
       */
      close: function alfresco_layout_StickyPanel__close() {
         this.alfPublish(topics.STICKY_PANEL_CLOSED);
         this.destroyRecursive();
      },

      /**
       * Disables the close button.
       * 
       * @instance
       * @param {object} payload Payload for the publication (expected to be empty)
       * @since 1.0.54
       */
      disableCloseButton: function alfresco_layout_StickyPanel__disableCloseButton(/*jshint unused:false*/ payload) {
         domClass.add(this.domNode, this.baseClass + "--close-disabled");
      },

      /**
       * Enables the close button.
       * 
       * @instance
       * @param {object} payload Payload for the publication (expected to be empty)
       * @since 1.0.54
       */
      enableCloseButton: function alfresco_layout_StickyPanel__enableCloseButton(/*jshint unused:false*/ payload) {
         domClass.remove(this.domNode, this.baseClass + "--close-disabled");
      },

      /**
       * Handle clicks on the close button (unless it has been disabled).
       *
       * @instance
       */
      onClickClose: function alfresco_layout_StickyPanel__onClickClose() {
         if (!domClass.contains(this.domNode, this.baseClass + "--close-disabled"))
         {
            this.close();
         }
      },

      /**
       * Handle clicks on the minimise or restore buttons.
       *
       * @instance
       */
      onClickMinimiseRestore: function alfresco_layout_StickyPanel__onClickMinimiseRestore() {
         domClass.toggle(this.domNode, this.baseClass + "--minimised");
      },

      /**
       * Setup all of the subscriptions.
       *
       * @instance
       * @listens module:alfresco/core/topics#STICKY_PANEL_CLOSE
       * @listens module:alfresco/core/topics#STICKY_PANEL_SET_TITLE
       * @listens module:alfresco/core/topics#STICKY_PANEL_DISABLE_CLOSE
       * @listens module:alfresco/core/topics#STICKY_PANEL_ENABLE_CLOSE
       */
      setupSubscriptions: function alfresco_layout_StickyPanel__setupSubscriptions() {
         this.alfSubscribe(topics.STICKY_PANEL_CLOSE, lang.hitch(this, this.close));
         this.alfSubscribe(topics.STICKY_PANEL_SET_TITLE, lang.hitch(this, this.setTitle));
         this.alfSubscribe(topics.STICKY_PANEL_DISABLE_CLOSE, lang.hitch(this, this.disableCloseButton));
         this.alfSubscribe(topics.STICKY_PANEL_ENABLE_CLOSE, lang.hitch(this, this.enableCloseButton));
      },

      /**
       * Set the title of the panel. If no payload or title is provided, then it will use
       * the [title property]{@link module:alfresco/layout/StickyPanel#title}.
       *
       * @instance
       * @param {object} payload The payload containing the new title
       * @param {string} payload.title The new title
       */
      setTitle: function alfresco_layout_StickyPanel__setTitle(payload) {
         var newTitle = (payload && payload.title) || this.title;
         this.titleNode.textContent = this.message(newTitle);
      },

      /**
       * Size the panel, based on the panelWidth property.
       *
       * @instance
       */
      sizePanel: function alfresco_layout_StickyPanel__sizePanel() {
         var widthRegex = /([0-9.]+)(.*)/,
            widthString = (typeof this.panelWidth !== "string") ? this.panelWidth : "" + this.panelWidth,
            matchResult = widthRegex.exec(widthString),
            number = parseInt(matchResult[1], 10),
            units = matchResult[2] || "px",
            numberToUse = units === "%" ? number * 2 : number;
         if (isNaN(number)) {
            this.alfLog("error", "Invalid panel width supplied for StickyPanel (" + this.panelWidth + ")");
         } else {
            domStyle.set(this.panelNode, {
               width: numberToUse + units,
               left: (0 - Math.round(numberToUse / 2)) + units
            });
         }
      }
   });
});