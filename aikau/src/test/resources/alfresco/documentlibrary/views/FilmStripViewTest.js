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
        "intern/chai!assert",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, expect, require, TestCommon) {

   var browser;
   var pause = 1500;

   // Setup some selectors for re-use...
   var previewCarouselSelector = "#FILMSTRIP_VIEW > div.preview";
   var thumbnailsCarouselSelector = "#FILMSTRIP_VIEW > div.items";

   var previewControlsSelector = previewCarouselSelector + " .controls";
   var prevPreviewControlSelector = previewControlsSelector + " > div.prev > img";
   var nextPreviewControlSelector = previewControlsSelector + " > div.next > img";
   var previewFrameSelector = previewCarouselSelector + " .frame > ol";
   var previewFrameItemsSelector = previewFrameSelector + " > li";

   var previewImgSelectorSuffix = " > div:nth-child(2) span > img";
   // var thumbnailImgSelectorSuffix = " > div:nth-child(1) img";

   var thumbnailControlsSelector = thumbnailsCarouselSelector + " .controls";
   var prevThumbnailControlSelector = thumbnailControlsSelector + " > div.prev > img";
   var nextThumbnailControlSelector = thumbnailControlsSelector + " > div.next > img";
   // var thumbnailFrameSelector = thumbnailsCarouselSelector + " .frame > ol";
   // var thumbnailFrameItemsSelector = thumbnailFrameSelector + " > li";

         
   registerSuite({
      name: "FilmStrip Setup Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FilmStripView", "FilmStrip Setup Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
     
      "Test Previous Preview control is hidden": function () {
         return browser.findByCssSelector(prevPreviewControlSelector)
            .isVisible()
            .then(function(result) {
               assert(result === false, "The previous preview control should not be displayed");
            });
      },

      "Test Next Preview control is displayed": function () {
         return this.remote.findByCssSelector(nextPreviewControlSelector)
            .isVisible()
            .then(function(result) {
               assert(result === true, "The previous preview control should have been displayed");
            });
      },

      "Test Previous Thumbnails Control is not displayed": function () {
         return this.remote.findByCssSelector(prevThumbnailControlSelector)
            .isVisible()
            .then(function(result) {
               assert(result === false, "The previous thumbnails control should not be displayed");
            });
      },

      "Test Next Thumbnails Control is displayed": function () {
         return this.remote.findByCssSelector(nextThumbnailControlSelector)
            .isVisible()
            .then(function(result) {
               assert(result === false, "The next thumbnails control should not be displayed");
            });
      },

      "Test Preview Item Count": function () {
         return this.remote.findAllByCssSelector(previewFrameItemsSelector)
            .then(function(elements) {
               assert(elements.length === 2, "Expected 2 preview items, found: " + elements.length);
            });
      },

      "Test First Preview is displayed": function () {
         return this.remote.findByCssSelector(previewFrameItemsSelector + ":nth-child(1)")
            .isVisible()
            .then(function(result) {
               assert(result === true, "The first preview item should be displayed");
            });
      },

      "Test Second Preview is hidden": function () {
         return this.remote.findByCssSelector(previewFrameItemsSelector + ":nth-child(2)")
            .isVisible()
            .then(function(result) {
               assert(result === false, "The second preview item should be hidden");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   // NOTE: This suite relies on the previous suite having run first so that the test browser is displaying
   //       the correct page...
   registerSuite({
      name: "FilmStrip Navigation Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FilmStripView", "FilmStrip Navigation Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
      "Test Next Preview Control": function () {
         // Click on the next preview item to scroll along...
         return browser.findByCssSelector(nextPreviewControlSelector)
            .click()
         .end()

         .sleep(pause) // Wait for just over a second for the animation to complete...

            // Check the first preview is now hidden and the second is visible...
            // NOTE: Not easy to test that the first preview is off the screen at the moment (the widget may
            //       need updating to support the test!)
            // .findByCssSelector(previewFrameItemsSelector + ":nth-child(1)")
            //    .isVisible()
            //    .then(function(result) {
            //       assert(result === false, "Test #3a - The first preview should now be hidden");
            //    })
            //    .end()

         .findByCssSelector(previewFrameItemsSelector + ":nth-child(2)")
            .isVisible()
            .then(function(result) {
               assert(result === true, "The second preview item should now be displayed");
            });
      },

      "Test Previous Preview Control displayed after Next Preview": function () {
         return this.remote.findByCssSelector(prevPreviewControlSelector)
            .isVisible()
            .then(function(result) {
               assert(result === true, "The previous button is not displayed after clicking next preview control");
            })
            .click()
            .sleep(pause); // Wait for just over a second for the animation to complete...
      },

      "Test Preview Control is hidden when used on second preview": function () {
         return this.remote.findByCssSelector(prevPreviewControlSelector)
            .isVisible()
            .then(function(result) {
               assert(result === false, "The previous button was not hidden after clicking it (to show first preview)");
            });
      },

      "Test Preview Navigation Click": function () {
         return this.remote.findByCssSelector(previewFrameItemsSelector + ":nth-child(1)" + previewImgSelectorSuffix)
            .click()
         .end()
         .sleep(pause) // Wait for folder items to load...

         // TODO: A better test would be to check the publication request?
         // Count the number of preview items...
         .findAllByCssSelector(previewFrameItemsSelector)
            .then(function(elements) {
               assert(elements.length === 14, "Expected 14 preview items, found: " + elements.length);
            });
      },

      "Test Thumbnail Scrolls With Preview": function () {
          // Click the next preview selector 4 times (to check that the thumbnail frame scrolls)...
         return browser.findByCssSelector(nextPreviewControlSelector)
            .click()
            .sleep(pause)
            .click()
            .sleep(pause)
            .click()
            .sleep(pause)
            .click()
            .sleep(pause)
         .end()
         .findByCssSelector(prevThumbnailControlSelector)
            .isVisible()
            .then(function(visible) {
               assert(visible === true, "The previous thumbnail selection should be visible");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }

      
      // TODO: Test needs completing
      // ,
      // "Test Preview Scrolls With Thumbnail Selection": function () {
      //    // Wait for the data to load and the page to draw - this is currently slow and the rendering needs to be
      //    // Move to the 3rd selection of thumbnails...
      //    return this.remote.findByCssSelector(nextThumbnailControlSelector)
      //       .click()
      //       .sleep(pause)
      //    .end()

      //    // TODO: Check that 3rd frame of thumbnails is displayed...
      //    .findByCssSelector(thumbnailFrameItemsSelector + ":nth-child(10)" + thumbnailImgSelectorSuffix)
      //       .click()
      //       .sleep(pause)
      //    .end()

      //    .sleep(pause)
      //    // TODO: Check that 10th preview is displayed...

      //    .alfPostCoverageResults(browser);
      // }
   });
});