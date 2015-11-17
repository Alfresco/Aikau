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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, TestCommon, keys) {

   registerSuite(function(){
      var browser;

      return {
         name: "Expandable Gallery View Tests",
         
         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ExandableGallery", "Expandable Gallery View Tests").end();
         },
         
         beforeEach: function() {
            browser.end();
         },

         "There should be no expanded cells": function() {
            return browser.findDisplayedById("CELL_CONTAINER_ITEM_0")
            .end()

            .findAllByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Unexpected expanded panel found");
               });
         },

         "Click on a cell to expand": function() {
            return browser.findDisplayedById("CELL_CONTAINER_ITEM_0")
               .click()
            .end()

            .findByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel");
         },

         "Resize window to make sure expanded cell remains the same size": function() {
            var originalWidth;
            return browser.findByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel td")
               .getSize()
               .then(function(size) {
                  originalWidth = size.width;
               })

               .setWindowSize(null, 1500, 768)

               .getSize()
               .then(function(size) {
                  assert.isAbove(size.width, originalWidth, "Expanded panel cell should not have got smaller");
               });
         },

         "Check the expanded panel position": function() {
            // This verifies that the expanded panel has been inserted in the 2nd row...
            return browser.findByCssSelector(".alfresco-lists-views-layouts-Grid tr.alfresco-lists-views-layouts-Grid__expandedPanel:nth-child(2)");
         },

         "Check that expanded panel has focus": function() {
            return browser.getActiveElement()
               .getProperty("value")
               .then(function(value) {
                  assert.equal(value, "Monthly HES Summary Data", "The form field in the expanded element was not focused");
               });
         },

         "Use escape key to close panel": function() {
            return browser.pressKeys(keys.ESCAPE)
               .waitForDeletedByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel");
         },

         "The expanded cell should be re-focused": function() {
            return browser.findByCssSelector(".alfresco-lists-views-layouts-Grid__cell--focused #CELL_CONTAINER_ITEM_0");
         },

         "Keyboard navigate to and expand another cell": function() {
            return browser.pressKeys(keys.ARROW_RIGHT)
               .findByCssSelector(".alfresco-lists-views-layouts-Grid__cell--focused #CELL_CONTAINER_ITEM_1")
            .end()

            .pressKeys(keys.RETURN)

            .findByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel")
            .end()

            .getActiveElement()
               .getProperty("value")
               .then(function(value) {
                  assert.equal(value, "Telford and Wrekin Council", "The form field in the expanded element was not focused");
               });
         },

         "Use mouse to close expanded cell": function() {
            return browser.findById("CELL_CONTAINER_ITEM_1")
               .click()
            .end()

            .waitForDeletedByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});