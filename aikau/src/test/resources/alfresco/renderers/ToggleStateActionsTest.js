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

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");
   var selectors = {
      tsas: {
         propertyMatch1: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["TSA1", "0"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["TSA1", "0"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.nth.action.label", ["TSA1", "0", "1"])
         },
         propertyMatch2: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["TSA1", "1"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["TSA1", "1"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.nth.action.label", ["TSA1", "1", "1"])
         },
         propertyExists1: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["TSA2", "0"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["TSA2", "0"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.nth.action.label", ["TSA2", "0", "1"])
         },
         propertyExists2: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["TSA2", "1"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["TSA2", "1"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.nth.action.label", ["TSA2", "1", "1"])
         }
      }
   };

   defineSuite(module, {
      name: "Toggle State Actions Test",
      testPage: "/ToggleStateActions",

      "Check initial rendering": function() {
         return this.remote.findDisplayedByCssSelector(selectors.tsas.propertyMatch1.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "On");
            })
         .end()

         .findDisplayedByCssSelector(selectors.tsas.propertyExists1.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Sure thing");
            })
         .end()

         .findDisplayedByCssSelector(selectors.tsas.propertyMatch2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Off");
            })
         .end()

         .findDisplayedByCssSelector(selectors.tsas.propertyExists2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "No way");
            })
         .end();
      },

      "Toggling on changes state": function() {
         return this.remote.findByCssSelector(selectors.tsas.propertyMatch2.label)
            .click()
         .end()

         .getLastPublish("ALF_TOGGLE_ON")
         .clearLog()

         .findDisplayedByCssSelector(selectors.tsas.propertyMatch2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "On");
            })
         .end()

         .findDisplayedByCssSelector(selectors.tsas.propertyExists2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Sure thing");
            })
         .end();
      },

      "Toggling off changes state of correct item": function() {
         // Click the button...
         return this.remote.findByCssSelector(selectors.tsas.propertyMatch1.label)
            .click()
         .end()

         // Wait for the drop-down menu to appear...
         .findDisplayedByCssSelector(selectors.tsas.propertyMatch1.dropDown)
         .end()

         // Click the menu item...
         .findByCssSelector(selectors.tsas.propertyMatch1.action)
            .click()
         .end()

         // Check the topic is published...
         .getLastPublish("ALF_TOGGLE_OFF")
         .clearLog()

         // Check the appropriate labels have changed...
         .findDisplayedByCssSelector(selectors.tsas.propertyMatch1.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Off");
            })
         .end()

         .findDisplayedByCssSelector(selectors.tsas.propertyExists1.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "No way");
            })
         .end()

         // The other labels should have stayed the same...
         .findDisplayedByCssSelector(selectors.tsas.propertyMatch2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "On");
            })
         .end()

         .findDisplayedByCssSelector(selectors.tsas.propertyExists2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Sure thing");
            })
         .end();
      }
   });
});