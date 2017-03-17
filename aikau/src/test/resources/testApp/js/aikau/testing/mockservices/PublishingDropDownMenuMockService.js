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
 * This mock service aids testing the dropdown subscriptions for SUCCESS, FAILURE and CANCEL events.
 * The first publish will succeed, the second will fail and the third will be cancelled.
 * All subsequent changes will trigger no response.
 *
 * @module aikauTesting/mockservices/PublishingDropDownMenuMockService
 * @extends module:alfresco/core/Core
 * @author David Webster
 */
define(["alfresco/core/Core",
      "alfresco/core/topics",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(AlfCore, topics, declare, lang) {

      return declare([AlfCore], {

         /**
          * Counter for the number of publishes (used to determine response)
          *
          * @instance 
          * @type {number}
          */
         publishCounter: 0,

         /**
          * Constructor
          *
          * @instance
          */
         constructor: function alfresco_testing_mockservices_PublishingDropDownMenuMockService__constructor() {
            this.alfSubscribe("ALF_PUBLISHING_DROPDOWN_MENU", lang.hitch(this, this.onDropdownMenuPublish));
            this.alfSubscribe("DROPDOWN_PUBLISH_CONFIRMED", lang.hitch(this, this.onDropdownPublishConfirmed));
            this.alfSubscribe("CONFIRM_DROPDOWN_PUBLISH", lang.hitch(this, this.confirmDropdownPublish));
         },

         /**
          * Confirm the change and re-publish to correct topic if confirmed
          *
          * @instance
          * @param {Object} payload The payload
          */
         confirmDropdownPublish: function alfresco_testing_mockservices_PublishingDropDownMenuMockService__confirmDropdownPublish(payload) {
            this.alfServicePublish(topics.CREATE_DIALOG, {
               cancelPublishTopic: payload.responseTopic + "_CANCEL",
               dialogTitle: "Are you sure?",
               dialogId: "CONFIRM_PUBLISH_DIALOG",
               handleOverflow: false,
               textContent: "Are you sure you wish to change this value?",
               widgetsButtons: [{
                  name: "alfresco/buttons/AlfButton",
                  id: "OK",
                  config: {
                     label: "OK",
                     publishTopic: "DROPDOWN_PUBLISH_CONFIRMED",
                     publishPayload: payload
                  }
               }, {
                  name: "alfresco/buttons/AlfButton",
                  id: "CANCEL",
                  config: {
                     label: "Cancel",
                     publishTopic: payload.responseTopic + "_CANCEL"
                  }
               }]
            });
         },

         /**
          * Handle dropdown menu publishes
          *
          * @instance
          * @param {Object} payload The payload
          */
         onDropdownMenuPublish: function alfresco_testing_mockservices_PublishingDropDownMenuMockService__onDropdownMenuPublish(payload) {
            if (this.publishCounter === 0) {
               this.alfPublish(payload.responseTopic + "_SUCCESS");
            } else if (this.publishCounter === 1) {
               this.alfPublish(payload.responseTopic + "_FAILURE");
            } else if (this.publishCounter === 2) {
               this.alfPublish(payload.responseTopic + "_CANCEL");
            }
            this.publishCounter++;
         },

         /**
          * Handle confirmation of the dropdown menu change
          *
          * @instance
          * @param {Object} payload The payload
          */
         onDropdownPublishConfirmed: function alfresco_testing_mockservices_PublishingDropDownMenuMockService__onDropdownPublishConfirmed(payload) {
            setTimeout(lang.hitch(this, function() {
               this.alfPublish(payload.responseTopic + "_SUCCESS");
            }), 50);
         }
      });
   });