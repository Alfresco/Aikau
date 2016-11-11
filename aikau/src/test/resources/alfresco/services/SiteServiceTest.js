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
define(["module",
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "intern/dojo/node!leadfoot/keys"],
        function(module, TestCommon, defineSuite, assert, keys) {

   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var dialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");
   var selectSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/Select");

   var selectors = {
      buttons: {
         createSite: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CREATE_SITE"])
      },
      dialogs: {
         createSite: {
            visible: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["CREATE_SITE_DIALOG"]),
            hidden: TestCommon.getTestSelector(dialogSelectors, "hidden.dialog", ["CREATE_SITE_DIALOG"]),
            confirmationButton: TestCommon.getTestSelector(dialogSelectors, "form.dialog.confirmation.button", ["CREATE_SITE_DIALOG"]),
            disabledConfirmationButton: TestCommon.getTestSelector(dialogSelectors, "disabled.form.dialog.confirmation.button", ["CREATE_SITE_DIALOG"])
         }
      },
      textBoxes: {
         createSiteTitle: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["CREATE_SITE_FIELD_TITLE"])
         },
         createSiteShortName: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["CREATE_SITE_FIELD_SHORTNAME"])
         }
      },
      selectControls: {
         sitePresets: {
            dropDown: TestCommon.getTestSelector(selectSelectors, "option.menu", ["CREATE_SITE_FIELD_PRESET"]),
            openIcon: TestCommon.getTestSelector(selectSelectors, "open.menu.icon", ["CREATE_SITE_FIELD_PRESET"]),
            options: TestCommon.getTestSelector(selectSelectors, "options", ["CREATE_SITE_FIELD_PRESET"]),
            option1: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["CREATE_SITE_FIELD_PRESET", "1"]),
            option2: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["CREATE_SITE_FIELD_PRESET", "2"])
         }
      }
   };

   defineSuite(module, {
      name: "SiteService Tests",
      testPage: "/SiteService",

      "Create site (shortName set from title)": function() {
         return this.remote.setFindTimeout(5000)

         .findByCssSelector(selectors.buttons.createSite)
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.createSite.visible)
         .end()

         .findByCssSelector(selectors.textBoxes.createSiteTitle.input)
            .type(" has*odd & chars")
         .end()

         .findByCssSelector(selectors.textBoxes.createSiteShortName.input)
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "hasodd-chars");
            });
      },

      "Create Site (edit shortName stops auto updating)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.createSiteShortName.input)
            .clearValue()
            .type("fail")
         .end()

         .findByCssSelector(selectors.textBoxes.createSiteTitle.input)
            .clearValue()
            .type("no copying now")
         .end()

         .findByCssSelector(selectors.textBoxes.createSiteShortName.input)
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "fail");
            });
      },

      "Create site (duplicate shortName)": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.createSiteTitle.input)
            .clearValue()
            .type(" used")
         .end()

         .findDisplayedByCssSelector("#CREATE_SITE_FIELD_TITLE .alfresco-forms-controls-BaseFormControl__validation-warning")
         .end()

         .findAllByCssSelector(selectors.dialogs.createSite.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "Create site success": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.createSiteTitle.input)
            .clearValue()
            .type("pass")
         .end()

         .findByCssSelector(selectors.textBoxes.createSiteShortName.input)
            .clearValue()
            .type("pass")
         .end()
         
         .waitForDeletedByCssSelector(selectors.dialogs.createSite.disabledConfirmationButton)
         .end()

         .clearLog()
         .pressKeys(keys.ENTER)

         .findByCssSelector(selectors.dialogs.createSite.hidden)
         .end()

         .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification--visible")
         .end()

         .getLastPublish("ALF_SITE_CREATION_REQUEST")
         .getLastPublish("ALF_ADD_FAVOURITE_SITE")
         .getLastPublish("ALF_SITE_CREATION_SUCCESS")
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
         .then(function(payload) {
            assert.propertyVal(payload, "url", "site/pass/dashboard");
         });
      },

      "Edit site": function() {
         return this.remote.findById("EDIT_SITE_label")
            .click()
         .end()

         .findByCssSelector("#EDIT_SITE_DIALOG #EDIT_SITE_FIELD_TITLE .dijitInputContainer input")
            .clearValue()
            .type("New Site Title")
         .end()

         .clearLog()

         .findById("EDIT_SITE_DIALOG_OK_label")
            .click()
            .click() // For some reason in automated testing a second click is required here
                     // Adding a long pause and a manual click and it works fine...
         .end()

         .findByCssSelector("#EDIT_SITE_DIALOG.dialogHidden")
         .end()

         .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification--visible")
         .end()

         .getLastPublish("ALF_SITE_EDIT_REQUEST")
            .getLastPublish("ALF_SITE_EDIT_SUCCESS")
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "site/site1");
            });
      },

      "Edit moderated site": function() {
         return this.remote.findById("EDIT_MODERATED_SITE_label")
            .click()
         .end()

         // The moderated visibility radio button should be selected
         .findByCssSelector("#EDIT_SITE_DIALOG #EDIT_SITE_FIELD_VISIBILITY_CONTROL .dijitRadioChecked input[value=MODERATED]")
         .end()

         .clearLog()

         .findById("EDIT_SITE_DIALOG_OK_label")
            .click()
            .end()

         .findByCssSelector("#EDIT_SITE_DIALOG.dialogHidden")
            .end()

         .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification--visible");
      },

      "Request to join site navigates user to their dashboard afterwards": function() {
         return this.remote.findById("REQUEST_SITE_MEMBERSHIP_label")
            .click()
         .end()

         .findByCssSelector(".dialogDisplayed .dijitButtonNode")
            .click()
         .end()

         .waitForDeletedByCssSelector(".dialogDisplayed")
         .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "user/admin%40alfresco.com/home", "Did not navigate to user home page");
            })

         .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification--visible");
      },

      "Requesting to join site with request already pending displays suitable error message": function() {
         return this.remote.findById("REQUEST_SITE_MEMBERSHIP_ALREADY_PENDING_label")
            .click()
         .end()

         .findDisplayedByCssSelector(".alfresco-notifications-AlfNotification__message")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "A request to join this site is already pending");
            })
         .end()

         .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification");
      },

      "Error occurring when requesting to join site displays error message": function() {
         return this.remote.findById("REQUEST_SITE_MEMBERSHIP_ERROR_label")
            .click()
         .end()

         .findDisplayedByCssSelector(".alfresco-notifications-AlfNotification__message")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "The request to join the site failed");
            })
         .end()

         .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification");
      },

      "Can cancel request to join site": function() {
         return this.remote.findById("CANCEL_PENDING_REQUEST_label")
            .clearLog()
            .click()
         .end()

         .getLastXhr("api/sites/my-site/invitations/foo")

         .findDisplayedByCssSelector(".alfresco-notifications-AlfNotification__message")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Successfully cancelled request to join site My Site");
            })
         .end()

         .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification")

         .getLastPublish("ALF_RELOAD_PAGE");
      },

      "Leave site and confirm user home page override works": function() {
         return this.remote.findById("LEAVE_SITE_label")
            .click()
         .end()

         .findByCssSelector(".dialogDisplayed .dijitButton:first-child .dijitButtonNode")
            .click()
         .end()

         .waitForDeletedByCssSelector(".dialogDisplayed")
         .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "user/admin%40alfresco.com/home", "Did not generate URL with correct user home page");
            });
      },

      "Become site manager (and reload data)": function() {
         return this.remote.findById("BECOME_SITE_MANAGER_label")
            .clearLog()
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_RELOAD_DATA");
      },

      "Become site manager (and reload page)": function() {
         return this.remote.findById("BECOME_SITE_MANAGER_PAGE_RELOAD_label")
            .clearLog()
            .click()
         .end()

         .getLastPublish("ALF_RELOAD_PAGE");
      }
   });

   defineSuite(module, {
      name: "SiteService Tests (Reconfigured presets)",
      testPage: "/SiteService?sitePresets=configured",

      "Reconfigured site presets are correct": function() {
         return this.remote.setFindTimeout(5000)

         .findByCssSelector(selectors.buttons.createSite)
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.createSite.visible)
         .end()

         .findByCssSelector(selectors.selectControls.sitePresets.openIcon)
            .click()
         .end()

         .findDisplayedByCssSelector(selectors.selectControls.sitePresets.dropDown)
         .end()

         .findAllByCssSelector(selectors.selectControls.sitePresets.options)
            .then(function(options) {
               assert.lengthOf(options, 1);
            })
         .end()

         .findByCssSelector(selectors.selectControls.sitePresets.option1)
            .getVisibleText()
            .then(function(sitePresetLabel) {
               assert.equal(sitePresetLabel, "Custom");
            });
      }
   });

   defineSuite(module, {
      name: "SiteService Tests (Additional presets)",
      testPage: "/SiteService?sitePresets=additional",

      "Reconfigured site presets are correct": function() {
         return this.remote.setFindTimeout(5000)

         .findByCssSelector(selectors.buttons.createSite)
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.createSite.visible)
         .end()

         .findByCssSelector(selectors.selectControls.sitePresets.openIcon)
            .click()
         .end()

         .findDisplayedByCssSelector(selectors.selectControls.sitePresets.dropDown)
         .end()

         .findAllByCssSelector(selectors.selectControls.sitePresets.options)
            .then(function(options) {
               assert.lengthOf(options, 2);
            })
         .end()

         .findByCssSelector(selectors.selectControls.sitePresets.option1)
            .getVisibleText()
            .then(function(sitePresetLabel) {
               assert.equal(sitePresetLabel, "Collaboration Site");
            })
         .end()

         .findByCssSelector(selectors.selectControls.sitePresets.option2)
            .getVisibleText()
            .then(function(sitePresetLabel) {
               assert.equal(sitePresetLabel, "Additional Custom");
            });
      }
   });

   defineSuite(module, {
      name: "SiteService Tests (Removed presets)",
      testPage: "/SiteService?sitePresets=remove",

      "Reconfigured site presets are correct": function() {
         return this.remote.setFindTimeout(5000)

         .findByCssSelector(selectors.buttons.createSite)
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.createSite.visible)
         .end()

         .findByCssSelector(selectors.selectControls.sitePresets.openIcon)
            .click()
         .end()

         .findDisplayedByCssSelector(selectors.selectControls.sitePresets.dropDown)
         .end()

         .findAllByCssSelector(selectors.selectControls.sitePresets.options)
            .then(function(options) {
               assert.lengthOf(options, 1);
            })
         .end()

         .findByCssSelector(selectors.selectControls.sitePresets.option1)
            .getVisibleText()
            .then(function(sitePresetLabel) {
               assert.equal(sitePresetLabel, "Additional Custom");
            });
      }
   });
});