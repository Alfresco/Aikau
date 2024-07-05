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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   defineSuite(module, {
      name: "Twister Tests",
      testPage: "/Twister",

      "Check the first twister gets H3 element": function() {
         return this.remote.findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Twister with heading level", "The 1st twister did not render an H3 element");
            });
      },

      "Check the second twister renders without header element": function() {
         return this.remote.findByCssSelector("#TWISTER_NO_HEADING_LEVEL > div.label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Twister with no heading level", "The 2nd twister label was rendered incorrectly");
            });
      },

      "Check that invalid heading level 'a' does not render invalid element": function() {
         return this.remote.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL > div.label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Twister with faulty heading level 'a'", "The 3rd twister did not render correctly");
            });
      },

      "Check that invalid heading level '0' does not render invalid element": function() {
         return this.remote.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL_TWO > div.label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Twister with heading level 0", "The 4th twister did not render correctly");
            });
      },

      "Check that invalid heading level '7' does not render invalid element": function() {
         return this.remote.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL_THREE > div.label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Twister with heading level 7", "The 5th twister did not render correctly");
            });
      },

      "Check that null label twister is not displayed": function() {
         return this.remote.findByCssSelector("#TWISTER_NULL_LABEL")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Twister with null label was unexpectedly displayed");
            });
      },

      "Check that empty string label twister is not displayed": function() {
         return this.remote.findByCssSelector("#TWISTER_EMPTY_LABEL")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Twister with empty string label was unexpectedly displayed");
            });
      },

      "Check that first twister is open": function() {
         return this.remote.findAllByCssSelector("#TWISTER_HEADING_LEVEL .alfresco-layout-Twister--open")
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
         return this.remote.findAllByCssSelector("#TWISTER_NO_HEADING_LEVEL .alfresco-layout-Twister--closed")
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
         return this.remote.findAllByCssSelector("#TWISTER_BAD_HEADING_LEVEL .alfresco-layout-Twister--open")
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
         return this.remote.findAllByCssSelector("#TWISTER_BAD_HEADING_LEVEL_TWO .alfresco-layout-Twister--closed")
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

      "Check the first twister title is still visible": function() {
         return this.remote.findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .click()
            .end()

         // Title should still be visible
         .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Twister with heading level", "The first twister title is not visible");
            });
      },

      "Check that logo in the first twister is hidden when the twister is clicked": function() {
         return this.remote.findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "The logo was unexpectedly shown");
            });
      },

      "Check the first twister title is still visible (2)": function() {
         return this.remote.findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .click()
            .end()

         // Title should still be visible
         .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Twister with heading level", "The first twister title is not visible");
            });
      },

      "Check that logo in the first twister is hidden when the twister is clicked (2)": function() {
         return this.remote.findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "The logo was unexpectedly hidden");
            });
      },

      "Check that closing a twister updates its preferences": function() {
         return this.remote.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL > div.label")
            .click()
            .end()

         .getLastXhr("aikau/proxy/alfresco/api/people/guest/preferences")
            .then(function(xhr) {
               assert.deepPropertyVal(xhr.request.body, "org.alfresco.share.twisters.twister1", false);
            });
      },

      "Check that opening a twister updates its preferences": function() {
         return this.remote.findByCssSelector("#TWISTER_BAD_HEADING_LEVEL > div.label")
            .click()
            .end()

         .getLastXhr("aikau/proxy/alfresco/api/people/guest/preferences")
            .then(function(xhr) {
               assert.deepPropertyVal(xhr.request.body, "org.alfresco.share.twisters.twister1", true);
            });
      },

      "Check the first twister title is visible after keyboard [RETURN]": function() {
         return this.remote.get(TestCommon.generateWebscriptUrl("/Twister"))

         // Focus the title of twister 1
         .pressKeys(keys.TAB)

         // 'Click' the title with the return key
         .pressKeys(keys.RETURN)

         // Title should still be visible
         .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Twister with heading level", "The first twister title is not visible after keyboard [RETURN]");
            });
      },

      "Check that logo in the first twister is hidden after keyboard [RETURN]": function() {
         // Content should be hidden
         return this.remote.findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "The logo was unexpectedly shown");
            });
      },

      "Check the first twister title is visible after re-pressing keyboard [RETURN]": function() {
         return this.remote.pressKeys(keys.RETURN)

         // Title should still be visible
         .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Twister with heading level", "The first twister title is not visible after re-pressing keyboard [RETURN]");
            });
      },

      "Check that logo in the first twister is displayed after re-pressing keyboard [RETURN]": function() {
         return this.remote.findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "The logo was unexpectedly hidden");
            });
      },

      "Check fixed width": function() {
         return this.remote.findById("FIXED_WIDTH_TWISTER")
            .getSize()
            .then(function(size) {
               assert.equal(size.width, 500, "The fixed width twister was not the correct size");
            });
      },

      "Check dynamic resizing": function() {
         var lastWidth;
         return this.remote.findById("AUTO_WIDTH_TWISTER")
            .getSize()
            .then(function(size) {
               lastWidth = size.width;
            })
            .end()

         .clearLog()

         .findById("HIDE_BUTTON_label")
            .click()
            .end()

         .getLastPublish("ALF_PREFERENCE_SET_SUCCESS")

         .findById("AUTO_WIDTH_TWISTER")
            .getSize()
            .then(function(size) {
               assert.isAbove(size.width, lastWidth, "Twister did not get bigger");
               lastWidth = size.width;
            })
            .end()

         .clearLog()

         .findById("SHOW_BUTTON_label")
            .click()
            .end()

         .getLastPublish("ALF_PREFERENCE_SET_SUCCESS")

         .findById("AUTO_WIDTH_TWISTER")
            .getSize()
            .then(function(size) {
               assert.isBelow(size.width, lastWidth, "Twister did not get smaller");
            });
      },

      // NOTE: During development it was noticed that the sidebar was not publishing
      //       to indicate that the sidebar had resized as well as the main node
      "Check sidebar dynamic resizing": function() {
         var lastWidth;
         return this.remote.findById("TWISTER_HEADING_LEVEL")
            .getSize()
            .then(function(size) {
               lastWidth = size.width;
            })
            .end()

         .clearLog()

         .findById("HIDE_BUTTON_label")
            .click()
            .end()

         .getLastPublish("ALF_PREFERENCE_SET_SUCCESS")

         .findById("TWISTER_HEADING_LEVEL")
            .getSize()
            .then(function(size) {
               assert.isBelow(size.width, lastWidth, "Twister in sidebar did not get bigger");
               lastWidth = size.width;
            });
      }
   });
});