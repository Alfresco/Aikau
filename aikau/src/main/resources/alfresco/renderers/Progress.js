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
 * <p>This renderer is specifically designed report progress to the user. It was originally written to support
 * the download folder action in Alfresco Share so it's default configuration (e.g. labels, topics and payload
 * properties) are intended for that purpose. To use this widget for reporting the progress on alternative 
 * activities then the default configuration should be overridden.</p>
 * <p>The [requestProgressTopic]{@link module:alfresco/renderers/Progress#requestProgressTopic} should be configured
 * as the topic to publish to begin requesting progress information to be generated.</p>
 *
 * @module alfresco/renderers/Progress
 * @extends external:dijit/_WidgetBase
 * @author David Webster
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "dojo/text!./templates/Progress.html",
        "dojo/_base/lang",
        "dojo/dom-style"],
        function(declare, _WidgetBase, _TemplatedMixin, AlfCore, template, lang, domStyle) {

   return declare([_WidgetBase, AlfCore, _TemplatedMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Progress.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Progress.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Progress.css"}]
       */
      cssRequirements: [{cssFile:"./css/Progress.css"}],

      /**
       * The HTML template to use for the widget.
       *
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * renderProgressUI
       *
       * @instance
       * @type {String}
       * @default "ALF_PROGRESS_RENDER"
       */
      renderProgressUITopic: "ALF_PROGRESS_RENDER",

      /**
       * The message to display when progress is being initialized. By default this includes a message
       * that was originally created to support the original use-case for reporting progress on generating
       * an archive to download. This should be overridden for alternative use cases.
       *
       * @instance
       * @type {string}
       * @default "renderer.progress.creating"
       */
      creatingMessage: "renderer.progress.creating",

      /**
       * The message to display that reports the current status. This message will be provided two tokens
       * that indicate the number of items processed and the total number of items to process.
       *
       * @instance
       * @type {string}
       * @default "renderer.progress.status"
       */
      statusMessage: "renderer.progress.status",

      /**
       * The message to display when an error occurs reporting progress.
       *
       * @instance
       * @type {string}
       * @default "renderer.progress.error"
       */
      errorMessage: "renderer.progress.error",

      /**
       * The message to display when progress is complete.
       *
       * @instance
       * @type {string}
       * @default "renderer.progress.complete"
       */
      completedMessage: "renderer.progress.complete",

      /**
       * Sets up the form specific configuration for the dialog.
       *
       * @instance
       * @returns {object} The dialog configuration.
       */
      postCreate: function alfresco_renderers_Progress__postCreate() {
         this.labelNode.innerHTML = this.message(this.creatingMessage);

         // Subscribe to Update Progress Action.
         this.alfSubscribe("ALF_CLOSE_DIALOG", lang.hitch(this, this.cleanUp), true);
         this.alfSubscribe(this.renderProgressUITopic, lang.hitch(this, this.onRenderUI));

         // Kick off the initial progress request
         this.onRequestProgress();
      },

      /**
       * This is the topic that will be published to request the start of progress updates. It will publish
       * a payload on this topic containing scoped topics that should be used to provide 
       * [update]{@link module:alfresco/renderers/Progress#progressUpdateTopic}, 
       * [completion]{@link module:alfresco/renderers/Progress#progressCompleteTopic},
       * [cancellation]{@link module:alfresco/renderers/Progress#progressCancelledTopic} and
       * [error]{@link module:alfresco/renderers/Progress#progressErrorTopic} events.
       *
       * @instance
       * @type {string}
       * @default null
       */
      requestProgressTopic: null,

      /**
       * The topic to publish on to provide progress updates.
       *
       * @instance
       * @type {string}
       * @default "ALF_PROGRESS_UPDATED"
       */
      progressUpdateTopic: "ALF_PROGRESS_UPDATED",

      /**
       * The topic to publish on to indicate the task has completed.
       *
       * @instance
       * @type {string}
       * @default "ALF_PROGRESS_COMPLETED"
       */
      progressCompleteTopic: "ALF_PROGRESS_COMPLETED",

      /**
       * The topic to publish on to indicate that the task has been cancelled
       *
       * @instance
       * @type {string}
       * @default "ALF_PROGRESS_CANCELLED"
       */
      progressCancelledTopic: "ALF_PROGRESS_CANCELLED",

      /**
       * The topic to publish on to indicate that there has been an error processing the task
       *
       * @instance
       * @type {string}
       * @default "ALF_PROGRESS_ERROR"
       */
      progressErrorTopic: "ALF_PROGRESS_ERROR",

      /**
       * Called when progress returns & updates progress dialog.
       *
       * @instance
       */
      onRequestProgress: function alfresco_renderers_Progress__onRequestProgress() {
         this.alfLog("log", "Requesting progress");

         if (!this.requestProgressTopic) 
         {
            this.alfLog("error", "I don't know where to request progress from: requestProgressTopic not set!" + this);
         }
         else
         {
            var subscriptionListeners = [
               this.alfSubscribe(this.progressUpdateTopic, lang.hitch(this, this.onProgressUpdate)),
               this.alfSubscribe(this.progressCompleteTopic, lang.hitch(this, this.onProgressComplete)),
               this.alfSubscribe(this.progressCancelledTopic, lang.hitch(this, this.onProgressCancelled)),
               this.alfSubscribe(this.progressErrorTopic, lang.hitch(this, this.onProgressError))
            ];
            var payload = {
               progressUpdateTopic: this.pubSubScope + this.progressUpdateTopic,
               progressCompleteTopic: this.pubSubScope + this.progressCompleteTopic,
               progressCancelledTopic: this.pubSubScope + this.progressCancelledTopic,
               progressErrorTopic: this.pubSubScope + this.progressErrorTopic,
               subscriptionListeners: subscriptionListeners,
               nodes: this.nodes
            };
            this.alfPublish(this.requestProgressTopic, payload, true);
         }
      },

      /**
       * Called when progress returns & updates progress dialog.
       *
       * @instance
       * @param {object} payload
       */
      onProgressUpdate: function alfresco_renderers_Progress__onProgressUpdate(payload) {
         this.alfLog("log", "Progress Dialog Update received: " + payload);
         this.alfPublish(this.renderProgressUITopic, payload);
      },

      /**
       * Called when progress is finished.
       *
       * @instance
       * @param {object} payload
       */
      onProgressComplete: function alfresco_renderers_Progress__onProgressComplete(payload) {
         this.alfLog("log", "Progress Dialog Complete: " + payload);

         // Update the UI:
         this.displayUIMessage(this.message(this.completedMessage));
         this.updateProgressBar(0);

         // Trigger the progressFinishedTopic
         if (this.progressFinishedTopic) {
            this.alfPublish(this.progressFinishedTopic, payload);
         }

         this.alfPublish("ALF_CLOSE_DIALOG", payload, true);
      },

      /**
       * Called when action has been cancelled.
       *
       * @instance
       * @param {object} payload
       */
      onProgressCancelled: function alfresco_renderers_Progress__onProgressCancelled(payload) {
         this.alfLog("log", "Progress Dialog Cancelled: " + payload);
         this.alfPublish("ALF_CLOSE_DIALOG", payload, true);
      },

      /**
       * Called when there has been a fatal error. Progress has stopped and will not resume.
       * Error status contained in payload.errorMessage.
       *
       * @instance
       * @param {object} payload
       */
      onProgressError: function alfresco_renderers_Progress__onProgressError(payload) {
         this.alfLog("log", "Progress Dialog Error: " + payload);
         this.displayUIMessage(this.message(this.errorMessage));
      },

      /**
       * The dot-notation address of the property in the progress publication that contains the
       * amount "done". This is expected to be an integer.
       *
       * @instance
       * @type {string}
       * @default "response.done"
       */
      doneProperty: "response.done",

      /**
       * The dot-notation address of the property in the progress publication that contains the
       * total amount "to do". This is expected to be an integer. The percentage complete will be
       * measured by the value of the [doneProperty]{@link module:alfresco/renderers/Progress} divided 
       * by the value represented by this property.
       *
       * @instance
       * @type {string}
       * @default "response.total"
       */
      totalProperty: "response.total",

      /**
       * The dot-notation address of the property in the progress publication that contains the
       * number of items completed towards the target.
       *
       * @instance
       * @type {string}
       * @default "response.filesAdded"
       */
      itemsAddedProperty: "response.filesAdded",

      /**
       * The dot-notation address of the property in the progress publication that contains the
       * total number of items to process.
       *
       * @instance
       * @type {string}
       * @default "response.totalFiles"
       */
      totalItemsProperty: "response.totalFiles",

      /**
       * Called to update the UI with the data.
       * 
       * @instance
       * @param {object} payload
       */
      onRenderUI: function alfresco_renderers_Progress_onRenderUI(payload) {
         // Get the raw data from the payload...
         var done = lang.getObject(this.doneProperty, false, payload);
         var total = lang.getObject(this.totalProperty, false, payload);
         var filesAdded = lang.getObject(this.itemsAddedProperty, false, payload);
         var totalFiles = lang.getObject(this.totalItemsProperty, false, payload);

         // Get integer values from the data...
         done = parseInt(done, 10);
         total = parseInt(total, 10);
         filesAdded = parseInt(filesAdded, 10);
         totalFiles = parseInt(totalFiles, 10);

         if (!total || !done || !filesAdded || !totalFiles)
         {
            this.alfLog("error", "Missing required data for progress: done=" + done + 
               ", total=" + total + 
               ", itemsAdded: " + filesAdded +
               ", totalItems: " + totalFiles);
         }
         else
         {
            var progressPercentage = (total > 0) ? Math.round(done / total * 100) : 0,
               percentageRemaining = 100 - progressPercentage;

            this.alfLog("log", "progress: " + progressPercentage);

            // Write to Dom:
            var messageVars = {
               0: filesAdded,
               1: totalFiles
            };
            this.displayUIMessage(this.message(this.statusMessage, messageVars));

            // Set style on progress bar:
            this.updateProgressBar(percentageRemaining);
         }
      },

      /**
       * Display the specified message in the dialog
       *
       * @instance
       * @param {string} message
       */
      displayUIMessage: function alfresco_renderers_Progress__displayUIMessage(message) {
         this.alfLog("log", "Progress message: " + message);
         if (this.labelNode) {
            this.labelNode.innerHTML = message;
         }
      },

      /**
       *
       * @instance
       * @param {number} percentageRemaining
       */
      updateProgressBar: function alfresco_renderers_Progress__updateProgressBar(percentageRemaining) {
         if (this.progressNode)
         {
            domStyle.set(this.progressNode, "left", "-" + percentageRemaining + "%");
         }
      },

      /**
       *
       * @instance
       * @param {object} payload
       */
      cleanUp: function alfresco_renderers_Progress__cleanUp(payload) {
         this.cleanProgressListeners(payload);
      },

      /**
       *
       * @instance
       * @param {object} payload
       */
      cleanProgressListeners: function alfresco_renderers_Progress__cleanProgressListeners(payload) {
         if (!payload.subscriptionListeners)
         {
            this.alfLog("error", "No subscription listeners to unsubscribe from");
            return;
         }
         this.alfUnsubscribe(payload.subscriptionListeners);
      }
   });
});