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
         name: "Gallery View (infinite scroll) Tests",
         
         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/GalleryViewInfiniteScroll", "Gallery View (infinite scroll) Tests").end();
         },
         
         beforeEach: function() {
            browser.end();
         },

         "Check total number of cells": function() {
            // There should be 7 cells in total (4 containing thumbnails, 3 that are empty to make the grid layout
            // look correct)...
            return browser.findAllByCssSelector(".alfresco-lists-views-layouts-Grid td")
               .then(function(elements) {
                  assert.lengthOf(elements, 7, "Unexpected number of cells");
               });
         },

         "Check for empty cells": function() {
            return browser.findAllByCssSelector(".alfresco-lists-views-layouts-Grid__emptyCell")
               .then(function(elements) {
                  assert.lengthOf(elements, 3, "No empty cells created to ensure grid layout is correct");
               });
         },

         "Check for show more link": function() {
            // The Show More link should be present because infinite scroll is enabled and there
            // are 11 results in total (and we're only using a page size of 4)...
            return browser.findByCssSelector(".alfresco-renderers-PropertyLink .value")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Show More", "The show more link was not rendered");
               });
         },

         "Reduce the number of columns": function() {
            // This test makes sure that the resizing when there is the same number of items
            // as columns works...
            return browser.findByCssSelector(".dijitSliderIncrementIconH")
               .clearLog()
               .click()
            .end()

            // Wait for the preference to be set...
            .getLastPublish("ALF_PREFERENCE_SET")

            // Check that there are now 2 rows...
            .findAllByCssSelector(".alfresco-lists-views-layouts-Grid tr")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "A second row wasn't added");
               });
         },

         "Check that show more link is on the second row": function() {
            // Because there are 4 results and 4 columns, the Show More link should have been 
            // rendered on it's own row...
            return browser.findByCssSelector(".alfresco-lists-views-layouts-Grid tr:nth-child(2) td:nth-child(1) .alfresco-renderers-PropertyLink .value");
         },

         "Increase the number of columns": function() {
            return browser.findByCssSelector(".dijitSliderDecrementIconH")
               .clearLog()
               .click()
            .end()

            // Wait for the preference to be set...
            .getLastPublish("ALF_PREFERENCE_SET")

            // Check that there are now 2 rows...
            .findAllByCssSelector(".alfresco-lists-views-layouts-Grid tr")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "The number of rows was not reduced");
               });
         },

         "Get more results": function() {
            // Click on the Show More link to get the second page of results...
            return browser.findByCssSelector(".alfresco-renderers-PropertyLink .value")
               .click()
            .end()

            // Wait for the results to come back...
            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS")

            // There should be no empty cells on the first row...
            .findAllByCssSelector(".alfresco-lists-views-layouts-Grid tr:nth-child(1) td.alfresco-lists-views-layouts-Grid__emptyCell")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "All the empty cells on the first row should have been removed");
               });
         },

         "Get the final set of results (show more link should not be displayed)": function() {
            // There are only 11 results in total, so getting the final page of results should mean
            // that the Show More link is not displayed...
            return browser.findByCssSelector(".alfresco-renderers-PropertyLink .value")
               .click()
            .end()

            // Wait for the results to come back...
            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS")

            .findAllByCssSelector(".alfresco-renderers-PropertyLink")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "The show more link should not be displayed");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});