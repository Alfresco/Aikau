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
 * This test renders examples of Indicators.
 *
 * The test is simple and much of its validity is in the use of slightly damaged or incomplete models to inspect edge cases.
 *
 * @author Richard Smith
 * @author Martin Doyle
 */
define(["intern!object", 
        "intern/chai!assert", 
        "require", 
        "alfresco/TestCommon"], 
        function(registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Indicators Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Indicators", "Indicators Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Indicators without actions do not respond to clicks": function() {
         var currentLogRows;
         return browser.findAllByCssSelector(".log > tbody > tr")
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
         return browser.findByCssSelector(".indicator[alt=cloud-indirect-sync]")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_SINGLE_DOCUMENT_ACTION_REQUEST", "action", "onCloudIndirectSyncIndicatorAction"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Action indicator did not publish topic");
            });
      },

      "Indicators with custom actions publish to their custom topic": function() {
         return browser.findByCssSelector(".indicator[alt=bob]")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("CUSTOM_ACTION", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Custom action did not publish custom topic");
            });
      },

      "Indicator titles are correct": function() {
         return browser.findByCssSelector(".indicator[alt=geographic]")
            .getAttribute("title")
            .then(function(titleValue) {
               assert.equal("Geolocation metadata available", titleValue, "Title attribute of indicator incorrect");
            });
      },

      "Indicators handle overrides and sorting appropriately": function() {
         return browser.findAllByCssSelector(".indicator")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Incorrect number of display indicators (overrides not working)");
            })
            .end()

         .findAllByCssSelector(".indicator[alt=bob] + .indicator[alt=geographic] + .indicator[alt=cloud-indirect-sync]")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Indicators not sorted correctly, or overrides incorrect");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});