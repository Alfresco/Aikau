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
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   // Get the options labels using:
   //    #FIXED_INVALID_CHANGES_TO_CONTROL_dropdown .dijitMenuItemLabel

   // Get the drop-down arrow to option the menu using:
   //    #FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner

   // Get the current label using the following:
   //    #FIXED_INVALID_CHANGES_TO span[role=option]

   // Get specific menu option:
   //    #FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel

   registerSuite({
      name: "Select Menu Test",
      "Test Label Rendering": function () {
         return TestCommon.loadTestWebScript(this.remote, "/Select", "Select Form Control Tests").findByCssSelector("#FIXED_INVALID_CHANGES_TO .label")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Fixed 1", "The label was not rendered correctly: " + resultText);
            })
         .end();
      },
      "Test initial value of fixed config": function() {
         return this.remote.findByCssSelector("#FIXED_INVALID_CHANGES_TO span[role=option]")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Two", "The initial value was not represented correctly: " + resultText);
            })
         .end();
      },
      "Test fixed options count": function() {
         return this.remote.findByCssSelector("#FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner")
            .click()
         .end()
         .findAllByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown .dijitMenuItemLabel")
            .then(function(elements) {
               assert(elements.length === 3, "Three fixed options were expected, found: " + elements.length);
            })
         .end();
      },
      "Test fixed option label rendering": function() {
         return this.remote.findByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "One", "Fixed label not set correctly: " + resultText);
            })
         .end();
      },
      "Test fixed option label set from value": function() {
         return this.remote.findByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(3) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "NO LABEL", "Fixed label not set correctly from value: " + resultText);
            })
         .end();
      },
      "Test pub/sub options generated": function() {
         return this.remote.findByCssSelector("#FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
         .end()
         .findAllByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown .dijitMenuItemLabel")
            .then(function(elements) {
               assert(elements.length === 2, "Two options were expected, found: " + elements.length);
            })
         .end();
      },
      "Test updated label set by pub/sub": function() {
         return this.remote.findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Update1_1", "Updated label not set correctly by pub/sub: " + resultText);
            })
         .end();
      },
      "Test pub/sub options generated from field change": function() {
         // Check that pub/sub options generated from field changes are correct (should be on 3rd request based on values being set)...
         return this.remote.findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#HAS_CHANGES_TO .dijitArrowButtonInner")
            .click()
         .end()
         .findAllByCssSelector("#HAS_CHANGES_TO_CONTROL_dropdown .dijitMenuItemLabel")
            .then(function(elements) {
               assert(elements.length === 2, "Two options were expected, found: " + elements.length);
            })
         .end();
      },
      "Test options provided once": function() {
         // The options should have been provided once (the mock service increments the options)...
         return this.remote.findByCssSelector("#HAS_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Update1_3", "Updated label not set correctly by pub/sub: " + resultText);
            })
         .end();
      },
      "Test update topics processed": function() {
         return this.remote.findByCssSelector("#HAS_CHANGES_TO .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#REQUEST_GLOBAL_UPDATE_label")
            .click()
         .end()
         .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Update1_2", "Updated label not set correctly by external update: " + resultText);
            })
         .end();
      },
      "Test update topic scoping": function() {
         // Clicking the 2nd button should have no effect (as it's the scoped topic published globally)...
         return this.remote.findByCssSelector("#REQUEST_SCOPED_UPDATE_GLOBALLY_label")
            .click()
         .end()
         .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Update1_2", "Updated label not unexpectedly updated: " + resultText);
            })
         .end();
      },
      "Test label updated  from external publication": function() {
         // Clicking the 3rd button should perform an update...
         return this.remote.findByCssSelector("#REQUEST_SCOPED_UPDATE_label")
            .click()
         .end()
         .findByCssSelector("#HAS_UPDATE_TOPICS .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#HAS_UPDATE_TOPICS_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Update1_3", "Updated label not set correctly by external update: " + resultText);
            })
         .end();
      },
      "Test changing field triggers update": function() {
         // Change a field to check an update is made...
         return this.remote.findByCssSelector("#FIXED_INVALID_CHANGES_TO .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#FIXED_INVALID_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .click()
         .end()
         .findByCssSelector("#HAS_CHANGES_TO .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#HAS_CHANGES_TO_CONTROL_dropdown table tr:nth-child(1) td.dijitMenuItemLabel")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Update1_4", "Updated label not set correctly by pub/sub: " + resultText);
            })
         .end();
      },
      "Test XSS attack fails": function() {
         // Change a field to check an update is made...
         var browser = this.remote;
         return this.remote.then(function(){
            var notHacked = browser.execute("!window.hackedLabel && !window.hackedValue");
            assert(notHacked, "XSS prevention failed - script executed in label or value of option");
         })
         .alfPostCoverageResults(browser);
      }
   });
});