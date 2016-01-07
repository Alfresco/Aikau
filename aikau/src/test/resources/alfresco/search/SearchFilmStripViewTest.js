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
   function(registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "SearchFilmStripView Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/SearchFilmStripView", "SearchFilmStripView Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         // See AKU-697...
         "Previews are same height": function() {
            var firstPreviewHeight;

            return browser.findByCssSelector("body")

               // Last publish on page render completion...
               .getLastPublish("ALF_PDFJS_ZOOM_SELECTION")
               
               // Get the height of the first preview...
               .findByCssSelector("#SEARCH_RESULTS_PREVIEWS .items li:nth-child(1) .alfresco-preview-PdfJs")
                  .getSize()
                  .then(function(size) {
                     firstPreviewHeight = size.height;
                  })
               .end()

               // Show the next preview...
               .clearLog()

               .findByCssSelector("#SEARCH_RESULTS_PREVIEWS .controls .next .alfresco-html-Image")
                  .click()
               .end()

               // Last publish after second preview render...
               .getLastPublish("ALF_PDFJS_ZOOM_SELECTION")

               // Check the heights are equal...
               .findByCssSelector("#SEARCH_RESULTS_PREVIEWS .items li:nth-child(2) .alfresco-preview-PdfJs")
                  .getSize()
                  .then(function(size) {
                     assert.equal(firstPreviewHeight, size.height, "The preview heights were not equal");
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
         name: "SearchFilmStripView Tests (height config)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/SearchFilmStripView?heightMode=400", "SearchFilmStripView Tests  (height config)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         // See AKU-744...
         "Height configuration is applied": function() {
            return browser.findByCssSelector("body")

               // Last publish on page render completion...
               .getLastPublish("ALF_PDFJS_ZOOM_SELECTION")
               
               .findDisplayedById("SEARCH_RESULTS_PREVIEWS")
                  .getSize()
                  .then(function(size) {
                     assert.equal(size.height, 400, "Height configuration not used");
                  });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});