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
 * An Alfresco styled notification.
 *
 * @module alfresco/notifications/AlfNotification
 * @author Martin Doyle
 */
define(["alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing", 
        "dojo/_base/array",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/Deferred",
        "dojo/dom-class",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetBase",
        "dijit/registry",
        "dojo/text!./templates/AlfNotification.html"],
        function(AlfCore, CoreWidgetProcessing, array, declare, lang, Deferred, domClass, _TemplatedMixin, _WidgetBase, registry, template) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfNotification.css"}]
       */
      cssRequirements: [{
         cssFile: "./css/AlfNotification.css"
      }],

      /**
       * The HTML template to use for the widget.
       *
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Whether to remain open and not automatically close.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.63
       */
      autoClose: true,

      /**
       * How many milliseconds to wait before destroying this widget after the notification has been hidden
       *
       * @instance
       * @type {number}
       * @default
       */
      destroyAfterHideMs: 1000,

      /**
       * Variable to hold the Deferred object that will resolve once this notification is destroyed
       *
       * @type {object}
       */
      destroyDeferred: null,

      /**
       * The notification ID (helps with customisation)
       *
       * @instance
       * @type {String}
       * @default
       * @since 1.0.63
       */
      id: null,

      /**
       * Estimate how many seconds it might take a user to focus on a notification
       *
       * @instance
       * @type {number}
       * @default
       */
      notificationFocusSecs: 1,

      /**
       * How many seconds to add on for each included widget
       *
       * @instance
       * @type {number}
       * @default
       * @since 1.0.63
       */
      widgetSecs: 1,

      /**
       * An array of widgets to be inserted into the notification, underneath the message.
       *
       * @instance
       * @type {Object[]}
       * @default
       * @since 1.0.63
       */
      widgets: null,

      /**
       * How many words per second a person will read, used to determine how long to display the message.
       * First attempt to gauge how long to show message ... may need refining!
       *
       * @instance
       * @type {number}
       * @default
       */
      wordsPerSecond: 5,

      /**
       * This is run after the properties have been mixed in, but before the
       * widget is created.
       *
       * @instance
       * @override
       * @since 1.0.63
       */
      postMixInProperties: function alfresco_notifications_AlfNotification__postMixInProperties() {
         if (!this.id || registry.byId(this.id)) {
            this.id = this.generateUuid();
         }
         this.inherited(arguments);
      },

      /**
       * Called after widget created, but not sub-widgets
       *
       * @instance
       * @override
       */
      postCreate: function alfresco_notifications_AlfNotification__postCreate() {
         this.inherited(arguments);
         if (this.autoClose) {
            domClass.add(this.domNode, "alfresco-notifications-AlfNotification--auto-close");
         }
         if (this.widgets && this.widgets.length) {
            domClass.add(this.domNode, "alfresco-notifications-AlfNotification--has-widgets");
            this.processWidgets(lang.clone(this.widgets), this.widgetsNode);
         }
         document.body.appendChild(this.domNode);
      },

      /**
       * Called when widget is destroyed
       *
       * @instance
       */
      destroy: function alfresco_notifications_AlfNotification__destroy() {
         this.destroyDeferred.resolve();
         this.inherited(arguments);
      },

      /**
       * Display the notification.
       *
       * @instance
       * @returns  {object} A promise that will resolve once the notification is destroyed.
       */
      display: function alfresco_notifications_AlfNotification__display() {
         this.destroyDeferred = new Deferred();
         setTimeout(lang.hitch(this, this._show), 0); // Add to page before showing, else transition fails
         return this.destroyDeferred.promise;
      },

      /**
       * Count the number of widgets provided in the config
       *
       * @instance
       * @private
       * @returns {number} The number of widgets
       * @since 1.0.63
       */
      _countWidgets: function alfresco_notifications_AlfNotification___countWidgets() {
         var numWidgets = 0;
         (function countWidgets(widgets) {
            if (!widgets || !widgets.length) {
               return;
            }
            if (widgets.constructor === Array) {
               numWidgets += widgets.length;
            }
            array.forEach(widgets, function(widget) {
               var conf = widget.config;
               if (conf) {
                  for (propName in conf) {
                     if (conf.hasOwnProperty(propName) && propName.indexOf("widgets") === 0) {
                        countWidgets(conf[propName]);
                     }
                  }
               }
            });
         })(this.widgets);
         return numWidgets;
      },

      /**
       * Hide the notification (and destroy it)
       *
       * @instance
       * @private
       */
      _hide: function alfresco_notifications_AlfNotification___hide() {
         if (this.domNode && this.domNode.parentNode === document.body) {
            domClass.remove(this.domNode, "alfresco-notifications-AlfNotification--visible");
            setTimeout(lang.hitch(this, this.destroy), this.destroyAfterHideMs);
         }
      },

      /**
       * Handle clicks on the close button
       *
       * @instance
       * @private
       * @param {Object} evt Dojo-normalised event object
       */
      _onCloseClick: function alfresco_notifications_AlfNotification___onCloseClick( /*jshint unused:false*/ evt) {
         this._hide();
      },

      /**
       * Show the notification
       *
       * @instance
       * @private
       */
      _show: function alfresco_notifications_AlfNotification___show() {
         domClass.add(this.domNode, "alfresco-notifications-AlfNotification--visible");
         var messageText = this.messageNode.textContent || this.message.innerText || "",
            messageWords = messageText.split(/\W+/),
            numWidgets = this._countWidgets(),
            autoHideSecs = Math.ceil(messageWords.length / this.wordsPerSecond) + Math.ceil(numWidgets * this.widgetSecs) + this.notificationFocusSecs;
         if (this.autoClose) {
            setTimeout(lang.hitch(this, this._hide), autoHideSecs * 1000);
         }
      }
   });
});