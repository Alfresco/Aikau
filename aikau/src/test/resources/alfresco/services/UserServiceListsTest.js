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
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");
   
   var selectors = {
      textBoxes: {
         filter: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["FILTER_TEXTBOX"])
         }
      }
   };

   defineSuite(module, {
      name: "User Service Test (used for lists)",
      testPage: "/UserServiceLists",

      "Users are listed": function() {
         return this.remote.findAllByCssSelector(".alfresco-lists-views-HtmlListView--renderer li")
            .then(function(elements) {
               assert.lengthOf(elements, 6);
            });
      },

      "Filter users": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.filter.input)
            .clearLog()
            .clearXhrLog()
            .type("a")
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .getXhrEntries({
               method: "GET",
               pos: "last"
            })
            .then(function(entry) {
               assert.deepProperty(entry, "request.url");
               assert.include(entry.request.url, "?filter=a&sortBy=fullName&dir=asc&pageSize=10&startIndex=0");
            });
      },

      "Sort users": function() {
         return this.remote.findByCssSelector("#SORTFIELD_text")
            .click()
         .end()

         .clearLog()
         .clearXhrLog()

         .findDisplayedByCssSelector("#SORT_BY_USERNAME_text")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .getXhrEntries({
               method: "GET",
               pos: "last"
            })
            .then(function(entry) {
               assert.deepProperty(entry, "request.url");
               assert.include(entry.request.url, "?filter=a&sortBy=userName&dir=asc&pageSize=10&startIndex=0");
            });
      },

      "Change sort order of users": function() {
         return this.remote.findByCssSelector("#DESCENDING_text")
            .clearLog()
            .clearXhrLog()
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")

         .getXhrEntries({
               method: "GET",
               pos: "last"
            })
            .then(function(entry) {
               assert.deepProperty(entry, "request.url");
               assert.include(entry.request.url, "?filter=a&sortBy=userName&dir=desc&pageSize=10&startIndex=0");
            });
      },

      "Change page size": function() {
         return this.remote.findByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR_text")
            .click()
         .end()

         .findDisplayedByCssSelector("#HASH_CUSTOM_PAGE_SIZE_PAGINATOR_RESULTS_PER_PAGE_SELECTOR_dropdown tr:nth-child(1) .dijitMenuItemLabel")
            .clearXhrLog()
            .clearLog()
            .click()
         .end()

         .getLastPublish("ALF_GET_USERS_SUCCESS")

         .getXhrEntries({
               method: "GET",
               pos: "last"
            })
            .then(function(entry) {
               assert.deepProperty(entry, "request.url");
               assert.include(entry.request.url, "pageSize=5&startIndex=0");
            });
      }
   });

   
});