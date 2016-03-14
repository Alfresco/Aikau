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
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {
        /*jshint maxlen:false*/

   defineSuite(module, {
      name: "AlfDetailedView",
      testPage: "/AlfDetailedView",

      "Two items are listed": function() {
         return this.remote.findAllByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "Incorrect number of items displayed");
            });
      },

      "Version does not appear on folders or working copies": function() {
         return this.remote.findAllByCssSelector(".detail-item__version")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Did not create one (and only one) version widget");
            })
            .end()

         .findAllByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(3) .detail-item__version")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Version widget created on incorrect item");
            });
      },

      "Version only appears on hover": function() {
         return this.remote.findByCssSelector(".detail-item__version .value")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Version information visible without hovering");
            })
            .end()

         .findByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(3)")
            .moveMouseTo()
            .end()

         .findByCssSelector(".detail-item__version .value")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Version information not visible when hovering");
            })
            .end()

         .findByCssSelector("body")
            .moveMouseTo(0, 0)
            .end()

         .findByCssSelector(".detail-item__version .value")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Version information visible when no longer hovering");
            });
      },

      "Title appears when specified": function() {
         return this.remote.findAllByCssSelector(".detail-item__title")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "Incorrect number of title widgets created");
            });
      },

      "Description populated when specified": function() {
         return this.remote.findAllByCssSelector(".detail-item__description .alfresco-renderers-Property:not(.faded)")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Incorrect number of description widgets populated");
            })
            .end()

         .findAllByCssSelector(".detail-item__description .alfresco-renderers-Property.faded")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Incorrect number of empty description widgets");
            })
            .end()

         .findAllByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(1) .detail-item__description .alfresco-renderers-Property:not(.faded), .alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(4) .detail-item__description:not(.faded)")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Description widgets not populated for correct items");
            });
      },

      "Tags appear on all but working copy": function() {
         return this.remote.findAllByCssSelector(".detail-item__tags")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Incorrect number of tag widgets created");
            })
            .end()

         .findAllByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(4) .detail-item__tags")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Tags widget created for working copy");
            });
      },

      "Category only appears when specified": function() {
         return this.remote.findAllByCssSelector(".detail-item__category")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Incorrect number of category widgets populated");
            })
            .end()

         .findAllByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(3) .detail-item__category")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Category widget appears against incorrect item");
            });
      },

      "Working copy has appropriate indicator": function() {
         return this.remote.findAllByCssSelector(".indicator[alt=editing]")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Incorrect number of editing indicators created");
            })
            .end()

         .findAllByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(4) .indicator[alt=editing]")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Editing indicator appears against incorrect item");
            });
      },

      "Working copy has appropriate banner": function() {
         return this.remote.findAllByCssSelector(".detail-item__lockedBanner:not(.hidden)")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Incorrect number of locked banners created");
            })
            .end()

         .findAllByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(4) .detail-item__lockedBanner:not(.hidden)")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Locked banner appears against incorrect item");
            });
      },

      "Items have size and folders do not": function() {
         return this.remote.findAllByCssSelector(".detail-item__size")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Incorrect number of size widgets created");
            })
            .end()

         .findAllByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(3) .detail-item__size, .alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(4) .detail-item__size")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Size widgets not created for correct items");
            });
      },

      "Clicking the comments link only opens the comments for that item": function() {
         return this.remote.findByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(1) .comment-link")
            .click()
            .end()

         .getLastPublish("ALF_GET_COMMENTS", true)

         .findByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(1) .detail-item__commentsReveal > .content")
            .getSize()
            .then(function(size) {
               assert.notEqual(size.height, 0, "Comments not expanded for chosen item");
            })
            .end()

         .findByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem:nth-child(2) .detail-item__commentsReveal > .content")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 0, "Comments expanded for incorrect item");
            });
      }
   });
});