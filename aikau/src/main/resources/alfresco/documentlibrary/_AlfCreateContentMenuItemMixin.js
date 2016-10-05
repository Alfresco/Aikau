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
 * This mixin module is used by both the [AlfCreateContentMenuBarItem]{@link module:alfresco/documentlibrary/AlfCreateContentMenuBarItem}
 * and [AlfCreateContentMenuItem]{@link module:alfresco/documentlibrary/AlfCreateContentMenuItem} and provides the basic payload
 * configuration for requesting dialogs to capture user information for creating content. It also provides tracking for the current
 * Node in which to create content.
 * 
 * @module alfresco/documentlibrary/_AlfCreateContentMenuItemMixin
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/topics"], 
        function(declare, AlfCore, topics) {
   
   return declare([AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/_AlfCreateContentMenuItemMixin.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/_AlfCreateContentMenuItemMixin.properties"}],

      /**
       * This is the type of content that will be created. This defaults to "cm:content" but can be overridden through
       * configuration.
       * 
       * @instance
       * @type {string}
       * @default
       */
      contentType: "cm:content",

      /**
       * The title for the content creation dialog.
       *
       * @instance
       * @type {String}
       * @default
       */
      dialogTitle: "create-content-menu-item.dialog.title",

      /**
       * The label for the content creation dialog confirmation button.
       *
       * @instance
       * @type {String}
       * @default
       */
      dialogConfirmationLabel: "create-content-menu-item.dialog.confirmation",

      /**
       * The label for the content creation dialog cancellation button.
       *
       * @instance
       * @type {String}
       * @default
       */
      dialogCancellationLabel: "create-content-menu-item.dialog.cancellation",

      /**
       * The topic published when the content creation dialog is confirmed.
       *
       * @instance
       * @type {String}
       * @default
       */
      formSubmissionTopic: "ALF_CREATE_CONTENT_REQUEST",

      /**
       * This is the MIME type of the content that will be created. This defaults to "text/plain" but can be overridden
       * through configuration.
       *
       * @instance
       * @type {string}
       * @default
       */
      mimeType: "text/plain",

      /**
       * This is the topic that will be published when the menu item is clicked. It defaults to the topic requesting
       * a form dialog be displayed but can be overridden through configuration.
       *
       * @instance
       * @type {String}
       * @default
       */
      publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",

      /**
       * It is expected that upload will require topics to be published globally, however this can be overridden through
       * configuration.
       *
       * @instance
       * @type {boolean}
       */
      publishGlobal: true,

      /**
       * The width of the dialog.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.89
       */
      dialogWidth: "550px",

      /**
       * This should be configured to be an array of form control widgets to be placed into the create content dialog.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgets: null,

      /**
       * 
       * @instance
       */
      onClick: function alfresco_documentlibrary__AlfCreateContentMenuItemMixin__onClick(/*jshint unused:false*/ evt) {
         var publishPayload;
         if (!this.publishPayload)
         {
            // If no explicit payload has been configured then use a default payload to generate a form dialog request...
            publishPayload = {
               contentWidth: this.dialogWidth || "550px",
               dialogId: "ALF_CREATE_CONTENT_DIALOG",
               dialogTitle: this.message(this.dialogTitle),
               dialogConfirmationButtonTitle: this.message(this.dialogConfirmationLabel),
               dialogCancellationButtonTitle: this.message(this.dialogCancellationLabel),
               dialogCloseTopic: this.pubSubScope + topics.CONTENT_CREATED,
               dialogEnableTopic: this.pubSubScope + topics.CONTENT_CREATION_FAILED,
               formSubmissionTopic: this.formSubmissionTopic,
               formSubmissionPayloadMixin: {
                  type: this.contentType,
                  prop_mimetype: this.mimeType || "",
                  currentNode: this.currentNode
               },
               fixedWidth: true,
               widgets: this.widgets
            };
         }
         else
         {
            // ...or use the configured payload
            publishPayload = this.publishPayload;
         }

         var publishGlobal = this.publishGlobal || false;
         var publishToParent = this.publishToParent || false;
         var payload = this.generatePayload(publishPayload, this.currentItem, null, this.publishPayloadType, this.publishPayloadItemMixin, this.publishPayloadModifiers);
         this.alfPublish(this.publishTopic, payload, publishGlobal, publishToParent);
      },

      /**
       * This handles publications on the 
       * [metadataChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#metadataChangeTopic}
       * topic to set the location of the current folder 
       * 
       * @instance
       * @param {object} payload 
       */
      onCurrentNodeChange: function alfresco_documentlibrary__AlfCreateContentMenuItemMixin__onCurrentNodeChange(payload) {
         if (payload && payload.node)
         {
            this.currentNode = payload.node;
         }
         else
         {
            this.alfLog("error", "A request was made to update the current NodeRef, but no 'node' property was provided in the payload: ", payload);
         }
      }
   });
});