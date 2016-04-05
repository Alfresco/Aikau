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
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "AlfDocumentList Tests (filters)",
      testPage: "/FilteredDocumentList",

      "Document request includes initial filter": function() {

         return this.remote.findByCssSelector("body").end().getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "dataType", "PERSONAL", "Initial filter not included in request");
            });
      },

      "Change filter": function() {
         return this.remote.findById("PUBLISH_DATA_label")
            .click()
            .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Fake data not provided")
            .clearLog()

         .findByCssSelector("#COMPOSITE_DROPDOWN_CONTROL input[value=\"DOCLIBS\"]")
            .click()
            .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST", "Filter did not trigger reload")
            .then(function(payload) {
               assert.propertyVal(payload, "dataType", "DOCLIBS", "Updated filter not included in request");
            });
      }
   });
});