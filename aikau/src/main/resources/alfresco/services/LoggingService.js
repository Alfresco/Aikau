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
 * @module alfresco/services/LoggingService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/_base/window",
        "dijit/registry",
        "alfresco/dialogs/AlfDialog"],
        function(declare, AlfCore, _PreferenceServiceTopicMixin, lang, domClass, win, registry, AlfDialog) {
        /*jshint devel:true*/


   return declare([AlfCore, _PreferenceServiceTopicMixin], {

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
       * @default "org.alfresco.share.logging"
       */
      loggingPreferencesId: "org.alfresco.share.logging",

      /**
       * This will hold a reference to the subscription to log events. It will be null unless logging is enabled.
       *
       * @instance
       * @type {object}
       * @default null
       */
      logSubscriptionHandle: null,

      /**
       * Sets up the subscriptions for the LoggingService
       *
       * @instance
       * @param {array} args The constructor arguments.
       *
       * @listens ALF_LOGGING_STATUS_CHANGE
       * @listens ALF_UPDATE_LOGGING_PREFERENCES
       * @listens ALF_SHOW_PUBSUB_LOG
       * @listens ALF_SHOW_DATA_MODEL
       * @listens ALF_TOGGLE_DEVELOPER_MODE
       *
       * @fires getPreferenceTopic
       */
      constructor: function alfresco_services_LoggingService__constructor(args) {
         lang.mixin(this, args);
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

         this.alfPublish(this.getPreferenceTopic, {
            preference: this.loggingPreferencesId,
            callback: this.setLoggingStatus,
            callbackScope: this
         });
      },

      toggleDeveloperMode: function alfresco_services_LoggingService__toggleDeveloperMode() {
         domClass.toggle(win.body(), "alfresco-developer-mode-Enabled");
      },

      /**
       *
       * @instance
       * @param {object} payload
       */
      showPubSubLog: function alfresco_services_LoggingService__showPubSubLog(payload) {
         /*jshint unused:false*/
         if (!this.pubSubLog)
         {
            this.pubSubLog = new AlfDialog({
               title: this.message("logging.pubSubLog.title"),
               fixedWidth: true,
               handleOverflow: true,
               widgetsContent: [
                  {
                     name: "alfresco/logging/SubscriptionLog"
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
       * Updates the subscription to the logging topic
       *
       * @instance
       *
       * @listens alfLoggingTopic
       */
      handleSubscription: function alfresco_services_LoggingService__handleSubscription() {
         if (this.loggingPreferences.enabled && !this.logSubscriptionHandle)
         {
            this.logSubscriptionHandle = this.alfSubscribe(this.alfLoggingTopic, lang.hitch(this, this.onLogRequest));
         }
         else if (!this.loggingPreferences.enabled && this.logSubscriptionHandle)
         {
            this.alfUnsubscribe(this.logSubscriptionHandle);
            this.logSubscriptionHandle = null;
         }
      },

      /**
       * This attribute is used to hold a reference to a [dialog]{@link module:alfresco/dialogs/AlfDialog} that can be
       * used to set more granular logging information (e.g. wildcard style matches for widgets and functions). It is set
       * on the first call to the [onDetailsDialog function]{@link module:alfresco/services/LoggingService#onDetailsDialog}.
       *
       * @instance
       * @type {object}
       * @default null
       */
      detailsDialog: null,

      /**
       * This is the topic used to subscribe to requests to save logging preferences updated by the
       * [preferences dialog]{@link module:alfresco/services/LoggingService#detailsDialog}.
       *
       * @instance
       * @event
       * @type {string}
       * @default "ALF_SAVE_LOGGING_PREFERNCES_UPDATE"
       */
      saveLoggingPrefsUpdateTopic: "ALF_SAVE_LOGGING_PREFERNCES_UPDATE",

      /**
       * This is the topic used to subscribe to requests to cancel logging preferences updates set in the
       * [preferences dialog]{@link module:alfresco/services/LoggingService#detailsDialog}.
       *
       * @instance
       * @event
       * @type {string}
       * @default "ALF_CANCEL_LOGGING_PREFERNCES_UPDATE"
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
       * @default null
       */
      loggingPreferences: null,

      /**
       *
       *
       * @typedef {Object} logPayload
       * @property severity {string}
       * @property callerName {string}
       * @property messageArgs {Object[]}
       */

      /**
       * @instance
       * @param {logPayload} payload
       */
      onLogRequest: function alfresco_services_LoggingService__onLogRequest(payload) {
         if (payload &&
             payload.severity &&
             payload.messageArgs &&
             (this.loggingPreferences.all === true ||
              this.loggingPreferences[payload.severity] === true))
         {
            // Call the console method passing all the additional arguments)...
            var callerName = payload.callerName;
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
            var matchesFilter = true;
            if (this.loggingPreferences.filter)
            {
               var test = new RegExp(this.loggingPreferences.filter);
               matchesFilter = test.test(callerName);
            }

            // If the filter is mapped (or if there is no filter) output the log...
            if (matchesFilter)
            {
               payload.messageArgs[0] = callerName + payload.messageArgs[0];
               var logFunc = (typeof console[payload.severity] === "function" && payload.severity) || "log";
               console[logFunc].apply(console, payload.messageArgs);
            }
         }
      }
   });
});
