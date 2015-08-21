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
 * @module alfresco/services/BaseService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 * @since 1.0.32
 */
define(["dojo/_base/declare",
        "alfresco/services/ServiceRegistry",
        "alfresco/core/Core"],
        function(declare, ServiceRegistry, AlfCore) {
   
   return declare([AlfCore], {
      
      /**
       * Sets up the subscriptions for the LogoutService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_BaseService__constructor(args) {
         declare.safeMixin(this, args);
         if (ServiceRegistry.getSingleton().register(this.alfServiceName, this.pubSubScope))
         {
            this.registerSubscriptions();
         }
         else
         {
            this.alfLog("log", "A service with the module id: '" + module.id + "' has already been registered");
         }
      },
      
      /**
       * This function should be overridden by extending services to register their subscriptions.
       *
       * @instance
       * @overridable
       */
      registerSubscriptions: function alfresco_services_BaseService__registerSubscriptions() {
         // No action required
      }
   });
});