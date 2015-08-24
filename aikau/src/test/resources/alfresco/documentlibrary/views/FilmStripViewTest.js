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
 * @author Martin Doyle
 */
define([
      "alfresco/TestCommon",
      "intern!object",
      "intern/chai!assert"
   ],
   function(TestCommon, registerSuite, assert) {

      // Setup cross-test variables
      var PREVIEW_CAROUSEL = "preview",
         ITEMS_CAROUSEL = "items",
         browser;

      // Define helper function to check visibility
      function carouselItemIsDisplayed(itemNum, carouselType, returnDebugInfo) {
         var carouselId = (carouselType === PREVIEW_CAROUSEL) ? "#FILMSTRIP_VIEW_PREVIEWS" : "#FILMSTRIP_VIEW_ITEMS";
         return browser.execute(function(itemsSelector, containerSelector, num, debugInfo) {
            var items = document.querySelector(itemsSelector),
               container = document.querySelector(containerSelector),
               firstItem = container.firstElementChild,
               itemWidth = firstItem.offsetWidth,
               itemStartPos = (num - 1) * itemWidth,
               itemsWidth = parseInt(getComputedStyle(items).width, 10),
               containerLeft = Math.abs(parseInt(container.style.left, 10)),
               itemVisibleWidth = Math.min(containerLeft + itemsWidth, itemStartPos + itemWidth) - Math.max(containerLeft, itemStartPos);
            if (debugInfo) {
               return JSON.stringify({
                  containerLeft: containerLeft,
                  itemsWidth: itemsWidth,
                  itemStartPos: itemStartPos,
                  itemWidth: itemWidth,
                  itemVisibleWidth: itemVisibleWidth
               });
            } else {
               return itemVisibleWidth === itemWidth;
            }
         }, [carouselId + " .items", carouselId + " ol", itemNum, returnDebugInfo]);
      }

      registerSuite({
         name: "FilmStripView Tests",

         setup: function() {
            browser = this.remote;
            browser.session.carouselItemIsDisplayed = carouselItemIsDisplayed;
            return TestCommon.loadTestWebScript(this.remote, "/FilmStripView", "FilmStripView Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check initial controls state": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "Previous preview control should not be displayed");
               })
               .end()

            .findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .next")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Next preview control should be displayed");
               })
               .end()

            .findByCssSelector("#FILMSTRIP_VIEW_ITEMS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "Previous items control should not be displayed");
               })
               .end()

            .findByCssSelector("#FILMSTRIP_VIEW_ITEMS .next")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Next items control should be displayed");
               });
         },

         "Previews generated and correct preview displayed": function() {
            return this.remote.findAllByCssSelector("#FILMSTRIP_VIEW_PREVIEWS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 5, "Incorrect number of preview items");
               })
               .end()

            .carouselItemIsDisplayed(1, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first preview item should be displayed");
               })

            .carouselItemIsDisplayed(2, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The second preview item should not be displayed");
               });
         },

         "Items generated and correct items displayed": function() {
            return this.remote.findAllByCssSelector("#FILMSTRIP_VIEW_ITEMS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 5, "Incorrect number of items");
               })
               .end()

            .carouselItemIsDisplayed(1, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first item should be displayed");
               })

            .carouselItemIsDisplayed(3, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The third item should be displayed");
               })

            .carouselItemIsDisplayed(4, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The fourth item should not be displayed");
               });
         },

         "Can select next preview": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .next img")
               .clearLog()
               .click()
               .end()

            .getLastPublish("ALF_FILMSTRIP_ITEM_CHANGED")
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 1, "Did not select second preview item");
               })

            .carouselItemIsDisplayed(1, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The first preview item should not be displayed");
               })

            .carouselItemIsDisplayed(2, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The second preview item should be displayed");
               })

            .carouselItemIsDisplayed(3, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The third preview item should not be displayed");
               });
         },

         "Can select previous preview": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .prev img")
               .clearLog()
               .click()
               .end()

            .getLastPublish("ALF_FILMSTRIP_ITEM_CHANGED")
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 0, "Did not select first preview item");
               })

            .carouselItemIsDisplayed(1, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first preview item should be displayed");
               })

            .carouselItemIsDisplayed(2, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The second preview item should not be displayed");
               })

            .findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "Previous preview control should not be displayed");
               });
         },

         "Selecting next page of items loads more data and displays second page": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS .next img")
               .clearLog()
               .click()
               .end()

            .getLastPublish("ALF_SCROLL_NEAR_BOTTOM", "Did not fire near-end event")

            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Did not load more documents")

            .findAllByCssSelector("#FILMSTRIP_VIEW_ITEMS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 10, "Did not load another page of five items");
               })
               .end()

            .carouselItemIsDisplayed(3, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The third item should not be displayed");
               })

            .carouselItemIsDisplayed(4, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The fourth item should be displayed");
               })

            .carouselItemIsDisplayed(6, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The sixth item should be displayed");
               })

            .carouselItemIsDisplayed(7, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The seventh item should not be displayed");
               })

            .findByCssSelector("#FILMSTRIP_VIEW_ITEMS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Second page of items should enable previous control");
               });
         },

         "Navigating to next preview loads first page of items": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .next img")
               .clearLog()
               .click()
               .end()

            .getLastPublish("ALF_FILMSTRIP_ITEM_CHANGED")
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 1, "Did not select second preview item");
               })

            .carouselItemIsDisplayed(2, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The second preview item should be displayed");
               })

            .carouselItemIsDisplayed(1, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first item should be displayed");
               })

            .carouselItemIsDisplayed(3, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The third item should be displayed");
               })

            .carouselItemIsDisplayed(4, ITEMS_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The fourth item should not be displayed");
               })

            .findByCssSelector("#FILMSTRIP_VIEW_ITEMS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "First page of items should disable previous control");
               });
         },

         "Clicking on thumbnail updates preview": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(3) .alfresco-renderers-Thumbnail")
               .clearLog()
               .click()
               .end()

            .getLastPublish("ALF_FILMSTRIP_SELECT_ITEM")
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 2, "Did not select third item from thumbnails list");
               })

            .carouselItemIsDisplayed(3, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The third preview item should be displayed");
               })
         },

         "Navigating to fourth page loads more items on first occasion only": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS .next img")
               .clearLog()
               .click()
               .click()
               .click()
               .end()

            .getLastPublish("ALF_SCROLL_NEAR_BOTTOM", "Did not fire near-end event")

            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Did not load more documents")

            .findAllByCssSelector("#FILMSTRIP_VIEW_ITEMS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 11, "Did not load final item");
               })
               .end()

            .findByCssSelector("#FILMSTRIP_VIEW_ITEMS .prev img")
               .clearLog()
               .click()
               .end()

            .findByCssSelector("#FILMSTRIP_VIEW_ITEMS .next img")
               .click()
               .end()

            .getAllPublishes("ALF_SCROLL_NEAR_BOTTOM")
               .then(function(payloads) {
                  assert.lengthOf(payloads, 0, "Fired scroll event unnecessarily");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   });