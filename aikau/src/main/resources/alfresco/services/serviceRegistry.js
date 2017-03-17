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
 * Application-level registry for ensuring that only one service of each type can be registered using the same
 * pubSubScope.
 *
 * @module alfresco/services/serviceRegistry
 * @author Dave Draper
 * @since 1.0.32
 */
define(["dojo/_base/lang"],
       function(lang) {

   // The registry
   var _registry = {};
   return {

      /**
       * This function should is called by the [constructor of the BaseService]{@link module:alfresco/services/BaseService#constructor}
       * to ensure that multiple instances of the extending service are not being created for the same pubSubScope. 
       * This can occur when a page contains multiple Surf Components that each render Aikau content. The function 
       * will return true if another instance of the same service has not been registered to use the same pubSubScope.
       * 
       * @instance
       * @param  {string} id The ID of the service
       * @param  {string} pubSubScope The pubSubScope used by the service
       * @return {boolean} Indicates whether or not this service was the first with this ID and scope to be registered
       */
      register: function alfresco_services_ServiceRegistry__register(id, pubSubScope) {
         var registryPath = pubSubScope + "." + id;
         var alreadyExists = lang.getObject(registryPath, false, _registry) === true;
         if (!alreadyExists) 
         {
            lang.setObject(registryPath, true, _registry);
         }
         return !alreadyExists;
      }
   };
});