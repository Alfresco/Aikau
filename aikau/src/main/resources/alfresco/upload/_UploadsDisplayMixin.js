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
 * This mixin acts as an interface for widgets displaying uploads' progress.
 *
 * @module alfresco/upload/_UploadsDisplayMixin
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Martin Doyle
 * @since 1.0.50
 */
define(["alfresco/core/Core", 
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin", 
        "dojo/_base/declare"], 
        function(AlfCore, _WidgetBase, _TemplatedMixin, declare) {
        /*jshint unused:false*/

   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * This function handles displaying a file that could not be uploaded (where the failure
       * was identified before any attempt was made to start uploading the file).
       *
       * @instance
       * @param {string} fileName The name of the file that could not be uploaded
       * @param {object} error The details of why the file could not be uploaded.
       */
      addFailedFile: function alfresco_upload__UploadsDisplayMixin__addFailedFile(fileName, error) {
         this.alfLog("warn", "Method not overridden in implementing class");
      },

      /**
       * This function handles displaying a file that an attempt will be made to upload. The
       * [updateUploadProgress function]{@link module:alfresco/upload/_UploadsDisplayMixin#updateUploadProgress}
       * will handle updating the upload progress.
       *
       * @instance
       * @param {string} fileId The unique id of the file
       * @pararm {object} file The file requested to be uploaded
       */
      addInProgressFile: function alfesco_upload__UploadsDisplayMixin__addInProgressFile(fileId, file) {
         this.alfLog("warn", "Method not overridden in implementing class");
      },

      /**
       * This function handles the successful completion of a file upload. By default it moves the
       * displayed file from the "In progress" section to the "Completed" section.
       * 
       * @instance
       * @param {string} fileId The unique id of the file
       * @param {object} completionEvt The upload completions event
       * @param {object} request The request object used to attempt to upload the file
       */
      handleCompletedUpload: function alfresco_upload__UploadsDisplayMixin__handleCompletedUpload(fileId, completionEvt, request) {
         this.alfLog("warn", "Method not overridden in implementing class");
      },

      /**
       * This function handles the failure to upload a file. By default it moves the displayed file
       * from the "In Progress" section to the "Failed" section.
       *
       * @instance
       * @param {string} fileId The unique id of the file
       * @param {object} completionEvt The upload completions event
       * @param {object} request The request object used to attempt to upload the file
       */
      handleFailedUpload: function alfresco_upload__UploadsDisplayMixin__handleFailedUpload(fileId, failureEvt, request) {
         this.alfLog("warn", "Method not overridden in implementing class");
      },

      /**
       * Resets the display.
       *
       * @instance
       */
      reset: function alfresco_upload__UploadsDisplayMixin__reset() {
         this.alfLog("warn", "Method not overridden in implementing class");
      },

      /**
       * Displays the overall upload progress of all the files.
       *
       * @instance
       * @param {number} aggregateProgress The aggregate progress as a decimal of 1.
       */
      updateAggregateProgress: function alfresco_upload__UploadsDisplayMixin__updateAggregateProgress(aggregateProgress) {
         this.alfLog("warn", "Method not overridden in implementing class");
      },

      /**
       * Updates the displayed progress for an individual file upload.
       *
       * @instance
       * @param {string} fileId The unique id of the file
       * @param {number} percentageComplete The current upload progress as a percentage
       * @param {object} progressEvt The progress event
       */
      updateUploadProgress: function alfresco_upload__UploadsDisplayMixin__updateUploadProgress(fileId, percentageComplete, progressEvt) {
         this.alfLog("warn", "Method not overridden in implementing class");
      }
   });
});