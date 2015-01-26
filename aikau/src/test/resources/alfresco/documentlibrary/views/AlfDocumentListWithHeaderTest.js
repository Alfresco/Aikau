/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the 
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, expect, require, TestCommon, keys) {

   registerSuite({
      name: 'AlfDocumentListWithHeaderView',
      'Keyboard Tests': function () {

         var alfPause = 150;
         var browser = this.remote;
         var testname = "AlfDocumentListWithHeaderTest (keyboard)";
         return TestCommon.loadTestWebScript(this.remote, "/AlfDocumentListWithHeader", testname)
            
            .sleep(alfPause)

            // Sort on the first column header...
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .getActiveElement()
               .getVisibleText()
               .then(function(resultText) {
                  expect(resultText).to.equal("Column 1", "Test #1a - The text is incorrect");
               })
            .end()
            
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "col1"))
               .then(null, function() {
                  assert(false, "Test #1b - Could not request to sort column 1 in PubSubLog");
               })
            .end()

            // Sort on the second column header...
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.RETURN)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "col2"))
               .then(null, function() {
                  assert(false, "Test #1c - Could not request to sort column 1 in PubSubLog");
               })
            .end()

            // Check that sort request doesn't occur for third column...
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.RETURN)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "col2"))
               .then(null, function() {
                  assert(false, "Test #1d - Could not request to sort column 1 in PubSubLog");
               })
            .end()

            // // Go back to the previous header cell and sort in the opposite direction...
            .pressKeys([keys.SHIFT,keys.TAB])
            .findByCssSelector("#COLUMN2_HEADER .descendingSort.hidden")
               .then(null,null)
            .end()

            // Check it is currently sorted ascendinging...
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "direction", "ascending"))
               .then(null, function() {
                  assert(false, "Test #1e - The initial sort direction is not ascending");
               })
            .end()

            // Now change the sort direction...
            .pressKeys(keys.RETURN)
            .findByCssSelector("#COLUMN2_HEADER .ascendingSort.hidden")
               .then(null,null)
            .end()

            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "direction", "descending"))
               .then(null, function() {
                  assert(false, "Test #1f - The second sort direction is not descending");
               })
            .end()

            // Now go to the table itself...
            .pressKeys(keys.SHIFT) // Need to remove shift...
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)

            // Should now be on the first row, tab to focus on the first cell...
            .pressKeys(keys.TAB)
            .sleep(alfPause)

            .getActiveElement()
               .getVisibleText()
               .then(function(resultText) {
                  expect(resultText).to.equal("A", "Test #1g - The text is incorrect");
               })
            .end()

            // Use the cursor keys to go to the next line...
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)

            // Select the first element...
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .getActiveElement()
               .getVisibleText()
               .then(function(resultText) {
                  expect(resultText).to.equal("D", "Test #1h - The text is incorrect");
               })
            .end()

            // Use the cursor keys to wrap back to the first row...
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)

            // Select the first element...
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .getActiveElement()
               .getVisibleText()
               .then(function(resultText) {
                  expect(resultText).to.equal("A", "Test #1i - The text is incorrect");
               })
            .end()

            // Use the up cursor to wrap back to the last element...
            .pressKeys(keys.ARROW_UP)
            .sleep(alfPause)

            // Select the first element...
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .getActiveElement()
               .getVisibleText()
               .then(function(resultText) {
                  expect(resultText).to.equal("J", "Test #1j - The text is incorrect");
               })
            .end()

            // Use the up cursor to go to the third row
            .pressKeys(keys.ARROW_UP)
            .sleep(alfPause)

            // Select the first element...
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .getActiveElement()
               .getVisibleText()
               .then(function(resultText) {
                  expect(resultText).to.equal("G", "Test #1k - The text is incorrect");
               })
            .end()
            .alfPostCoverageResults(browser);
      },
      'Mouse Tests': function () {
         var browser = this.remote;
         var testname = "AlfDocumentListWithHeaderTest (mouse)";
         return TestCommon.loadTestWebScript(this.remote, "/AlfDocumentListWithHeader", testname)

            .findByCssSelector("#COLUMN1_HEADER > span")
               .then(null, function() {
                  assert(false, "Test #1a - Could not find COLUMN1_HEADER in Test #2a");
               })
            .end()
            .findByCssSelector("#COLUMN1_HEADER > span")
               .click()
            .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "col1"))
               .then(null, function() {
                  assert(false, "Test #1b - Could not request to sort column 1 via mouse");
               })
            .end()
            
            .alfPostCoverageResults(browser);
      }
   });
});