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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Image Preview Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ImagePreview", "Image Preview Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Find image preview node": function () {
            return browser.findByCssSelector(".alfresco-preview-AlfDocumentPreview > div.previewer");
         },

         "Find image source request": function() {
            return browser.findAllByCssSelector(".alfresco-testing-MockXhr table tbody tr")
               .then(function(elements) {
                  assert.lengthOf(elements,1, "Expected just one XHR request");
               })
            .end()

            .findByCssSelector(".alfresco-testing-MockXhr table tbody tr:first-child td.mx-url")
               .getVisibleText()
                  .then(function(text) {
                     var result = text.indexOf("/aikau/service/components/documentlibrary/data/node/workspace/SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4?view=browse&noCache") !== -1;
                     assert(result, "Test #2b - AlfDocument didn't request node details: " + text);
                  });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Image Preview Tests (plugin removal)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ImagePreview?removeCondition=true", "Image Preview Tests (plugin removal)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Image cannot be previewed": function () {
            return browser.findByCssSelector(".alfresco-preview-AlfDocumentPreview .previewer .message")
               .getVisibleText()
               .then(function(text) {
                  assert.include(text, "This document can't be previewed.");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});