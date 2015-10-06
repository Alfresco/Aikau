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
        function(registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "NavigationService Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/NavigationService", "NavigationService Tests")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Set a hash": function() {
         return browser.findByCssSelector("#SET_HASH_label")
            .click()
            .execute("return window.location.hash.toString()")
            .then(function(hash) {
               assert.equal(hash, "#hash1=bob&hash2=ted", "Setting a hash didn't work");
            });
      },

      "Post to current page": function() {
         return browser.findAllByCssSelector("#NOTHING_POSTED")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Loaded a page with request parameters");
               })
            .end()
            .getCurrentUrl()
               .then(function(url) {
                  assert.include(url, "page/tp/ws/NavigationService", "Unexpected URL fragment (before POST)");
                  assert.notInclude(url, "page/tp/ws/NavigationService?same=true", "Unexpected URL fragment (before POST)");
               })
            .findByCssSelector("#POST_TO_CURRENT_PAGE_label")
               .click()
            .end()
            .sleep(1000)
            .findAllByCssSelector("#POSTED")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Navigation POST didn't occur");
               })
            .end()
            .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "page/tp/ws/NavigationService?same=true", "Unexpected URL fragment (after POST)");
            });
      },

      "Back to original page": function() {
         // Clear the current browser log...
         return browser.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
            .click()
         .end()
         .findByCssSelector("#BACK_TO_ORIGINAL_URL_label")
            .click()
         .end()
         .sleep(1000)
         // Wait for page load
         .getLastPublish("ALF_WIDGET_PROCESSING_COMPLETE")
         .findAllByCssSelector("#NOTHING_POSTED")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Original URL not reloaded");
            })
         .end();
      },

      "Post to new page": function() {
         // Clear the current browser log...
         return browser.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
            .click()
         .end()
         .getCurrentUrl()
         .then(function(url) {
            assert.notInclude(url, "page/tp/ws/NavigationService?same=true", "Not on the expected page (before POST to new page");
         })
         .findByCssSelector("#POST_TO_NEW_PAGE_label")
            .click()
         .end()
         .sleep(1000) // Wait for the page to open
         .getAllWindowHandles()
         .then(function(handles) {
            assert.lengthOf(handles, 2, "A new page wasn't opened");
            return browser.switchToWindow(handles[1])
               .getCurrentUrl()
               .then(function(url) {
                  // UNCOMMENT THIS FOR DEBUGGING
                  // console.log("Current URL: " + url);
                  assert.include(url, "page/tp/ws/NavigationService?new=true", "Not on new page (after POST to new page");
               })
               .findAllByCssSelector("#POSTED")
                  .then(function(elements) {
                     // UNCOMMENT THIS FOR DEBUGGING
                     // console.log("Counting posted");
                     assert.lengthOf(elements, 1, "Navigation POST didn't occur");
                  })
               .end();
         });
      },

      "Post to new page using params": function() {
         // Clear the current browser log...
         return browser.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
            .click()
            .end()
            .getCurrentUrl()
            .then(function (url) {
               assert.notInclude(url, "page/tp/ws/NavigationService?bar=scndqryprm&foo=qryprm#baz=hshprm", "Not on the expected page (before nav to new page");
            })
            .findByCssSelector("#NAV_TO_PAGE_WITH_PARAMS_label")
            .click()
            .end()
            .sleep(1000) // Wait for the page to open
            .getCurrentUrl()
            .then(function (url) {
               assert.include(url, "page/tp/ws/NavigationService?bar=scndqryprm&foo=qryprm#baz=hshprm", "Not on new page (after nav to new page");
            })
            .end();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});