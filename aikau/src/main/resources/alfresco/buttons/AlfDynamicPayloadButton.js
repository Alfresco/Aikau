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
 * <p>Extends the standard Aikau button to allow the payload to dynamically be updated on published topics.
 * This allows a button to be contextually sensitive to changes on the page. Configure the updates by 
 * setting the [publishPayloadSubscriptions]{@link module:alfresco/buttons/AlfDynamicPayloadButton#publishPayloadSubscriptions}.</p>
 * <p>It is also possible to configure the button to udpate the payload as the browser URL hash fragment
 * changes (again using an optional mapping).
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
 *                "incomingPayloadProperty": "buttonPayloadProperty"
 *             }
 *          }
 *       ],
 *       "useHash": true,
 *       "hashDataMapping": {
 *          "hashFragmentParameterName": "buttonPayloadProperty"
 *       }
 *    }
 * }
 * 
 * @module alfresco/buttons/AlfDynamicPayloadButton
 * @extends alfresco/buttons/AlfButton
 * @mixes module:alfresco/documentlibrary/_AlfHashMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/buttons/AlfButton", 
        "alfresco/documentlibrary/_AlfHashMixin",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/io-query",
        "dojo/hash"], 
        function(declare, AlfButton, _AlfHashMixin, array, lang, ioQuery, hash) {
   
   return declare([AlfButton, _AlfHashMixin], {

      /**
       * Indicates whether not has values can be used to map data into the button payload.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      useHash: false,

      /**
       * An optional mapping of hash fragment data to publish payload data. This allows only certain elements
       * of the hash to be used and for them to be assigned to specific properties of the published payload.
       *
       * @instance
       * @type {object}
       * @default null
       */
      hashDataMapping: null,

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
         array.forEach(this.publishPayloadSubscriptions, lang.hitch(this, this.setupPayloadSubscriptions));
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/buttons/AlfButton#postCreate} to check
       * update the payload based on the browser URL hash and set up handlers for hash changes (if 
       * [useHash]{@link module:alfresco/buttons/AlfDynamicPayloadButton#useHash} is true).
       * 
       * @instance
       */
      postCreate: function alfresco_buttons_AlfDynamicPayloadButton__postCreate() {
         this.inherited(arguments);
         if (this.useHash)
         {
            var hashString = hash();
            var currHash = ioQuery.queryToObject(hashString);
            if (this.hashDataMapping)
            {
               this.mapData(this.hashDataMapping, currHash);
            }
            else
            {
               // If no data mapping has been provided then mix the entire hash in
               lang.mixin(this.publishPayload, currHash);
            }

            this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onHashChanged));
         }
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
         if (!this.publishPayload)
         {
            this.publishPayload = {};
         }

         if (dataMapping)
         {
            // Map data as requested...
            this.mapData(dataMapping, payload);
         }
         else
         {
            // Mixin the entire payload if none is provided...
            lang.mixin(this.publishPayload, payload);
         }
      },

      /**
       * Maps the data provided into the payload based on the dataMapping provided.
       *
       * @instance
       * @param {object} dataMapping The mapping to use for the data
       * @param {object} data The data to be mapped
       */
      mapData: function alfresco_buttons_AlfDynamicPayloadButton__mapData(dataMapping, data) {
         for (var key in dataMapping)
         {
            if (dataMapping.hasOwnProperty(key))
            {
               // Check that the data actually exists...
               var value = lang.getObject(key, false, data);
               if (value)
               {
                  // ...and then set it as requested
                  lang.setObject(dataMapping[key], value, this.publishPayload);
               }
            }
         }
      },

      /**
       * This function is called whenever the browser URL hash fragment is changed.e end of the fragment
       * 
       * @instance
       * @param {object} payload
       */
      onHashChanged: function alfresco_buttons_AlfDynamicPayloadButton__onHashChanged(payload) {
         if (this.hashDataMapping)
         {
            this.mapData(this.hashDataMapping, payload);
         }
         else
         {
            // If no data mapping has been provided then mix the entire hash in
            lang.mixin(this.publishPayload, payload);
         }
      }
   });
});