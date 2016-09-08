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
        "alfresco/notifications/ProgressIndicator",
        "alfresco/core/topics"],
        function(declare, BaseService, lang, on, StickyPanel, AlfNotification, ProgressIndicator, topics) {

   // We only ever allow one sticky panel currently
   var theStickyPanel = null;

   // We only ever allow one progress indicator
   var theProgressIndicator = null;

   // We need to have a static count of activities for the global progress/activity indicator
   var numProgressActivities = 0;

   return declare([BaseService], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{
         i18nFile: "./i18n/NotificationService.properties"
      }],

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
       * Controls whether or not the subscriptions are created for progress indicator requests so if this
       * is configured to be false then the progress indicator will never be shown.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.72
       */
      showProgressIndicator: false,

      /**
       * Sets up the subscriptions for the NotificationService
       *
       * @instance
       * @since 1.0.32
       * @listens module:alfresco/services/NotificationService#displayNotificationTopic
       * @listens module:alfresco/services/NotificationService#displayPromptTopic
       * @listens module:alfresco/core/topics#DISPLAY_STICKY_PANEL
       * @listens module:alfresco/core/topics#PROGRESS_INDICATOR_ADD_ACTIVITY
       * @listens module:alfresco/core/topics#PROGRESS_INDICATOR_REMOVE_ACTIVITY
       * @listens module:alfresco/core/topics#PROGRESS_INDICATOR_REMOVE_ALL_ACTIVITIES
       */
      registerSubscriptions: function alfresco_services_NotificationService__registerSubscriptions() {
         this.alfSubscribe(this.displayNotificationTopic, lang.hitch(this, this.onDisplayNotification));
         this.alfSubscribe(this.displayPromptTopic, lang.hitch(this, this.onDisplayPrompt));
         this.alfSubscribe(topics.DISPLAY_STICKY_PANEL, lang.hitch(this, this.onDisplayStickyPanel));
         this.alfSubscribe(topics.REQUEST_CONFIRMATION_PROMPT, lang.hitch(this, this.onConfirmationPromptRequest));

         if (this.showProgressIndicator)
         {
            this.alfSubscribe(topics.PROGRESS_INDICATOR_ADD_ACTIVITY, lang.hitch(this, this.onAddProgressActivity));
            this.alfSubscribe(topics.PROGRESS_INDICATOR_REMOVE_ACTIVITY, lang.hitch(this, this.onRemoveProgressActivity));
            this.alfSubscribe(topics.PROGRESS_INDICATOR_REMOVE_ALL_ACTIVITIES, lang.hitch(this, this.onRemoveAllProgressActivities));
         }
      },

      /**
       * Increments the quantity of in-progress activities and displays the progress-indicator if not already displayed.
       *
       * @instance
       * @since 1.0.71
       */
      onAddProgressActivity: function alfresco_services_NotificationService__onAddProgressActivity() {
         if (numProgressActivities++ === 0) {
            theProgressIndicator = new ProgressIndicator();
         }
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

            // Define and use config to create a new notification
            var config = {
               message: payload.message,
               widgets: payload.widgets,
               id: payload.notificationId,
               inlineLink: payload.inlineLink,
               closeTopic: payload.closeTopic
            };
            if (typeof payload.autoClose !== "undefined") {
               config.autoClose = payload.autoClose;
            }
            if (typeof payload.wordsPerSecond !== "undefined") {
               config.wordsPerSecond = payload.wordsPerSecond;
            }
            var newNotification = new AlfNotification(config);

            // Show the notification
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
         /*jshint maxcomplexity:false*/

         // Setup variables
         var panelConfig = {},
            closeSubscription;

         // Determine action
         if (theStickyPanel) {

            // Warn that panel aready exists if appropriate
            payload.warnIfOpen && this.alfLog("warn", "It was not possible to display a StickyPanel because one is already displayed", payload);

            // Make sure panel isn't minimised
            this.alfPublish(topics.STICKY_PANEL_RESTORE);

         } else if (payload.widgets) {

            // Setup the panel-widget config
            panelConfig.widgets = payload.widgets;
            if (payload.title) {
               panelConfig.title = payload.title;
            }
            if (payload.width) {
               panelConfig.panelWidth = payload.width;
            }
            if (payload.padding || payload.padding === 0) {
               panelConfig.widgetsPadding = payload.padding;
            }
            if (payload.closeButtonLabel) {
               panelConfig.closeButtonLabel = payload.closeButtonLabel;
            }
            if (payload.minimiseButtonLabel) {
               panelConfig.minimiseButtonLabel = payload.minimiseButtonLabel;
            }
            if (payload.restoreButtonLabel) {
               panelConfig.restoreButtonLabel = payload.restoreButtonLabel;
            }

            // Create the panel
            theStickyPanel = new StickyPanel(panelConfig);

            // When the panel is closed, empty the static pointer to it
            closeSubscription = this.alfSubscribe(topics.STICKY_PANEL_CLOSED, lang.hitch(this, function() {
               theStickyPanel = null;
               this.alfUnsubscribe(closeSubscription);
            }));

         } else {

            // Cannot create panel
            this.alfLog("warn", "It was not possible to display the StickyPanel because no suitable 'widgets' attribute was provided", payload);
         }

         // If we've got a panel and a callback, use it
         if (theStickyPanel && payload.callback) {
            payload.callback(theStickyPanel);
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
      },

      /**
       * Decrements the quantity of in-progress activities and hides the progress-indicator if its displayed.
       *
       * @instance
       * @since 1.0.71
       * @param {Object} payload The publication payload
       */
      onRemoveAllProgressActivities: function alfresco_services_NotificationService__onRemoveAllProgressActivities( /*jshint unused:false*/ payload) {
         this.resetProgressIndicator();
      },

      /**
       * Decrements the quantity of in-progress activities and hides the progress-indicator if its displayed.
       *
       * @instance
       * @since 1.0.71
       * @param {Object} payload The publication payload
       */
      onRemoveProgressActivity: function alfresco_services_NotificationService__onRemoveProgressActivity( /*jshint unused:false*/ payload) {
         if (--numProgressActivities <= 0) {
            this.resetProgressIndicator();
         }
      },

      /**
       * Hide the progress indicator (destroy it) and reset the number of activities to zero.
       *
       * @instance
       * @since 1.0.71
       */
      resetProgressIndicator: function alfresco_services_NotificationService__resetProgressIndicator() {
         if (theProgressIndicator) {
            theProgressIndicator.hide().then(function() {
               theProgressIndicator = null;
            });
            numProgressActivities = 0;
         }
      },


      /**
       * This is a generic 
       *
       * @instance
       * @param {object} payload
       * @since 1.0.85
       */
      onConfirmationPromptRequest: function alfresco_services_NotificationService__onConfirmationPromptRequest(payload) {
         var confirmationTopic = this.generateUuid();
         var cancellationTopic = this.generateUuid();
         var confirmationHandle = this.alfSubscribe(confirmationTopic, lang.hitch(this, this.onConfirmationPromptConfirmation), true);
         var cancellationHandle = this.alfSubscribe(cancellationTopic, lang.hitch(this, this.onConfirmationPromptCancellation), true);

         var title = payload.confirmationTitle || "notification.confirmation.prompt.title";
         var prompt = payload.confirmationPrompt || "notification.confirmation.prompt.prompt";
         var confirmButtonLabel = payload.confirmationButtonLabel || "notification.confirmation.prompt.confirmationButtonLabel";
         var cancelButtonLabel = payload.cancellationButtonLabel || "notification.confirmation.prompt.cancellationButtonLabel";

         this.alfServicePublish(topics.CREATE_DIALOG, {
            dialogId: "ALF_GENERIC_CONFIRMATION_DIALOG",
            dialogTitle: this.message(title),
            textContent: this.message(prompt),
            widgetsButtons: [
               {
                  id: "ALF_GENERIC_CONFIRMATION_DIALOG_CONFIRM",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message(confirmButtonLabel),
                     publishTopic: confirmationTopic,
                     publishPayload: {
                        alfSubscriptionHandles: [confirmationHandle, cancellationHandle],
                        confirmationPublication: payload.confirmationPublication
                     }
                  }
               },
               {
                  id: "ALF_GENERIC_CONFIRMATION_DIALOG_CANCEL",
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message(cancelButtonLabel),
                     publishTopic: cancellationTopic,
                     publishPayload: {
                        alfSubscriptionHandles: [confirmationHandle, cancellationHandle],
                        cancellationPublication: payload.cancellationPublication
                     }
                  }
               }
            ]
         });
      },

      /**
       * 
       *
       * @instance
       * @param {object} payload An object containing the deletion details.
       * @since 1.0.85
       */
      onConfirmationPromptConfirmation: function alfresco_services_NotificationService__onConfirmationPromptConfirmation(payload) {
         payload.alfSubscriptionHandles && this.alfUnsubscribeSaveHandles(payload.alfSubscriptionHandles);
         if (payload.confirmationPublication)
         {
            this.alfPublish(payload.confirmationPublication.publishTopic,
                            payload.confirmationPublication.publishPayload,
                            payload.confirmationPublication.publishGlobal,
                            payload.confirmationPublication.publishToParent,
                            payload.confirmationPublication.publishScope);
         }
      },

      /**
       * 
       *
       * @instance
       * @param {object} payload An object containing the deletion details.
       * @since 1.0.85
       */
      onConfirmationPromptCancellation: function alfresco_services_NotificationService__onConfirmationPromptCancellation(payload) {
         payload.alfSubscriptionHandles && this.alfUnsubscribeSaveHandles(payload.alfSubscriptionHandles);
         if (payload.cancellationPublication)
         {
            this.alfPublish(payload.cancellationPublication.publishTopic,
                            payload.cancellationPublication.publishPayload,
                            payload.cancellationPublication.publishGlobal,
                            payload.cancellationPublication.publishToParent,
                            payload.cancellationPublication.publishScope);
         }
      }
   });
});