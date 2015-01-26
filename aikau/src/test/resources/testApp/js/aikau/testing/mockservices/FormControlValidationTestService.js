/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @module aikauTesting/mockservices/FormControlValidationTestService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/_base/array"],
   function(declare, AlfCore, lang, array) {

      return declare([AlfCore], {

         /**
          * This queues up responses to simulate asynchronous delays.
          *
          * @instance
          * @type {array}
          * @default []
          */
         responses: [],

         /**
          * Indicates whether or not responses can be returned immediately or if they should be queued
          *
          * @instance
          * @type {boolean}
          * @default false
          */
         responsesBlocked: false,

         /**
          *
          *
          * @instance
          * @param {array} args The constructor arguments.
          */
         constructor: function alfresco_testing_mockservices_FormControlValidationTestService__constructor(args) {
            lang.mixin(this, args);
            this.alfSubscribe("GET_DUMMY_VALUES", lang.hitch(this, this.onGetDummyValues));
            this.alfSubscribe("BLOCK_RESPONSES", lang.hitch(this, this.onBlockResponses));
            this.alfSubscribe("UNBLOCK_RESPONSES", lang.hitch(this, this.onUnblockResponses));
         },

         /**
          * Sets a boolean flag which causes responses to start queuing up.
          *
          * @instance
          * @param {object} payload The published payload.
          */
         onBlockResponses: function alfresco_testing_mockservices_FormControlValidationTestService__onBlockResponses(payload) {
            this.responsesBlocked = true;
         },

         /**
          * Unsets a boolean flag which allows responses to be sent immediately and then publishes all
          * previously queued responses
          *
          * @instance
          * @param {object} payload The published payload
          */
         onUnblockResponses: function alfresco_testing_mockservices_FormControlValidationTestService__onBlockResponses(payload) {
            array.forEach(this.responses, function(response, index) {
               this.alfPublish(response.publishTopic, response.publishPayload);
            }, this);
            this.responsesBlocked = false;
         },

         /**
          * @instance
          */
         onGetDummyValues: function alfresco_testing_mockservices_FormControlValidationTestService__onGetDummyValues(payload) {
            var alfTopic = ((payload.alfResponseTopic != null) ? payload.alfResponseTopic : "NO_ALFRESPONSETOPIC") + "_SUCCESS";
            var payload = {
               someData: [
                  {
                     name: "One"
                  },
                  {
                     name: "Two"
                  },
                  {
                     name: "Three"
                  }
               ]
            };

            if (this.responsesBlocked)
            {
               this.responses.push({
                  publishTopic: alfTopic,
                  publishPayload: payload
               });
            }
            else
            {
               this.alfPublish(alfTopic, payload);
            }
         }
      });
   });
