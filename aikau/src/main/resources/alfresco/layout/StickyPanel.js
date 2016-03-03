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
 * <p>This widget is used by the [NotificationService]{@link module:alfresco/services/NotificationService}
 * to display a sticky panel attached to the bottom of the screen. It should not be instantiated
 * directly.</p>
 *
 * <p><strong>NOTE:</strong> There is a bug with older browsers (IE8/IE9/IE10 only) that means that it is
 * not possible to click on elements to the left or right of the sticky panel.</p>
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
       * The label to display on the minimise button for accessibility reasons
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.58
       */
      closeButtonLabel: "button.close.label",

      /**
       * The label to display on the minimise button for accessibility reasons
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.58
       */
      minimiseButtonLabel: "button.minimise.label",

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
       * The label to display on the minimise button for accessibility reasons
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.58
       */
      restoreButtonLabel: "button.restore.label",

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
         if (this.widgetsPadding || this.widgetsPadding === 0) {
            domStyle.set(this.widgetsNode, "padding", this.widgetsPadding + "px");
         }
         this.sizePanel();

         // Setup mouse-hover and screenreader text labels for the panel buttons
         this.minimiseButtonNode.setAttribute("title", this.message(this.minimiseButtonLabel));
         this.restoreButtonNode.setAttribute("title", this.message(this.restoreButtonLabel));
         this.closeButtonNode.setAttribute("title", this.message(this.closeButtonLabel));
         this.minimiseButtonNode.setAttribute("aria-label", this.message(this.minimiseButtonLabel));
         this.restoreButtonNode.setAttribute("aria-label", this.message(this.restoreButtonLabel));
         this.closeButtonNode.setAttribute("aria-label", this.message(this.closeButtonLabel));
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
      disableCloseButton: function alfresco_layout_StickyPanel__disableCloseButton( /*jshint unused:false*/ payload) {
         domClass.add(this.domNode, this.baseClass + "--close-disabled");
      },

      /**
       * Enables the close button.
       * 
       * @instance
       * @param {object} payload Payload for the publication (expected to be empty)
       * @since 1.0.54
       */
      enableCloseButton: function alfresco_layout_StickyPanel__enableCloseButton( /*jshint unused:false*/ payload) {
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
       * @since 1.0.58
       */
      onClickMinimise: function alfresco_layout_StickyPanel__onClickMinimise() {
         this.setMinimised(true);
         this.restoreButtonNode.focus();
      },

      /**
       * Handle clicks on the minimise or restore buttons.
       *
       * @instance
       * @since 1.0.58
       */
      onClickRestore: function alfresco_layout_StickyPanel__onClickRestore() {
         this.setMinimised(false);
         this.minimiseButtonNode.focus();
      },

      /**
       * Setup all of the subscriptions.
       *
       * @instance
       * @listens module:alfresco/core/topics#STICKY_PANEL_CLOSE
       * @listens module:alfresco/core/topics#STICKY_PANEL_SET_TITLE
       * @listens module:alfresco/core/topics#STICKY_PANEL_DISABLE_CLOSE
       * @listens module:alfresco/core/topics#STICKY_PANEL_ENABLE_CLOSE
       * @listens module:alfresco/core/topics#STICKY_PANEL_RESTORE
       * @listens module:alfresco/core/topics#STICKY_PANEL_MINIMISE
       */
      setupSubscriptions: function alfresco_layout_StickyPanel__setupSubscriptions() {
         this.alfSubscribe(topics.STICKY_PANEL_CLOSE, lang.hitch(this, this.close));
         this.alfSubscribe(topics.STICKY_PANEL_SET_TITLE, lang.hitch(this, this.setTitle));
         this.alfSubscribe(topics.STICKY_PANEL_DISABLE_CLOSE, lang.hitch(this, this.disableCloseButton));
         this.alfSubscribe(topics.STICKY_PANEL_ENABLE_CLOSE, lang.hitch(this, this.enableCloseButton));
         this.alfSubscribe(topics.STICKY_PANEL_RESTORE, lang.hitch(this, this.setMinimised, false));
         this.alfSubscribe(topics.STICKY_PANEL_MINIMISE, lang.hitch(this, this.setMinimised, true));
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
       * Size the panel, based on the panelWidth property. If we receive a number without
       * units (apart from 0), we should assume it's pixels.
       *
       * @instance
       */
      sizePanel: function alfresco_layout_StickyPanel__sizePanel() {
         var newWidth = this.panelWidth;
         if (newWidth) {
            if (!isNaN(newWidth)) {
               newWidth += "px";
            }
            domStyle.set(this.panelNode, "width", newWidth);
         }
      },

      /**
       * Set the minimised state
       *
       * @instance
       * @param {boolean} minimise Whether to minimise the panel (true will minimise, false will restore)
       * @since 1.0.58
       */
      setMinimised: function alfresco_layout_StickyPanel__setMinimised(minimise) {
         domClass[minimise ? "add" : "remove"](this.domNode, this.baseClass + "--minimised");
      },

      /**
       * Prevent the title property from being used to set the title
       * attribute on the widget's root node.
       *
       * @instance
       * @override
       * @param {string} newTitle The new title
       * @since 1.0.55
       */
      _setTitleAttr: function alfresco_layout_StickyPanel___setTitleAttr(/*jshint unused:false*/ newTitle) {
         // NOOP
      }
   });
});
