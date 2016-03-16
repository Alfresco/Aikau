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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var selectSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/Select");
   var fsSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/FilteringSelect");
   var msiSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/MultiSelectInput");

   var selectors = {
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM"])
      },
      selectControls: {
         scoped1: {
            dropDown: TestCommon.getTestSelector(selectSelectors, "option.menu", ["SELECT_1"]),
            openIcon: TestCommon.getTestSelector(selectSelectors, "open.menu.icon", ["SELECT_1"]),
            options: TestCommon.getTestSelector(selectSelectors, "options", ["SELECT_1"]),
            option3: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["SELECT_1","3"])
         },
         unscoped1: {
            dropDown: TestCommon.getTestSelector(selectSelectors, "option.menu", ["SELECT_3"]),
            openIcon: TestCommon.getTestSelector(selectSelectors, "open.menu.icon", ["SELECT_3"]),
            options: TestCommon.getTestSelector(selectSelectors, "options", ["SELECT_3"]),
            option3: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["SELECT_3","3"])
         },
         scoped2: {
            dropDown: TestCommon.getTestSelector(selectSelectors, "option.menu", ["SELECT_2"]),
            openIcon: TestCommon.getTestSelector(selectSelectors, "open.menu.icon", ["SELECT_2"]),
            options: TestCommon.getTestSelector(selectSelectors, "options", ["SELECT_2"]),
            option3: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["SELECT_2","3"])
         },
         unscoped2: {
            dropDown: TestCommon.getTestSelector(selectSelectors, "option.menu", ["SELECT_4"]),
            openIcon: TestCommon.getTestSelector(selectSelectors, "open.menu.icon", ["SELECT_4"]),
            options: TestCommon.getTestSelector(selectSelectors, "options", ["SELECT_3"]),
            option3: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["SELECT_4","3"])
         }
      },
      filteringSelects: {
         scoped1: {
            dropDown: TestCommon.getTestSelector(fsSelectors, "option.menu", ["FILTERING_SELECT_1"]),
            filter: TestCommon.getTestSelector(fsSelectors, "filter.input", ["FILTERING_SELECT_1"]),
            openIcon: TestCommon.getTestSelector(fsSelectors, "open.menu.icon", ["FILTERING_SELECT_1"]),
            options: TestCommon.getTestSelector(fsSelectors, "options", ["FILTERING_SELECT_1"]),
            option1: TestCommon.getTestSelector(fsSelectors, "nth.option.label", ["FILTERING_SELECT_1","1"])
         },
         unscoped1: {
            dropDown: TestCommon.getTestSelector(fsSelectors, "option.menu", ["FILTERING_SELECT_2"]),
            filter: TestCommon.getTestSelector(fsSelectors, "filter.input", ["FILTERING_SELECT_2"]),
            openIcon: TestCommon.getTestSelector(fsSelectors, "open.menu.icon", ["FILTERING_SELECT_2"]),
            options: TestCommon.getTestSelector(fsSelectors, "options", ["FILTERING_SELECT_2"]),
            option1: TestCommon.getTestSelector(fsSelectors, "nth.option.label", ["FILTERING_SELECT_2","1"])
         }
      },
      multiSelects: {
         scoped1: {
            loaded: TestCommon.getTestSelector(msiSelectors, "options.loaded.state", ["MULTI_SELECT_INPUT_1"]),
            result: TestCommon.getTestSelector(msiSelectors, "result", ["MULTI_SELECT_INPUT_1"]),
            secondResult: TestCommon.getTestSelector(msiSelectors, "nth.result", ["MULTI_SELECT_INPUT_1", "2"]),
            searchbox: TestCommon.getTestSelector(msiSelectors, "searchbox", ["MULTI_SELECT_INPUT_1"]),
         },
         unscoped1: {
            loaded: TestCommon.getTestSelector(msiSelectors, "options.loaded.state", ["MULTI_SELECT_INPUT_3"]),
            result: TestCommon.getTestSelector(msiSelectors, "result", ["MULTI_SELECT_INPUT_3"]),
            secondResult: TestCommon.getTestSelector(msiSelectors, "nth.result", ["MULTI_SELECT_INPUT_3", "2"]),
            searchbox: TestCommon.getTestSelector(msiSelectors, "searchbox", ["MULTI_SELECT_INPUT_3"]),
         },
         scoped2: {
            loaded: TestCommon.getTestSelector(msiSelectors, "options.loaded.state", ["MULTI_SELECT_INPUT_2"]),
            result: TestCommon.getTestSelector(msiSelectors, "result", ["MULTI_SELECT_INPUT_2"]),
            secondResult: TestCommon.getTestSelector(msiSelectors, "nth.result", ["MULTI_SELECT_INPUT_2", "2"]),
            searchbox: TestCommon.getTestSelector(msiSelectors, "searchbox", ["MULTI_SELECT_INPUT_2"]),
         },
         unscoped2: {
            loaded: TestCommon.getTestSelector(msiSelectors, "options.loaded.state", ["MULTI_SELECT_INPUT_4"]),
            result: TestCommon.getTestSelector(msiSelectors, "result", ["MULTI_SELECT_INPUT_4"]),
            secondResult: TestCommon.getTestSelector(msiSelectors, "nth.result", ["MULTI_SELECT_INPUT_4", "2"]),
            searchbox: TestCommon.getTestSelector(msiSelectors, "searchbox", ["MULTI_SELECT_INPUT_4"]),
         }
      }
   };

   registerSuite(function(){
      var browser;

      return {
         name: "Options Service Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/OptionsService", "Options Service Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Count options in scoped Select": function() {
            return browser.findByCssSelector(selectors.selectControls.scoped1.openIcon)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.selectControls.scoped1.dropDown)
            .end()

            .findAllByCssSelector(selectors.selectControls.scoped1.options)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               });
         },

         "Third option label in scoped select is correct": function() {
            return browser.findByCssSelector(selectors.selectControls.scoped1.option3)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "abeecher");
               })

               // Select 3rd option to close menu
               .click(); 
         },

         "Count options in unscoped Select": function() {
            return browser.findByCssSelector(selectors.selectControls.unscoped1.openIcon)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.selectControls.unscoped1.dropDown)
            .end()

            .findAllByCssSelector(selectors.selectControls.unscoped1.options)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               });
         },

         "Third option label in unscoped select is correct": function() {
            return browser.findByCssSelector(selectors.selectControls.unscoped1.option3)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "abeecher");
               })

               // Select 3rd option to close menu
               .click(); 
         },

         "Count options in scoped Select (UserService)": function() {
            return browser.findByCssSelector(selectors.selectControls.scoped2.openIcon)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.selectControls.scoped2.dropDown)
            .end()

            .findAllByCssSelector(selectors.selectControls.scoped2.options)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               });
         },

         "Third option label in scoped select is correct (UserService)": function() {
            return browser.findByCssSelector(selectors.selectControls.scoped2.option3)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Alice Beecher");
               })

               // Select 3rd option to close menu
               .click(); 
         },

         "Count options in unscoped Select (UserService)": function() {
            return browser.findByCssSelector(selectors.selectControls.unscoped2.openIcon)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.selectControls.unscoped2.dropDown)
            .end()

            .findAllByCssSelector(selectors.selectControls.unscoped2.options)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               });
         },

         "Third option label in unscoped select is correct (UserService)": function() {
            return browser.findByCssSelector(selectors.selectControls.unscoped2.option3)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Alice Beecher");
               })

               // Select 3rd option to close menu
               .click(); 
         },

         "Count filter scoped options": function() {
            return browser.findByCssSelector(selectors.filteringSelects.scoped1.openIcon)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.filteringSelects.scoped1.dropDown)
            .end()

            .findAllByCssSelector(selectors.selectControls.scoped1.options)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               })
            .end();
         },

         "Count filter unscoped options": function() {
            return browser.findByCssSelector(selectors.filteringSelects.unscoped1.openIcon)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.filteringSelects.unscoped1.dropDown)
            .end()

            .findAllByCssSelector(selectors.selectControls.unscoped1.options)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               })
            .end();
         },

         "Count scoped MultiSelectInput options": function() {
            return browser.findByCssSelector(selectors.multiSelects.scoped1.searchbox)
               .click()
            .end()

            .findByCssSelector(selectors.multiSelects.scoped1.loaded)
            .end()

            .findAllByCssSelector(selectors.multiSelects.scoped1.result)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               });
         },

         "Check scoped MultiSelect second option label": function() {
            return browser.findByCssSelector(selectors.multiSelects.scoped1.secondResult)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "mjackson");
               })
               .click();
         },

         "Count unscoped MultiSelectInput options": function() {
            return browser.findByCssSelector(selectors.multiSelects.unscoped1.searchbox)
               .click()
            .end()

            .findByCssSelector(selectors.multiSelects.unscoped1.loaded)
            .end()

            .findAllByCssSelector(selectors.multiSelects.unscoped1.result)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               });
         },

         "Check unscoped MultiSelect second option label": function() {
            return browser.findByCssSelector(selectors.multiSelects.unscoped1.secondResult)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "mjackson");
               })
               .click();
         },

         "Count scoped MultiSelectInput options (UserService)": function() {
            return browser.findByCssSelector(selectors.multiSelects.scoped2.searchbox)
               .click()
            .end()

            .findByCssSelector(selectors.multiSelects.scoped2.loaded)
            .end()

            .findAllByCssSelector(selectors.multiSelects.scoped2.result)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               });
         },

         "Check scoped MultiSelect second option label (UserService)": function() {
            return browser.findByCssSelector(selectors.multiSelects.scoped2.secondResult)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Mike Jackson");
               })
               .click();
         },

         "Count unscoped MultiSelectInput options (UserService)": function() {
            return browser.findByCssSelector(selectors.multiSelects.unscoped2.searchbox)
               .click()
            .end()

            .findByCssSelector(selectors.multiSelects.unscoped2.loaded)
            .end()

            .findAllByCssSelector(selectors.multiSelects.unscoped2.result)
               .then(function(options) {
                  assert.lengthOf(options, 6);
               });
         },

         "Check unscoped MultiSelect second option label (UserService)": function() {
            return browser.findByCssSelector(selectors.multiSelects.unscoped2.secondResult)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Mike Jackson");
               })
               .click();
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});