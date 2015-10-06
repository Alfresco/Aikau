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
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Widget Creation Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/WidgetCreation", "Widget Creation Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Count the number of Logo widgets": function () {
            // This isn't the optimal way of testing this - ideally we want to get each widget and then
            // check the IDs - however, it's not easily understood how to do this with mulitple selection and 
            // chaining of promises - this test should be sufficient but it would be nice to update at some
            // point in the future!

            return browser.findAllByCssSelector(".alfresco-logo-Logo")
               .then(function (els) {
                  assert.lengthOf(els, 3, "An unexpected number of logo widgets found");
               });
         },

         "Check for the Logo with the specific ID": function() {
            return browser.findAllByCssSelector("#SPECIFIC_DOM_ID")
               .then(function (els) {
                  assert.lengthOf(els, 1, "Couldn't find Logo with specific DOM id");
               });
         },

         "Check for the Logo with the overridden ID": function() {
            return browser.findAllByCssSelector("#SPECIFIC_DOM_ID")
               .then(function (els) {
                  assert.lengthOf(els, 1, "Couldn't find Logo with overridden DOM id");
               });
         },

         "Open dialog for first item": function() {
            // Open the dialog for the first item in the list...
            return browser.findByCssSelector("#PROPERTY_LINK_ITEM_0 .value")
               .click()
            .end()

            // Wait for the dialog to open...
            .findByCssSelector("#one_DIALOG.dialogDisplayed")
            .end()

            // Close it...
            .findById("one_DIALOG_OK_label")
               .click()
            .end()

            // Wait for it to close...
            .findByCssSelector("#one_DIALOG.dialogHidden")
            .end()

            // Open the dialog for the second item in the list...
            .findByCssSelector("#PROPERTY_LINK_ITEM_1 .value")
               .click()
            .end()

            // Wait for the dialog to open...
            .findByCssSelector("#two_DIALOG.dialogDisplayed")
            .end()

            .findByCssSelector("#two_DIALOG .alfresco-forms-controls-BaseFormControl")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The text box in the second dialog should have been displayed");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});