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
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "TabbedControls Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/TabsInForms", "TabbedControls Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that values are set": function() {
         // This checks that values assigned to the form are passed onto the form controls
         return browser.findByCssSelector("#TB1 .dijitInputContainer input")
            .getProperty("value")
            .then(function(text) {
               assert.equal(text, "data", "The initial value was not set correctly for the field on Tab 1");
            })
         .end()
         .findByCssSelector("#TB2 .dijitInputContainer input")
            .getProperty("value")
            .then(function(text) {
               assert.equal(text, "fail", "The initial value was not set correctly for the field on Tab 2");
            });
      },

      "Check that form is initially disabled": function() {
         // The form should be initially disabled because the value of the text box on tab 2 does not
         // meet minimum length requirements
         return browser.findAllByCssSelector(".alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The form confirmation button was not initially disabled");
            });
      },

      "Check that resolving control validation enables form submission": function() {
         // Check that updating the value of the text box on tab 2 to meet the minimum length requirements
         // will enable the confirmation button on the form
         return browser.findByCssSelector(".dijitTab:nth-child(2) .tabLabel")
            .click()
         .end()
         .findByCssSelector("#TB2 .dijitInputContainer input")
            .clearValue()
            .type("LongEnough")
         .end()
         .findAllByCssSelector(".alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The form confirmation button was not enabled");
            });
      },

      "Check form post value": function() {
         // Check that posting the form submits all of the correct values
         return browser.findByCssSelector(".alfresco-buttons-AlfButton.confirmationButton > span")
            .click()
         .end()
         .getLastPublish("FORM1_SAVE_FORM")
            .then(function(payload) {
               assert.propertyVal(payload, "tb1", "data", "Published form data incorrect (tb1)"); 
               assert.propertyVal(payload, "tb2", "LongEnough", "Published form data incorrect (tb2)");
               assert.propertyVal(payload, "tb3", "", "Published form data incorrect (tb3)");
            });
      },

      "Check requirement rule disables form": function() {
         // Setting the text box on tab 1 to be "break" should make the text box on tab 3 required and as 
         // it has no data this should result in the confirmation button on the form being disabled
         return browser.findByCssSelector(".dijitTab:nth-child(1) .tabLabel")
            .click()
         .end()
         .findByCssSelector("#TB1 .dijitInputContainer input")
            .clearValue()
            .type("break")
         .end()
         .findAllByCssSelector(".alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The form confirmation button was not disabled");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});