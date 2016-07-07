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
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "NavigationService Tests",
      testPage: "/NavigationService",

      "Set a hash": function() {
         return this.remote.findByCssSelector("#SET_HASH_label")
            .click()
            .execute("return window.location.hash.toString()")
            .then(function(hash) {
               assert.equal(hash, "#hash1=bob&hash2=ted", "Setting a hash didn't work");
            });
      },

      "Modify a hash": function() {
         return this.remote.findByCssSelector("#MODIFY_HASH_label")
            .click()
            .execute("return window.location.hash.toString()")
            .then(function(hash) {
               assert.equal(hash, "#hash1=bob&hash2=ted&hash3=fred%2Fbarney", "Modifying a hash didn't work");
            });
      },

      "Post to current page": function() {
         return this.remote.findAllByCssSelector("#NOTHING_POSTED")
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
         return this.remote.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
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
         return this.remote.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
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
            .then(handles => {
               assert.lengthOf(handles, 2, "A new page wasn't opened");
               return this.remote.switchToWindow(handles[1])
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
         return this.remote.findByCssSelector(".alfresco_logging_DebugLog__clear-button")
            .click()
            .end()
            .getCurrentUrl()
            .then(function(url) {
               assert.notInclude(url, "page/tp/ws/NavigationService?bar=scndqryprm&foo=qryprm#baz=hshprm", "Not on the expected page (before nav to new page");
            })
            .findByCssSelector("#NAV_TO_PAGE_WITH_PARAMS_label")
            .click()
            .end()
            .sleep(1000) // Wait for the page to open
            .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "page/tp/ws/NavigationService?bar=scndqryprm&foo=qryprm#baz=hshprm", "Not on new page (after nav to new page");
            })
            .end();
      },

      // Keep this as last test to avoid having to switch window back!!
      "Navigate to new page in named window": function() {
         return this.remote.findById("NAVIGATE_TO_NAMED_PAGE_label")
            .click()
            .end()

         .switchToWindow("new_window")
            .getCurrentUrl()
            .then(function(currentUrl) {
               assert.include(currentUrl, "page/tp/ws/NavigationService?named=true");
            });
      }
   });

   defineSuite(module, {
      name: "NavigationService Tests (site stemming)",
      testPage: "/NavigationService",

      // See AKU-737 - Full path URLs should ignore any site data (because it's not possible to add a site prefix)
      "Full path with site data": function() {
         return this.remote.findDisplayedById("FULL_PATH_SITE_STRING_text")
            .clearLog()
            .click()
            .end()

         .sleep(1000) // Wait for page load, can't figure out a way around this sleep!

         .getLastPublish("ALF_WIDGETS_READY", "Page loaded")

         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "page/tp/ws/NavigationService", "Loaded URL incorrect");
            });
      },

      // See AKU-737 - A page relative path can make use of a site object...
      "Page relative path with site object": function() {
         return this.remote.findDisplayedById("PAGE_RELATIVE_SITE_OBJECT_text")
            .clearLog()
            .click()
            .end()

         .sleep(1000) // Wait for page load, can't figure out a way around this sleep!

         .getLastPublish("ALF_WIDGETS_READY", "Page loaded")

         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "page/site/bob/tp/ws/NavigationService", "Loaded URL incorrect");
            });
      },

      // See AKU-737 - A page relative path can make use of a site string...
      "Page relative path with site string": function() {
         return this.remote.findDisplayedById("PAGE_RELATIVE_SITE_STRING_text")
            .clearLog()
            .click()
            .end()

         .sleep(1000) // Wait for page load, can't figure out a way around this sleep!

         .getLastPublish("ALF_WIDGETS_READY", "Page loaded")

         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "page/site/gwen/tp/ws/NavigationService", "Loaded URL incorrect");
            });
      },

      // See AKU-737 - A page relative path will ignore invalid site object data...
      "Page relative path with invalid site object": function() {
         return this.remote.findDisplayedById("PAGE_RELATIVE_INVALID_SITE_text")
            .clearLog()
            .click()
            .end()

         .sleep(1000) // Wait for page load, can't figure out a way around this sleep!

         .getLastPublish("ALF_WIDGETS_READY", "Page loaded")

         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "page/tp/ws/NavigationService", "Loaded URL incorrect");
            });
      },

      // See AKU-737 - A page relative path no site data should just be processed as normal...
      "Page relative path with no site data": function() {
         return this.remote.findDisplayedById("PAGE_RELATIVE_NO_SITE_text")
            .clearLog()
            .click()
            .end()

         .sleep(1000) // Wait for page load, can't figure out a way around this sleep!

         .getLastPublish("ALF_WIDGETS_READY", "Page loaded")

         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "page/tp/ws/NavigationService", "Loaded URL incorrect");
            });
      },

      "Same page with hash doesn't show progress": function() {
         return this.remote.findDisplayedById("SAME_PAGE_BUT_WITH_HASHES_text")
            .clearLog()
            .click()
         .end()

         .getAllPublishes("ALF_PROGRESS_INDICATOR_ADD_ACTIVITY")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0);
            });
      },

      "Action download links don't show progress": function() {
         return this.remote.findDisplayedById("ACTION_LINK_FOR_DOWNLOAD_label")
            .clearLog()
            .click()
         .end()

         .getAllPublishes("ALF_PROGRESS_INDICATOR_ADD_ACTIVITY")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0);
            });
      }
   });
});