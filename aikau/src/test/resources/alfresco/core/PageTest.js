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
 * This tests the basic page loading behaviour with regards to service and widget creation.
 *
 * @author Dave Draper
 * @since 1.0.63
 */
define(["module",
        "alfresco/defineSuite"],
        function(module, defineSuite) {

   defineSuite(module, {
      name: "Page Behaviour Tests",
      testPage: "/Page#searchTerm=test",

      // See AKU-922 for the background on this test
      "Search request is published": function() {
         return this.remote.getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS");
            
      }
   });
});