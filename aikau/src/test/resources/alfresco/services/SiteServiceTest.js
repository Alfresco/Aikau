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
 * This test uses a MockXhr service to test the site service responds as required.
 * 
 * @author Martin Doyle
 */
define(["alfresco/TestCommon", 
        "intern!object", 
        "intern/chai!assert"], 
        function(TestCommon, registerSuite, assert) {

   registerSuite(function() {
      var browser;

      return {
         name: "SiteService Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/SiteService", "SiteService Tests");
         },

         beforeEach: function() {
            browser.end();
         },

         "Create site (duplicate shortName)": function() {
            return browser.setFindTimeout(5000)

            .findById("CREATE_SITE_label")
               .click()
            .end()

            .findDisplayedById("CREATE_SITE_DIALOG")
            .end()

            .findByCssSelector("#CREATE_SITE_DIALOG #CREATE_SITE_FIELD_TITLE .dijitInputContainer input")
               .type("fail")
            .end()

            .findByCssSelector("#CREATE_SITE_DIALOG #CREATE_SITE_FIELD_SHORTNAME .dijitInputContainer input")
               .type("fail")
            .end()

            .findById("CREATE_SITE_DIALOG_OK_label")
               .click()
            .end()

            .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification--visible")
            .end()

            .findDisplayedById("NOTIFICATION_PROMPT")
            .end()

            .findById("NOTIFCATION_PROMPT_ACKNOWLEDGEMENT_label")
               .click()
            .end()

            .findByCssSelector("#NOTIFICATION_PROMPT.dialogHidden")
            .end();
         },

         "Create site success": function() {
            return browser.findByCssSelector("#CREATE_SITE_DIALOG #CREATE_SITE_FIELD_TITLE .dijitInputContainer input")
               .clearValue()
               .type("pass")
            .end()

            .findByCssSelector("#CREATE_SITE_DIALOG #CREATE_SITE_FIELD_SHORTNAME .dijitInputContainer input")
               .clearValue()
               .type("pass")
            .end()

            .clearLog()

            .findById("CREATE_SITE_DIALOG_OK_label")
               .click()
            .end()

            .findByCssSelector("#CREATE_SITE_DIALOG.dialogHidden")
            .end()

            .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification--visible")
            .end()

            .getLastPublish("ALF_SITE_CREATION_REQUEST")
            .getLastPublish("ALF_SITE_CREATION_SUCCESS")
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.propertyVal(payload, "url", "site/pass/dashboard");
               });
         },

         "Edit site": function() {
            return browser.findById("EDIT_SITE_label")
               .click()
            .end()

            .findByCssSelector("#EDIT_SITE_DIALOG #EDIT_SITE_FIELD_TITLE .dijitInputContainer input")
               .clearValue()
               .type("New Site Title")
            .end()

            .clearLog()

            .findById("EDIT_SITE_DIALOG_OK_label")
               .click()
            .end()

            .findByCssSelector("#EDIT_SITE_DIALOG.dialogHidden")
            .end()

            .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification--visible")
            .end()

            .getLastPublish("ALF_SITE_EDIT_REQUEST")
            .getLastPublish("ALF_SITE_EDIT_SUCCESS")
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.propertyVal(payload, "url", "site/site1/dashboard");
               });
         },

         "Request to join site navigates user to their dashboard afterwards": function(){
            return browser.findById("REQUEST_SITE_MEMBERSHIP_label")
               .click()
               .end()

            .findByCssSelector(".dialogDisplayed .dijitButtonNode")
               .click()
               .end()

            .waitForDeletedByCssSelector(".dialogDisplayed")
               .end()

            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload){
                  assert.propertyVal(payload, "url", "user/admin%40alfresco.com/home", "Did not navigate to user home page");
               })

            .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification--visible");
         },

         "Leave site and confirm user home page override works": function(){
            return browser.findById("LEAVE_SITE_label")
               .click()
               .end()

            .findByCssSelector(".dialogDisplayed .dijitButton:first-child .dijitButtonNode")
               .click()
               .end()

            .waitForDeletedByCssSelector(".dialogDisplayed")
               .end()

            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload){
                  assert.propertyVal(payload, "url", "user/admin%40alfresco.com/home", "Did not generate URL with correct user home page");
               });
         },

         "Become site manager (and reload data)": function() {
            return browser.findById("BECOME_SITE_MANAGER_label")
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_DOCLIST_RELOAD_DATA");
         },

         "Become site manager (and reload page)": function() {
            return browser.findById("BECOME_SITE_MANAGER_PAGE_RELOAD_label")
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_RELOAD_PAGE");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});