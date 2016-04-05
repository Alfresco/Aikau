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
 * This test assesses the CoreXhr base class.
 *
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "intern/dojo/lang"],
        function(module, TestCommon, defineSuite, assert, lang) {

   defineSuite(module, {
      name: "CoreXhr Tests",
      testPage: "/CoreXhr",

      "Ensure correct default headers are sent with each request": function() {
         return this.remote.findById("CRUD_GET_ALL_BUTTON")
            .click()
            .end()

         .getLastXhr("my/test/url")
            .then(function(xhr) {
               var requestHeaders = lang.getProperty(xhr, "request.headers");
               assert.property(requestHeaders, "Accept-Language");
               assert.propertyVal(requestHeaders, "Content-Type", "application/json");
            });
      },

      "Ensure 401 is handled correctly when a handler is provided by a service request": function() {
         return this.remote.findById("AUTHENTICATION_FAIL_BUTTON")
            .click()
            .end()

         .getLastXhr("authfail")
            .then(function(xhr) {
               var body = lang.getProperty(xhr, "response.body");
               assert.property(body, "result");
            });
      }
   });
});