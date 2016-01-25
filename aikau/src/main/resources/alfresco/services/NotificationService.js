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
 * @module alfresco/services/NotificationService
 * @extends module:alfresco/services/BaseService
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "dojo/_base/lang",
        "dojo/on",
        "alfresco/layout/StickyPanel",
        "alfresco/notifications/AlfNotification",
        "alfresco/core/topics"],
        function(declare, BaseService, lang, on, StickyPanel, AlfNotification, topics) {

   // We only ever allow one sticky panel currently
   var theStickyPanel = null;

   return declare([BaseService], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/NotificationService.properties"}],

      /**
       * This is the topic that is subscribed to for handling requests to close a displayed
       * notification.
       *
       * @instance
       * @type {string}
       * @default [topics.NOTIFICATION_CLOSED]{@link module:alfresco/core/topics#NOTIFICATION_CLOSED}
       */
      closeNotificationTopic: topics.NOTIFICATION_CLOSED,

      /**
       * This is the topic that is subscribed to for handling requests to display a notification.
       *
       * @instance
       * @type {string}
       * @default [topics.DISPLAY_NOTIFICATION]{@link module:alfresco/core/topics#DISPLAY_NOTIFICATION}
       * @listens module:alfresco/core/topics#DISPLAY_NOTIFICATION
       * @event
       */
      displayNotificationTopic: topics.DISPLAY_NOTIFICATION,

      /**
       * This is the topic that is subscribed to for handling requests to display a prompt.
       *
       * @instance
       * @type {string}
       * @default [topics.DISPLAY_PROMPT]{@link module:alfresco/core/topics#DISPLAY_PROMPT}
       */
      displayPromptTopic: topics.DISPLAY_PROMPT,

      /**
       * Sets up the subscriptions for the NotificationService
       *
       * @instance
       * @since 1.0.32
       * @listens module:alfresco/services/NotificationService#displayNotificationTopic
       * @listens module:alfresco/services/NotificationService#displayPromptTopic
       * @listens module:alfresco/core/topics#DISPLAY_STICKY_PANEL
       */
      registerSubscriptions: function alfresco_services_NotificationService__registerSubscriptions() {
         this.alfSubscribe(this.displayNotificationTopic, lang.hitch(this, this.onDisplayNotification));
         this.alfSubscribe(this.displayPromptTopic, lang.hitch(this, this.onDisplayPrompt));
         this.alfSubscribe(topics.DISPLAY_STICKY_PANEL, lang.hitch(this, this.onDisplayStickyPanel));
      },

      /**
       * Displays a notification to the user
       *
       * @instance
       * @param {object} payload The details of the notification.
       */
      onDisplayNotification: function alfresco_services_NotificationService__onDisplayNotification(payload) {
         var message = lang.getObject("message", false, payload);
         if (message) {
            var newNotification = new AlfNotification({
               message: payload.message
            });
            newNotification.startup();
            newNotification.display().then(lang.hitch(this, function() {
               this.alfPublish(this.closeNotificationTopic, {}, true);
               if (payload.publishTopic) {
                  this.alfPublish(payload.publishTopic, payload.publishPayload || {}, payload.publishGlobal, payload.publishToParent);
               }
            }));
         } else {
            this.alfLog("warn", "It was not possible to display the message because no suitable 'message' attribute was provided", payload);
         }
      },

      /**
       * Displays a sticky panel at the bottom of the screen.
       *
       * @instance
       * @param {object} payload The details of the notification.
       * @since 1.0.48
       */
      onDisplayStickyPanel: function alfresco_services_NotificationService__onDisplayStickyPanel(payload) {
         var panelOpts = {},
            closeSubscription;
         if (theStickyPanel) {
            this.alfLog("warn", "It was not possible to display a StickyPanel because one is already displayed", payload);
            return;
         }
         if (payload.widgets) {
            panelOpts.widgets = payload.widgets
            if(payload.title) {
               panelOpts.title = payload.title;
            }
            if(payload.width) {
               panelOpts.panelWidth = payload.width;
            }
            if(payload.padding || payload.padding === 0) {
               panelOpts.widgetsPadding = payload.padding;
            }
            theStickyPanel = new StickyPanel(panelOpts);
            closeSubscription = this.alfSubscribe(topics.STICKY_PANEL_CLOSED, lang.hitch(this, function() {
               theStickyPanel = null;
               this.alfUnsubscribe(closeSubscription);
            }));
         } else {
            this.alfLog("warn", "It was not possible to display the StickyPanel because no suitable 'widgets' attribute was provided", payload);
         }
      },

      /**
       * Displays a prompt to the user
       *
       * @instance
       * @param {object} payload The details of the notification.
       */
      onDisplayPrompt: function alfresco_services_NotificationService__onDisplayPrompt(payload) {
         var message = lang.getObject("message", false, payload);
         if (message) {
            var title = payload.title || "notification.prompt.title";
            this.alfPublish(topics.CREATE_DIALOG, {
               dialogId: "NOTIFICATION_PROMPT",
               dialogTitle: this.message(title),
               textContent: message,
               widgetsButtons: [
                  {
                     id: "NOTIFCATION_PROMPT_ACKNOWLEDGEMENT",
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: "notification.ok.label",
                        additionalCssClasses: "call-to-action"
                     }
                  }
               ]
            });
         } else {
            this.alfLog("warn", "It was not possible to display the message because no suitable 'message' attribute was provided", payload);
         }
      }
   });
});