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
 * An Alfresco styled notification.
 *
 * @module alfresco/notifications/AlfNotification
 * @author Martin Doyle
 */
define(["alfresco/core/Core",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/Deferred",
        "dojo/dom-class",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetBase",
        "dojo/text!./templates/AlfNotification.html"],
        function(AlfCore, declare, lang, Deferred, domClass, _TemplatedMixin, _WidgetBase, template) {

      return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

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
          * How many milliseconds to wait before destroying this widget after the notification has been hidden
          *
          * @instance
          * @type  {number}
          * @default 1000
          */
         destroyAfterHideMs: 1000,

         /**
          * Variable to hold the Deferred object that will resolve once this notification is destroyed
          *
          * @type {object}
          */
         destroyDeferred: null,

         /**
          * Estimate how many seconds it might take a user to focus on a notification
          *
          * @instance
          * @type  {number}
          * @default 1
          */
         notificationFocusSecs: 1,

         /**
          * How many words per second a person will read, used to determine how long to display the message.
          * First attempt to gauge how long to show message ... may need refining!
          *
          * @instance
          * @type  {number}
          * @default 5
          */
         wordsPerSecond: 5,

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
          * Called after widget created, but not sub-widgets
          *
          * @instance
          */
         postCreate: function alfresco_notifications_AlfNotification__postCreate() {
            this.inherited(arguments);
            document.body.appendChild(this.domNode);
         },

         /**
          * Hide the notification (and destroy it)
          *
          * @instance
          * @private
          */
         _hide: function alfresco_notifications_AlfNotification___hide() {
            domClass.remove(this.domNode, "alfresco-notifications-AlfNotification--visible");
            setTimeout(lang.hitch(this, this.destroy), this.destroyAfterHideMs);
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
               autoHideSecs = Math.ceil(messageWords.length / this.wordsPerSecond) + this.notificationFocusSecs;
            setTimeout(lang.hitch(this, this._hide), autoHideSecs * 1000);
         }
      });
   }
);