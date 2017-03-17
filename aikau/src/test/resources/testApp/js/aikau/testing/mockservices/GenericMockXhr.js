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
 * Generic mock XHR that returns 200 OK for everything.
 * 
 * @module aikauTesting/mockservices/GenericMockXhr
 * @author Martin Doyle
 */
define([
      "alfresco/testing/MockXhr",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(MockXhr, declare, lang) {

      return declare([MockXhr], {

         /**
          * Set up the fake server
          *
          * @instance
          */
         setupServer: function aikauTesting_mockservices_GenericMockXhr__setupServer() {
            try {
               this.server.respondWith([200, {
                  "Content-Type": "application/json;charset=UTF-8"
               }, JSON.stringify({
                  result: "OK"
               })]);
               this.alfPublish("ALF_MOCK_XHR_SERVICE_READY");
            } catch (e) {
               this.alfLog("error", "The following error occurred setting up the mock server", e);
            }
         }
      });
   });