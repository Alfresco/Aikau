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
 * @author Martin Doyle
 */
define(["intern!object",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon"
   ],
   function(registerSuite, assert, require, TestCommon) {

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
                  assert.lengthOf(payload.selectedFiles, 1, "Should have one node selected");
                  assert.deepPropertyVal(payload, "selectedFiles[0].node.nodeRef", "workspace://SpacesStore/b0037179-f105-4858-9d8f-44bfb0f67d8a", "Incorrect node selected");
               });
         },

         "Deselecting a document changes the selected documents appropriately": function() {
            return browser.findByCssSelector("[widgetid=\"DOCUMENT_DESELECTED_BUTTON\"] .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("ALF_SELECTED_FILES_CHANGED", "Selected files change not published")
               .then(function(payload) {
                  assert.lengthOf(payload.selectedFiles, 0, "Should not have a current selected node");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
      });
   });