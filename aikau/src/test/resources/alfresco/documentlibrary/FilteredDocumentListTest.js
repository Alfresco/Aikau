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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "AlfDocumentList Tests (filters)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/FilteredDocumentList", "AlfDocumentList Tests (filters)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Document request includes initial filter": function() {

            return browser.findByCssSelector("body").end().getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
               .then(function(payload) {
                  assert.propertyVal(payload, "dataType", "PERSONAL", "Initial filter not included in request");
               });
         },

         "Change filter": function() {
            return browser.findByCssSelector("#COMPOSITE_DROPDOWN_CONTROL input[value=\"DOCLIBS\"]")
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST", "Filter did not trigger reload")
               .then(function(payload) {
                  assert.propertyVal(payload, "dataType", "DOCLIBS", "Updated filter not included in request");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});