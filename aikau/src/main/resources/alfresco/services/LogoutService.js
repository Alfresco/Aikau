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
 * @module alfresco/services/LogoutService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, AlfCore, CoreXhr, lang, AlfConstants) {
   
   return declare([AlfCore, CoreXhr], {
      
      /**
       * Sets up the subscriptions for the LogoutService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_LogoutService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_DOLOGOUT", lang.hitch(this, "doLogout"));
      },
      
      /**
       * Perform a logout POST operation.
       * The action of performing this call will return a 401 Unauthorised status code and potentially
       * a 'Location' header for the redirect - this is handled by CoreXhr.
       * 
       * @instance
       */
      doLogout: function alfresco_services_LogoutService__doLogout() {
         this.serviceXhr({
            url: AlfConstants.URL_PAGECONTEXT + "dologout",
            method: "POST",
            callbackScope: this
         });
      }
   });
});