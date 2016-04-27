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
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Simple Picker Tests",
      testPage: "/SimplePicker",

      "Test that PICKER1 has no items selected on load": function() {
         return this.remote.findAllByCssSelector("#PICKER1 .picked-items table > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Items were unexpectedly pre-selected in PICKER1");
            });
      },

      "Test that PICKER2 has one item selected on load": function() {
         return this.remote.findAllByCssSelector("#PICKER2 .picked-items table > *")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Items were unexpectedly pre-selected in PICKER2");
            });
      },

      "Test that PICKER1 has 3 options available for selection on load": function() {
         return this.remote.findAllByCssSelector("#PICKER1 .sub-pickers .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Not the correct number of available items for selection in PICKER1");
            });
      },

      "Test that PICKER2 has 2 options available for selection on load": function() {
         return this.remote.findAllByCssSelector("#PICKER2 .sub-pickers .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Not the correct number of available items for selection in PICKER2");
            });
      },

      "Test that PICKER2 posted value contains pre-selected item": function() {
         return this.remote.findByCssSelector("#FORM .confirmationButton > span")
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_POST")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "picker2.0.name", "One");
            });
      },

      "Test that an item can be selected": function() {
         // Pick the 3rd item ("Three") in the first picker...
         return this.remote.findByCssSelector("#PICKER1 .alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .click()
            .end()
            .findAllByCssSelector("#PICKER1 .picked-items table > *")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "An item was not picked");
            });
      },

      "Test that the picked item is reflected in the posted form value": function() {
         return this.remote.findByCssSelector("#FORM .confirmationButton > span")
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_POST")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "picker1.0.name", "Three");
            });
      },

      "Test that the picked item is not available to be picked again": function() {
         return this.remote.findByCssSelector("#PICKER1 .alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .isDisplayed()
            .then(function(visible) {
               assert.isFalse(visible, "The picked item in PICKER1 is still visible to be picked again");
            });
      },

      "Test that removing a previously picked item removes it from the picked list": function() {
         return this.remote.findByCssSelector("#PICKER1 .picked-items tr .alfresco-renderers-PublishAction > img")
            .click()
            .end()
            .findAllByCssSelector("#PICKER1 .picked-items table > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Previously picked item was not removed");
            });
      },

      "Test that removed item is available for re-selection": function() {
         return this.remote.findByCssSelector("#PICKER1 .alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .isDisplayed()
            .then(function(visible) {
               assert.isTrue(visible, "The removed item from PICKER1 is not available for selection");
            });
      },

      "Test form value post after removing previously picked item": function() {
         return this.remote.findByCssSelector("#FORM .confirmationButton > span")
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_POST")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "picker2.0.name", "One");
               assert.notDeepProperty(payload, "picker1.1.name");
            });
      }
   });
});