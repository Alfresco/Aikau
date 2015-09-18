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
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(registerSuite, assert, require, TestCommon) {
registerSuite(function(){
   var browser;

   return {
      name: "Simple Picker Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SimplePicker", "Simple Picker Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end().alfPostCoverageResults(browser);
      // },

      "Test that PICKER1 has no items selected on load": function() {
         return browser.findAllByCssSelector("#PICKER1 .picked-items table > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Items were unexpectedly pre-selected in PICKER1");
            });
      },

      "Test that PICKER2 has one item selected on load": function() {
         return browser.findAllByCssSelector("#PICKER2 .picked-items table > *")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Items were unexpectedly pre-selected in PICKER2");
            });
      },

      "Test that PICKER1 has 3 options available for selection on load": function() {
         return browser.findAllByCssSelector("#PICKER1 .sub-pickers .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Not the correct number of available items for selection in PICKER1");
            });
      },

      "Test that PICKER2 has 2 options available for selection on load": function() {
         return browser.findAllByCssSelector("#PICKER2 .sub-pickers .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Not the correct number of available items for selection in PICKER2");
            });
      },

      "Test that PICKER2 posted value contains pre-selected item": function() {
         return browser.findByCssSelector("#FORM .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM_POST","picker2","name","One"))
            .then(null, function() {
               assert(false, "Pre-selected item was not reflected in initial form value post");
            });
      },

      "Test that an item can be selected": function() {
         // Pick the 3rd item ("Three") in the first picker...
         return browser.findByCssSelector("#PICKER1 .alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .click()
         .end()
         .findAllByCssSelector("#PICKER1 .picked-items table > *")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "An item was not picked");
            });
      },

      "Test that the picked item is reflected in the posted form value": function() {
         return browser.findByCssSelector("#FORM .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM_POST","picker1","name","Three"))
            .then(null, function() {
               assert(false, "Picked item from PICKER1 is not reflected in form value post");
            });
      },

      "Test that the picked item is not available to be picked again": function() {
         return browser.findByCssSelector("#PICKER1 .alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .isDisplayed()
            .then(function(visible) {
               assert.isFalse(visible, "The picked item in PICKER1 is still visible to be picked again");
            });
      },

      "Test that removing a previously picked item removes it from the picked list": function() {
         return browser.findByCssSelector("#PICKER1 .picked-items tr .alfresco-renderers-PublishAction > img")
            .click()
         .end()
         .findAllByCssSelector("#PICKER1 .picked-items table > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Previously picked item was not removed");
            });
      },

      "Test that removed item is available for re-selection": function() {
         return browser.findByCssSelector("#PICKER1 .alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .isDisplayed()
            .then(function(visible) {
               assert.isTrue(visible, "The removed item from PICKER1 is not available for selection");
            });
      },
      
      "Test form value post after removing previously picked item": function() {
         return browser.findByCssSelector("#FORM .confirmationButton > span")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM_POST","picker1","name","Three"))
            .then(function(elements) {
               // NOTE: We should still find the previous post in the SubscriptionLog which is why we're checking for one...
               assert.lengthOf(elements, 1, "Removed item from PICKER1 is not reflected in form value post");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});