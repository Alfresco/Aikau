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
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {

      name: "Nested item re-ordering, moving and deleting tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/nested-reorder-dnd", "Nested item re-ordering, moving and deleting tests")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that only 3 items are shown on the palette": function() {
         // ...as all the others have been used...
         return browser.findAllByCssSelector("#DRAG_PALETTE1 .dojoDndItem")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "There should only be 3 elements remaining on the palette as the others have been used");
            });
      },

      "Drag nested items and check that palette is not cleared": function() {
         // See AKU-413...
         return browser.findByCssSelector(".middleTestItemWrapper:nth-child(1) > .dojoDndHandle")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
         .end()
         .findByCssSelector("#DRAG_PALETTE1 .dojoDndItem:first-child > div")
            .then(function(element) {
                  return browser.moveMouseTo(element)
                     .sleep(1000) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
                     .releaseMouseButton();
               })
         .end()
         .findAllByCssSelector("#DRAG_PALETTE1 .dojoDndItem")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "There should still be 3 elements remaining on the palette after drag");
            });
      },

      "Move a deep nested item down a place": function() {
         return browser.findByCssSelector(".middleTestItemWrapper:nth-child(1) .innerTestItemWrapper:nth-child(1) .down")
            .click()
         .end()
         .clearLog()
         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .getLastPublish("FORM1_POST")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "data.0.config.widgets.0.config.widgets.0.name", "E", "E was not saved as first item");
               assert.deepPropertyVal(payload, "data.0.config.widgets.0.config.widgets.1.name", "D", "D was not saved as second item");
            });
      },

      "Delete a deep nested item": function() {
         return browser.findByCssSelector(".middleTestItemWrapper:nth-child(1) .innerTestItemWrapper:nth-child(1) .delete")
            .click()
         .end()
         .clearLog()
         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .getLastPublish("FORM1_POST")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "data.0.config.widgets.0.config.widgets.0.name", "D", "D was not saved as first item");
               assert.deepPropertyVal(payload, "data.0.config.widgets.0.config.widgets.1.name", "F", "F was not saved as second item");
               assert.lengthOf(payload.data[0].config.widgets[0].config.widgets, 2, "E was not deleted");
            });
      },

      "Move a deep nested item into another target": function() {
         return browser.findByCssSelector(".middleTestItemWrapper:nth-child(1) .innerTestItemWrapper:nth-child(1) .dojoDndHandle")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
         .end()
         .findByCssSelector(".middleTestItemWrapper:nth-child(2) .previewPanel > div:first-child")
            .then(function(element) {
                  return browser.moveMouseTo(element)
                     .sleep(500) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
                     .releaseMouseButton();
               })
         .end()
         .clearLog()
         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .getLastPublish("FORM1_POST")
            .then(function(payload) {
               assert.lengthOf(payload.data[0].config.widgets[1].config.widgets, 4, "D was not moved between targets");
               assert.lengthOf(payload.data[0].config.widgets[0].config.widgets, 1, "D was not removed from original source");
            });
      },

      "Re-order deep nested item using buttons": function() {
         return browser.findByCssSelector(".middleTestItemWrapper:nth-child(2) .innerTestItemWrapper:nth-child(4) .up")
            .click()
         .end()
         .clearLog()
         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .getLastPublish("FORM1_POST")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "data.0.config.widgets.1.config.widgets.2.name", "D", "D was not moved up");
               assert.deepPropertyVal(payload, "data.0.config.widgets.1.config.widgets.3.name", "E", "E was not moved down");
            });
      },

      "Re-order middle nested item using buttons": function() {
         return browser.findByCssSelector(".middleTestItemWrapper:nth-child(1) > .actions > .down")
            .click()
         .end()
         .clearLog()
         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .getLastPublish("FORM1_POST")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "data.0.config.widgets.0.config.widgets.2.name", "D", "C was not moved up");
               assert.deepPropertyVal(payload, "data.0.config.widgets.1.config.widgets.0.name", "F", "B was not moved down");
            });
      },

      "Delete middle nested item": function() {
         return browser.findByCssSelector(".middleTestItemWrapper:nth-child(1) > .actions > .delete")
            .click()
         .end()
         .clearLog()
         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .getLastPublish("FORM1_POST")
            .then(function(payload) {
               assert.lengthOf(payload.data[0].config.widgets, 1, "C was not deleted");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});