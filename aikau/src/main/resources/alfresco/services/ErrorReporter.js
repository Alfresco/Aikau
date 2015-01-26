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
 * @module alfresco/services/ErrorReporter
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "dojo/_base/lang"],
        function(declare, AlfCore, CoreXhr, AlfConstants, lang) {
   
   return declare([AlfCore, CoreXhr], {
      
      /**
       * Subscribes to log requests.
       * 
       * @instance
       * @param {array} args The constructor arguments.
       */
      constructor: function alfresco_services_ErrorReporterconstructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe(this.alfLoggingTopic, lang.hitch(this, "onLogRequest"));
      },
      
      /**
       * This is the URL that will be posted to with the details of every error that occurs on the client side.
       * If this is left as null then it is assumed to be the standard Alfresco error reporting URL.
       *
       * @instance
       * @type {string}
       * @default null
       */
      errorReportingUrl: null,

      /**
       * This handles log requests. If the log serverity is "error" then the details will be
       * posted to the [errorReportingUrl]{@link module:alfresco/services/ErrorReporter#errorReportingUrl}
       * including the ID of the current user and URL of the current page that they were on.
       * 
       * @instance
       * @param {{severity: string, callerName: string, messageArgs: object[]} payload
       */
      onLogRequest: function alfresco_services_ErrorReporteronLogRequest(payload) {
         if (payload &&
             payload.severity === "error" &&
             payload.messageArgs)
         {
            var url = this.errorReportingUrl;
            if (url == null)
            {
               url = AlfConstants.URL_SERVICECONTEXT + "aikau/error-report"
            }
            var config = {
               callerName: (payload.callerName) ? payload.callerName : "unknown-caller",
               messageArgs: (payload.messageArgs) ? payload.messageArgs : [],
               userName: AlfConstants.USERNAME,
               location: window.location.href
            };
            this.serviceXhr({url : url,
                             data: config,
                             method: "POST"});
         }
      }
   });
});
