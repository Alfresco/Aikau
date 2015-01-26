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
 * Singleton providing class for publication/subscription logging. The idea is that all pub/sub data
 * is logged through a single object that can be used for rendering logging data.
 *  
 * @module alfresco/core/PubSubLog
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/_base/lang"], 
        function(declare, lang) {

   // This is a simple singleton pattern. Technically it is still possible to instantiate a new log,
   // but as the core will always use the singleton and it is expected that all calls will go through the core
   // then this shouldn't be a problem...
   var PubSubLog = declare(null, {
      
      /**
       * @instance
       */
      _log: [],
      
      /**
       * @instance
       * @param {string} type The type of pub/sub event (e.g. publish, subscribe, unsubscribe)
       * @param {string} topic The associated topic (if available)
       * @param {object} data Any associated data with the event (e.g. the publication payload)
       * @param {object} object The widget or service that triggered the event
       */
      updateLog: function alfresco_core_PubSubLog__updateLog(type, topic, data, object) {
         var entry = {
            type: type,
            topic: topic,
            data: data,
            object: object
         };

         // Send details to the console to enable better filter, searching and clearing.
         // if (lang.isFunction(console.debug)) {
         //    console.debug(entry);
         // }

         this.addEntry(entry);
      },

      /**
       * @instance
       * @param {object} entry The log entry
       */
      addEntry: function alfresco_core_PubSubLog__addEntry(entry) {
         this._log.push(entry);
      },

      /**
       * 
       * @instance
       * @param {string} topic The topic published to
       * @param {object} payload The published payload (will include the topic)
       * @param {object} object The object that made the subscription
       */
      pub: function alfresco_core_PubSubLog__pub(topic, payload, object) {
         if (topic != "ALF_LOG_REQUEST")
         {
            this.updateLog("PUBLISH", topic, payload, object.id);
         }
      },

      /**
       * 
       * @instance
       * @param {string} topic The topic subscribed to
       * @param {object} callback The function passed as a callback
       * @param {object} object The object that made the subscription
       */
      sub: function alfresco_core_PubSubLog__sub(topic, callback, object) {
         this.updateLog("SUBSCRIBE", topic, callback.name, object.id);
      },

      /**
       * 
       * @instance
       * @param {object} handle The supplied subscription handle
       * @param {object} object The object that made the subscription
       */
      unsub: function alfresco_core_PubSubLog__unsub(handle, object) {
         this.updateLog("UNSUBSCRIBE", "", null, object.id);
      }
   });
   
   var instance; 
   PubSubLog.getSingleton = function() {
      if (instance == null)
      {
         instance = new PubSubLog(); 
      }
      return instance;
   };
   return PubSubLog;
});