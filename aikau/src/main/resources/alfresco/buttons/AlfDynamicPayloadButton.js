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
 * <p>Extends the standard Aikau button to allow the payload to dynamically be updated on published topics.
 * This allows a button to be contextually sensitive to changes on the page. Configure the updates by 
 * setting the [publishPayloadSubscriptions]{@link module:alfresco/buttons/AlfDynamicPayloadButton#publishPayloadSubscriptions}.</p>
 *
 * @example <caption>This is an example configuration:</caption>
 * {
 *    "name": "alfresco/buttons/AlfDynamicPayloadButton",
 *    "config": {
 *       "publishTopic": "MY_TOPIC_WHEN_CLICKED",
 *       "publishPayload": {
 *          "value": "A"
 *       },
 *       "publishPayloadSubscriptions": [
 *          {
 *             "topic": "MIXIN_COMPLETE_PAYLOAD"
 *          },
 *          {
 *             "topic": "MAP_SELECTED_DATA",
 *             "dataMapping": {
 *                "incomingPayload": "buttonPayload"
 *             }
 *          }
 *       ]
 *    }
 * }
 * 
 * @module alfresco/buttons/AlfDynamicPayloadButton
 * @extends alfresco/buttons/AlfButton
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/buttons/AlfButton",
        "dojo/_base/array",
        "dojo/_base/lang"], 
        function(declare, AlfButton, array, lang) {
   
   return declare([AlfButton], {

      /**
       * Represents the topics that will trigger an update of the button payload. Each topic can have it's own
       * mapping of data. If no 'dataMapping' attribute is provided then the entire published payload will be
       * mixed into the payload for the button.
       * 
       * @instance
       * @type {array}
       * @default null
       */
      publishPayloadSubscriptions: null,

      /**
       * Extends the [inherited function]{@link module:alfresco/buttons/AlfButton#postMixInProperties} to set up the
       * subscriptions for the [publishPayloadSubscriptions]
       * {@link module:alfresco/buttons/AlfDynamicPayloadButton#publishPayloadSubscriptions}
       * entries.
       *
       * @instance
       */
      postMixInProperties: function alfresco_buttons_AlfDynamicPayloadButton__postMixInProperties() {
         this.inherited(arguments);
         array.forEach(this.publishPayloadSubscriptions, lang.hitch(this, this.setupPayloadSubscriptions))
      },

      /**
       * Sets up subscriptions for each configured 
       * [publishPayloadSubscription]{@link module:alfresco/buttons/AlfDynamicPayloadButton#publishPayloadSubscriptions} entry.
       *
       * @instance
       */
      setupPayloadSubscriptions: function alfresco_buttons_AlfDynamicPayloadButton__setupPayloadSubscriptions(pps) {
         if (pps.topic)
         {
            this.alfSubscribe(pps.topic, lang.hitch(this, this.onPayloadUpdate, pps.dataMapping));
         }
         else
         {
            this.alfLog("warn", "A publishPayloadSubscription is configured without a 'topic' attribute", pps, this);
         }
      },

      /**
       * This handles the mapping of data for a subscribed topic. It ensures that a publishPayload object exists
       * and then attempts to map the requested data defined in the supplied dataMapping argument from the payload
       * argument into the publishPayload object. If no dataMapping argument is provided then the entire payload
       * is mixed in.
       *
       * @instance
       */
      onPayloadUpdate: function alfresco_buttons_AlfDynamicPayloadButton__onPayloadUpdate(dataMapping, payload) {
         // Make sure that there is a payload object to work with...
         if (this.publishPayload == null)
         {
            this.publishPayload = {};
         }

         if (dataMapping)
         {
            // Map data as requested...
            for (var key in dataMapping)
            {
               // Check that the data actually exists...
               var value = lang.getObject(key, false, payload);
               if (value != null)
               {
                  // ...and then set it as requested
                  lang.setObject(dataMapping[key], value, this.publishPayload);
               }
            }
         }
         else
         {
            // Mixin the entire payload if none is provided...
            lang.mixin(this.publishPayload, payload);
         }
      }
   });
});