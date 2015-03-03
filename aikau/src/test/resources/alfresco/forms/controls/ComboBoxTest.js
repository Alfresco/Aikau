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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

   var browser;
   registerSuite({
      name: "ComboBox Tests (mouse)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ComboBox", "ComboBox Tests (mouse)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Checking the number of tag options...": function () {
         return browser.findByCssSelector("#TAGS .dijitArrowButtonInner")
            .click()
         .end()

         .findAllByCssSelector("#TAGS_CONTROL_popup .dijitMenuItem[item]")
            .then(function(elements) {
               assert(elements.length === 4, "Test 1a - Four tag options were expected, found: " + elements.length);
            });
      },

      "Checking the number of properties options": function() {
         return browser.findByCssSelector("#TAGS label.label")
            .click()
         .end()

         // Open the properties combo and count the available options...
         .findByCssSelector("#PROPERTIES .dijitArrowButtonInner")
            .click()
         .end()

         .findAllByCssSelector("#PROPERTIES_CONTROL_popup .dijitMenuItem[item]")
            .then(function(elements) {
               assert(elements.length === 5, "Test 1b - Five property options were expected, found: " + elements.length);
            });
      },

      "Checking tag options are reduced": function() {
         return browser.findByCssSelector("#TAGS_CONTROL")
            .click()
            .type("t")
            .sleep(1000)
         .end()

         .findAllByCssSelector("#TAGS_CONTROL_popup .dijitMenuItem[item]")
            .then(function(elements) {
               assert(elements.length === 3, "Three tag options were expected, found: " + elements.length);
            });
      },

      "Checking tag options are further reduced": function() {
         return browser.findByCssSelector("#TAGS_CONTROL")
            .click()
            .type("ag1")
            .sleep(1000)
         .end()

         .findAllByCssSelector("#TAGS_CONTROL_popup .dijitMenuItem[item]")
            .then(function(elements) {
               assert(elements.length === 2, "Two tag options were expected, found: " + elements.length);
            });
      },

      "Check that tag value gets auto-completed and posted": function() {
         return browser.findByCssSelector("#TAGS_CONTROL")
            .click()
            .pressKeys(keys.RETURN)
         .end()

         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.pubDataCssSelector("POST_FORM", "tag", "tag1"))
            .then(function(elements) {
               assert(elements.length === 1, "The tag value was not auto-completed and posted");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "ComboBox Tests (keyboard)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ComboBox", "ComboBox Tests (keyboard)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Down arrow test": function () {
         // Slightly convoluted way to leave a result stem in the #TAGS_CONTROL
         return browser.pressKeys(keys.TAB)
            .pressKeys("ta")
            .sleep(500)
            .pressKeys(keys.TAB)
            .sleep(500)
            .pressKeys([keys.SHIFT, keys.TAB])
            .pressKeys(keys.ARROW_DOWN)
            .sleep(500)
         .end()

         // Release SHIFT and TAB before assertion...
         .pressKeys([keys.SHIFT, keys.TAB])

         // Test that clicking the down arrow gives results based on the stem left above
         .findAllByCssSelector("#TAGS_CONTROL_popup .dijitMenuItem[item]")
            .then(function(elements) {
               assert(elements.length === 3, "Three tag options were expected, found: " + elements.length);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});