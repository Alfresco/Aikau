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
 * @module aikauTesting/mockservices/FileUploadMockService
 * @extends module:alfresco/core/Core
 * @author Martin Doyle
 * @since 1.0.65
 */
define(["alfresco/core/Core",
        "alfresco/core/topics", 
        "dojo/_base/array", 
        "dojo/_base/declare", 
        "dojo/_base/lang"], 
        function(AlfCore, topics, array, declare, lang) {

   return declare([AlfCore], {

      /**
       * Constructor
       *
       * @instance
       * @param {array} args The constructor arguments.
       */
      constructor: function alfresco_testing_mockservices_FileUploadMockService__constructor(args) {
         declare.safeMixin(this, args);
         this.alfSubscribe("UNDO_UPLOAD", lang.hitch(this, this._undoUpload));
      },

      /**
       * Undo the upload
       *
       * @instance
       * @param    {object} payload The publish payload
       */
      _undoUpload: function alfresco_testing_mockservices_FileUploadMockService___undoUpload(payload) {
         var uploadId = payload.uploadId;
         this.alfPublish(topics.UPLOAD_MODIFY_ITEM, {
            uploadId: uploadId,
            action: "REMOVE"
         });
      }
   });
});