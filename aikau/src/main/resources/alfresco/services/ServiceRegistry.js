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
 * Singleton for ensuring that only one service of each type can be registered using the same
 * pubSubScope.
 *
 * @module alfresco/services/ServiceRegistry
 * @author Dave Draper
 * @since 1.0.32
 */
define(["dojo/_base/declare"],
        function(declare) {

   // This is a simple singleton pattern. Technically it is still possible to instantiate a new registry,
   // but as the core will always use the singleton and it is expected that all calls will go through the core
   // then this shouldn't be a problem...
   var ServiceRegistry = declare(null, {

      /**
       * Internal registry of all services. Instantiated in prototype to be shared by all instances in case
       * another registry is created avoiding the singleton pattern.
       * 
       * @instance
       */
      _registry: {},

      /**
       * This function should be called in the constructor of all services to ensure that multiple instances
       * of that service are not being created for the same pubSubScope. This can occur when a page contains
       * multiple Surf Components that each render Aikau content. The function will return true if another
       * instance of the same service has not been registered to use the same pubSubScope.
       * 
       * @instance
       * @param  {string} id The ID of the service
       * @param  {string} pubSubScope The pubSubScope used by the service
       * @return {boolean} Indicates whether or not this service was registered unique
       */
      register: function alfresco_services_ServiceRegistry__register(id, pubSubScope) {
         var unique = true;
         if (!this._registry[pubSubScope])
         {
            // PubSubScope has not previously been used
            this._registry[pubSubScope] = {};
            this._registry[pubSubScope][id] = true;
         }
         else
         {
            // PubSubScope registered by another service...
            var scopedRegistry = this._registry[pubSubScope];
            if (!scopedRegistry[id])
            {
               // An instance of the service has not been registered at the requested scope
               scopedRegistry[id] = true;
            }
            else
            {
               // An instance of the service has already been registered at the requested scope
               unique = false;
            }
         }
         return unique;
      }
      
   });

   var instance;
   ServiceRegistry.getSingleton = function() {
      if (!instance)
      {
         instance = new ServiceRegistry();
      }
      return instance;
   };
   return ServiceRegistry;
});