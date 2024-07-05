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
 * @module aikauTesting/mockservices/FormDialogMockService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang"],
         function(declare, AlfCore, lang) {

   return declare([AlfCore], {

     /**
       * @instance
       * @param {array} args The constructor arguments.
       */
      constructor: function alfresco_testing_mockservices_FormDialogMockService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("POST_FORM_DIALOG", lang.hitch(this, this.onFormPost));
      },

      /**
       * @instance
       * @param {object} payload
       */
      onFormPost: function alfresco_testing_mockservices_FormDialogMockService__onFormPost(payload) {
         if (payload.text === "fail")
         {
            // Publish and error message to indicate that a failure occurred
            this.alfPublish("ALF_DISPLAY_PROMPT", {
               message: "Post failure"
            });

            // Intentionally wait before publishing failure message so that the unit test can detect the
            // disabled buttons.
            var _this = this;
            setTimeout(function() {
               _this.alfPublish(payload.alfPublishScope + "FORM_POST_FAILURE");
            }, 2000);
            
         }
         else
         {
            this.alfPublish(payload.alfPublishScope + "FORM_POST_SUCCESS");
         }
      }
   });
});
