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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the 
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   var browser;
   registerSuite({
      name: "FacetFilters Tests (Mouse)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FacetFilters", "FacetFilters Tests (Mouse)").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Mouse tests": function () {
         var testname = "FacetFiltersTest - Mouse tests";
         // Check no facets are shown to begin with
         return browser.findById("FACET1")
            .getVisibleText()
            .then(function (initialValue) {
               TestCommon.log(testname,"Check no facets are shown to begin with");
               expect(initialValue).to.equal("Facet 1", "The only text shown should be 'Facet 1'");
            })
            .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function (rows) {
               TestCommon.log(testname,"Check no facet rows are shown to begin with");
               expect(rows).to.have.length(0, "There should be no visible rows in the facet display");
            })
            .end()

         // Click button 1 - 4 rows of facet data should appear
         .findById("DO_FACET_BUTTON_1")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function (rows) {
               TestCommon.log(testname,"Check facets are shown after clicking button 1");
               expect(rows).to.have.length(4, "There should be 4 rows in the facet display");
            })
            .end()

         // Check the facet values
         .findById("FACET1")
            .getVisibleText()
            .then(function (facets) {
               TestCommon.log(testname,"Check the first set of facets have appeared");
               expect(facets).to.contain("result 1", "Facets should contain 'result 1'");
               expect(facets).to.contain("result 2", "Facets should contain 'result 2'");
               expect(facets).to.contain("result 3", "Facets should contain 'result 3'");
               expect(facets).to.contain("result 4", "Facets should contain 'result 4'");
            })
            .end()

         // Click button 2 - 2 rows of facet data should appear
         .findById("DO_FACET_BUTTON_2")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function (rows) {
               TestCommon.log(testname,"Check facets are shown after clicking button 2");
               expect(rows).to.have.length(2, "There should be 2 rows in the facet display");
            })
            .end()

         // Check the facet values
         .findById("FACET1")
            .getVisibleText()
            .then(function (facets) {
               TestCommon.log(testname,"Check the second set of facets have appeared");
               expect(facets).to.contain("result 5", "Facets should contain 'result 5'");
               expect(facets).to.contain("result 6", "Facets should contain 'result 6'");
            })
            .end()

         // Click button 3 - 4 rows of facet data should appear
         .findById("DO_FACET_BUTTON_3")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function (rows) {
               TestCommon.log(testname,"Check facets are shown after clicking button 3");
               expect(rows).to.have.length(6, "There should be 6 rows in the facet display");
            })
            .end()

         // Check the facet values
         .findById("FACET1")
            .getVisibleText()
            .then(function (facets) {
               TestCommon.log(testname,"Check the third set of facets have appeared");
               expect(facets).to.contain("result 7", "Facets should contain 'result 7'");
               expect(facets).to.contain("result 8", "Facets should contain 'result 8'");
               expect(facets).to.contain("result 9", "Facets should contain 'result 9'");
               expect(facets).to.contain("result 10", "Facets should contain 'result 10'");
               expect(facets).to.contain("result 11", "Facets should contain 'result 11'");
               expect(facets).to.contain("Show More", "Facets should contain 'More choices'");
               expect(facets).to.not.contain("result 12", "Facets should not contain 'result 12'");
            })
            .end()

         // Click the more choices button
         .findByCssSelector("li.showMore")
            .click()
            .end()

         // Check the facet values
         .findById("FACET1")
            .getVisibleText()
            .then(function (facets) {
               TestCommon.log(testname,"Check the four set of facets are shown");
               expect(facets).to.contain("result 7", "Facets should contain 'result 7'");
               expect(facets).to.contain("result 8", "Facets should contain 'result 8'");
               expect(facets).to.contain("result 9", "Facets should contain 'result 9'");
               expect(facets).to.contain("result 10", "Facets should contain 'result 10'");
               expect(facets).to.contain("result 11", "Facets should contain 'result 11'");
               expect(facets).to.contain("Show Fewer", "Facets should contain 'Less choices'");
               expect(facets).to.contain("result 12", "Facets should contain 'result 12'");
            })
            .end()

         // Click the less choices button
         .findByCssSelector("li.showLess")
            .click()
            .end()

         // Check the facet values
         .findById("FACET1")
            .getVisibleText()
            .then(function (facets) {
               TestCommon.log(testname,"Check the fifth set of facets are shown");
               expect(facets).to.contain("result 7", "Facets should contain 'result 7'");
               expect(facets).to.contain("result 8", "Facets should contain 'result 8'");
               expect(facets).to.contain("result 9", "Facets should contain 'result 9'");
               expect(facets).to.contain("result 10", "Facets should contain 'result 10'");
               expect(facets).to.contain("result 11", "Facets should contain 'result 11'");
               expect(facets).to.contain("Show More", "Facets should contain 'More choices'");
               expect(facets).to.not.contain("result 12", "Facets should not contain 'result 12'");
            })
            .end()

         // Click the title - the facet menu should disappear
         .findByCssSelector("#FACET1 > div.label")
            .click()
            .end()

         .findByCssSelector("#FACET1 > ul.filters")
            .isDisplayed()
            .then(function (displayed) {
               TestCommon.log(testname,"Check facet menu is hidden when the title is clicked");
               expect(displayed).to.equal(false, "Facet menu should be hidden when the title is clicked");
            })
            .end()

         // Click the title again - the facet menu should reappear
         .findByCssSelector("#FACET1 > div.label")
            .click()
            .end()

         .findByCssSelector("#FACET1 > ul.filters")
            .isDisplayed()
            .then(function (displayed) {
               TestCommon.log(testname,"Check facet menu is shown when the title is clicked again");
               expect(displayed).to.equal(true, "Facet menu should be shown when the title is clicked again");
            })
            .end()

         // Click the first facet menu item - it should select
         .findByCssSelector("#FACET1 > ul.filters > li:first-of-type span.filterLabel")
            .click()
            .end()

         .findByCssSelector("#FACET1 > ul.filters > li:first-of-type > span.status > span")
            .isDisplayed()
            .then(function (displayed) {
               TestCommon.log(testname,"Facet menu item should select when clicked");
               expect(displayed).to.equal(true, "Facet menu item should select when clicked");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "ALF_APPLY_FACET_FILTER"))
            .then(
               function(){TestCommon.log(testname,"Clicking a facet should publish");},
               function(){assert(false, "The facet did not publish on 'ALF_APPLY_FACET_FILTER'");}
            )
           .end()

         // Click the first facet menu item again - it should de-select
         .findByCssSelector("#FACET1 > ul.filters > li:first-of-type span.filterLabel")
            .click()
            .end()

         .findByCssSelector("#FACET1 > ul.filters > li:first-of-type > span.status > span")
            .isDisplayed()
            .then(function (displayed) {
               TestCommon.log(testname,"Facet menu item should de-select when clicked again");
               expect(displayed).to.equal(false, "Facet menu item should de-select when clicked again");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "ALF_REMOVE_FACET_FILTER"))
            .then(
               function(){TestCommon.log(testname,"Clicking a facet to deselect should publish");},
               function(){assert(false, "The facet deselection did not publish on 'ALF_REMOVE_FACET_FILTER'");}
            );
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "FacetFilters Tests (Keyboard)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FacetFilters", "FacetFilters Tests (Keyboard)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Keyboard tests": function () {
         var testname = "FacetFiltersTest - Keyboard tests";
         // Check no facets are shown to begin with
         return browser.findById("FACET1")
            .getVisibleText()
            .then(function (initialValue) {
               TestCommon.log(testname,"Check no facets are shown to begin with");
               expect(initialValue).to.equal("Facet 1", "The only text shown should be 'Facet 1'");
            })
            .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function (rows) {
               TestCommon.log(testname,"Check no facet rows are shown to begin with");
               expect(rows).to.have.length(0, "There should be no visible rows in the facet display");
            })
            .end()

         // 'click' the first button
         .pressKeys(keys.TAB)
         .pressKeys(keys.RETURN)
         .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function (rows) {
               TestCommon.log(testname,"Check facets are shown after selecting button 1 with the keyboard");
               expect(rows).to.have.length(4, "There should be 4 rows in the facet display");
            })
            .end()

         // Move to the facet menu label and 'click' it
         .pressKeys(keys.TAB)
         .pressKeys(keys.TAB)
         .pressKeys(keys.TAB)
         .pressKeys(keys.RETURN)
         .end()

         .findByCssSelector("#FACET1 > ul.filters")
            .isDisplayed()
            .then(function (displayed) {
               TestCommon.log(testname,"Check facet menu is hidden when the title is clicked with the keyboard");
               expect(displayed).to.equal(false, "Facet menu should be hidden when the title is clicked using the keyboard");
            })
            .end()

         // 'Click' the menu label again to re-show the menu
         .pressKeys(keys.RETURN)
         .end()

         .findByCssSelector("#FACET1 > ul.filters")
            .isDisplayed()
            .then(function (displayed) {
               TestCommon.log(testname,"Check facet menu is displayed when the title is re-clicked with the keyboard");
               expect(displayed).to.equal(true, "Facet menu should be displayed when the title is re-clicked using the keyboard");
            })
            .end()

         // Tab onto the first facet in the menu and 'click' it - it should select
         .pressKeys(keys.TAB)
         .pressKeys(keys.RETURN)
         .end()

         .findByCssSelector("#FACET1 > ul.filters > li:first-of-type > span.status > span")
            .isDisplayed()
            .then(function (displayed) {
               TestCommon.log(testname,"Facet menu item should select when clicked with the keyboard");
               expect(displayed).to.equal(true, "Facet menu item should select when clicked using the keyboard");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "ALF_APPLY_FACET_FILTER"))
            .then(
               function(){TestCommon.log(testname,"Clicking a facet with the keyboard should publish");},
               function(){assert(false, "The facet did not publish on 'ALF_APPLY_FACET_FILTER' when clicked with the keyboard");}
            )
            .end()

         // 'Click' the first facet menu item again - it should de-select
         .pressKeys(keys.RETURN)
         .end()

         .findByCssSelector("#FACET1 > ul.filters > li:first-of-type > span.status > span")
            .isDisplayed()
            .then(function (displayed) {
               TestCommon.log(testname,"Facet menu item should de-select when clicked again using the keyboard");
               expect(displayed).to.equal(false, "Facet menu item should de-select when clicked again using the keyboard");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "ALF_REMOVE_FACET_FILTER"))
            .then(
               function(){TestCommon.log(testname,"Clicking a facet using the keyboard to deselect should publish");},
               function(){assert(false, "The facet deselection using the keyboard did not publish on 'ALF_REMOVE_FACET_FILTER'");}
            );
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "FacetFilters Tests (URL Hash Tests)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FacetFilters", "FacetFilters Tests (URL Hash Tests)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Url hash tests": function () {
         var testname = "FacetFiltersTest - Url hash tests";
         // Click button 4 - 3 rows of facet data should appear
         return browser.findById("DO_FACET_BUTTON_4")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-search-FacetFilter:not(.hidden)")
            .then(function (rows) {
               TestCommon.log(testname,"Check facets are shown after clicking button 4");
               expect(rows).to.have.length(3, "There should be 3 rows in the facet display");
            })
            .end()

         // Click facet1 - check the url hash appears as expected
         .findByCssSelector("#FACET2 > ul.filters > li:first-of-type span.filterLabel")
            .click()
            .end()

         .getCurrentUrl()
            .then(function (url) {
               TestCommon.log(testname,"Click the first item in the facet menu");
               expect(url).to.contain("FACET2QNAME", "The url hash should contain 'FACET2QNAME'")
                  .and.to.contain("facFil1", "The facet click did not write the value 'facFil1' to the url hash as expected");
            })
            .end()

         // Click facet2 - check the url hash appears as expected
         .findByCssSelector("#FACET2 > ul.filters > li:nth-of-type(2) span.filterLabel")
            .click()
            .end()

         .getCurrentUrl()
            .then(function (url) {
               TestCommon.log(testname,"Click the second item in the facet menu");
               expect(url).to.contain("FACET2QNAME", "The url hash should contain 'FACET2QNAME'")
                  .and.to.contain("facFil1", "The url hash should contain 'facFil2'")
                  .and.to.contain("facFil2", "The facet click did not add the value 'facFil2' to the url hash as expected");
            })
            .end()

         // Click facet1 - check the url hash appears as expected
         .findByCssSelector("#FACET2 > ul.filters > li:first-of-type span.filterLabel")
            .click()
            .end()

         .getCurrentUrl()
            .then(function (url) {
               TestCommon.log(testname,"Click the first item in the facet menu again");
               expect(url).to.contain("FACET2QNAME", "The url hash should contain 'FACET2QNAME'")
                  .and.to.not.contain("facFil1", "The facet click did not remove the value 'facFil1' from the url hash as expected");
            })
            .end()

         // Click facet2 - check the url hash appears as expected
         .findByCssSelector("#FACET2 > ul.filters > li:nth-of-type(2) span.filterLabel")
            .click()
            .end()

         .getCurrentUrl()
            .then(function (url) {
               TestCommon.log(testname,"Click the second item in the facet menu again");
               expect(url).to.not.contain("FACET2QNAME", "The url hash should not now contain 'FACET2QNAME'")
                  .and.to.not.contain("facFil2", "The facet click did not remove the value 'facFil2' from the url hash as expected");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});