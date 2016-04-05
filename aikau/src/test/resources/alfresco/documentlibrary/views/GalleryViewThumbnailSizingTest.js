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
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   defineSuite(module, {
      name: "Gallery View Tests (Thumbnail Resizing)",

      setup: function() {
         return TestCommon.loadTestWebScript(this.remote, "/GalleryViewThumbnailSizing", "Gallery View Tests (Thumbnail Resizing)")
            .setWindowSize(null, 900, 768) // Set a window height to ensure 2 columns
            .end();
      },

      "There are initially 6 rows": function() {
         // The default thumbnail width is 400px and with a 900px view width we'd expect
         // two columns... 11 items in 2 columns produces 6 rows...
         return this.remote.findAllByCssSelector(".alfresco-lists-views-layouts-Grid tr")
            .then(function(elements) {
               assert.lengthOf(elements, 6, "Unexpected number of rows");
            });
      },

      // See AKU-743 - The thumbnail is wrapped in a tooltip and we need to ensure that the tooltip
      //               delegates resize calls onto its child widgets...
      "Check the thumbnail size": function() {
         return this.remote.findByCssSelector("#TOOLIP_ITEM_0 .alfresco-renderers-Thumbnail")
            .getSize()
            .then(function(size) {
               assert.equal(size.width, 400, "Thumbnail was not sized by outer tooltip widget");
            });
      },

      "Increase thumbnail size to decrease columns": function() {
         // Increasing the thumbnail size (using the slider) should re-render the grid
         // so that there is only a single column of thumbnails
         return this.remote.findByCssSelector(".dijitSliderIncrementIconH")
            .clearLog()
            .click()
            .end()

         // Wait for preference to be set...
         .getLastPublish("ALF_PREFERENCE_SET", "Preference not set")

         .findAllByCssSelector(".alfresco-lists-views-layouts-Grid tr")
            .then(function(elements) {
               assert.lengthOf(elements, 11, "Unexpected number of rows");
            });
      },

      "Increase the browser window to increase columns": function() {
         // Increasing the window size should add more columns...
         return this.remote.setWindowSize(null, 1500, 768)
            .findAllByCssSelector(".alfresco-lists-views-layouts-Grid tr")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "Unexpected number of rows");
            });
      },

      "Decrease the thumbnail size to increase the colums": function() {
         // It is necessary to go down 2 steps to get to 4 columns...
         return this.remote.findByCssSelector(".dijitSliderDecrementIconH")
            .clearLog()
            .click()
            .end()

         // Wait for preference to be set (first size reduction)...
         .getLastPublish("ALF_PREFERENCE_SET", "Preference not set")

         .findByCssSelector(".dijitSliderDecrementIconH")
            .clearLog()
            .click()
            .end()

         // Wait for preference to be set (second size reduction)...
         .getLastPublish("ALF_PREFERENCE_SET", "Preference not set")

         .findAllByCssSelector(".alfresco-lists-views-layouts-Grid tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Unexpected number of rows");
            });
      }
   });
});