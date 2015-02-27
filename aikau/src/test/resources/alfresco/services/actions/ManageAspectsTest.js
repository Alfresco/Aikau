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
 * This tests the Manage Aspects action in the [ActionService]{@link module:alfresco/services/ActionService}.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(registerSuite, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Manage Aspects Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ManageAspects", "Manage Aspects Test").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test aspects dialog opens (when requesting aspects)": function() {
         // Check that dialog opens when the button simulating the action request is clicked...
         return browser.findByCssSelector("#MANAGE_ASPECTS1_label")
            .click()
         .end()
         .findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG.alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "The manage aspects dialog did not appear");
            });
      },

      "Test available aspects count": function() {
         // Count the number of available aspects (the applied aspects should not be shown)...
         // NOTE: elements might exist, but just be hidden
         return browser.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 14, "Incorrect number of available aspects");
            });
      },

      "Test selected aspects count": function() {
         // Cound the aspects that are currently applied...
         // NOTE: aspects not in the available list should be hidden
         return browser.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .picked-items .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Incorrect number of selected aspects");
            });
      },

      "Test that classifiable aspect is not displayed as available": function() {
         // Classifiable should be the first aspect in the available list and it should not be displayed
         // (because it is already applied!)
         return browser.findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers  .alfresco-lists-views-AlfListView tr:nth-child(1)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The classifiable aspect is shown as available");
            });
      },

      "Test that only addable aspects have add icon displayed": function() {
         // cm:effectivity should not be addable because it is not in the addable list
         // It should be the 3rd row in the available list
         // It's PublishAction should not have been rendered
         return browser.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers .alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The cm:effectivity aspect should not be addable");
            });
      },

      "Test that only removable aspects have the remove icon displayed": function() {
         // cm:versionable should be pre-selected but not removable because it is not in the removable list
         // It should bee the 2nd row in the available list
         // It's PublishAction should not have been rendered
         return browser.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .picked-items .alfresco-lists-views-AlfListView tr:nth-child(2) .alfresco-renderers-PublishAction > img")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The cm:versionable aspect should not be removable");
            });
      },

      "Test adding an aspect": function() {
         return browser.findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers .alfresco-lists-views-AlfListView tr:nth-child(2) .alfresco-renderers-PublishAction > img")
            .click()
         .end()
         .findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .picked-items .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Aspect wasn't added");
            });
      },

      "Test removing an aspect": function() {
         // Clicking on the cm:classifiable item should allow it to be removed and display it in the available list
         return browser.findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .picked-items .alfresco-lists-views-AlfListView tr:nth-child(1) .alfresco-renderers-PublishAction > img")
            .click()
         .end()
         .findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers  .alfresco-lists-views-AlfListView tr:nth-child(1)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Aspect wasn't removed");
            });
      },

      "Test saving upated aspects": function() {
         // Clicking on the confirmation button in the dialog should post the correct added and remove payload...
         return browser.findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(".mx-row:nth-child(2) .mx-payload")
            .getVisibleText()
            .then(function(payload) {
               assert.equal(payload, "{\"added\":[\"cm:complianceable\"],\"removed\":[\"cm:generalclassifiable\"]}", "The added/removed payload wasn't generated correctly");
            });
      },

      "Test aspects dialog opens (when current aspects are provided)": function() {
         return browser.sleep(500).findByCssSelector("#MANAGE_ASPECTS2_label")
            .click()
         .end()
         .findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG.alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "The manage aspects dialog did not appear");
            });
      },

      "Test pre-configured aspects count": function()  {
         return browser.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .picked-items .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Incorrect number of selected aspects");
            });
      },

      "Test cancelling aspects dialog ": function() {
         return browser.findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .cancellationButton > span")
            .click()
         .end()
         .sleep(500)
         .findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The dialog was not hidden");
            });
      },

      "Test managing aspects when aspects can't be retrieved": function() {
         // By using a node that the mock service doesn't cater for we can rely on a 404 producing an error...
         return browser.sleep(500).findByCssSelector("#MANAGE_ASPECTS3_label")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_PROMPT", "message", "It was not possible to retrieve the aspects applied to No Data Node"))
            .then(null, function() {
               assert(false, "The error prompt was not requested when failing to retrieve aspects");
            });
      },

      "Test failure to save aspect changes": function() {
         // By using a node that the mock service doesn't cater for we can rely on a 404 producing an error...
         return browser.sleep(500).findByCssSelector("#MANAGE_ASPECTS4_label")
            .click()
         .end()
         .findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_PROMPT", "message", "It was not possible to update the aspects applied to Save Fail Node"))
            .then(null, function() {
               assert(false, "The error prompt was not requested when failure occurred saving data");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});