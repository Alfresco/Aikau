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

   var shouldBeRendered = function(browser, index) {
      return browser.findById("ACTIONS_ITEM_" + index + "_MENU_text")
         .click()
      .end()

      .findDisplayedById("ACTIONS_ITEM_" + index + "_GROUP")
      .end()

      .findById("ACTIONS_ITEM_" + index + "_UPLOAD_NEW_VERSION");
   };

   var shouldNotBeRendered = function(browser, index) {
      return browser.findById("ACTIONS_ITEM_" + index + "_MENU_text")
         .click()
      .end()

      .findDisplayedById("ACTIONS_ITEM_" + index + "_GROUP")
      .end()

      .findAllByCssSelector("#ACTIONS_ITEM_" + index + "_UPLOAD_NEW_VERSION")
         .then(function(elements) {
            assert.lengthOf(elements, 0, "Upload new version action shouldn't be rendered");
         });
   };

   registerSuite(function(){
      var browser;

      return {
         name: "Upload New Version Action Test",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/UploadNewVersionAction", "Upload New Version Action Test").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check folder": function() {
            return shouldNotBeRendered(browser, 0);
         },

         "Check basic node": function() {
            return shouldBeRendered(browser, 1);
         },

         "Check working copy owner by user": function() {
            return shouldBeRendered(browser, 2);
         },

         "Check working copy owner by another user": function() {
            return shouldNotBeRendered(browser, 3);
         },

         "Check node locked by user": function() {
            return shouldBeRendered(browser, 4);
         },

         "Check node locked by another user": function() {
            return shouldNotBeRendered(browser, 5);
         },

         "Check node with node lock": function() {
            return shouldNotBeRendered(browser, 6);
         },

         "Check node without Write permission": function() {
            return shouldNotBeRendered(browser, 7);
         },

         "Upload a new verion": function() {
            return browser.findById("ACTIONS_ITEM_1_MENU_text")
               .click()
            .end()

            .findDisplayedById("ACTIONS_ITEM_1_GROUP")
            .end()

            .findById("ACTIONS_ITEM_1_UPLOAD_NEW_VERSION")
               .click()
            .end()

            // Give the dialog a chance to appear...
            .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed")
            .end()

            // Check this is an update (rather than just upload) dialog...
            .findAllByCssSelector(".alfresco-dialog-AlfDialog .alfresco-forms-controls-RadioButtons")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Version increment options should be displayed");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});