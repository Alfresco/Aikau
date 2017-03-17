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
 * This widget is provided for testing purposes. Any child widgets configured within it will
 * not be created until a topic has been published indicating that a 
 * [MockXhr widget]{@link module:alfresco/testing/MockXhr} is ready for handling requests.
 * 
 * @module alfresco/testing/WaitForMockXhrService
 * @extends module:alfresco/core/ProcessWidgets
 * @author Dave Draper
 * @since 1.0.50
 */
define(["dojo/_base/declare",
        "alfresco/core/ProcessWidgets",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, ProcessWidgets, lang, array) {
   
   return declare([ProcessWidgets], {
      
      /**
       * Processes the widgets into the content node.
       * 
       * @instance
       */
      postCreate: function alfresco_testing_WaitForMockXhrService__postCreate() {
         this.alfSubscribe("ALF_MOCK_XHR_SERVICE_READY", lang.hitch(this, this.onMockXhrServiceReady));
      },

      /**
       * Load any services and widgets once the mock XHR service is ready to handle requests that
       * make XHR requests.
       * 
       * @instance
       */
      onMockXhrServiceReady: function alfresco_testing_WaitForMockXhrService__onMockXhrServiceReady() {
         if (!this._processedWidgets)
         {
            if (this.services)
            {
               array.forEach(this.services, function(service) {
                  var dep = null,
                      serviceConfig = {};
                  if (typeof service === "string")
                  {
                     dep = service;
                  }
                  else if (typeof service === "object" && service.name)
                  {
                     dep = service.name;
                     serviceConfig = service.config || {};
                  }
                  var requires = [dep];
                  require(requires, function(ServiceType) {
                     // jshint nonew:false
                     new ServiceType(serviceConfig);
                  });
               });
            }
            if (this.widgets)
            {
               this.processWidgets(this.widgets, this.containerNode);
            }
         }
      }
   });
});