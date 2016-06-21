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
 * A progress indicator.
 *
 * @module alfresco/notifications/ProgressIndicator
 * @author Martin Doyle
 * @since 1.0.71
 */
define(["alfresco/core/Core",
        "alfresco/core/topics",
        "dojo/_base/declare",
        "dojo/Deferred",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/keys",
        "dojo/on",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetBase",
        "dijit/registry",
        "dojo/text!./templates/ProgressIndicator.html"],
        function(AlfCore, topics, declare, Deferred, domClass, domStyle, keys, on, _TemplatedMixin, _WidgetBase, registry, template) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/ProgressIndicator.css"}]
       */
      cssRequirements: [{
         cssFile: "./css/ProgressIndicator.css"
      }],

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/ProgressIndicator.properties"}]
       */
      i18nRequirements: [{
         i18nFile: "./i18n/ProgressIndicator.properties"
      }],

      /**
       * The HTML template to use for the widget.
       *
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The base CSS class for the widget
       *
       * @instance
       * @type {string}
       * @default
       */
      baseClass: "alfresco-notifications-ProgressIndicator",

      /**
       * How many milliseconds to wait before destroying this widget after the indicator has been hidden
       *
       * @instance
       * @type {number}
       * @default
       */
      destroyAfterHideMs: 500,

      /**
       * Variable to hold the Deferred object that will resolve once this notification is destroyed
       *
       * @instance
       * @type {object}
       * @default
       */
      destroyDeferred: null,

      /**
       * The notification ID (helps with customisation)
       *
       * @instance
       * @type {String}
       * @default
       */
      id: null,

      /**
       * The loading message text
       *
       * @instance
       * @type {string}
       * @default
       */
      loadingMessage: "progress-indicator.loading-message",

      /**
       * The scrollbar width for this browser-environment
       *
       * @instance
       * @type {number}
       * @default
       */
      _scrollbarWidth: null,

      /**
       * This is run after the properties have been mixed in, but before the
       * widget is created.
       *
       * @instance
       * @override
       */
      postMixInProperties: function alfresco_notifications_ProgressIndicator__postMixInProperties() {
         if (!this.id || registry.byId(this.id)) {
            this.id = this.generateUuid();
         }
         this.loadingMessage = this.message(this.loadingMessage);
         this.inherited(arguments);
      },

      /**
       * Called after widget created, but not sub-widgets
       *
       * @instance
       * @override
       */
      postCreate: function alfresco_notifications_ProgressIndicator__postCreate() {
         this.inherited(arguments);
         document.body.appendChild(this.domNode);
         domClass.add(document.documentElement, this.baseClass + "--displayed");
         domStyle.set(document.body, "margin-right", this._getScrollbarWidth() + "px");
         this.own(on(document.body, "keydown", this.onKeyPress.bind(this)));
      },

      /**
       * Called when widget is destroyed
       *
       * @instance
       * @override
       */
      destroy: function alfresco_notifications_AlfNotification__destroy() {
         this.destroyDeferred.resolve();
         this.inherited(arguments);
      },

      /**
       * Hide the progress indicator (and destroy it)
       *
       * @instance
       * @private
       * @returns {Object} A promise that will be resolved when this widget has been destroyed
       */
      hide: function alfresco_notifications_ProgressIndicator___hide() {
         this.destroyDeferred = new Deferred();
         if (this.domNode && document.body.contains(this.domNode.parentNode)) {
            domStyle.set(document.body, "margin-right", "0");
            domClass.remove(document.documentElement, this.baseClass + "--displayed");
            domClass.add(this.domNode, this.baseClass + "--hiding");
            setTimeout(function() {
               this.destroy();
            }.bind(this), this.destroyAfterHideMs);
         }
         return this.destroyDeferred.promise;
      },

      /**
       * Handle clicks on the close button.
       *
       * @instance
       * @param {Object} evt The Dojo-normalised event object
       */
      onCloseClick: function alfresco_notifications_ProgressIndicator__onCloseClick( /*jshint unused:false*/ evt) {
         this.alfLog("warn", "Progress indicator manually closed");
         this.alfServicePublish(topics.PROGRESS_INDICATOR_REMOVE_ALL_ACTIVITIES);
      },

      /**
       * Handle keypresses on the document.
       *
       * @instance
       * @param {Object} evt The Dojo-normalised event object
       */
      onKeyPress: function alfresco_notifications_ProgressIndicator__onKeyPress(evt) {
         var charOrCode = evt.charCode || evt.keyCode;
         switch (charOrCode) {
            case keys.ESCAPE:
               this.alfLog("warn", "Progress indicator closed by pressing ESCAPE key");
               this.alfServicePublish(topics.PROGRESS_INDICATOR_REMOVE_ALL_ACTIVITIES);
               evt.stopPropagation();
               break;
            default:
               // Do not trap the keypress
         }
      },

      /**
       * Get the scrollbar width for the current browser environment. This is cached
       * after first retrieval for faster access.
       *
       * @instance
       * @returns {number} The scrollbar width
       */
      _getScrollbarWidth: function alfresco_services_DialogService___getScrollbarWidth() {
         if (!this._scrollbarWidth) {
            this._scrollbarWidth = window.innerWidth - document.documentElement.offsetWidth;
         }
         return this._scrollbarWidth;
      }
   });
});