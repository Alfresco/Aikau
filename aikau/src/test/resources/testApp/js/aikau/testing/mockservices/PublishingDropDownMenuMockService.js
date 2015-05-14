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
 * This mock service aids testing the dropdown subscriptions for SUCCESS, FAILURE and CANCEL events.
 * The first publish will succeed, the second will fail and the third will be cancelled.
 * All subsequent changes will trigger no response.
 *
 * @module aikauTesting/mockservices/PublishingDropDownMenuMockService
 * @extends module:alfresco/core/Core
 * @author David Webster
 */
define(["alfresco/core/Core",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(AlfCore, declare, lang) {

      return declare([AlfCore], {

         /**
          * Save a reference to the subscription handle so we can unsubscribe later
          *
          * @instance
          * @type {Object}
          */
         subscriptionHandle: null,

         /**
          * Constructor
          *
          * @instance
          * @param {array} args The constructor arguments.
          */
         constructor: function alfresco_testing_mockservices_PublishingDropDownMenuMockService__constructor(args) {
            this.subscriptionHandle = this.alfSubscribe("ALF_PUBLISHING_DROPDOWN_MENU", lang.hitch(this, this.onDropDownPublishSuccess));
         },

         /**
          * Publish the SUCCESS event and swap subscription to trigger FAILURE event next time
          *
          * @instance
          * @param    {object} payload The publish payload
          */
         onDropDownPublishSuccess: function alfresco_testing_mockservices_PublishingDropDownMenuMockService__onDropDownPublishSuccess(payload) {
            // Unsubscribe from the success event handler and resubscribe for failure event
            this.alfUnsubscribe(this.subscriptionHandle);
            this.subscriptionHandle = this.alfSubscribe("ALF_PUBLISHING_DROPDOWN_MENU", lang.hitch(this, this.onDropDownPublishFailure));
            this.alfPublish(payload.responseTopic + "_SUCCESS", {});
         },

         /**
          * Publish the FAILURE event and swap subscription to trigger CANCEL event next time
          *
          * @instance
          * @param    {object} payload The publish payload
          */
         onDropDownPublishFailure: function alfresco_testing_mockservices_PublishingDropDownMenuMockService__onDropDownPublishFailure(payload) {
            // Unsubscribe from the failure event handler and resubscripbe for cancel event
            this.alfUnsubscribe(this.subscriptionHandle);
            this.subscriptionHandle = this.alfSubscribe("ALF_PUBLISHING_DROPDOWN_MENU", lang.hitch(this, this.onDropDownPublishCancel));
            this.alfPublish(payload.responseTopic + "_FAILURE", {});
         },

         /**
          * Publish the CANCEL event and remove subscriptions. This service is now done.
          *
          * @instance
          * @param    {object} payload The publish payload
          */
         onDropDownPublishCancel: function alfresco_testing_mockservices_PublishingDropDownMenuMockService__onDropDownPublishCancel(payload) {
            // Unsubscribe for cancel event and don't resubscribe.
            this.alfUnsubscribe(this.subscriptionHandle);
            this.alfPublish(payload.responseTopic + "_CANCEL", {});
         }
      });
   });