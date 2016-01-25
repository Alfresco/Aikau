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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Drag-and-drop file upload tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/dnd-upload", "Drag-and-drop file upload tests").end();
         },
         
         beforeEach: function() {
            browser.end();
         },
         
         "Simulate file drop": function() {
            return browser.findByCssSelector("body")

            // Wait for the document library to finish loading...
            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")
            .clearLog()

            // Simulate dropping a node...
            .findById("SIM_DROP_label")
               .click()
            .end()

            // Check that an upload request is published and includes the metadata...
            .getLastPublish("ALF_UPLOAD_REQUEST")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "targetData.destination", "parent://node/ref", "Target data not included in upload request");
               });
         },

         // See AKU-784 - We need to ensure that when new list data is loaded (such that a new view instance is created
         // to replace the current view instance) that target metadata is retained...
         "Update view and drop": function() {
            return browser.findByCssSelector("#SIMPLE_VIEW_NAME_ITEM_0 .alfresco-renderers-Property")
               .click()
            .end()

            // Wait for the document library to finish loading...
            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")
            .clearLog()

            // Simulate dropping a node...
            .findById("SIM_DROP_label")
               .click()
            .end()

            // Check that an upload request is published and includes the metadata...
            .getLastPublish("ALF_UPLOAD_REQUEST")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "targetData.destination", "parent://node/ref", "Target data not included in upload request");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});