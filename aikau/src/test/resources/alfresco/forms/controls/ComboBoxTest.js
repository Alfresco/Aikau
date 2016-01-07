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
 * Test the ComboBox control
 *
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["alfresco/TestCommon",
        "intern!object",
        "intern/chai!assert",
        "intern/dojo/node!leadfoot/keys"],
        function(TestCommon, registerSuite, assert, keys) {

   registerSuite(function(){
      var browser;

      return {
         name: "ComboBox Tests (mouse)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ComboBox", "ComboBox Tests (mouse)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check place holder text": function() {
            return browser.findDisplayedByCssSelector("#TAGS .dijitPlaceHolder")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Add or select tag", "Place holder text not correct");
               });
         },

         "Check that mouse selection of option updates value": function() {
            return browser.findByCssSelector("#PROPERTIES label.label")
               .click()
            .end()

            .findByCssSelector("#PROPERTIES .dijitArrowButtonInner")
               .click()
            .end()
            .findByCssSelector("#PROPERTIES_CONTROL_popup0")
               .click()
            .end()

            .findByCssSelector(".confirmationButton > span")
               .click()
               .end()

            .getLastPublish("POST_FORM")
               .then(function(payload) {
                  assert.propertyVal(payload, "property", "act:actionExecutionTitle", "Property value not set from mouse selection");
               });
         },

         "Checking the number of tag options...": function() {
            return browser.findByCssSelector("#TAGS .dijitArrowButtonInner")
               .click()
               .end()

            .findAllByCssSelector("#TAGS_CONTROL_popup .dijitMenuItem[item]")
               .then(function(elements) {
                  assert.lengthOf(elements, 4, "Didn't display full list of tags");
               });
         },

         "Checking the number of properties options": function() {
            return browser.findByCssSelector("#TAGS label.label")
               .click()
               .end()

            .findByCssSelector("#PROPERTIES .dijitArrowButtonInner")
               .click()
               .end()

            .findAllByCssSelector("#PROPERTIES_CONTROL_popup .dijitMenuItem[item]")
               .then(function(elements) {
                  assert.lengthOf(elements, 5, "Didn't display full list of properties");
               });
         },

         "Checking tag options are reduced": function() {
            return browser.findByCssSelector("#TAGS_CONTROL")
               .clearLog()
               .type("t")
               .end()

            .getLastPublish("_SUCCESS")

            .findAllByCssSelector("#TAGS_CONTROL_popup .dijitMenuItem[item]")
               .then(function(elements) {
                  assert.lengthOf(elements, 4, "Did not expect 't' to reduce elements list");
               });
         },

         "Checking tag options are further reduced": function() {
            return browser.findByCssSelector("#TAGS_CONTROL")
               .clearLog()
               .type("ag1")
               .end()

            .getLastPublish("_SUCCESS")

            .findAllByCssSelector("#TAGS_CONTROL_popup .dijitMenuItem[item]")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "List was not filtered correctly for search 'tag1'");
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

            .getLastPublish("POST_FORM")
               .then(function(payload) {
                  assert.propertyVal(payload, "tag", "tag1", "Tag value was not auto-completed and posted");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "ComboBox Tests (keyboard)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ComboBox", "ComboBox Tests (keyboard)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Down arrow test": function() {
            // Slightly convoluted way to leave a result stem in the #TAGS_CONTROL
            return browser.pressKeys(keys.TAB)
               .pressKeys("g1")
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
                  assert.lengthOf(elements, 2, "Wrong number of results for search string 'g1'");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});