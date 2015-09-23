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
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
       function (registerSuite, assert, require, TestCommon) {

   var checkAction = function(browser, row, count, error) {
      return browser.findByCssSelector("#LIST tr:nth-child(" + row + ") .dijitMenuBar")
         .getAttribute("id")
         .then(function(id) {
            // NOTE: Uncomment for debugging
            // console.log("ID is: " + id);
            return browser.end().findByCssSelector("div.dijitPopup[dijitpopupparent=" + id +"]")
               // NOTE: Uncomment for debugging
               // .getAttribute("id")
               // .then(function(popupId) {
               //    console.log("Popup id is: " + popupId);
               // })
               .findAllByCssSelector(".alfresco-menus-AlfMenuItem .dijitMenuItemLabel")
                  .then(function(elements) {
                     // NOTE: Uncomment for debugging
                     // console.log("Actions found: " + elements.length);
                     assert.lengthOf(elements, count, error);
                  });
         });
   };

   var useAction = function(browser, row) {
      return browser.findByCssSelector("#LIST tr:nth-child(" + row + ") .dijitMenuBar")
         .getAttribute("id")
         .then(function(id) {
            // NOTE: Uncomment for debugging
            // console.log("ID is: " + id);
            return browser.end().findByCssSelector("div.dijitPopup[dijitpopupparent=" + id +"]")
               // NOTE: Uncomment for debugging
               // .getAttribute("id")
               // .then(function(popupId) {
               //    console.log("Popup id is: " + popupId);
               // })
               .findByCssSelector(".alfresco-menus-AlfMenuItem .dijitMenuItemLabel")
                  .click();
         });
   };


   registerSuite(function(){
   var browser;

   return {
      name: "Upload New Version Action Test",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/UploadNewVersionAction", "Upload New Version Action Test").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check folder": function() {
         return browser.findByCssSelector("#LIST tr:nth-child(1) .dijitMenuItemLabel > span:first-child")
            .click()
         .end()
         .then(function() {
            return checkAction(browser, 1, 0, "Upload new version action shouldn't be rendered for a folder");
         });
      },

      "Check basic node": function() {
         return browser.findByCssSelector("#LIST tr:nth-child(2) .dijitMenuItemLabel > span:first-child")
            .click()
         .end()
         .then(function() {
            return checkAction(browser, 2, 1, "Upload new version action should be rendered for a basic node");
         });
      },

      "Check working copy owner by user": function() {
         return browser.findByCssSelector("#LIST tr:nth-child(3) .dijitMenuItemLabel > span:first-child")
            .click()
         .end()
         .then(function() {
            return checkAction(browser, 3, 1, "Upload new version action should be rendered for working copy owned by the current user");
         });
      },

      "Check working copy owner by another user": function() {
         return browser.findByCssSelector("#LIST tr:nth-child(4) .dijitMenuItemLabel > span:first-child")
            .click()
         .end()
         .then(function() {
            return checkAction(browser, 4, 0, "Upload new version action should not be rendered for a working copy owned by a different user");
         });
      },

      "Check node locked by user": function() {
         return browser.findByCssSelector("#LIST tr:nth-child(5) .dijitMenuItemLabel > span:first-child")
            .click()
         .end()
         .then(function() {
            return checkAction(browser, 5, 1, "Upload new version action should be rendered for a node locked by the current user");
         });
      },

      "Check node locked by another user": function() {
         return browser.findByCssSelector("#LIST tr:nth-child(6) .dijitMenuItemLabel > span:first-child")
            .click()
         .end()
         .then(function() {
            return checkAction(browser, 6, 0, "Upload new version action should not be rendered for a node locked by a different user");
         });
      },

      "Check node with node lock": function() {
         return browser.findByCssSelector("#LIST tr:nth-child(7) .dijitMenuItemLabel > span:first-child")
            .click()
         .end()
         .then(function() {
            return checkAction(browser, 7, 0, "Upload new version action should not be rendered for a node with lock type NODE_LOCK");
         });
      },

      "Check node without Write permission": function() {
         return browser.findByCssSelector("#LIST tr:nth-child(8) .dijitMenuItemLabel > span:first-child")
            .click()
         .end()
         .then(function() {
            return checkAction(browser, 8, 0, "Upload new version action should not be rendered for a node without user write permissions");
         });
      },

      "Upload a new verion": function() {
         return browser.findByCssSelector("#LIST tr:nth-child(2) .dijitMenuItemLabel > span:first-child")
            .click()
         .end()
         .then(function() {
            return useAction(browser, 2);
         })
         .end()
         // Give the dialog a chance to appear...
         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed")
         .end()
         // Check this is an update (rather than just upload) dialog...
         .findAllByCssSelector(".alfresco-dialog-AlfDialog .alfresco-forms-controls-RadioButtons")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Version increment options should be displayed");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});