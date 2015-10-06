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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "Twister Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Twister", "Twister Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check the first twister gets H3 element": function () {
         return browser.findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text,"Twister with heading level", "The 1st twister did not render an H3 element");
            });
      },

      "Check the second twister renders without header element": function () {
         return browser.findByCssSelector("#TWISTER_NO_HEADING_LEVEL > div.label")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text,"Twister with no heading level", "The 2n twister label was rendered incorrectly");
            });
      },

      "Check that invalid heading level 'a' does not render invalid element": function () {
         return browser.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL > div.label")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text,"Twister with faulty heading level 'a'", "The 3rd twister did not render correctly");
            });
      },

      "Check that invalid heading level '0' does not render invalid element": function () {
         return browser.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL_TWO > div.label")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text,"Twister with heading level 0", "The 4th twister did not render correctly");
            });
      },

      "Check that invalid heading level '7' does not render invalid element": function () {
         return browser.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL_THREE > div.label")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text,"Twister with heading level 7", "The 5th twister did not render correctly");
            });
      },

      "Check that null label twister is not displayed": function () {
         return browser.findByCssSelector("#TWISTER_NULL_LABEL")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Twister with null label was unexpectedly displayed");
            });
      },

      "Check that empty string label twister is not displayed": function () {
         return browser.findByCssSelector("#TWISTER_EMPTY_LABEL")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Twister with empty string label was unexpectedly displayed");
            });
      },

      "Check that first twister is open": function() {
         return browser.findAllByCssSelector("#TWISTER_HEADING_LEVEL .alfresco-layout-Twister--open")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Twister configured to be open, was closed");
            })
         .end()
         .findByCssSelector("#TWISTER_HEADING_LEVEL .content")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Twister configured to be open is NOT displaying its contents");
            });
      },

      "Check that second twister is closed": function() {
         return browser.findAllByCssSelector("#TWISTER_NO_HEADING_LEVEL .alfresco-layout-Twister--closed")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Twister configured to be closed, was open");
            })
         .end()
         .findByCssSelector("#TWISTER_NO_HEADING_LEVEL .content")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Twister configured to be closed is displaying its contents");
            });
      },

      "Check that third twister is open (using preferences)": function() {
         return browser.findAllByCssSelector("#TWISTER_BAD_HEADING_LEVEL .alfresco-layout-Twister--open")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Twister preferred to be open, was closed");
            })
         .end()
         .findByCssSelector("#TWISTER_BAD_HEADING_LEVEL .content")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Twister preferred to be open is NOT displaying its contents");
            });
      },

      "Check that fourth twister is closed (using preferences)": function() {
         return browser.findAllByCssSelector("#TWISTER_BAD_HEADING_LEVEL_TWO .alfresco-layout-Twister--closed")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Twister preferred to be closed, was open");
            })
         .end()
         .findByCssSelector("#TWISTER_BAD_HEADING_LEVEL_TWO .content")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Twister preferred to be closed is displaying its contents");
            });
      },

      "Check the first twister title is still visible": function () {
         return browser.findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .click()
         .end()

         // Title should still be visible
         .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text,"Twister with heading level", "The first twister title is not visible");
            });
      },

      "Check that logo in the first twister is hidden when the twister is clicked": function() {
         return browser.findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "The logo was unexpectedly shown");
            });
      },
      
      "Check the first twister title is still visible (2)": function() {
         return browser.findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .click()
         .end()

         // Title should still be visible
         .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text,"Twister with heading level", "The first twister title is not visible");
            });
      },
      
      "Check that logo in the first twister is hidden when the twister is clicked (2)": function() {
         return browser.findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "The logo was unexpectedly hidden");
            });
      },

      "Check that closing a twister updates its preferences": function() {
         return browser.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL > div.label")
            .click()
         .end()

         .findByCssSelector("tr.mx-row:nth-child(1) td.mx-payload")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "{\"org\":{\"alfresco\":{\"share\":{\"twisters\":{\"twister1\":false}}}}}", "Preference not saved on close");
            });
      },

      "Check that opending a twister updates its preferences": function() {
         return browser.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL > div.label")
            .click()
         .end()

         .findByCssSelector("tr.mx-row:nth-child(2) td.mx-payload")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "{\"org\":{\"alfresco\":{\"share\":{\"twisters\":{\"twister1\":true}}}}}", "Preference not saved on open");
            });
      },

      // NOTE: Called because the next test does a refresh...
      "Post Coverage Results Before Page Refresh": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      },

      "Check the first twister title is visible after keyboard [RETURN]": function () {
         return browser.refresh()

            // Focus the title of twister 1
            .pressKeys(keys.TAB)
            
            // 'Click' the title with the return key
            .pressKeys(keys.RETURN)

            // Title should still be visible
            .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
               .getVisibleText()
               .then(function (text) {
                  assert.equal(text,"Twister with heading level", "The first twister title is not visible after keyboard [RETURN]");
               });
         },

         "Check that logo in the first twister is hidden after keyboard [RETURN]": function() {
            // Content should be hidden
            return browser.findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
               .isDisplayed()
               .then(function(result) {
                  assert.isFalse(result, "The logo was unexpectedly shown");
               });
         },

         "Check the first twister title is visible after re-pressing keyboard [RETURN]": function() {
            return browser.pressKeys(keys.RETURN)

            // Title should still be visible
            .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
               .getVisibleText()
               .then(function (text) {
                  assert.equal(text,"Twister with heading level", "The first twister title is not visible after re-pressing keyboard [RETURN]");
               });
         },

         "Check that logo in the first twister is displayed after re-pressing keyboard [RETURN]": function() {
            return browser.findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "The logo was unexpectedly hidden");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});