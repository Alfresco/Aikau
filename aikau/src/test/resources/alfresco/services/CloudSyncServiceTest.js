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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(registerSuite, assert, TestCommon, keys) {

   registerSuite(function(){
      var browser;

      return {

         name: "Cloud Sync Service Tests",

         setup: function() {
            browser = this.remote;
            // We need a bigger window for this test to accommodate the dialog....
            // Ideally dialogs should resize/position but was out of scope for the creation of this test...
            return TestCommon.loadTestWebScript(this.remote, "/CloudSyncService", "Cloud Sync Service Tests").setWindowSize(null, 1024, 950)
            .end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Request cloud authentication": function() {
            return browser.findById("UNAUTHENTICATED_label")
               .click()
            .end()
            .findByCssSelector("#ALF_CLOUD_AUTHENTICATION_DIALOG.dialogDisplayed");
         },

         "Authentication failure against the Cloud": function() {
            // Enter a user name (bob@alfresco.com will always be rejected)...
            return browser.findByCssSelector("#ALF_CLOUD_AUTHENTICATION_DIALOG #CLOUD_AUTH_USERNAME .dijitInputContainer input")
               .clearValue()
               .type("bob@alfresco.com")
            .end()

            // Enter a password...
            .findByCssSelector("#ALF_CLOUD_AUTHENTICATION_DIALOG #CLOUD_AUTH_PASSWORD .dijitInputContainer input")
               .clearValue()
               .type("invalid")
            .end()

            // Hit the confirmation button...
            .findById("ALF_CLOUD_AUTHENTICATION_DIALOG_OK_label")
               .click()
            .end()

            // Error notifcation prompt should be displayed
            .findByCssSelector("#NOTIFICATION_PROMPT.dialogDisplayed")
            .end()

            // Close the error prompt...
            .findById("NOTIFCATION_PROMPT_ACKNOWLEDGEMENT_label")
               .click()
            .end();
         },

         "Authentication success against the Cloud": function() {
            // Enter a user name (tony@alfresco.com will always be accepted)...
            return browser.findByCssSelector("#ALF_CLOUD_AUTHENTICATION_DIALOG #CLOUD_AUTH_USERNAME .dijitInputContainer input")
               .clearValue()
               .type("tony@alfresco.com")
            .end()

            // Enter a password...
            .findByCssSelector("#ALF_CLOUD_AUTHENTICATION_DIALOG #CLOUD_AUTH_PASSWORD .dijitInputContainer input")
               .clearValue()
               .type("password")
            .end()

            // Hit the confirmation button...
            .findById("ALF_CLOUD_AUTHENTICATION_DIALOG_OK_label")
               .click()
            .end();
         },

         "Make sure that path is not shown initially": function() {
            return browser.findByCssSelector("#ALF_CLOUD_SYNC_DIALOG.dialogDisplayed").end()
               .findById("CLOUD_SYNC_CONTAINER")
                  .isDisplayed()
                  .then(function(displayed) {
                     assert.isFalse(displayed, "The container picker should not be displayed until a site has been picked");
                  });
         },

         "Make sure that only sync-enabled tenants are displayed": function() {
            // There are actually 3 tenants in total, but one of them has sync disabled so only
            // 2 should be shown as options...

            // Clear the default tenant selection to reveal all the options...
            return browser.findById("CLOUD_SYNC_TENANT_CONTROL")
               .clearValue()
               .type("a")
            .end()

            // Get all the options
            .findAllByCssSelector("#CLOUD_SYNC_TENANT_CONTROL_popup div.dijitReset.dijitMenuItem")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "Only two tenants should be available as options");
               });
         },

         "Select a site to reveal the container picker": function() {
            // Select the tenant (should be alfresco.com as it's the first)...
            return browser.pressKeys(keys.ENTER)

               // Enter the start of a site name...
               .findById("CLOUD_SYNC_SITE_CONTROL")
                  .clearValue()
                  .type("s")
               .end()

               // Wait for the options popup
               .findDisplayedById("CLOUD_SYNC_SITE_CONTROL_popup")
               .end()

               // Now select the option...
               .findById("CLOUD_SYNC_SITE_CONTROL")
                  .pressKeys(keys.ENTER)
               .end()

               .findDisplayedById("CLOUD_SYNC_CONTAINER")
                  .isDisplayed()
                  .then(function(displayed) {
                     assert.isTrue(displayed, "The container picker should be displayed when a site value is provided");
                  });
         },

         "Check that the right site was used for the container picker": function() {
            return browser.findByCssSelector("body").end()
               .getLastPublish("ALF_GET_CLOUD_PATH")
                  .then(function(payload) {
                     assert.propertyVal(payload, "remoteSiteId", "site1");
                  });
         },

         "Expand a folder": function() {
            // Only the "release pipeline" folder can be expanded...
            return browser.findByCssSelector("#CLOUD_SYNC_CONTAINER .dijitTreeNodeContainer .dijitTreeNode:nth-child(4) .dijitTreeExpando")
               .click()
            .end()

            // There should now be a new container
            .findDisplayedByCssSelector("#CLOUD_SYNC_CONTAINER .dijitTreeNodeContainer .dijitTreeNode:nth-child(4) .dijitTreeNodeContainer .dijitTreeLabel")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "CANNOT SYNC", "Could not find the expected tree node");
               });
         },

         "Fail to create a sync": function() {
            // The "CANNOT SYNC" node will NOT be accepted by the mock XHR handler, so selecting it
            // and posting the form should result in an error...
            return browser.findByCssSelector("#CLOUD_SYNC_CONTAINER .dijitTreeNodeContainer .dijitTreeNode:nth-child(4) .dijitTreeNodeContainer .dijitTreeLabel")
               .click()
            .end()

            // Submit the form dialog...
            .findById("ALF_CLOUD_SYNC_DIALOG_OK_label")
               .click()
            .end()

            // Check the failure notification is displayed...
            .findByCssSelector("#NOTIFICATION_PROMPT.dialogDisplayed")
            .end()

            // Acknowledge the notification...
            .findById("NOTIFCATION_PROMPT_ACKNOWLEDGEMENT_label")
               .click()
            .end()

            // Wait for the prompt to be hidden...
            .findByCssSelector("#NOTIFICATION_PROMPT.dialogHidden");
         },

         "Switch sites to refresh container tree": function() {
            // Switch the sites to get a different container displayed...
            return browser.findById("CLOUD_SYNC_SITE_CONTROL").clearLog()
                  .clearValue()
                  .type("a")
               .end()

               // Wait for the options popup
               .findDisplayedById("CLOUD_SYNC_SITE_CONTROL_popup")
               .end()

               // Now select the option...
               .findById("CLOUD_SYNC_SITE_CONTROL")
                  .pressKeys(keys.ENTER)
               .end()

               .getLastPublish("ALF_GET_CLOUD_PATH")
                  .then(function(payload) {
                     assert.propertyVal(payload, "remoteSiteId", "anothersite");
                  });
         },

         "Successfully create a sync": function() {
            return browser.findByCssSelector("#CLOUD_SYNC_CONTAINER .dijitTreeNodeContainer .dijitTreeNode:nth-child(1) .dijitTreeLabel")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Presentation Collaboration");
               })
               .click()
            .end()

            // Submit the form dialog...
            .findById("ALF_CLOUD_SYNC_DIALOG_OK_label")
               .click()
            .end()

            // Wait for the dialog to be hidden...
            .findByCssSelector("#ALF_CLOUD_SYNC_DIALOG.dialogHidden")
            .end()

            .getLastPublish("ALF_SYNC_TO_CLOUD")
               .then(function(payload) {
                  assert.propertyVal(payload, "remoteTenantId", "alfresco.com", "Incorrect tenant");
                  assert.propertyVal(payload, "remoteSiteId", "anothersite", "Incorrect site");
                  assert.propertyVal(payload, "targetFolderNodeRef", "workspace://SpacesStore/5abec47f-15dd-472a-8f86-6c74e5d7d6d2", "Incorrect target NodeRef");
                  assert.deepPropertyVal(payload, "memberNodeRefs.0", "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e", "Incorrect member nodeRef (1)");
                  assert.deepPropertyVal(payload, "memberNodeRefs.1", "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4f", "Incorrect member nodeRef (2)");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});