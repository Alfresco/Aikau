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
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {

         name: "ActionService Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ActionService", "ActionService Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Selecting a document changes the selected documents appropriately": function() {
            return browser.findByCssSelector("[widgetid=\"DOCUMENT_SELECTED_BUTTON\"] .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("ALF_SELECTED_FILES_CHANGED", "Selected files change not published")
               .then(function(payload) {
                  assert.lengthOf(payload.selectedItems, 1, "Should have one node selected");
                  assert.deepPropertyVal(payload, "selectedItems[0].node.nodeRef", "workspace://SpacesStore/b0037179-f105-4858-9d8f-44bfb0f67d8a", "Incorrect node selected");
               });
         },

         "Deselecting a document changes the selected documents appropriately": function() {
            return browser.findByCssSelector("[widgetid=\"DOCUMENT_DESELECTED_BUTTON\"] .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("ALF_SELECTED_FILES_CHANGED", "Selected files change not published")
               .then(function(payload) {
                  assert.lengthOf(payload.selectedItems, 0, "Should not have a current selected node");
               });
         },

         "Edit offline succcess": function() {
            return browser.findById("EDIT_OFFLINE_SUCCESS_label")
               .click()
            .end()

            .getLastPublish("ALF_DISPLAY_NOTIFICATION")
               .then(function(payload) {
                  assert.propertyVal(payload, "message", "'AKU-610.mp4' can now be edited");
               })

            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.include(payload.url, "/aikau/proxy/alfresco/api/node/content/workspace/SpacesStore/888956ca-b90e-47ff-9a18-86ae6dcdc50f/AKU-610%20(Working%20Copy).mp4?a=true");
               });
         },

         "Edit offline failure": function() {
            return browser.findById("EDIT_OFFLINE_FAILURE_label")
               .click()
            .end()

            .getLastPublish("ALF_DISPLAY_NOTIFICATION")
               .then(function(payload) {
                  assert.propertyVal(payload, "message", "You can't edit 'Another document'.");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});