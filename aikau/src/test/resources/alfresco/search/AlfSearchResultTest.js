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
 * This test generates some variations on AlfSearchResult to test the various if statements in the rendering widgets involved
 *
 * @author Richard Smith
 */
define(["intern!object",
      "intern/chai!assert",
      "alfresco/TestCommon"
   ],
   function(registerSuite, assert, TestCommon) {

      var browser;

      registerSuite({
         name: "AlfSearchResult Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AlfSearchResult", "AlfSearchResult Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Correct number of rows is shown": function() {
            return browser.findAllByCssSelector(".alfresco-search-AlfSearchResult")
               .then(function(elements) {
                  assert.lengthOf(elements, 12, "Wrong number of results rendered");
               });
         },

         "Clicked result becomes focused": function() {
            var activeElementId;
            return browser.findByCssSelector(".alfresco-search-AlfSearchResult:last-child")
               .click()
               .end()

            .getActiveElement()
               .then(function(element) {
                  activeElementId = element.elementId;
               })
               .end()

            .findByCssSelector(".alfresco-search-AlfSearchResult:last-child")

            .then(function(element) {
               assert.equal(element.elementId, activeElementId, "The clicked element has not become focused");
            });
         },

         "Event result opens correct date in calendar": function() {
            return browser.findByCssSelector(".alfresco-search-AlfSearchResult:last-child .nameAndTitleCell .alfresco-renderers-PropertyLink > .inner")
               .click()
            .end()

            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "url", "site/eventResult/calendar?date=2015-04-01", "Did not navigate to correct page");
               });
         },

         "Click on folder link container ampersand": function() {
            return browser.findByCssSelector(".alfresco-search-AlfSearchResult:first-child .nameAndTitleCell .alfresco-renderers-PropertyLink > .inner")
               .click()
            .end()

            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "url", "site/normalResult/documentlibrary?path=%2Fone%2Ftwo%2Fthree%2Ffour%2Ftest1%20%26%20test2", "Special characters were not encoded");
               });
         },

         "Click on 'In folder' link": function() {
            return browser.findByCssSelector(".alfresco-search-AlfSearchResult:first-child .pathCell .alfresco-renderers-PropertyLink > .inner")
               .click()
            .end()
            
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "url", "site/normalResult/documentlibrary?path=%2F%2Fone%2Ftwo%2Fthree%2Ffour", "In folder link goes to the correct path");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   });