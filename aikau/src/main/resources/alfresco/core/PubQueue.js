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
 * Singleton providing class for handling publications. This allows publications to be queued whilst all the
 * widgets on the page are created. The overall [page widget]{@link module:alfresco/core/Page} will then "release"
 * all the publications once the widgets are ready to process them.
 *  
 * @module alfresco/core/PubQueue
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/topic",
        "alfresco/core/PubSubLog",
        "service/constants/Default"], 
        function(declare, lang, array, pubSub, PubSubLog, AlfConstants) {

   // This is a simple singleton pattern. Technically it is still possible to instantiate a new log,
   // but as the core will always use the singleton and it is expected that all calls will go through the core
   // then this shouldn't be a problem...
   var PubQueue = declare(null, {
      
      /**
       * Indicates whether or not the publications have been released. This is set from false to true
       * when the [release]{@link module:alfresco/core/PubQueue#release} function is called and will result
       * in publications no longer being queue but being published immediated
       *
       * @instance
       * @type {boolean}
       * @default
       */
      _released: false,

      /**
       * To make sure that all publications are made in order after releasing, this flag is used to indicate
       * that all queued publications have been made before publishing resulting publications. An example of this
       * would be where a queued publication triggers another publication - it is imperative that this resulting
       * publication does not "jump the queue". Instead it should itself be queued and wait for its turn.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.65
       */
      _unreleasedEmptied: false,

      /**
       * @instance
       * @type {array}
       * @default []
       */
      _queue: [],
      
      /**
       * @instance
       * @param {string} scopedTopic The topic to publish on
       * @param {string} payload The payload to be delivered
       */
      publish: function alfresco_core_PubQueue__publish(scopedTopic, payload, caller) {
         if (this._released === false || this._unreleasedEmptied === false)
         {
            this._queue.push({
               topic: scopedTopic,
               payload: payload,
               caller: caller
            });
         }
         else
         {
            this.log(scopedTopic, payload, caller);
            pubSub.publish(scopedTopic, payload);
         }
      },

      /**
       * Iterates over the queued publications and publishes them.
       *
       * @instance
       */
      release: function alfresco_core_PubQueue__release() {
         this._released = true;
         var publication = this._queue.shift();
         while (publication)
         {
            this.log(publication.topic, publication.payload, publication.caller);
            pubSub.publish(publication.topic, publication.payload);
            publication = this._queue.shift();
         }
         this._unreleasedEmptied = true;
      },

      /**
       * Logs the publication if the publication to be logged isn't a log request or 
       * a request to log publications or subscriptions.
       * 
       * @param {string} scopedTopic The topic to publish on
       * @param {object} payload The payload to be delivered
       * @param {object} caller The widget or service requesting the publication
       */
      log: function alfresco_core_PubQueue__log(scopedTopic, payload, caller) {
         if (scopedTopic && (scopedTopic !== "ALF_LOG_REQUEST" &&
                             scopedTopic !== "ALF_LOG_PUBLICATION_ACTIVITY" &&
                             scopedTopic !== "ALF_LOG_SUBSCRIPTION_ACTIVITY" &&
                             scopedTopic !== "ALF_LOG_UNSUBSCRIPTION_ACTIVITY"))
         {
            if (AlfConstants.DEBUG === true)
            {
               PubSubLog.getSingleton().pub(scopedTopic, payload, caller);
               pubSub.publish("ALF_LOG_PUBLICATION_ACTIVITY", payload, caller);
            }
         }
      }
   });
   
   var instance; 
   PubQueue.getSingleton = function() {
      if (!instance)
      {
         instance = new PubQueue(); 
      }
      return instance;
   };
   return PubQueue;
});