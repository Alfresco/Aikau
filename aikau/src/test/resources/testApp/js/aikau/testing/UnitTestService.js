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
 * @module aikauTesting/UnitTestService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, AlfCore, CoreXhr, lang, AlfConstants) {
   
   return declare([AlfCore, CoreXhr], {
      
      /**
       * Sets up a subscription for processing unit test requests. This is hitched to the
       * [requestUnitTest]{@link module:aikauTesting/UnitTestService#requestUnitTest}
       * function that will POST the supplied model to the Unit Test WebScript (this should
       * save the test model in the HTTP Session and then redirect to the unit test page
       * renderer)
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_testing_UnitTestService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_REQUEST_UNIT_TEST", lang.hitch(this, "requestUnitTest"));
      },
      
      /**
       * Makes an XHR request to set the supplied model in the session.
       *
       * @instance
       * @param {object} The paylod containing additional data. This can contain a "responseTopic" to 
       * publish the options back on.
       */
      requestUnitTest: function alfresco_testing_UnitTestService__requestUnitTest(payload) {
         this.alfLog("log", "Unit test request received:", payload);
         if (payload != null && payload.unitTestModel != null)
         {
            var data = {
               unitTestModel: payload.unitTestModel
            };
            this.serviceXhr({
               url: AlfConstants.URL_SERVICECONTEXT + "unit-test-model",
               data: data,
               method: "POST",
               successCallback: this.requestUnitTestSuccess,
               failureCallback: this.requestUnitTestFailure,
               callbackScope: this
            });
         }
         else
         {
            this.alfLog("error", "No 'unitTestModel' attribute provided in the payload", payload, this);
         }
      },

      /**
       * When a unit test model has been successfully posted it will be saved in the HTTP Session and
       * the browser can be re-directed to the the unit test rendering page.
       *
       * @instance
       * @param {object} response The response from the POST request
       * @param {object} originalRequestConfig The details of the original request
       */
      requestUnitTestSuccess: function alfresco_testing_UnitTestService__requestUnitTestSuccess(response, originalRequestConfig) {
         this.alfLog("log", "Redirecting to unit test rendering page");
         window.location = AlfConstants.URL_PAGECONTEXT + "tp/ws/unit-test-model";
      },

      /**
       * Called when the unit test model could not be saved to the HTTP Session.
       *
       * @instance
       * @param {object} response The response from the POST request
       * @param {object} originalRequestConfig The details of the original request
       */
      requestUnitTestFailure: function alfresco_testing_UnitTestService__requestUnitTestSuccess(response, originalRequestConfig) {
         this.alfLog("error", "The unit test model could not be saved", response, originalRequestConfig);
      }
   });
});