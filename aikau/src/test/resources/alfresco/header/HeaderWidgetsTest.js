/*jshint browser:true*/
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
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, keys) {

   defineSuite(module, {
      name: "Basic Header Widgets Tests",
      testPage: "/HeaderWidgets",

      // See AKU-788...
      "Down arrow is visible on long menu bar pop-up": function() {
         return this.remote.findDisplayedByCssSelector("#HEADER_POPUP .alfresco-menus-AlfMenuBarPopup__arrow");
      },

      "Test that header CSS is applied": function() {
         // Check that the header CSS is applied...
         return this.remote.findByCssSelector(".alfresco-layout-LeftAndRight.alfresco-header-Header")
            .then(function() {}, function() {
               assert(false, "The header CSS was not applied correctly");
            });
      },

      "Test title text is correct": function() {
         return this.remote.findByCssSelector(".alfresco-header-Title__text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Sök <img src=\"1\" onerror=\"window.hackedTitle=true\">", "The title was not set correctly");
            })
         .end()

         .execute(function() {
               return window.hackedTitle;
            })
            .then(function(hackedTitle) {
               assert.isFalse(!!hackedTitle, "XSS attack in title succeeded");
            })

         .getPageTitle()
            .then(function(title) {
               assert.equal(title, "Alfresco » Sök <img src=\"1\" onerror=\"window.hackedTitle=true\">", "The title was not set correctly");
            });
      },

      "Test initial user status": function() {
         return this.remote.findByCssSelector("#HEADER_POPUP .alfresco-menus-AlfMenuBarPopup__text-wrapper")
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
         return this.remote.findByCssSelector("#PRESET_STATUS > div.lastUpdate > span")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "over 16 years ago", "Preset status time not displayed as expected");
            });
      },

      "Test unset status displayed correctly": function() {
         return this.remote.findByCssSelector("#NO_STATUS > div.status")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "What are you thinking?", "Unset status not displayed correctly");
            });
      },

      "Test unset status time displayed correctly": function() {
         return this.remote.findByCssSelector("#NO_STATUS > div.lastUpdate")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Last updated: never", "Unset status time not displayed as expected");
            });
      },

      "Test status dialog is displayed on click": function() {
         return this.remote.findByCssSelector("#NO_STATUS > div.status")
            .click()
         .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed")
            .then(function() {}, function() {
               assert(false, "The update dialog was not displayed");
            });
      },

      "Test status dialog text is correct": function() {
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitleBar > span")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "What Are You Thinking?", "User status dialog title not set correctly");
            });
      },

      "Test new status published correctly": function() {
         return this.remote.findByCssSelector("#NO_STATUS_STATUS_TEXTAREA")
            .clearValue()
            .type("Status Update")
            .pressKeys([keys.TAB])
            .pressKeys([keys.RETURN])
         .end()

         // Check that the status update was posted correctly...
         .getLastPublish("ALF_UPDATE_USER_STATUS")
            .then(function(payload) {
               assert.propertyVal(payload, "status", "Status Update", "User status not published correctly");
            });
      },

      "Test setting status updates via PubSub (status)": function() {
         // Use the menus to simulate a status update...
         // (with the bonus of checking the header versions of the menu items work)...
         return this.remote.findByCssSelector("#HEADER_POPUP .alfresco-menus-AlfMenuBarPopup__text-wrapper")
            .click()
         .end()

         .findDisplayedByCssSelector("#CASCADE_1_text")
            .click()
         .end()

         .findDisplayedByCssSelector("#MENU_ITEM_1_text")
            .click()
         .end()

         // Open the popup again...
         .findDisplayedByCssSelector("#HEADER_POPUP .alfresco-menus-AlfMenuBarPopup__text-wrapper")
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
         return this.remote.findByCssSelector("#NO_STATUS > div.lastUpdate > span")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "over 16 years ago", "Status time not updated");
            })
            .end();

      },

      "Test recent sites displayed (first site)": function() {
         // Click on the sites menus...
         return this.remote.findByCssSelector("#SITES_MENU_text")
            .click()
            .end()

         .findByCssSelector("#HEADER_SITES_MENU_RECENT_site1 a")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Site1", "First recent site not rendered correctly");
            });
      },

      "Test recent sites displayed (second site)": function() {
         return this.remote.findByCssSelector("#HEADER_SITES_MENU_RECENT_site2 a")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Site2", "Sccond recent site not rendered correctly");
            });
      },

      "Test favourite sites displayed (first site)": function() {
         return this.remote.findByCssSelector("#SITES_MENU_FAVOURITES_text")
            .click()
            .end()

         .findByCssSelector("#HEADER_SITES_MENU_FAVOURITE_site1 a")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Site1", "First favourite site not rendered correctly");
            });
      },

      "Test favourite sites displayed (second site)": function() {
         return this.remote.findByCssSelector("#HEADER_SITES_MENU_FAVOURITE_site2 a")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Site2", "Second favourite site not rendered correctly");
            });
      },

      "Test updating title": function() {
         return this.remote.findByCssSelector("#SET_TITLE_BUTTON")
            .click()
         .end()
         
         .findByCssSelector(".alfresco-header-Title__text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Updated Sök <img src=\"1\" onerror=\"window.hackedSetTitle=true\">", "The title was not updated");
            })
         .end()

         .execute(function() {
               return window.hackedSetTitle;
            })
            .then(function(hackedSetTitle) {
               assert.isFalse(!!hackedSetTitle, "XSS attack in setting title succeeded");
            })

         .getPageTitle()
            .then(function(title) {
               assert.equal(title, "Alfresco » Updated Sök <img src=\"1\" onerror=\"window.hackedSetTitle=true\">", "The title was not set correctly");
            });
      }
   });

   defineSuite(module, {
      name: "Add Favourites Tests",
      testPage: "/AddFavouriteSite",

      "Test add favourite request published": function() {
         return this.remote.findByCssSelector("#SITES_MENU")
            .click()
            .end()

         // Open the favourites menu to do initial load
         .findById("SITES_MENU_FAVOURITES")
            .click()
            .end()

         .findByCssSelector("#SITES_MENU_FAVOURITES_dropdown .alfresco-menus-AlfMenuItem")
            .end()

         .findByCssSelector("#SITES_MENU_ADD_FAVOURITE")
            .click()
            .end()

         .getLastPublish("ALF_ADD_FAVOURITE_SITE", true)
            .then(function(payload) {
               assert.propertyVal(payload, "site", "site1");
               assert.propertyVal(payload, "title", "Site One");
            })

         .findByCssSelector("#SITES_MENU")
            .click()
            .end()

         .findById("SITES_MENU_FAVOURITES")
            .click()
            .end()

         .findByCssSelector("#SITES_MENU_FAVOURITES_dropdown .dijitMenuItemLabel [title=\"Site One\"]")
            .getAttribute("href")
            .then(function(href) {
               assert.equal(href, "/aikau/page/site/site1/wibble");
            });
      }
   });

   defineSuite(module, {
      name: "Remove Favourites Tests",
      testPage: "/RemoveFavouriteSite",

      "Test remove favourite request published": function() {
         return this.remote.findByCssSelector("#SITES_MENU_text")
            .click()
         .end()

         .findDisplayedByCssSelector("#SITES_MENU_dropdown")
         .end()

         .findByCssSelector("#SITES_MENU_FAVOURITES")
            .getAttribute("title")
            .then(function(title) {
               assert.equal(title, "Favorites");
            })
         .end()

         .findByCssSelector("#SITES_MENU_REMOVE_FAVOURITE_text")
            .click()
         .end()

         .getLastPublish("ALF_REMOVE_FAVOURITE_SITE")
            .then(function(payload) {
               assert.propertyVal(payload, "site", "site1");
            });
      }
   });

   defineSuite(module, {
      name: "Title Tests",
      testPage: "/Title",

      "Test title gets set": function() {
         return this.remote.findByCssSelector(".alfresco-header-Title:nth-child(2)")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "This is a title", "The title was not set");
            });
      },

      /* global document */
      "Long title is truncated": function() {
         return this.remote.execute(function() {
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
         return this.remote.findByCssSelector("#LINK .alfresco-header-Title__text a")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "dp/ws/some-other-page");
               assert.propertyVal(payload, "type", "PAGE_RELATIVE");
            });
      }
   });

   defineSuite(module, {
      name: "Set Title Tests",
      testPage: "/SetTitle",

      "Test title gets set": function() {
         return this.remote.findByCssSelector(".alfresco-header-Title__text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Updated Title", "The title was not updated");
            });
      },

      "Test document title": function() {
         return this.remote.execute("return document.title;")
            .then(function(title) {
               assert(title.indexOf("Unit Tests" === 0), "The document title was not updated");
            });
      }
   });
});