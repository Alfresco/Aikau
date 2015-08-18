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
 */
define(["intern!object",
        "intern/chai!expect", 
        "intern/chai!assert", 
        "require", 
        "alfresco/TestCommon", 
        "intern/dojo/node!leadfoot/keys"], 
        function(registerSuite, expect, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "Basic Header Widgets Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/HeaderWidgets", "Basic Header Widgets Test").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test that header CSS is applied": function() {
         // Check that the header CSS is applied...         
         return browser.findByCssSelector(".alfresco-layout-LeftAndRight.alfresco-header-Header")
            .then(function() {}, function() {
               assert(false, "The header CSS was not applied correctly");
            });
      },

      "Test title text is correct": function() {
         return browser.findByCssSelector(".alfresco-header-Title__text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Test Title", "The title was not set correctly");
            });
      },

      "Test initial user status": function() {
         return browser.findByCssSelector("#HEADER_POPUP_text")
            .click()
            .end()

         // Check the preset user status...
         .findByCssSelector("#PRESET_STATUS > div.status")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Test Status", "Preset status not set correctly");
            });
      },

      "Test initial status time": function() {
         return browser.findByCssSelector("#PRESET_STATUS > div.lastUpdate > span")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "over 15 years ago", "Preset status time not displayed as expected");
            });
      },

      "Test unset status displayed correctly": function() {
         return browser.findByCssSelector("#NO_STATUS > div.status")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "What are you thinking?", "Unset status not displayed correctly");
            });
      },

      "Test unset status time displayed correctly": function() {
         return browser.findByCssSelector("#NO_STATUS > div.lastUpdate")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Last updated: never", "Unset status time not displayed as expected");
            });
      },

      "Test status dialog is displayed on click": function() {
         return browser.findByCssSelector("#NO_STATUS > div.status")
            .click()
            .sleep(500)
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function() {}, function() {
               assert(false, "The update dialog was not displayed");
            });
      },

      "Test status dialog text is correct": function() {
         return browser.findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitleBar > span")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "What Are You Thinking?", "User status dialog title not set correctly");
            });
      },

      "Test new status published correctly": function() {
         return browser.findByCssSelector("#NO_STATUS_STATUS_TEXTAREA")
            .clearValue()
            .type("Status Update")
            .pressKeys([keys.TAB])
            .pressKeys([keys.RETURN])
            .sleep(250)
            .end()

         // Check that the status update was posted correctly...
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "status", "Status Update"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "User status not published correctly");
            });
      },

      "Test setting status updates via PubSub (status)": function() {
         // Use the menus to simulate a status update...
         // (with the bonus of checking the header versions of the menu items work)...
         return browser.findByCssSelector("#HEADER_POPUP_text")
            .click()
            .end()
            .sleep(150)
            .findByCssSelector("#CASCADE_1_text")
            .click()
            .end()
            .sleep(150)
            .findByCssSelector("#MENU_ITEM_1_text")
            .click()
            .end()
            .sleep(150)

         // Open the popup again...
         .findByCssSelector("#HEADER_POPUP_text")
            .click()
            .end()

         // Check the preset user status (which should be updated)...
         .findByCssSelector("#NO_STATUS > div.status")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Button Update", "Status not updated");
            });
      },

      "Test setting status updates via PubSub (time)": function() {
         return browser.findByCssSelector("#NO_STATUS > div.lastUpdate > span")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "over 15 years ago", "Status time not updated");
            })
            .end();

      },

      "Test recent sites displayed (first site)": function() {
         // Click on the sites menus...
         return browser.findByCssSelector("#SITES_MENU_text")
            .click()
            .end()

         .findByCssSelector("#HEADER_SITES_MENU_RECENT_site1 a")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Site1", "First recent site not rendered correctly");
            });
      },

      "Test recent sites displayed (second site)": function() {
         return browser.findByCssSelector("#HEADER_SITES_MENU_RECENT_site2 a")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Site2", "Sccond recent site not rendered correctly");
            });
      },

      "Test favourite sites displayed (first site)": function() {
         return browser.findByCssSelector("#SITES_MENU_FAVOURITES_text")
            .click()
            .end()

         .findByCssSelector("#HEADER_SITES_MENU_FAVOURITE_site1 a")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Site1", "First favourite site not rendered correctly");
            });
      },

      "Test favourite sites displayed (second site)": function() {
         return browser.findByCssSelector("#HEADER_SITES_MENU_FAVOURITE_site2 a")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Site2", "Second favourite site not rendered correctly");
            });
      },

      "Test updating title": function() {
         return browser.findByCssSelector("#SET_TITLE_BUTTON")
            .click()
            .end()
            .findByCssSelector(".alfresco-header-Title__text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Updated Title", "The title was not updated");
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
      name: "Add Favourites Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AddFavouriteSite", "Add Favourites Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test add favourite request published": function() {
         return browser.findByCssSelector("#SITES_MENU_text")
            .click()
            .sleep(500)
            .end()

         .findByCssSelector("#SITES_MENU_ADD_FAVOURITE_text")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("ALF_ADD_FAVOURITE_SITE", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Add favourite topic not published");
            });
      },

      "Test favourite request published correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "site", "site1"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Favourite not added correctly");
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
      name: "Remove Favourites Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/RemoveFavouriteSite", "Add Favourites Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test remove favourite request published": function() {
         return browser.findByCssSelector("#SITES_MENU_text")
            .click()
            .sleep(500)
            .end()

         .findByCssSelector("#SITES_MENU_REMOVE_FAVOURITE_text")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("ALF_REMOVE_FAVOURITE_SITE", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Remove favourite topic not published");
            });
      },

      "Test remove request published correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "site", "site1"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Favourite not removed correctly");
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
      name: "Title Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Title", "Title Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test title gets set": function() {
         return browser.findByCssSelector(".alfresco-header-Title:nth-child(2)")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "This is a title", "The title was not set");
            });
      },

      "Long title is truncated": function() {
         return browser.execute(function() {
               var title = document.querySelector("#LONG .alfresco-header-Title__text");
               return title.clientWidth < title.scrollWidth;
            })
            .then(function(truncated) {
               assert.isTrue(truncated, "Long title not truncated");
            })
            .end()

         .findByCssSelector("#LONG .alfresco-header-Title__text")
            .then(function(elem) {
               return elem.getSize();
            })
            .then(function(size) {
               assert.equal(size.width, 300, "Long title width incorrect");
            })
            .end()

         .screenie(); // For visual verification of ellipsis if required
      },

      "Test link title": function() {
         return browser.findByCssSelector("#LINK .alfresco-header-Title__text a")
            .click()
         .end()
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "dp/ws/some-other-page");
               assert.propertyVal(payload, "type", "PAGE_RELATIVE");
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
      name: "Set Title Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SetTitle", "Set Title Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test title gets set": function() {
         return browser.findByCssSelector(".alfresco-header-Title__text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Updated Title", "The title was not updated");
            });
      },

      "Test document title": function() {
         return browser.execute("return document.title;")
            .then(function(title) {
               assert(title.indexOf("Unit Tests" === 0), "The document title was not updated");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});