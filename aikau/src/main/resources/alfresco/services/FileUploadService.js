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
 * <p>This service can be used to control the uploading of content as well as
 * the updating the content of existing nodes on an Alfresco Repository.</p>
 * 
 * <p><strong>NOTE:</strong> There is a bug with older browsers (IE8/IE9/IE10 only)
 * that means that it is not possible to click on elements to the left or right of
 * the upload panel.</p>
 * 
 * @module alfresco/services/FileUploadService
 * @extends module:alfresco/services/_BaseUploadService
 * @author Martin Doyle
 * @since 1.0.52
 */
define(["alfresco/core/topics", 
        "alfresco/services/_BaseUploadService", 
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/Deferred"], 
        function(topics, _BaseUploadService, declare, lang, Deferred) {

   // Declare and return the class
   return declare([_BaseUploadService], {

      /**
       * This is the topic on which to publish updates to the title container.
       *
       * @instance
       * @override
       * @type {string}
       * @default
       */
      uploadsContainerTitleUpdateTopic: topics.STICKY_PANEL_SET_TITLE,

      /**
       * The widget definition that displays the uploads' progress. This should
       * be a single widget that implements the interface defined by
       * [_UploadsDisplayMixin]{@link module:alfresco/services/_UploadsDisplayMixin}.
       *
       * @instance
       * @override
       * @type {object[]}
       * @default [{name: "alfresco/upload/UploadMonitor"}]
       */
      widgetsForUploadDisplay: [{
         name: "alfresco/upload/UploadMonitor"
      }],

      /**
       * Extends the [inherited function]{@link module:alfresco/services/_BaseUploadService#resetTotalUploads}
       * to publish a topic to indicate that the [sticky panel]{@link module:alfresco/layout/StickyPanel} containing
       * this upload monitor can re-enable its close button.
       *
       * @instance
       * @param {object} payload A payload detailing the completed upload (not used)
       * @since 1.0.54
       * @fires module:alfresco/core/topics#STICKY_PANEL_DISABLE_CLOSE
       */
      resetTotalUploads: function alfresco_services_FileUploadService__resetTotalUploads() {
         this.inherited(arguments);
         this.alfServicePublish(topics.STICKY_PANEL_ENABLE_CLOSE);
      },

      /**
       * Register this service's subscriptions.
       * 
       * @instance
       * @override
       * @listens module:alfresco/core/topics#STICKY_PANEL_CLOSED
       */
      registerSubscriptions: function alfresco_services_FileUploadService__registerSubscriptions() {
         this.inherited(arguments);
         this.alfSubscribe(topics.STICKY_PANEL_CLOSED, lang.hitch(this, this.onUploadsContainerClosed), true);
      },

      /**
       * Ensure the uploads display widget is available
       *
       * @instance
       * @override
       * @returns {object} A promise, that will resolve when the widget is ready to accept upload information.
       * @fires module:alfresco/core/topics#STICKY_PANEL_DISABLE_CLOSE
       */
      showUploadsWidget: function alfresco_services_FileUploadService__showUploadsWidget() {
         var dfd = new Deferred();
         this.alfServicePublish(topics.DISPLAY_STICKY_PANEL, {
            title: this.message(this.uploadsContainerTitle, 0),
            padding: 0,
            widgets: this.widgetsForUploadDisplay,
            callback: lang.hitch(this, function(panel) {
               this.uploadsContainer = panel;
               dfd.resolve();
            })
         });
         this.alfServicePublish(topics.STICKY_PANEL_DISABLE_CLOSE);
         return dfd.promise;
      }
   });
});