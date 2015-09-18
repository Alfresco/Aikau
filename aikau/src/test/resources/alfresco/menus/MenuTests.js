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
 * This registers the test suites for the alfresco/menus package.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

   var alfPause = 250;
registerSuite(function(){
   var browser;

   return {
      name: "Menus Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/BasicMenuTestPage", "Menus Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Tests": function () {
         // TODO: It would be nice to get rid of the sleeps in this test...
         //       Should this test start failing then the first thing to do would be to increase
         //       the sleep times. However, there should be a better way of determining whether or 
         //       not it's safe to proceed before the next action without needing the sleep
         var testName = "Menus Test";
         // Test #1 
         // Open the drop-down menu and select the FIRST menut item using the space bar...
         return browser.pressKeys(keys.TAB)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_1"))
               .then(
                  function() {
                     TestCommon.log(testName, "1) Clicking MENU_ITEM_1 (tab, down, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_1 after Test #1");
                  }
               )
               .end()

            // Test #2
            // Open the drop-down menu and select the SECOND menu item using the return key...
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)
            .pressKeys(keys.RETURN)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_2"))
               .then(
                  function() {
                     TestCommon.log(testName, "2) Clicking MENU_ITEM_2 (down, down, return)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_2 in Test #2");
                  }
               )
               .end()

            // Test #3
            // Open the menu and select the first item in the SECOND group (tests cross-group navigation)...
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)
            .pressKeys(keys.RETURN)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_3"))
               .then(
                  function() {
                     TestCommon.log(testName, "3) Clicking MENU_ITEM_3 (down, down, down, return)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_3 in Test #3");
                  }
               )
               .end()

            // Test #4
            // Test cross group navigation both up and down groups...
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_UP)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_2"))
               .then(
                  function() {
                     TestCommon.log(testName, "4) Clicking MENU_ITEM_2 (down, down, down, up, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_2 in Test #4");
                  }
               )
               .end()

            // Test #5
            // Test going from first item in first group to last item in last group...
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_UP)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_6"))
               .then(
                  function() {
                     TestCommon.log(testName, "5) Clicking MENU_ITEM_6 (down, up, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_6 in Test #5");
                  }
               )
               .end()

            // Test #6
            // Test going from the last item in the last group to the first item in the first group...
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_UP)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(1000)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_1"))
               .then(
                  function() {
                     TestCommon.log(testName, "6) Clicking MENU_ITEM_1 (down, up, down, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_1 in Test #6");
                  }
               )
               .end()

            // Test #7
            // Test going along the menu bar (the menu bar should already have focus)...
            .pressKeys(keys.ARROW_RIGHT)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "MENU_BAR_ITEM_1"))
               .then(
                  function() {
                     TestCommon.log(testName, "7) Clicking MENU_BAR_ITEM_1 (right, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_BAR_ITEM_1 in Test #7");
                  }
               )
               .end()

            // Test #8
            // Test navigating between UNGROUPED menu items in a drop down menu...
            // (Moving to the menu will open it and have the first item selected)
            .pressKeys(keys.ARROW_RIGHT)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "MENU_ITEM_8"))
               .then(
                  function() {
                     TestCommon.log(testName, "8) Clicking MENU_ITEM_8 (right, down, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_8 in Test #8");
                  }
               )
               .end()

            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_UP)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "MENU_ITEM_7"))
               .then(
                  function() {
                     TestCommon.log(testName, "9) Clicking MENU_ITEM_7 (down, down, up, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_7 in Test #9");
                  }
               )
               .end()

            // Test #9
            // Test cascade menu keyboard navigation (opening and closing cascades)...
            .pressKeys(keys.ARROW_RIGHT)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN) // Go past and back to cascade
            .pressKeys(keys.ARROW_UP)
            .pressKeys(keys.ARROW_RIGHT) // Open the cascade
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_11"))
               .then(
                  function() {
                     TestCommon.log(testName, "10) Clicking MENU_ITEM_11 (right, down, down, up, right)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_11 in Test #10");
                  }
               )
               .end()

            // Test #10
            // Test opening cascades within cascades...
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_RIGHT) // Open the FIRST cascade
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_RIGHT) // Open the SECOND cascade
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_13"))
               .then(
                  function() {
                     TestCommon.log(testName, "11) Clicking MENU_ITEM_13 (down, down, right, down, right, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_13 in Test #11");
               })
               .end()

            // Test #11
            // Test closing cascades
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_RIGHT) // Open the cascade
            .pressKeys(keys.ARROW_LEFT)  // Close the cascade 
            .pressKeys(keys.ARROW_DOWN)  // Select the next menu item
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_14"))
               .then(
                  function() {
                     TestCommon.log(testName, "12) Clicking MENU_ITEM_14 (down, down, right, left, down, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_14 in Test #12");
                  }
               )
               .end()

            // Test #12
            // Test menu item wrapper navigation (e.g. that you can navigate over non-menu items)
            .pressKeys(keys.ARROW_RIGHT)
            .pressKeys(keys.ARROW_DOWN) // This should jump over the logo widget inserted into the menu
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_10"))
               .then(
                  function() {
                     TestCommon.log(testName, "13) Clicking MENU_ITEM_10 (right, down, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_10 in Test #13");
                  }
               )
               .end()

            // Test #13
            // Test menu item wrapper navigation (e.g. that you can navigate back up over non-menu items)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN) // This should jump over the logo widget inserted into the menu
            .pressKeys(keys.ARROW_UP) // This should jump over the logo widget inserted into the menu
            .sleep(1000)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_9"))
               .then(
                  function() {
                     TestCommon.log(testName, "14) Clicking MENU_ITEM_9 (down, down, up, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_9 in Test #14");
               })
               .end()

            // Test #14
            // Test right cursor wrapping on menu...
            .pressKeys(keys.ARROW_RIGHT)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(1000)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_2"))
               .then(
                  function() {
                     TestCommon.log(testName, "15) Clicking MENU_ITEM_2 (right, down, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_2 in Test #15");
                  }
               )
               .end()

            // Test #15
            // Test left cursor wrapping on menu...
            .pressKeys(keys.ARROW_LEFT)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(1000)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_10"))
               .then(
                  function() {
                     TestCommon.log(testName, "16) Clicking MENU_ITEM_10 (left, down, space)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_10 in Test #16");
                  }
               )
               .end()

            // Test #16
            // Test drop-down menu using the mouse...
            .findByCssSelector("#DROP_DOWN_MENU_1")
               .click()
               .end()
            .findByCssSelector("#MENU_ITEM_1")
               .click()
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_1"))
               .then(
                  function() {
                     TestCommon.log(testName, "17) Clicking MENU_ITEM_1 (mouse)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_1 in Test #17");
                  }
               )
               .end()

            // Test #17
            // Test cascade menus using the mouse...
            .findByCssSelector("#DROP_DOWN_MENU_3")
               .click()
               .end()
            .findByCssSelector("#CASCADING_MENU_1")
               .click()
               .end()
            .findByCssSelector("#CASCADING_MENU_2")
               .click()
               .end()
            .findByCssSelector("#MENU_ITEM_13")
               .click()
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "item", "MENU_ITEM_13"))
               .then(
                  function() {
                     TestCommon.log(testName, "18) Clicking MENU_ITEM_13 (mouse)...");
                  }, 
                  function() {
                     assert(false, "Could not find MENU_ITEM_13 in Test #18");
                  }
               );
      },

      "Share relative page URLs are correct": function() {
         return browser.findByCssSelector("#MENU_ITEM_7 .alfresco-navigation-_HtmlAnchorMixin")
            .getAttribute("href")
            .then(function(href) {
               assert.equal(href, "/aikau/page/MENU_ITEM_7", "Share relative page URL incorrect");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});