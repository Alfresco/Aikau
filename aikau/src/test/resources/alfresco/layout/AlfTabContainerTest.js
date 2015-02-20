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

   registerSuite({
      name: 'Tab Container Tests',
      

      'AlfTabContainer initial rendering': function () {
         var testname = "AlfTabContainer initial rendering";
         return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainer", testname)

            .findByCssSelector("div.alfresco-layout-AlfTabContainer > div.dijitTabContainer")
               .then(
                  function (obj) {
                     TestCommon.log(testname,"Check the tab container is present");
                  },
                  function (err) {
                     assert(false, "Tab container not rendered");
                  })
            .end()

            .findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
               .then(
                  function (tabs) {
                     TestCommon.log(testname,"Check the correct number of tabs is present");
                     expect(tabs.length).to.equal(9, "There are not 9 tabs");
                  }
               )
            .end()

            .findAllByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper")
               .then(
                  function (panels) {
                     TestCommon.log(testname,"Check the correct number of panels is present");
                     expect(panels.length).to.equal(9, "There are not 9 panels");
                  }
               )
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper.dijitVisible")
               .then(
                  function (obj) {
                     TestCommon.log(testname,"Check one visible panel is present");
                  },
                  function (err) {
                     assert(false, "Visible panel not rendered");
                  })
            .end()

            .findAllByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper.dijitHidden")
               .then(
                  function (panels) {
                     TestCommon.log(testname,"Check the correct number of panels is present");
                     expect(panels.length).to.equal(8, "There are not 8 panels");
                  }
               )
            .end()
      },


      'AlfTabContainer mouse tests': function () {
         var browser = this.remote;
         var testname = "AlfTabContainer mouse tests";
         return browser
        
            // Test current panel states
            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 3rd panel is visible");
                     expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:last-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking last panel is hidden");
                     expect(currClasses).to.contain("dijitHidden", "The last panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The last panel should not be visible");
                  })
            .end()

            // Click tab 2
            .findByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab:last-of-type")
               .click()
            .end()

            // Test current panel states
            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 3rd panel is hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 3rd panel should not be visible");
                     expect(currClasses).to.contain("dijitHidden", "The 3rd panel should be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:last-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking last panel is visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The last panel should not be hidden");
                     expect(currClasses).to.contain("dijitVisible", "The last panel should be visible");
                  })
            .end()

            // Click tab 1
            .findByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab:nth-of-type(3)")
               .click()
            .end()

            // Test current panel states
            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 3rd panel is visible");
                     expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:last-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking last panel is hidden");
                     expect(currClasses).to.contain("dijitHidden", "The last panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The last panel should not be visible");
                  })
            .end()

            .alfPostCoverageResults(browser)

      },


      // This test reloads the page to clear any previous focus and make keyboard actions more predictable
      'AlfTabContainer keyboard tests': function () {
         var browser = this.remote;
         var testname = "AlfTabContainer keyboard tests";
         return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainer", testname)
        
            // Test current panel states
            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 3rd panel is visible");
                     expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 4th is hidden");
                     expect(currClasses).to.contain("dijitHidden", "The 4th panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 4th panel should not be visible");
                  })
            .end()

            // Tab to tab controls and select right tab
            .pressKeys(keys.TAB)
            .pressKeys(keys.ARROW_RIGHT)

            // Test current panel states
            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 3rd panel is hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 3rd panel should not be visible");
                     expect(currClasses).to.contain("dijitHidden", "The 3rd panel should be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 4th panel is visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 4th panel should not be hidden");
                     expect(currClasses).to.contain("dijitVisible", "The 4th panel should be visible");
                  })
            .end()

            // Select left tab
            .pressKeys(keys.ARROW_LEFT)

            // Test current panel states
            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 3rd panel is visible");
                     expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 4th panel is hidden");
                     expect(currClasses).to.contain("dijitHidden", "The 4th panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 4th panel should not be visible");
                  })
            .end()

            .alfPostCoverageResults(browser)

      },


      // This test reloads the page
      'AlfTabContainer function tests': function () {
         var browser = this.remote;
         var testname = "AlfTabContainer function tests";
         return TestCommon.loadTestWebScript(this.remote, "/AlfTabContainer", testname)
        
            .end()

            // Test current panel states
            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 3rd panel is visible");
                     expect(currClasses).to.contain("dijitVisible", "The 3rd panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 3rd panel should not be hidden");
                  })
            .end()

            .findById("SELECT_TAB_1")
               .click()
               .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st panel is visible after external selection by index");
                     expect(currClasses).to.contain("dijitVisible", "The 1st panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 1st panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(3)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 3rd panel is hidden after external selection by index");
                     expect(currClasses).to.contain("dijitHidden", "The 3rd panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 3rd panel should not be visible");
                  })
            .end()

            .findById("SELECT_TAB_2")
               .click()
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(2)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 2nd panel is visible after external selection by index");
                     expect(currClasses).to.contain("dijitVisible", "The 2nd panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 2nd panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st panel is hidden after external selection by index");
                     expect(currClasses).to.contain("dijitHidden", "The 1st panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 1st panel should not be visible");
                  })
            .end()

            .findById("SELECT_TAB_3")
               .click()
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st panel is visible after external selection by title");
                     expect(currClasses).to.contain("dijitVisible", "The 1st panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 1st panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 2nd panel is hidden after external selection by title");
                     expect(currClasses).to.contain("dijitHidden", "The 2nd panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 2nd panel should not be visible");
                  })
            .end()

            .findById("SELECT_TAB_4")
               .click()
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(2)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 2nd panel is visible after external selection by title");
                     expect(currClasses).to.contain("dijitVisible", "The 2nd panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 2nd panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st panel is hidden after external selection by title");
                     expect(currClasses).to.contain("dijitHidden", "The 1st panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 1st panel should not be visible");
                  })
            .end()

            .findById("SELECT_TAB_5")
               .click()
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st panel is visible after external selection by id");
                     expect(currClasses).to.contain("dijitVisible", "The 1st panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 1st panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(4)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 2nd panel is hidden after external selection by id");
                     expect(currClasses).to.contain("dijitHidden", "The 2nd panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 2nd panel should not be visible");
                  })
            .end()

            .findById("SELECT_TAB_6")
               .click()
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:nth-of-type(2)")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 2nd panel is visible after external selection by id");
                     expect(currClasses).to.contain("dijitVisible", "The 2nd panel should be visible");
                     expect(currClasses).to.not.contain("dijitHidden", "The 2nd panel should not be hidden");
                  })
            .end()

            .findByCssSelector("div.dijitTabPaneWrapper > div.dijitTabContainerTopChildWrapper:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st panel is hidden after external selection by id");
                     expect(currClasses).to.contain("dijitHidden", "The 1st panel should be hidden");
                     expect(currClasses).to.not.contain("dijitVisible", "The 1st panel should not be visible");
                  })
            .end()

            .findById("DISABLE_TAB_1")
               .click()
            .end()

            .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st tab is disabled after external selection by index");
                     expect(currClasses).to.contain("dijitDisabled", "The 1st panel should be disabled");
                  })
            .end()

            .findById("DISABLE_TAB_2")
               .click()
            .end()

            .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st tab is enabled after external selection by index");
                     expect(currClasses).to.not.contain("dijitDisabled", "The 1st panel should not be disabled");
                  })
            .end()

            .findById("DISABLE_TAB_3")
               .click()
            .end()

            .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st tab is disabled after external selection by title");
                     expect(currClasses).to.contain("dijitDisabled", "The 1st panel should be disabled");
                  })
            .end()

            .findById("DISABLE_TAB_4")
               .click()
            .end()

            .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st tab is enabled after external selection by title");
                     expect(currClasses).to.not.contain("dijitDisabled", "The 1st panel should not be disabled");
                  })
            .end()

            .findById("DISABLE_TAB_5")
               .click()
            .end()

            .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st tab is disabled after external selection by id");
                     expect(currClasses).to.contain("dijitDisabled", "The 1st panel should be disabled");
                  })
            .end()

            .findById("DISABLE_TAB_6")
               .click()
            .end()

            .findByCssSelector("div.dijitTabContainerTop-tabs > div:first-of-type")
               .getAttribute('class')
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking 1st tab is enabled after external selection by id");
                     expect(currClasses).to.not.contain("dijitDisabled", "The 1st panel should not be disabled");
                  })
            .end()

            .findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
               .then(
                  function (tabs) {
                     TestCommon.log(testname,"Check the correct number of tabs is present");
                     expect(tabs.length).to.equal(9, "There are not 9 tabs");
                  }
               )
            .end()

            .findById("DELETE_TAB_1")
               .click()
            .end()

            .findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
               .then(
                  function (tabs) {
                     TestCommon.log(testname,"Check the correct number of tabs is present after deleting tab 7");
                     expect(tabs.length).to.equal(8, "There are not 8 tabs");
                  }
               )
            .end()

            .findById("DELETE_TAB_2")
               .click()
            .end()

            .findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
               .then(
                  function (tabs) {
                     TestCommon.log(testname,"Check the correct number of tabs is present after deleting tab titled 'Logo 8'");
                     expect(tabs.length).to.equal(7, "There are not 7 tabs");
                  }
               )
            .end()

            .findById("DELETE_TAB_3")
               .click()
            .end()

            .findAllByCssSelector("div.dijitTabListWrapper > div.dijitTabContainerTop-tabs > div.dijitTab")
               .then(
                  function (tabs) {
                     TestCommon.log(testname,"Check the correct number of tabs is present after deleting tab with id 'dijit_layout_ContentPane_8");
                     expect(tabs.length).to.equal(6, "There are not 6 tabs");
                  }
               )
            .end()

            .alfPostCoverageResults(browser)

      }
      
   });
});