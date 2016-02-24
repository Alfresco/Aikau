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
 * @module alfresco/services/LoggingService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/_base/window",
        "dijit/registry",
        "alfresco/dialogs/AlfDialog"],
        function(declare, BaseService, _PreferenceServiceTopicMixin, lang, domClass, win, registry, AlfDialog) {
        /*jshint devel:true*/


   return declare([BaseService, _PreferenceServiceTopicMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/LoggingService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/LoggingService.properties"}],

      /**
       * @instance
       * @type {string}
       * @default
       */
      loggingPreferencesId: "org.alfresco.share.logging",

      /**
       * This will hold a reference to the subscription to log events. It will be null unless logging is enabled.
       *
       * @instance
       * @type {object}
       * @default
       */
      logSubscriptionHandle: null,

      /**
       * Indicates whether or not the user preferences for logging should be suppressed. If this is set to true then
       * a request will not be made to retrieve the user preferences for logging.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.36
       */
      suppressUserPreferences: false,

      /**
       * Sets up the subscriptions for the LoggingService
       *
       * @instance
       * @listens ALF_LOGGING_STATUS_CHANGE
       * @listens ALF_UPDATE_LOGGING_PREFERENCES
       * @listens ALF_SHOW_PUBSUB_LOG
       * @listens ALF_SHOW_DATA_MODEL
       * @listens ALF_TOGGLE_DEVELOPER_MODE
       *
       * @fires module:alfresco/core/topics#GET_PREFERENCE
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_LoggingService__registerSubscriptions() {
         this.alfSubscribe("ALF_LOGGING_STATUS_CHANGE", lang.hitch(this, this.onLoggingStatusChange));
         this.alfSubscribe("ALF_UPDATE_LOGGING_PREFERENCES", lang.hitch(this, this.onDetailsDialog));
         this.alfSubscribe("ALF_SHOW_PUBSUB_LOG", lang.hitch(this, this.showPubSubLog));
         this.alfSubscribe("ALF_SHOW_DATA_MODEL", lang.hitch(this, this.showDataModel));
         this.alfSubscribe("ALF_TOGGLE_DEVELOPER_MODE", lang.hitch(this, this.toggleDeveloperMode));

         if (this.loggingPreferences !== null && typeof this.loggingPreferences !== "undefined")
         {
            // Set up subscriptions if the LoggingService has been instantiated with default
            // preferences...
            this.handleSubscription();
         }

         if (!this.suppressUserPreferences)
         {
            this.alfPublish(this.getPreferenceTopic, {
               preference: this.loggingPreferencesId,
               callback: this.setLoggingStatus,
               callbackScope: this
            });
         }
      },

      /**
       * Switches into the developer mode that gives an exploded view of the widgets on the page.
       * 
       * @instance
       */
      toggleDeveloperMode: function alfresco_services_LoggingService__toggleDeveloperMode() {
         domClass.toggle(win.body(), "alfresco-developer-mode-Enabled");
      },

      /**
       *
       * @instance
       * @param {object} payload
       */
      showPubSubLog: function alfresco_services_LoggingService__showPubSubLog(/*jshint unused:false*/ payload) {
         if (!this.pubSubLog)
         {
            this.pubSubLog = new AlfDialog({
               title: this.message("logging.pubSubLog.title"),
               fixedWidth: true,
               handleOverflow: true,
               widgetsContent: [
                  {
                     name: "alfresco/logging/DebugLog"
                  }
               ]
            });
         }
         this.pubSubLog.show();
      },

      /**
       * This displays a dialog that displays the current data model built up through the use of the
       * [CoreData singleton]{@link module:alfresco/core/CoreData}.
       *
       * @instance
       * @param {object} payload The request payload
       */
      showDataModel: function alfresco_services_LoggingService__showDataModel(payload) {
         /*jshint unused:false*/
         var dialog = new AlfDialog({
            pubSubScope: this.pubSubScope,
            title: this.message("logging.dataModel.title"),
            widgetsContent: [
               {
                  name: "alfresco/debug/CoreDataDebugger"
               }
            ]
         });
         dialog.show();
      },

      /**
       * Handles requests to change the current logging status.
       *
       * @instance
       * @param {object} payload
       *
       * @fires setPreferenceTopic
       */
      onLoggingStatusChange: function alfresco_services_LoggingService__onLoggingStatusChange(payload) {
         if (lang.exists("selected", payload) && lang.exists("value", payload))
         {
            this.alfPublish(this.setPreferenceTopic, {
               preference: this.loggingPreferencesId + "." + payload.value,
               value: (payload.selected === true)
            });
            if (!this.loggingPreferences)
            {
               this.loggingPreferences = {};
            }
            this.loggingPreferences[payload.value] = (payload.selected === true);
            this.handleSubscription();
         }
      },

      /**
       * @instance
       * @param {boolean} value Indicates whether or not to enable or disable logging.
       */
      setLoggingStatus: function alfresco_services_LoggingService__setLoggingStatus(value) {
         this.loggingPreferences = value || {};
         this.handleSubscription();
      },

      /**
       * Updates the subscription to the logging topic.
       * Checks each subscription individually and only subscribes if one doesn't already exist.
       *
       * @instance
       *
       * @listens alfLoggingTopic
       */
      handleSubscription: function alfresco_services_LoggingService__handleSubscription() {
         // jshint maxcomplexity:false,maxstatements:false
         if (this.loggingPreferences.enabled)
         {
            if (!this.logSubscriptionHandle)
            {
               this.logSubscriptionHandle = this.alfSubscribe(this.alfLoggingTopic, lang.hitch(this, this.onLogRequest));
            }

            // Only log pub/sub activity if either all logging is enabled or PUBSUB logging has been
            // explicitly requested...
            if (this.loggingPreferences.all === true ||
                this.loggingPreferences.pubSub === true)
            {
               if (!this.subLogSubscriptionHandle)
               {
                  this.subLogSubscriptionHandle = this.alfSubscribe("ALF_LOG_SUBSCRIPTION_ACTIVITY", lang.hitch(this, this.onPubSubLogRequest, "SUBSCRIPTION"));
               }

               if (!this.pubLogSubscriptionHandle)
               {
                  this.pubLogSubscriptionHandle = this.alfSubscribe("ALF_LOG_PUBLICATION_ACTIVITY", lang.hitch(this, this.onPubSubLogRequest, "PUBLICATION"));
               }

               if (!this.unsubLogSubscriptionHandle)
               {
                  this.unsubLogSubscriptionHandle = this.alfSubscribe("ALF_LOG_UNSUBSCRIPTION_ACTIVITY", lang.hitch(this, this.onPubSubLogRequest, "UNSUBSCRIPTION"));
               }
            }
            else
            {
               if (this.subLogSubscriptionHandle)
               {
                  this.alfUnsubscribe(this.subLogSubscriptionHandle);
                  this.subLogSubscriptionHandle = null;
               }
               if (this.pubLogSubscriptionHandle)
               {
                  this.alfUnsubscribe(this.pubLogSubscriptionHandle);
                  this.pubLogSubscriptionHandle = null;
               }
               if (this.unsubLogSubscriptionHandle)
               {
                  this.alfUnsubscribe(this.unsubLogSubscriptionHandle);
                  this.unsubLogSubscriptionHandle = null;
               }
            }
         }
         else if (!this.loggingPreferences.enabled && this.logSubscriptionHandle)
         {
            if (this.logSubscriptionHandle)
            {
               this.alfUnsubscribe(this.logSubscriptionHandle);
               this.logSubscriptionHandle = null;
            }
            if (this.subLogSubscriptionHandle)
            {
               this.alfUnsubscribe(this.subLogSubscriptionHandle);
               this.subLogSubscriptionHandle = null;
            }
            if (this.pubLogSubscriptionHandle)
            {
               this.alfUnsubscribe(this.pubLogSubscriptionHandle);
               this.pubLogSubscriptionHandle = null;
            }
            if (this.unsubLogSubscriptionHandle)
            {
               this.alfUnsubscribe(this.unsubLogSubscriptionHandle);
               this.unsubLogSubscriptionHandle = null;
            }
         }
      },

      /**
       * This attribute is used to hold a reference to a [dialog]{@link module:alfresco/dialogs/AlfDialog} that can be
       * used to set more granular logging information (e.g. wildcard style matches for widgets and functions). It is set
       * on the first call to the [onDetailsDialog function]{@link module:alfresco/services/LoggingService#onDetailsDialog}.
       *
       * @instance
       * @type {object}
       * @default
       */
      detailsDialog: null,

      /**
       * This is the topic used to subscribe to requests to save logging preferences updated by the
       * [preferences dialog]{@link module:alfresco/services/LoggingService#detailsDialog}.
       *
       * @instance
       * @event
       * @type {string}
       * @default
       */
      saveLoggingPrefsUpdateTopic: "ALF_SAVE_LOGGING_PREFERNCES_UPDATE",

      /**
       * This is the topic used to subscribe to requests to cancel logging preferences updates set in the
       * [preferences dialog]{@link module:alfresco/services/LoggingService#detailsDialog}.
       *
       * @instance
       * @event
       * @type {string}
       * @default
       */
      cancelLoggingPrefsUpdateTopic: "ALF_CANCEL_LOGGING_PREFERNCES_UPDATE",

      /**
       * @instance
       * @param {object} payload
       */
      onDetailsDialog: function alfresco_services_LoggingService__onDetailsDialog(payload) {
         if (!this.detailsDialog)
         {
            this.alfSubscribe(this.saveLoggingPrefsUpdateTopic, lang.hitch(this, "onPrefsUpdateSave"));
            this.alfSubscribe(this.cancelLoggingPrefsUpdateTopic, lang.hitch(this, "onPrefsUpdateCancel"));
            this.detailsDialog = new AlfDialog({
               title: this.message("logging.preferences.title"),
               widgetsContent: [
                  {
                     name: "alfresco/forms/controls/DojoValidationTextBox",
                     config: {
                        id: this.id + "_LOGGING_FILTER",
                        name: "filter",
                        label: this.message("filter.label"),
                        description: this.message("filter.description"),
                        value: this.loggingPreferences.filter || ""
                     }
                  }
               ],
               widgetsButtons: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.message("button.save-logging-prefs"),
                        publishTopic: this.saveLoggingPrefsUpdateTopic,
                        publishPayload: payload
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.message("button.cancel-logging-prefs-update"),
                        publishTopic: this.cancelLoggingPrefsUpdateTopic,
                        publishPayload: payload
                     }
                  }
               ]
            });
         }
         this.detailsDialog.show();
      },

      /**
       * @instance
       * @param {object} payload
       */
      onPrefsUpdateSave: function alfresco_services_LoggingService__onPrefsUpdateSave(payload) {
         /*jshint unused:false*/
         var filterWidget = registry.byId(this.id + "_LOGGING_FILTER");
         if (filterWidget)
         {
            var filterValue = filterWidget.getValue();
            this.alfPublish(this.setPreferenceTopic, {
               preference: this.loggingPreferencesId + ".filter",
               value: filterValue
            });
            this.loggingPreferences.filter = filterValue;
         }
      },

      /**
       * @instance
       * @param {object} payload
       */
      onPrefsUpdateCancel: function alfresco_services_LoggingService__onPrefsUpdateCancel(payload) {
         /*jshint unused:false*/
         var filterWidget = registry.byId(this.id + "_LOGGING_FILTER");
         if (filterWidget)
         {
            filterWidget.setValue(this.loggingPreferences.filter || "");
         }
      },

      /**
       * The local copy of logging preferences.
       *
       * @instance
       * @type {object}
       * @default
       */
      loggingPreferences: null,

      /**
       * This logging is explicitly for publication, subscription and unsubscription events.
       *
       * @param  {string} type This is the PubSub activity type (e.g. "SUBSCRIPTION", "PUBLICATION", etc).
       * @param  {object} payload The details of the PubSub activity
       * @param  {object} [caller] A reference to the object that published the event
       */
      onPubSubLogRequest: function alfresco_services_LoggingService__onPubSubLogRequest(type, payload, caller) {
         if (this.passesLoggingFilter(payload.alfCallerName))
         {
            var event = {
               type: type
            };

            // Build a custom object type depending on the log type
            switch (type)
            {
               case "PUBLICATION":
                  event.topic = payload.alfPublishScope + payload.alfTopic;
                  event.payload = payload;

                  // If the widget that triggered the publish has been passed, pass that through, highlighting the id.
                  if (caller)
                  {
                     if (caller.id)
                     {
                        event.publisherId = caller.id;
                     }
                     event.publisher = caller;
                  }

                  break;
               case "SUBSCRIPTION":
                  event.topic = payload.subscribedTopic;
                  event.subscriberId = payload.subscriber.id;
                  event.subscriber = payload.subscriber;
                  break;
               case "UNSUBSCRIPTION":
                  event.topic = payload.unsubscribedTopic;
                  event.subscriberId = payload.subscriber.id;
                  event.subscriber = payload.subscriber;
                  break;
            }
            console.log(event);
         }
      },

      /**
       *
       *
       * @typedef {Object} logPayload
       * @property severity {string}
       * @property callerName {string}
       * @property messageArgs {Object[]}
       */

      /**
       * Checks to see whether or not the current log request caller passes the logging filter.
       *
       * @instance
       * @param {string} callerName The name of the function requesting logging.
       * @return {boolean} true if the filter passes and false otherwise
       */
      passesLoggingFilter: function alfresco_services_LoggingService__passesLoggingFilter(callerName) {
         var matchesFilter = true;
         if (callerName && callerName !== "")
         {
            var fIndex = callerName.lastIndexOf("__"),
                re1 = /([^_])_/g;
            if (fIndex !== -1)
            {
               var mName = callerName.substring(0, fIndex);
               var fName = callerName.substring(fIndex + 2);
               callerName = mName.replace(re1, "$1/") + "[" + fName + "] >> ";
            }
            else
            {
               callerName = callerName + " >> ";
            }
         }
         else
         {
            callerName = "";
         }

         // Check to see whether or not there is a log filter and if so, whether or
         // not the current caller passes the filter...
         if (this.loggingPreferences.filter)
         {
            var test = new RegExp(this.loggingPreferences.filter);
            matchesFilter = test.test(callerName);
         }
         return matchesFilter;
      },

      /**onLogRequest
       * @instance
       * @param {logPayload} payload
       */
      onLogRequest: function alfresco_services_LoggingService__onLogRequest(payload) {
         /*jshint maxcomplexity:false*/
         if (payload &&
             payload.severity &&
             payload.messageArgs &&
             (this.loggingPreferences.all === true ||
              this.loggingPreferences[payload.severity] === true))
         {
            // If the filter is mapped (or if there is no filter) output the log...
            if (this.passesLoggingFilter(payload.callerName))
            {
               // Decorate the message with the source
               payload.messageArgs[0] = (payload.callerName || payload.alfCallerName || "") + " >> " + payload.messageArgs[0];

               // Make sure we can use the requested console method
               if (typeof console[payload.severity].apply !== "function") {

                  // Run through the message arguments (because apply doesn't work)
                  var message;
                  for (var i = 0, j = payload.messageArgs.length; i < j; i++) {

                     // Get the next message
                     message = payload.messageArgs[i];

                     // If message is an object, try and be helpful and JSONify it
                     if (typeof message !== "string") {
                        try {
                           message = JSON.stringify(message);
                        } catch (e) {
                           message = "Unable to JSONify: '" + message + "'";
                        }
                     }

                     // Decorate the message according to its position in the array
                     var prefix = (j === 1) ? "" : "[" + (i + 1) + "/" + j + "] ";

                     // Log the message
                     if (i === 0) {
                        console.log("");
                     }
                     console.log(prefix + message);
                     if (i + 1 === j) {
                        console.log("");
                     }
                  }
               } else {

                  // All good here, carry on ...
                  console[payload.severity].apply(console, payload.messageArgs);
               }
            }
         }
      }
   });
});
