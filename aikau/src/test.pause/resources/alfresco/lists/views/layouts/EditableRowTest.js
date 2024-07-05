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
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Editable Row Tests",
      testPage: "/EditableRow",

      "Check there are two editable rows": function() {
         return this.remote.findAllByCssSelector(".alfresco-lists-views-layouts-EditableRow")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The wrong number of editable rows were found");
            });
      },

      "Check there are 6 cells": function() {
         return this.remote.findAllByCssSelector(".alfresco-lists-views-layouts-Cell")
            .then(function(elements) {
               assert.lengthOf(elements, 6, "The wrong number of cells were found");
            });
      },

      "Check the value of the first property": function() {
         // The assumption here is that we'll work with the first of 4 properties...
         // If the test ever fails, check this holds true first!
         return this.remote.findByCssSelector(".alfresco-renderers-Property .value")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "rhubarb", "Property value not initialised as expected");
            });
      },

      "Check that edit mode widgets haven't been created yet": function() {
         return this.remote.findAllByCssSelector(".alfresco-forms-Form")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Edit mode widgets were unexpectedly created");
            });
      },

      "Enter edit mode (mouse)": function() {
         return this.remote.findByCssSelector(".alfresco-lists-views-layouts-EditableRow:nth-child(1) .alfresco-renderers-PublishAction > img")
            .click()
            .end()
            .findAllByCssSelector(".alfresco-forms-Form")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Edit mode widgets were not created");
            });
      },

      "Check the initial form value": function() {
         return this.remote.findByCssSelector("#LABEL_FIELD .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "rhubarb", "The form field value was not set correctly");
            });
      },

      "Update form value and cancel": function() {
         return this.remote.findByCssSelector("#LABEL_FIELD .dijitInputContainer input")
            .clearValue()
            .type("bananas")
            .end()
            .findByCssSelector(".cancelButton > span")
            .click()
            .end()
            .findByCssSelector(".alfresco-renderers-Property .value")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "rhubarb", "The property should not have been updated");
            });
      },

      "Check form is re-initialised": function() {
         return this.remote.findByCssSelector(".alfresco-lists-views-layouts-EditableRow:nth-child(1) .alfresco-renderers-PublishAction > img")
            .click()
            .end()
            .findByCssSelector("#LABEL_FIELD .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "rhubarb", "The form field value was not re-initialised");
            });
      },

      "Update form value and save": function() {
         return this.remote.findByCssSelector("#LABEL_FIELD .dijitInputContainer input")
            .clearValue()
            .type("bananas")
            .end()
            .findByCssSelector(".confirmationButton > span")
            .click()
            .end()
            .findByCssSelector(".alfresco-renderers-Property .value")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "bananas", "The property should not have been updated");
            });
      }
   });
});