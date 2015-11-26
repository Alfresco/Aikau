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
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "AlfDocumentFilters Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AlfDocumentFilters", "AlfDocumentFilters Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Filters label is displayed correctly": function() {
            return browser.findByCssSelector("#FILTERS > .label")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "TestSök<img src=\"1\" onerror=\"window.hacked=true\">", "Not the expected text");
               });
         },

         "Filter label is displayed correctly": function() {
            return browser.findByCssSelector("#FILTERS .alfresco-documentlibrary-AlfDocumentFilter span")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "TestSök<img src=\"1\" onerror=\"window.hacked=true\">", "Not the expected text");
               });
         },

         "Initial subscribing label is correct": function() {
            return browser.findById("FILTER_DESCRIPTION")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Filter Not SetSök<img src=\"1\" onerror=\"window.hacked=true\">", "Not the expected text");
               });
         },

         "Click on filter to publish": function() {
            return browser.findByCssSelector("#FILTERS .alfresco-documentlibrary-AlfDocumentFilter span")
               .click()
            .end()

            .getLastPublish("ALF_DOCLIST_FILTER_SELECTION")
               .then(function(payload) {
                  assert.propertyVal(payload, "value", "all", "Payload not published correctly");
               });
         },

         "Subscribing label has been updated": function() {
            return browser.findById("FILTER_DESCRIPTION")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "TestSök<img src=\"1\" onerror=\"window.hacked=true\">", "Not the expected text");
               });
         },

         "No XSS attacks were successful": function() {
            var notHacked = browser.execute("!window.hacked");
            assert(notHacked, "XSS attack in setting title succeeded");
            return browser;
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});