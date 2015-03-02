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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/helpers/pollUntil"], 
        function(registerSuite, assert, require, TestCommon, pollUntil) {

      var browser;

      function closeAllDialogs() {
         return browser.end()
            .findAllByCssSelector(".dijitDialogCloseIcon")
            .then(function(closeButtons) {
               closeButtons.forEach(function(closeButton) {
                  if (closeButton.isDisplayed()) {
                     closeButton.click();
                  }
               });
               browser.end();
            })
            .then(pollUntil(function() {
               /*globals document*/
               var underlay = document.getElementById("dijit_DialogUnderlay_0"),
                  underlayHidden = underlay && underlay.style.display === "none";
               return underlayHidden || null;
            }, 5000));
      }

      registerSuite({
         name: "CrudService",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/CrudService", "CrudService")
               .end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Valid DELETE call succeeds": function() {
            return browser.findById("DELETE_SUCCESS_BUTTON")
               .click()
               .end()

            .findAllByCssSelector(TestCommon.topicSelector("ALF_CRUD_DELETED_SUCCESS", "publish", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Delete did not succeed");
               });
         },

         "Invalid DELETE call fails": function() {
            return browser.findById("DELETE_FAILURE_BUTTON")
               .click()
               .end()

            .findAllByCssSelector(TestCommon.topicSelector("ALF_CRUD_DELETED_FAILURE", "publish", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Invalid delete did not fail");
               });
         },

         "Failed DELETE displays failure message": function() {
            return browser.findByCssSelector("#NOTIFICATION_PROMPT .dialog-body")
               .then(function(dialogBody) {
                  return dialogBody.getVisibleText()
                     .then(function(messageText) {
                        var trimmed = messageText.replace(/^\s+|\s+$/g, "");
                        assert.equal(trimmed, "Test delete-failure message", "Delete failure message not displayed");
                     });
               });
         },

         "Valid UPDATE call succeeds": function() {
            return closeAllDialogs()
               .then(function() {
                  return browser.findById("UPDATE_SUCCESS_BUTTON")
                     .click()
                     .end()

                  .findAllByCssSelector(TestCommon.topicSelector("ALF_CRUD_UPDATED_SUCCESS", "publish", "any"))
                     .then(function(elements) {
                        assert.lengthOf(elements, 1, "Update did not succeed");
                     });
               });
         },

         "Invalid UPDATE call fails": function() {
            return browser.findById("UPDATE_FAILURE_BUTTON")
               .click()
               .end()

            .findAllByCssSelector(TestCommon.topicSelector("ALF_CRUD_UPDATED_FAILURE", "publish", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Invalid update did not fail");
               });
         },

         "Failed UPDATE displays failure message": function() {
            return browser.findByCssSelector("#NOTIFICATION_PROMPT .dialog-body")
               .then(function(dialogBody) {
                  return dialogBody.getVisibleText()
                     .then(function(messageText) {
                        var trimmed = messageText.replace(/^\s+|\s+$/g, "");
                        assert.equal(trimmed, "Test update-failure message", "Update failure message not displayed");
                     });
               });
         },

         "Valid CREATE call succeeds": function() {
            return closeAllDialogs()
               .then(function() {
                  return browser.findById("CREATE_SUCCESS_BUTTON")
                     .click()
                     .end()

                  .findAllByCssSelector(TestCommon.topicSelector("ALF_CRUD_CREATED_SUCCESS", "publish", "any"))
                     .then(function(elements) {
                        assert.lengthOf(elements, 1, "Create did not succeed");
                     });
               });
         },

         "Invalid CREATE call fails": function() {
            return browser.findById("CREATE_FAILURE_BUTTON")
               .click()
               .end()

            .findAllByCssSelector(TestCommon.topicSelector("ALF_CRUD_CREATED_FAILURE", "publish", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Invalid create did not fail");
               });
         },

         "Failed CREATE displays failure message": function() {
            return browser.findByCssSelector("#NOTIFICATION_PROMPT .dialog-body")
               .then(function(dialogBody) {
                  return dialogBody.getVisibleText()
                     .then(function(messageText) {
                        var trimmed = messageText.replace(/^\s+|\s+$/g, "");
                        assert.equal(trimmed, "Test create-failure message", "Create failure message not displayed");
                     });
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   });