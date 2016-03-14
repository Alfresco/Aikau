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
 * This test renders examples of Indicators.
 *
 * The test is simple and much of its validity is in the use of slightly damaged or incomplete models to inspect edge cases.
 *
 * @author Richard Smith
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Indicators Tests",
      testPage: "/Indicators",

      "Indicators without actions do not respond to clicks": function() {
         var currentLogRows;
         return this.remote.findAllByCssSelector(".log > tbody > tr")
            .then(function(elements) {
               currentLogRows = elements.length;
            })
            .end()

         .findByCssSelector(".indicator[alt=geographic]")
            .click()
            .end()

         .findAllByCssSelector(".log > tbody > tr")
            .then(function(elements) {
               assert.equal(currentLogRows, elements.length, "New action occurred when clicking indicator without action");
            });
      },

      "Indicators with actions publish to the ALF_SINGLE_DOCUMENT_ACTION_REQUEST topic": function() {
         return this.remote.findByCssSelector(".indicator[alt=cloud-indirect-sync]")
            .click()
            .end()

         .getLastPublish("ALF_SINGLE_DOCUMENT_ACTION_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "action", "onCloudIndirectSyncIndicatorAction", "Action indicator did not publish topic");
            });
      },

      "Indicators with custom actions publish to their custom topic": function() {
         return this.remote.findByCssSelector(".indicator[alt=bob]")
            .click()
            .end()

         .getLastPublish("CUSTOM_ACTION");
      },

      "Indicator titles are correct": function() {
         return this.remote.findByCssSelector(".indicator[alt=geographic]")
            .getAttribute("title")
            .then(function(titleValue) {
               assert.equal("Geolocation metadata available", titleValue, "Title attribute of indicator incorrect");
            });
      },

      "Indicators handle overrides and sorting appropriately": function() {
         return this.remote.findAllByCssSelector("#INDICATORS1 .indicator")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Incorrect number of display indicators (overrides not working)");
            })
            .end()

         .findAllByCssSelector(".indicator[alt=bob] + .indicator[alt=geographic] + .indicator[alt=cloud-indirect-sync]")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Indicators not sorted correctly, or overrides incorrect");
            });
      },

      "Indicator in legacyMode has correct URL": function() {
         return this.remote.findByCssSelector("#INDICATORS3 .indicator:nth-of-type(1)")
            .getAttribute("src")
            .then(function(src) {
               assert.equal(src, "/aikau/res/components/documentlibrary/indicators/exif-16.png");
            });
      },

      "Indicator icon can be mapped": function() {
         return this.remote.findByCssSelector("#INDICATORS3 .indicator:nth-of-type(2)")
            .getAttribute("src")
            .then(function(src) {
               assert.equal(src, "/aikau/res/some/custom/image.jpg");
            });
      }
   });
});