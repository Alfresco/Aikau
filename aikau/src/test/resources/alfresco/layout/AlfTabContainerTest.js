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
 * This is a unit test for AlfTabContainer
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, TestCommon, keys) {

   // Get the selectors required for the tests...
   var tabContainerSelectors = TestCommon.getTestSelectors("alfresco/layout/AlfTabContainer");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");

   var selectors = {
      tc1: {
         container: TestCommon.getTestSelector(tabContainerSelectors, "container", ["TC"]),
         debugTab: TestCommon.getTestSelector(tabContainerSelectors, "identified.tab", ["TC","DEBUG_TAB"]),
         eleventhPanel: TestCommon.getTestSelector(tabContainerSelectors, "nth.panel", ["TC", "11"]),
         eleventhTab: TestCommon.getTestSelector(tabContainerSelectors, "nth.tab", ["TC", "11"]),
         firstPanel: TestCommon.getTestSelector(tabContainerSelectors, "nth.panel", ["TC", "1"]),
         firstTab: TestCommon.getTestSelector(tabContainerSelectors, "nth.tab", ["TC", "1"]),
         formControlTab1: TestCommon.getTestSelector(tabContainerSelectors, "identified.tab", ["TC","FormControl1"]),
         formControlTab2: TestCommon.getTestSelector(tabContainerSelectors, "identified.tab", ["TC","FormControl2"]),
         fourthPanel: TestCommon.getTestSelector(tabContainerSelectors, "nth.panel", ["TC", "4"]),
         fourthTab: TestCommon.getTestSelector(tabContainerSelectors, "nth.tab", ["TC", "4"]),
         hiddenPanels: TestCommon.getTestSelector(tabContainerSelectors, "hidden.panels", ["TC"]),
         panels: TestCommon.getTestSelector(tabContainerSelectors, "panels", ["TC"]),
         searchListTab: TestCommon.getTestSelector(tabContainerSelectors, "identified.tab", ["TC","SEARCH_LIST"]),
         secondPanel: TestCommon.getTestSelector(tabContainerSelectors, "nth.panel", ["TC", "2"]),
         secondTab: TestCommon.getTestSelector(tabContainerSelectors, "nth.tab", ["TC", "2"]),
         secondTabLabel: TestCommon.getTestSelector(tabContainerSelectors, "nth.tab.label", ["TC", "2"]),
         sidebarTab: TestCommon.getTestSelector(tabContainerSelectors, "identified.tab", ["TC","SIDEBAR"]),
         tabs: TestCommon.getTestSelector(tabContainerSelectors, "tabs", ["TC"]),
         thirdPanel: TestCommon.getTestSelector(tabContainerSelectors, "nth.panel", ["TC", "3"]),
         thirdTab: TestCommon.getTestSelector(tabContainerSelectors, "nth.tab", ["TC", "3"]),
         visiblePanel: TestCommon.getTestSelector(tabContainerSelectors, "visible.panel", ["TC"])
      },
      buttons: {
         create: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CREATE_TAB"]),
         createViaPub: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CREATE_TAB_WITH_PUBLICATION"]),
         deleteTabById: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DELETE_TAB_BY_ID"]),
         deleteTabByIndex: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DELETE_TAB_BY_INDEX"]),
         deleteTabByTitle: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DELETE_TAB_BY_TITLE"]),
         disableTabById: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DISABLE_TAB_BY_ID"]),
         disableTabByIndex: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DISABLE_TAB_BY_INDEX"]),
         disableTabByTitle: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DISABLE_TAB_BY_TITLE"]),
         enableTabById: TestCommon.getTestSelector(buttonSelectors, "button.label", ["ENABLE_TAB_BY_ID"]),
         enableTabByIndex: TestCommon.getTestSelector(buttonSelectors, "button.label", ["ENABLE_TAB_BY_INDEX"]),
         enableTabByTitle: TestCommon.getTestSelector(buttonSelectors, "button.label", ["ENABLE_TAB_BY_TITLE"]),
         reload: TestCommon.getTestSelector(buttonSelectors, "button.label", ["RELOAD_BUTTON"]),
         selectTab1: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SELECT_TAB_1"]),
         selectTab2: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SELECT_TAB_2"]),
         selectTab3: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SELECT_TAB_3"]),
         selectTab4: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SELECT_TAB_4"]),
         selectTab5: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SELECT_TAB_5"]),
         selectTab6: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SELECT_TAB_6"])
      }
   };

   registerSuite(function(){
      var browser;

      return {
         name: "Tab Container Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainer", "Tab Container Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check the tab container is present": function () {
            return browser.findByCssSelector(selectors.tc1.container)
               .then(function () {}, function () {
                  assert(false, "Tab container not rendered");
               });
         },

         "Check the correct number of tabs is present": function() {
            return browser.findAllByCssSelector(selectors.tc1.tabs)
               .then(function (tabs) {
                  assert.lengthOf(tabs, 11);
               });
         },

         "Check the correct number of panels is present": function() {
            return browser.findAllByCssSelector(selectors.tc1.panels)
               .then(function (panels) {
                  assert.lengthOf(panels, 11);
               });
         },

         "Visible panel not rendered": function() {
            return browser.findByCssSelector(selectors.tc1.visiblePanel)
               .then(function () {}, function () {
                  assert(false, "Visible panel not rendered");
               });
         },

         "Check the correct number of hidden panels is present": function() {
            return browser.findAllByCssSelector(selectors.tc1.hiddenPanels)
               .then(function (panels) {
                  assert.lengthOf(panels, 10);
               });
         },

         "Checking 3rd panel is visible": function() {
            return browser.findByCssSelector(selectors.tc1.thirdPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 3rd panel should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 3rd panel should not be hidden");
               });
         },

         "Checking 11th panel is hidden": function() {
            return browser.findByCssSelector(selectors.tc1.eleventhPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 11th panel should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 11th panel should not be visible");
               });
         },

         "Select 11th tab, check 3rd panel is hidden": function() {
            return browser.findByCssSelector(selectors.tc1.eleventhTab)
               .click()
            .end()

            // Test current panel states
            .findByCssSelector(selectors.tc1.thirdPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.notInclude(currClasses, "dijitVisible", "The 3rd panel should not be visible");
                  assert.include(currClasses, "dijitHidden", "The 3rd panel should be hidden");
               });
         },

         "Checking 11th panel is visible": function() {
            return browser.findByCssSelector(selectors.tc1.eleventhPanel)
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     assert.notInclude(currClasses, "dijitHidden", "The 11th panel should not be hidden");
                     assert.include(currClasses, "dijitVisible", "The 11th panel should be visible");
                  });
         },

         "Select 3rd tab, check 3rd panel becomes visible": function() {
            return browser.findByCssSelector(selectors.tc1.thirdTab)
               .click()
            .end()

            .findByCssSelector(selectors.tc1.thirdPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 3rd panel should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 3rd panel should not be hidden");
               });
         },

         "Checking last panel is hidden (2)": function() {
            return browser.findByCssSelector(selectors.tc1.eleventhPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The last panel should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The last panel should not be visible");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });


   // This test reloads the page to clear any previous focus and make keyboard actions more predictable
   registerSuite(function(){
      var browser;

      return {
         name: "Tab Container Tests (keyboard)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainer", "Tab Container Tests (keyboard)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Checking 3rd panel is visible": function () {
            return browser.findByCssSelector(selectors.tc1.thirdPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 3rd panel should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 3rd panel should not be hidden");
               });
         },

         "Checking 4th is hidden": function() {
            return browser.findByCssSelector(selectors.tc1.fourthPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 4th panel should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 4th panel should not be visible");
               });
         },

         "Checking 3rd panel is hidden": function() {
            return browser.pressKeys(keys.TAB)
               .pressKeys(keys.ARROW_RIGHT)

               .findByCssSelector(selectors.tc1.thirdPanel)
                  .getAttribute("class")
                  .then(function(currClasses) {
                     assert.notInclude(currClasses, "dijitVisible", "The 3rd panel should not be visible");
                     assert.include(currClasses, "dijitHidden", "The 3rd panel should be hidden");
                  });
         },

         "Checking 4th panel is visible": function() {
            return browser.findByCssSelector(selectors.tc1.fourthPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.notInclude(currClasses, "dijitHidden", "The 4th panel should not be hidden");
                  assert.include(currClasses, "dijitVisible", "The 4th panel should be visible");
               });
         },

         "Checking 3rd panel is visible (2)": function() {
            return browser.pressKeys(keys.ARROW_LEFT)

            .findByCssSelector(selectors.tc1.thirdPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 3rd panel should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 3rd panel should not be hidden");
               });
         },

         "Checking 4th panel is hidden": function() {
            return browser.findByCssSelector(selectors.tc1.fourthPanel)
               .getAttribute("class")
               .then(function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 4th panel should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 4th panel should not be visible");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });


   // // This test reloads the page to clear any previous focus and make keyboard actions more predictable
   registerSuite(function(){
      var browser;

      return {
         name: "Tab Container Tests (function)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainer", "Tab Container Tests (function)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Checking 3rd panel is visible": function () {
            return browser.findById("Logo3")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The 3rd panel should have been initially visible on page load");
               });
         },

         "Checking 1st panel is visible after external selection by index": function() {
            return browser.findByCssSelector(selectors.buttons.selectTab1)
               .click()
            .end()

            .findById("Logo1")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The 1st panel should have been visible after selection via publication");
               });
         },

         "Checking 3rd panel is hidden after external selection by index": function() {
            return browser.findById("Logo3")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The 3rd panel should have been hidden");
               });
         },

         "Checking 2nd panel is visible after external selection by index": function() {
            return browser.findByCssSelector(selectors.buttons.selectTab2)
               .click()
            .end()

            .findById("Logo2")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The 2nd panel should have been displayed");
               });
         },

         "Checking 1st panel is hidden after external selection by index": function() {
            return browser.findById("Logo1")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The 1st panel should have been hidden");
               });
         },

         "Checking 1st panel is visible after external selection by title": function() {
            return browser.findByCssSelector(selectors.buttons.selectTab3)
               .click()
            .end()

            .findById("Logo1")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The 1st panel should be visible");
               });
         },

         "Checking 2nd panel is hidden after external selection by title": function() {
            return browser.findById("Logo2")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The 2nd panel should have been hidden");
               });
         },

         "Checking 2nd panel is visible after external selection by title": function() {
            return browser.findByCssSelector(selectors.buttons.selectTab4)
               .click()
            .end()

            .findById("Logo2")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The 2nd panel should have been displayed");
               });
         },

         "Checking 1st panel is hidden after external selection by title": function() {
            return browser.findById("Logo1")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The 1st panel should have been hidden");
               });
         },

         "Checking 1st panel is visible after external selection by id": function() {
            return browser.findByCssSelector(selectors.buttons.selectTab5)
               .click()
            .end()

            .findById("Logo1")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The 1st panel should have been displayed");
               });
         },

         "Checking 2nd panel is hidden after external selection by id": function() {
            return browser.findById("Logo2")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The 2nd panel should have been hidden");
               });
         },

         "Checking 2nd panel is visible after external selection by id": function() {
            return browser.findByCssSelector(selectors.buttons.selectTab6)
               .click()
            .end()

            .findById("Logo2")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The 2nd panel should have been displayed");
               });
         },

         "Checking 1st panel is hidden after external selection by id": function() {
            return browser.findById("Logo1")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The 1st panel should have been hidden");
               });
         },

         "Checking 1st tab is disabled after external selection by index": function() {
            return browser.findByCssSelector(selectors.buttons.disableTabByIndex)
               .click()
            .end()

            .findByCssSelector(selectors.tc1.firstTab)
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     assert.include(currClasses, "dijitDisabled", "The 1st panel should be disabled");
                  });
         },

         "Checking 1st tab is enabled after external selection by index": function() {
            return browser.findByCssSelector(selectors.buttons.enableTabByIndex)
               .click()
            .end()

            .findByCssSelector(selectors.tc1.firstTab)
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     assert.notInclude(currClasses, "dijitDisabled", "The 1st panel should not be disabled");
                  });
         },

         "Checking 1st tab is disabled after external selection by title": function() {
            return browser.findByCssSelector(selectors.buttons.disableTabByTitle)
               .click()
            .end()

            .findByCssSelector(selectors.tc1.firstTab)
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     assert.include(currClasses, "dijitDisabled", "The 1st panel should be disabled");
                  });
         },

         "Checking 1st tab is enabled after external selection by title": function() {
            return browser.findByCssSelector(selectors.buttons.enableTabByTitle)
               .click()
            .end()

            .findByCssSelector(selectors.tc1.firstTab)
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     assert.notInclude(currClasses, "dijitDisabled", "The 1st panel should not be disabled");
                  });
         },

         "Checking 1st tab is disabled after external selection by id": function() {
            return browser.findByCssSelector(selectors.buttons.disableTabById)
               .click()
            .end()

            .findByCssSelector(selectors.tc1.firstTab)
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     assert.include(currClasses, "dijitDisabled", "The 1st panel should be disabled");
                  });
         },

         "Checking 1st tab is enabled after external selection by id": function() {
            return browser.findByCssSelector(selectors.buttons.enableTabById)
               .click()
            .end()

            .findByCssSelector(selectors.tc1.firstTab)
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     assert.notInclude(currClasses, "dijitDisabled", "The 1st panel should not be disabled");
                  });
         },

         "Check the correct number of tabs is present": function() {
            return browser.findAllByCssSelector(selectors.tc1.tabs)
               .then(
                  function (tabs) {
                     assert.lengthOf(tabs, 11, "There are not 11 tabs");
                  }
               );
         },

         "Check the correct number of tabs is present after deleting tab 7": function() {
            return browser.findByCssSelector(selectors.buttons.deleteTabByIndex)
               .click()
            .end()

            .findAllByCssSelector(selectors.tc1.tabs)
               .then(
                  function (tabs) {
                     expect(tabs.length).to.equal(10, "There are not 10 tabs");
                  }
               );
         },

         "Check the correct number of tabs is present after deleting tab titled 'Logo 8'": function() {
            return browser.findByCssSelector(selectors.buttons.deleteTabByTitle)
               .click()
            .end()

            .findAllByCssSelector(selectors.tc1.tabs)
               .then(
                  function (tabs) {
                     expect(tabs.length).to.equal(9, "There are not 9 tabs");
                  }
               );
         },

         "Check the correct number of tabs is present after deleting tab with id 'dijit_layout_ContentPane_8": function() {
            return browser.findByCssSelector(selectors.buttons.deleteTabById)
               .click()
            .end()

            .findAllByCssSelector(selectors.tc1.tabs)
               .then(
                  function (tabs) {
                     expect(tabs.length).to.equal(8, "There are not 8 tabs");
                  }
               );
         },

         "Check that delayed processing form control is displayed correctly": function() {
            return browser.findByCssSelector(selectors.tc1.formControlTab1)
               .click()
            .end()

            .findByCssSelector("#FormControl1 .label")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Select...", "The form control was not displayed correctly");
               });
         },

          "Check that non-delayed processing form control is displayed correctly": function() {
            return browser.findByCssSelector(selectors.tc1.formControlTab2)
               .click()
            .end()
            .findByCssSelector("#FormControl2 .label")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Select...", "The form control was not displayed correctly");
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
         name: "Tab Container Tests (example use case)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainerUseCase", "Tab Container Tests (example use case)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check the correct number of tabs is present": function() {
            return browser.findAllByCssSelector(selectors.tc1.tabs)
               .then(function (tabs) {
                  assert.lengthOf(tabs, 1, "Only one tab should be initially shown");
               });
         },

         "Add a new panel to display first item": function () {
            return browser.findByCssSelector(".alfresco-lists-views-AlfListView tr:first-child .alfresco-renderers-Property .value")
               .click()
            .end()
            .findAllByCssSelector(selectors.tc1.tabs)
               .then(function (tabs) {
                  assert.lengthOf(tabs, 2, "A second tab should have been added");
               });
         },

         "Checking new panel is selected": function() {
            return browser.findByCssSelector(selectors.tc1.secondPanel)
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The new tab should have been selected");
               });
         },

         "Check that the new panel has rendered content correctly": function() {
            return browser.findByCssSelector(selectors.tc1.secondPanel + " .alfresco-html-Label")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "One", "The new tab content was rendered correctly");
               });
         },

         "Check that the form control in the new panel has rendered correctly": function() {
            return browser.findByCssSelector("#SELECT_FOR_One .label")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Select...", "The form control was not displayed correctly");
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
         name: "Tab Container Tests (example use case 2)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainerUseCase2", "Tab Container Tests (example use case 2)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Select second tab and check search is not in progress": function() {
            return browser.findByCssSelector(selectors.tc1.secondTabLabel)
               .click()
            .end()

            .findById("SEARCH_LIST")
            .end()

            .getAllPublishes("ALF_SEARCH_REQUEST")
               .then(function(payloads){
                  assert.lengthOf(payloads, 0, "Search request should not have been made");
               });
         },

         "Click a button to trigger a reload and check reload request occurs": function() {
            return browser.findByCssSelector(selectors.buttons.reload)
               .click()
            .end()
            .getLastPublish("ALF_SEARCH_REQUEST", "Search request did not occur");
         },

         "Create a new tab": function() {
            return browser.findByCssSelector(selectors.buttons.create)
               .click()
            .end()

            .waitForDeletedByCssSelector("#ADDED_LIST .rendered-view.share-hidden")
            .end()

            .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED")
            
            .findById("ADDED_LIST_VIEW")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The list was not displayed");
               });
         },

         "Attempt to create the same tab": function() {
            // Switch back to the 2nd tab...
            return browser.findByCssSelector(selectors.tc1.searchListTab)
               .click()
            .end()

            // Click to create the tab again...
            .findById("CREATE_TAB_label")
               .click()
            .end()

            .findAllByCssSelector(selectors.tc1.tabs)
               .then(function (tabs) {
                  assert.lengthOf(tabs, 3, "Wrong number of tabs!");
               })
            .end()

            .findById("ADDED_FIXED_HEADER_FOOTER")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The existing tab was not re-selected");
               });
         },

         "Create a tab with a follow-on publication": function() {
            // Switch back to the 2nd tab...
            return browser.findByCssSelector(selectors.tc1.searchListTab)
               .click()
            .end()

            // Click the button to create a tab with a publication on addition...
            .findDisplayedByCssSelector(selectors.buttons.createViaPub)
               .click()
            .end()

            // Find the new tab...
            .findDisplayedById("ADDED_LIST_2")
            .end()
            
            // Switch back to the debug log...
            .findByCssSelector(selectors.tc1.debugTab)
               .click()
            .end()

            // ...and check that it is loading request is published (this will be a result of the reload publication)...
            .getLastPublish("LIST_2_SCOPE_ALF_DOCLIST_RELOAD_DATA", "Follow publication not made");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Tab Container Tests (height calculations)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/MixedLayoutHeights", "Tab Container Tests (height calculations)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         // See AKU-489 - we want to check that a sidebar inside a tab is not bigger than the window. In fact
         // it's height should be the body height, minus the offset (approx 36px) and the configured footer (10px)
         "Check inner sidebar height": function() {
            var height;
            return browser.findByCssSelector(selectors.tc1.sidebarTab)
               .click()
            .end()

            .findByCssSelector("body")
               .getSize()
               .then(function(size) {
                  height = size.height;
               })
            .end()

            .findById("SIDEBAR")
               .getSize()
                  .then(function(size) {
                     var target = height - 46;
                     assert.closeTo(size.height, target, 5, "Sidebar height incorrect");
                  });
         },

         // See AKU-506 - make sure that widgets waiting for page readiness (in this case a list) get informed that
         // they can do their stuff (in this case, load data)
         "Check that list data is loaded": function() {
            return browser.findByCssSelector(selectors.tc1.debugTab)
               .click()
            .end()
            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS", "List data was not requested on tab load");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});
