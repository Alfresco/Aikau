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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the 
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 * 
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["alfresco/TestCommon",
        "intern!object",
        "intern/chai!assert"],
       function(TestCommon, registerSuite, assert) {

   // Setup cross-test variables
   var PREVIEW_CAROUSEL = "preview",
      ITEMS_CAROUSEL = "items";

   // Define helper function to check visibility
   function carouselItemIsDisplayed(browser, itemNum, carouselType, idPrefix, returnDebugInfo) {
      /* global document, getComputedStyle */
      var elemPrefix = "#" + (idPrefix || "") + "FILMSTRIP_VIEW_",
         carouselId = elemPrefix + (carouselType === PREVIEW_CAROUSEL ? "PREVIEWS" : "ITEMS");
      return browser.execute(function(carouselSelector, num, debugInfo) {
         var items = document.querySelector(carouselSelector + " .items"),
            container = document.querySelector(carouselSelector + " ol"),
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
      }, [carouselId, itemNum, returnDebugInfo]);
   }

   registerSuite(function() {
      var browser;

      return {
         name: "FilmStripView Tests (Infinite scrolling)",

         setup: function() {
            browser = this.remote;
            browser.session.carouselItemIsDisplayed = carouselItemIsDisplayed;
            return TestCommon.loadTestWebScript(this.remote, "/FilmStripView", "FilmStripView Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check configured height": function() {
            return browser.findById("FILMSTRIP_VIEW")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 400, "Height was not applied to view");
               })
            .end()

            // Give the rest of the page a chance to finish loading...
            .getLastPublish("PAGED_ALF_DOCLIST_REQUEST_FINISHED");
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

            .carouselItemIsDisplayed(browser, 1, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first preview item should be displayed");
               })

            .carouselItemIsDisplayed(browser, 2, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The second preview item should not be displayed");
               });
         },

         "Items generated and correct items displayed": function() {
            return this.remote.findAllByCssSelector("#FILMSTRIP_VIEW_ITEMS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 5, "Incorrect number of items");
               });
         },

         "First item displayed": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(1)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Fourth item displayed": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(4)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Fifth item NOT displayed": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(5)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed);
               });
         },

         "Can select next preview": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .next img")
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_FILMSTRIP_ITEM_CHANGED", true)
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 1, "Did not select second preview item");
               })

            .carouselItemIsDisplayed(browser, 1, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The first preview item should not be displayed");
               })

            .carouselItemIsDisplayed(browser, 2, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The second preview item should be displayed");
               })

            .carouselItemIsDisplayed(browser, 3, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The third preview item should not be displayed");
               });
         },

         "Custom arrow images are used": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .next .alfresco-html-Image__img")
               .getAttribute("src")
               .then(function(src) {
                  assert.equal(src, "/aikau/images/right-cursor-25x25.png");
               })
               .end()

            .findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .prev .alfresco-html-Image__img")
               .getAttribute("src")
               .then(function(src) {
                  assert.equal(src, "/aikau/images/left-cursor-25x25.png");
               });
         },

         "Can select previous preview": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .prev img")
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_FILMSTRIP_ITEM_CHANGED", true)
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 0, "Did not select first preview item");
               })

            .carouselItemIsDisplayed(browser, 1, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first preview item should be displayed");
               })

            .carouselItemIsDisplayed(browser, 2, PREVIEW_CAROUSEL)
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

            .getLastPublish("ALF_SCROLL_NEAR_BOTTOM", "Did not fire near-end event", true)

            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Did not load more documents", true)

            .findAllByCssSelector("#FILMSTRIP_VIEW_ITEMS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 10, "Did not load another page of five items");
               });
         },

         "Third item now hidden": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(3)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed);
               });
         },

         "Fifth item displayed": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(5)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Eighth item displayed": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(8)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Ninth item hidden": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(9)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed);
               });
         },

         "Previous button now displayed": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed);
               });
         },

         "Navigating to next preview loads first page of items": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .next img")
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_FILMSTRIP_ITEM_CHANGED", true)
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 1, "Did not select second preview item");
               });
         },

         "First item is now displayed": function() {
            return browser.findDisplayedByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(1)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Sixth item now hidden": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(6)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed);
               });
         },

         "Previous button hidden again": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed);
               });
         },

         "Clicking on thumbnail updates preview": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_ITEMS li:nth-child(3) .alfresco-renderers-Thumbnail")
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_FILMSTRIP_SELECT_ITEM", true)
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 2, "Did not select third item from thumbnails list");
               })

            .carouselItemIsDisplayed(browser, 3, PREVIEW_CAROUSEL)
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The third preview item should be displayed");
               });
         },

         "Navigating to fourth page loads more items on first occasion only": function() {
            return browser.findDisplayedByCssSelector("#FILMSTRIP_VIEW_ITEMS .next img")
               .clearLog()
               .click()
               .click()
               // .click()
            .end()

            .getLastPublish("ALF_SCROLL_NEAR_BOTTOM", "Did not fire near-end event", true)

            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Did not load more documents", true)

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

         "Clicking folder updates hash": function() {
            // Not yet implemented
            // Waiting for problems with layout/resizing/reloading of FilmStripView to be resolved
         },

         "New folder contents loaded": function() {
            // Not yet implemented
            // Waiting for problems with layout/resizing/reloading of FilmStripView to be resolved
         },

         "Going back in browser history returns to previous folder": function() {
            // Not yet implemented
            // Waiting for problems with layout/resizing/reloading of FilmStripView to be resolved
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   // ------------
   // END OF SUITE
   // ------------


   // --------------
   // START OF SUITE
   // --------------

   registerSuite(function() {
      var browser;

      return {
         name: "FilmStripView Tests (Paginated)",

         setup: function() {
            browser = this.remote;
            browser.session.carouselItemIsDisplayed = carouselItemIsDisplayed;
            return TestCommon.loadTestWebScript(this.remote, "/FilmStripView", "FilmStripView Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check initial controls state": function() {
            return browser.findByCssSelector("body").end()

            // Give the page a chance to finish initialising...
            .getLastPublish("PAGED_ALF_DOCLIST_REQUEST_FINISHED")

            .findByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "Previous preview control should not be displayed");
               })
               .end()

            .findByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS .next")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Next preview control should be displayed");
               })
               .end()

            .findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "Previous items control should not be displayed");
               })
               .end()

            .findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS .next")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Next items control should be displayed");
               });
         },

         "Previews generated and correct preview displayed": function() {
            return this.remote.findAllByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 5, "Incorrect number of preview items");
               })
               .end()

            .carouselItemIsDisplayed(browser, 1, PREVIEW_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first preview item should be displayed");
               })

            .carouselItemIsDisplayed(browser, 2, PREVIEW_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The second preview item should not be displayed");
               });
         },

         "Items generated and correct items displayed": function() {
            return this.remote.findAllByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 5, "Incorrect number of items");
               });
         },

         "First item displayed": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(1)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Fourth item displayed": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(4)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Fifth item NOT displayed": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(5)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed);
               });
         },

         "Custom next arrow image is used": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS .next .alfresco-html-Image__img")
               .getAttribute("src")
               .then(function(src) {
                  assert.equal(src, "/aikau/images/right-cursor-25x25.png");
               });
         },

         "Can select next preview": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS .next img")
               .clearLog()
               .click()
            .end()

            .getLastPublish("PAGED_ALF_FILMSTRIP_ITEM_CHANGED", true)
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 1, "Did not select second preview item");
               })

            .carouselItemIsDisplayed(browser, 1, PREVIEW_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The first preview item should not be displayed");
               })

            .carouselItemIsDisplayed(browser, 2, PREVIEW_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The second preview item should be displayed");
               })

            .carouselItemIsDisplayed(browser, 3, PREVIEW_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The third preview item should not be displayed");
               });
         },

         "Custom previous arrow image is used": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS .prev .alfresco-html-Image__img")
               .getAttribute("src")
               .then(function(src) {
                  assert.equal(src, "/aikau/images/left-cursor-25x25.png");
               });
         },

         "Can select previous preview": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS .prev img")
               .clearLog()
               .click()
               .end()

            .getLastPublish("PAGED_ALF_FILMSTRIP_ITEM_CHANGED", true)
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 0, "Did not select first preview item");
               })

            .carouselItemIsDisplayed(browser, 1, PREVIEW_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first preview item should be displayed");
               })

            .carouselItemIsDisplayed(browser, 2, PREVIEW_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The second preview item should not be displayed");
               })

            .findByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "Previous preview control should not be displayed");
               });
         },

         "Selecting next page of items displays second page of Page 1 of results": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS .next img")
               .clearLog()
               .click()
               .end()

            .getAllPublishes("ALF_SCROLL_NEAR_BOTTOM")
               .then(function(payloads) {
                  assert.lengthOf(payloads, 0, "Fired scroll event incorrectly");
               })

            .findAllByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 5, "Loaded more items");
               });
         },

         "Third item NOT displayed": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(3)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed);
               });
         },

         "Fourth item now displayed": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(4)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Fifth item now displayed": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(5)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Previous control displayed": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Second page of items should enable previous control");
               });
         },

         "Navigating to next preview loads first page of items": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS .next img")
               .clearLog()
               .click()
            .end()

            .getLastPublish("PAGED_ALF_FILMSTRIP_ITEM_CHANGED", true)
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 1, "Did not select second preview item");
               });
         },

         "Second preview item should be displayed": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS li:nth-child(2)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
            
         },

         "First item now displayed": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(1)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Fourth item displayed again": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(4)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Fifth item NOT displayed again": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(5)")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed);
               });
         },

         "Previous control is now hidden": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS .prev")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "First page of items should disable previous control");
               });
         },

         "Clicking on thumbnail updates preview": function() {
            return browser.findByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li:nth-child(3) .alfresco-renderers-Thumbnail")
               .clearLog()
               .click()
               .end()

            .getLastPublish("PAGED_ALF_FILMSTRIP_SELECT_ITEM", true)
               .then(function(payload) {
                  assert.propertyVal(payload, "index", 2, "Did not select third item from thumbnails list");
               })

            .carouselItemIsDisplayed(browser, 3, PREVIEW_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The third preview item should be displayed");
               });
         },

         "Navigating to Page 3 of results renders only one item": function() {
            return browser.findByCssSelector("#PAGED_PAGINATOR_PAGE_SELECTOR")
               .click()
            .end()

            .findByCssSelector("#PAGED_PAGINATOR_PAGE_SELECTOR_dropdown .alfresco-menus-AlfMenuItem:last-child")
               .click()
               .end()

            .getLastPublish("PAGED_ALF_DOCLIST_REQUEST_FINISHED", true, "Did not load final page of results")

            .findAllByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Incorrect number of preview items");
               })
               .end()

            .carouselItemIsDisplayed(browser, 1, PREVIEW_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first preview item should be displayed");
               })

            .findAllByCssSelector("#PAGED_FILMSTRIP_VIEW_ITEMS li")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Incorrect number of items");
               })
               .end()

            .carouselItemIsDisplayed(browser, 1, ITEMS_CAROUSEL, "PAGED_")
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The first item should be displayed");
               });
         },

      "Clicking folder loads new folder": function() {
         return browser.findByCssSelector("body").clearLog().end()
            
         .findByCssSelector("#PAGED_PAGINATOR_PAGE_SELECTOR")
            .click()
         .end()

         .findByCssSelector("#PAGED_PAGINATOR_PAGE_SELECTOR_dropdown .alfresco-menus-AlfMenuItem:first-child")
            .click()
         .end()

         .getLastPublish("PAGED_ALF_DOCLIST_REQUEST_FINISHED", true, "Did not load first page of results")

         .clearLog()

         .findByCssSelector("#PAGED_FILMSTRIP_VIEW_PREVIEWS li:first-child .alfresco-renderers-Thumbnail .alfresco-renderers-Thumbnail__image")
            .click()
         .end()

         .getLastPublish("PAGED_ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS", "Did not load data");
      },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});
