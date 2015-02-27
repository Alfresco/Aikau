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
      "intern/chai!expect",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon"
   ],
   function(registerSuite, expect, assert, require, TestCommon) {

      var browser;

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
                        assert.equal(trimmed, "Test failure message", "Failure message not displayed");
                     });
               });
         },

         // "Notification hides after displaying": function() {
         //    return browser.setFindTimeout(5000)
         //       .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification__message");
         // },

         // "Topic publishes after notification hidden": function() {
         //    return browser.findAllByCssSelector(TestCommon.topicSelector("ALF_NOTIFICATION_DESTROYED", "publish", "any"))
         //       .then(function(elements) {
         //          assert.lengthOf(elements, 1, "Post-notification topic not published");
         //       });
         // },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   });