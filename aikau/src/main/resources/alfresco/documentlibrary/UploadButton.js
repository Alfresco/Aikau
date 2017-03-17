/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This is a specialization of the [AlfCreateContentMenuBarItem]{@link module:alfresco/documentlibrary/AlfCreateContentMenuBarItem}
 * widget that subscribes to [metadataChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#metadataChangeTopic}
 * publications so that the upload target can be tracked. When the menu item is actioned it will publish a request
 * to a [ContentService]{@link module:alfresco/services/ContentService} (or equivalent service) to handle upload actions.
 * 
 * @module alfresco/documentlibrary/UploadButton
 * @extends alfresco/documentlibrary/AlfCreateContentMenuBarItem
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/AlfCreateContentMenuBarItem"], 
        function(declare, AlfCreateContentMenuBarItem) {

   return declare([AlfCreateContentMenuBarItem], {
      
      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/UploadButton.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/UploadButton.properties"}],

      /**
       * 
       * @instance
       * @type {string}
       * @default
       */
      label: "upload.label",

      /**
       * 
       * @instance
       * @type {string}
       * @default
       */
      iconClass: "alf-upload-icon",
      
      /**
       * 
       * @instance
       * @type {string}
       * @default
       */
      publishTopic: "ALF_SHOW_UPLOADER",

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_documentlibrary_UploadButton__postCreate() {
         this.inherited(arguments);
      },

      /**
       * 
       * @instance
       */
      onClick: function alfresco_documentlibrary_UploadButton__onClick(/*jshint unused:false*/ evt) {
         this.alfPublish(this.publishTopic, this.currentNode, this.publishGlobal, this.publishToParent);
      }
   });
});