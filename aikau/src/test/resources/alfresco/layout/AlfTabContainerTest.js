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
 * This is a unit test for AlfTabContainer
 * 
 * @author Richard Smith
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
      name: "Tab Container Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainer", "Tab Container Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check the tab container is present": function () {
         return browser.findByCssSelector("div.alfresco-layout-AlfTabContainer > div.dijitTabContainer")
            .then(function () {
               
            },
            function () {
               assert(false, "Tab container not rendered");
            });
      },

      "Check the correct number of tabs is present": function() {
         return browser.findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
            .then(
               function (tabs) {
                  expect(tabs.length).to.equal(11, "There are not 11 tabs");
               }
            );
      },

      "Check the correct number of panels is present": function() {
         return browser.findAllByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper")
            .then(
               function (panels) {
                  expect(panels.length).to.equal(11, "There are not 11 panels");
               }
            );
      },

      "Visible panel not rendered": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper.dijitVisible")
            .then(
               function () {
               },
               function () {
                  assert(false, "Visible panel not rendered");
               });
      },

      "Check the correct number of panels is present (2)": function() {
         return browser.findAllByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper.dijitHidden")
            .then(
               function (panels) {
                  expect(panels.length).to.equal(10, "There are not 10 panels");
               }
            );
      },

      "Checking 3rd panel is visible": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
               });
      },

      "Checking last panel is hidden": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:last-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The last panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The last panel should not be visible");
               });
      },

      "Checking 3rd panel is hidden": function() {
         return browser.findByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab:last-of-type")
            .click()
         .end()

         // Test current panel states
         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.not.contain("dijitVisible", "The 3rd panel should not be visible");
                  expect(currClasses).to.contain("dijitHidden", "The 3rd panel should be hidden");
               });
      },

      "Checking last panel is visible": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:last-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.not.contain("dijitHidden", "The last panel should not be hidden");
                  expect(currClasses).to.contain("dijitVisible", "The last panel should be visible");
               });
      },

      "Checking 3rd panel is visible (2)": function() {
         return browser.findByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab:nth-of-type(3)")
            .click()
         .end()

         // Test current panel states
         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
               });
      },

      "Checking last panel is hidden (2)": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:last-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The last panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The last panel should not be visible");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });


   // This test reloads the page to clear any previous focus and make keyboard actions more predictable
   registerSuite({
      name: "Tab Container Tests (keyboard)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainer", "Tab Container Tests (keyboard)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Checking 3rd panel is visible": function () {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
               });
      },

      "Checking 4th is hidden": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The 4th panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The 4th panel should not be visible");
               });
      },

      "Checking 3rd panel is hidden": function() {
         return browser.pressKeys(keys.TAB)
         .pressKeys(keys.ARROW_RIGHT)

         // Test current panel states
         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.not.contain("dijitVisible", "The 3rd panel should not be visible");
                  expect(currClasses).to.contain("dijitHidden", "The 3rd panel should be hidden");
               });
      },

      "Checking 4th panel is visible": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.not.contain("dijitHidden", "The 4th panel should not be hidden");
                  expect(currClasses).to.contain("dijitVisible", "The 4th panel should be visible");
               });
      },

      "Checking 3rd panel is visible (2)": function() {
         return browser.pressKeys(keys.ARROW_LEFT)

         // Test current panel states
         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
               });
      },

      "Checking 4th panel is hidden": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The 4th panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The 4th panel should not be visible");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });


   // This test reloads the page to clear any previous focus and make keyboard actions more predictable
   registerSuite({
      name: "Tab Container Tests (function)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainer", "Tab Container Tests (function)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Checking 3rd panel is visible": function () {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
               });
      },

      "Checking 1st panel is visible after external selection by index": function() {
         return browser.findById("SELECT_TAB_1")
            .click()
            .end()

         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 1st panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 1st panel should not be hidden");
               });
      },

      "Checking 3rd panel is hidden after external selection by index": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The 3rd panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The 3rd panel should not be visible");
               });
      },

      "Checking 2nd panel is visible after external selection by index": function() {
         return browser.findById("SELECT_TAB_2")
            .click()
         .end()

         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(2)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 2nd panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 2nd panel should not be hidden");
               });
      },

      "Checking 1st panel is hidden after external selection by index": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The 1st panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The 1st panel should not be visible");
               });
      },

      "Checking 1st panel is visible after external selection by title": function() {
         return browser.findById("SELECT_TAB_3")
            .click()
         .end()

         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 1st panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 1st panel should not be hidden");
               });
      },

      "Checking 2nd panel is hidden after external selection by title": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The 2nd panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The 2nd panel should not be visible");
               });
      },

      "Checking 2nd panel is visible after external selection by title": function() {
         return browser.findById("SELECT_TAB_4")
            .click()
         .end()

         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(2)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 2nd panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 2nd panel should not be hidden");
               });
      },

      "Checking 1st panel is hidden after external selection by title": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The 1st panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The 1st panel should not be visible");
               });
      },

      "Checking 1st panel is visible after external selection by id": function() {
         return browser.findById("SELECT_TAB_5")
            .click()
         .end()

         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 1st panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 1st panel should not be hidden");
               });
      },

      "Checking 2nd panel is hidden after external selection by id": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The 2nd panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The 2nd panel should not be visible");
               });
      },

      "Checking 2nd panel is visible after external selection by id": function() {
         return browser.findById("SELECT_TAB_6")
            .click()
         .end()

         .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(2)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitVisible", "The 2nd panel should be visible");
                  expect(currClasses).to.not.contain("dijitHidden", "The 2nd panel should not be hidden");
               });
      },

      "Checking 1st panel is hidden after external selection by id": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitHidden", "The 1st panel should be hidden");
                  expect(currClasses).to.not.contain("dijitVisible", "The 1st panel should not be visible");
               });
      },

      "Checking 1st tab is disabled after external selection by index": function() {
         return browser.findById("DISABLE_TAB_1")
            .click()
         .end()

         .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitDisabled", "The 1st panel should be disabled");
               });
      },

      "Checking 1st tab is enabled after external selection by index": function() {
         return browser.findById("DISABLE_TAB_2")
            .click()
         .end()

         .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.not.contain("dijitDisabled", "The 1st panel should not be disabled");
               });
      },

      "Checking 1st tab is disabled after external selection by title": function() {
         return browser.findById("DISABLE_TAB_3")
            .click()
         .end()

         .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitDisabled", "The 1st panel should be disabled");
               });
      },

      "Checking 1st tab is enabled after external selection by title": function() {
         return browser.findById("DISABLE_TAB_4")
            .click()
         .end()

         .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.not.contain("dijitDisabled", "The 1st panel should not be disabled");
               });
      },

      "Checking 1st tab is disabled after external selection by id": function() {
         return browser.findById("DISABLE_TAB_5")
            .click()
         .end()

         .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.contain("dijitDisabled", "The 1st panel should be disabled");
               });
      },

      "Checking 1st tab is enabled after external selection by id": function() {
         return browser.findById("DISABLE_TAB_6")
            .click()
         .end()

         .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  expect(currClasses).to.not.contain("dijitDisabled", "The 1st panel should not be disabled");
               });
      },

      "Check the correct number of tabs is present": function() {
         return browser.findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
            .then(
               function (tabs) {
                  expect(tabs.length).to.equal(11, "There are not 11 tabs");
               }
            );
      },

      "Check the correct number of tabs is present after deleting tab 7": function() {
         return browser.findById("DELETE_TAB_1")
            .click()
         .end()

         .findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
            .then(
               function (tabs) {
                  expect(tabs.length).to.equal(10, "There are not 10 tabs");
               }
            );
      },

      "Check the correct number of tabs is present after deleting tab titled 'Logo 8'": function() {
         return browser.findById("DELETE_TAB_2")
            .click()
         .end()

         .findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
            .then(
               function (tabs) {
                  expect(tabs.length).to.equal(9, "There are not 9 tabs");
               }
            );
      },

      "Check the correct number of tabs is present after deleting tab with id 'dijit_layout_ContentPane_8": function() {
         return browser.findById("DELETE_TAB_3")
            .click()
         .end()

         .findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
            .then(
               function (tabs) {
                  expect(tabs.length).to.equal(8, "There are not 8 tabs");
               }
            );
      },

      "Check that delayed processing form control is displayed correctly": function() {
         return browser.findById("dijit_layout_TabContainer_0_tablist_dijit_layout_ContentPane_9")
            .click()
         .end()
         .findByCssSelector("#FormControl1 .label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Select...", "The form control was not displayed correctly");
            });
      },

       "Check that non-delayed processing form control is displayed correctly": function() {
         return browser.findById("dijit_layout_TabContainer_0_tablist_dijit_layout_ContentPane_10")
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
   });

   registerSuite({
      name: "Tab Container Tests (example use case)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainerUseCase", "Tab Container Tests (example use case)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check the correct number of tabs is present": function() {
         return browser.findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
            .then(
               function (tabs) {
                  assert.lengthOf(tabs, 1, "Only one tab should be initially shown");
               }
            );
      },

      "Add a new panel to display first item": function () {
         return browser.findByCssSelector(".alfresco-lists-views-AlfListView tr:first-child .alfresco-renderers-Property .value")
            .click()
         .end()
         .findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
            .then(function (tabs) {
               assert.lengthOf(tabs, 2, "A second tab should have been added");
            });
      },

      "Checking new panel is selected": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(2)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The new tab should have been selected");
            });
      },

      "Check that the new panel has rendered content correctly": function() {
         return browser.findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(2) .alfresco-html-Label")
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
   });

   registerSuite({
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
         return browser.findByCssSelector("body")
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

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});