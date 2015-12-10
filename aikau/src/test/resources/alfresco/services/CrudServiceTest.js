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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/helpers/pollUntil"],
        function(registerSuite, assert, TestCommon, pollUntil) {

   function closeAllDialogs(browser) {
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

   registerSuite(function(){
      var browser;

      return {
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

            .getLastPublish("ALF_CRUD_DELETED_SUCCESS", "Delete did not succeed");
         },

         "Invalid DELETE call fails": function() {
            return browser.findById("DELETE_FAILURE_BUTTON")
               .click()
            .end()

            .getLastPublish("ALF_CRUD_DELETED_FAILURE", "Invalid delete did not fail");
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
            return closeAllDialogs(browser)
               .then(function() {
                  return browser.findById("UPDATE_SUCCESS_BUTTON")
                     .click()
                  .end()

                  .getLastPublish("ALF_CRUD_UPDATED_SUCCESS", "Update did not succeed");
               });
         },

         "Invalid UPDATE call fails": function() {
            return browser.findById("UPDATE_FAILURE_BUTTON")
               .click()
            .end()

            .getLastPublish("ALF_CRUD_UPDATED_FAILURE", "Invalid update did not fail");
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
            return closeAllDialogs(browser)
               .then(function() {
                  return browser.findById("CREATE_SUCCESS_BUTTON")
                     .click()
                  .end()

                  .getLastPublish("ALF_CRUD_CREATED_SUCCESS", "Create did not succeed");
               });
         },

         "Invalid CREATE call fails": function () {
            return browser.findById("CREATE_FAILURE_BUTTON")
               .click()
            .end()

            .getLastPublish("ALF_CRUD_CREATED_FAILURE", "Invalid create did not fail");
         },

         "Failed CREATE displays failure message": function () {
            return browser.findByCssSelector("#NOTIFICATION_PROMPT .dialog-body")
               .then(function (dialogBody) {
                  return dialogBody.getVisibleText()
                     .then(function (messageText) {
                        var trimmed = messageText.replace(/^\s+|\s+$/g, "");
                        assert.equal(trimmed, "Test create-failure message", "Create failure message not displayed");
                     });
               });
         },

         "GET ALL success": function () {
            return closeAllDialogs(browser)
               .then(function() {
                  return browser.findById("GET_ALL_DEFAULT_CACHE_BUTTON")
                     .click()
                  .end()

                  .getLastPublish("ALF_GET_ALL_DEFAULT_CACHE_SUCCESS", "GET ALL didn't succeed");
               });
         },

         "GET ALL with prevent cache option success": function () {
            return browser.findById("GET_ALL_PREVENT_CACHE_BUTTON")
               .click()
            .end()

            .getLastPublish("ALF_GET_ALL_PREVENT_CACHE_SUCCESS", "GET ALL with preventCache flag failed");
         },

         "Check URI encoding": function() {
            return browser.findById("URL_ENCODING_REQUIRED_BUTTON")
               .clearXhrLog()
               .click()
            .end()
            .getLastXhr("aikau/proxy/alfresco/resources/nocache?filter=%25moomin");
         },

         "Scoped create": function() {
            return browser.findById("SCOPED_CREATE_label")
               .click()
            .end()
            .getLastPublish("SCOPE1_ALF_DOCLIST_RELOAD_DATA", "Scoped reload request not published");
         },

         "Scoped delete": function() {
            return browser.findById("SCOPED_DELETE_label")
               .click()
            .end()
            .getLastPublish("SCOPE2_ALF_DOCLIST_RELOAD_DATA", "Scoped reload request not published");
         },

         "Scoped delete with confirmation": function() {
            return browser.findById("SCOPED_DELETE_WITH_CONFIRMATION_label")
               .click()
            .end()

            .findByCssSelector("#ALF_CRUD_SERVICE_DELETE_CONFIRMATION_DIALOG.dialogDisplayed")
            .end()

            .findById("ALF_CRUD_SERVICE_DELETE_CONFIRMATION_DIALOG_CONFIRM_label")
               .click()
            .end()

            .getLastPublish("SCOPE3_ALF_DOCLIST_RELOAD_DATA", "Scoped reload request not published");
         },

         "Scoped Update": function() {
            return browser.findById("SCOPED_UPDATE_label")
               .click()
            .end()
            .getLastPublish("SCOPE4_ALF_DOCLIST_RELOAD_DATA", "Scoped reload request not published");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});