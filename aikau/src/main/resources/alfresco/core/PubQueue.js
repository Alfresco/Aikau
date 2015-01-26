/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
       * @default false
       */
      _released: false,

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
         if (this._released == false)
         {
            this._queue.push({
               topic: scopedTopic,
               payload: payload,
               caller: caller
            });
         }
         else
         {
            if (AlfConstants.DEBUG == true)
            {
               PubSubLog.getSingleton().pub(scopedTopic, payload, caller);
            }
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
         array.forEach(this._queue, function(publication) {
            if (AlfConstants.DEBUG == true)
            {
               PubSubLog.getSingleton().pub(publication.topic, 
                                            publication.payload, 
                                            publication.caller);
            }
            pubSub.publish(publication.topic, publication.payload);
         }, this);
      }
   });
   
   var instance; 
   PubQueue.getSingleton = function() {
      if (instance == null)
      {
         instance = new PubQueue(); 
      }
      return instance;
   };
   return PubQueue;
});