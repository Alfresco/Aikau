/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(module, defineSuite, expect, assert, require, TestCommon) {

   defineSuite(module, {
      name: "CRUD Form Tests",
      testPage: "/CrudForm",

      "Check that the info node is initially displayed": function() {
         return this.remote.findByCssSelector("#CRUD_FORM_INFO_NODE")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The info node should be displayed");
            });
      },

      "Check that the info node has been hidden": function() {
         return this.remote.findByCssSelector("#SHOW_FORM_label")
            .click()
            .end()
            .findByCssSelector("#CRUD_FORM_INFO_NODE")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The info node should be hidden");
            });
      },

      "Check that the info node has been displayed again": function() {
         return this.remote.findByCssSelector("#ADDITIONAL_BUTTON_label")
            .click()
            .end()
            .findByCssSelector("#CRUD_FORM_INFO_NODE")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The info node should be displayed");
            });
      },

      "Check that the info node has been hidden again": function() {
         return this.remote.findByCssSelector("#SHOW_CREATE_label")
            .click()
            .end()

         .findByCssSelector("#CRUD_FORM_INFO_NODE")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The info node should be hidden");
            });
      },

      "Checking that new form value is correct default": function() {
         return this.remote.findByCssSelector("#TEXT_FIELD .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "NewData", "The new form value was not set correctly: " + resultText);
            });
      },

      "Checking that the create button is displayed": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton.createButton > span")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The create button was not displayed");
            })
            .click();
      },

      "Checking that new item data is published correctly": function() {
         return this.remote.findAllByCssSelector(TestCommon.pubDataCssSelector("CREATE_ITEM", "prop1", "NewData"))
            .then(function(elements) {
               assert(elements.length === 1, "The new item button data was not published correctly, expected 1. Found: " + elements.length);
            });
      },

      "Checking that form value is shows the existing value": function() {
         return this.remote.findByCssSelector("#SHOW_EXISTING_1_label")
            .click()
            .end()

         // Check existing data is displayed...
         .findByCssSelector("#TEXT_FIELD .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "Existing 1", "The form was not set with existing data: " + resultText);
            });
      },

      "Checking that the update button is displayed": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton.updateButton > span")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The update button was not displayed");
            })
            .click();
      },

      "Checking that existing item data is published correctly": function() {
         return this.remote.findAllByCssSelector(TestCommon.pubDataCssSelector("UPDATE_ITEM", "prop1", "Existing 1"))
            .then(function(elements) {
               assert(elements.length === 1, "The existing item button data was not published correctly");
            });
      },

      "Checking that the delete button is displayed": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton.deleteButton > span")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The delete button was not displayed");
            })
            .click();
      },

      "Checking that a request was made to delete the existing item": function() {
         return this.remote.findAllByCssSelector(TestCommon.pubDataCssSelector("DELETE_ITEM", "prop1", "Existing 1"))
            .then(function(elements) {
               assert(elements.length === 1, "A request was not made to delete the existing item");
            });
      },

      "The info node should be displayed": function() {
         return this.remote.findByCssSelector("#CRUD_FORM_INFO_NODE")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The info node should be displayed");
            });
      }
   });
});