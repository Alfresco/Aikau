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

      name: "DND Alternative Editing Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/alternative-editor-dnd", "DND Alternative Editing Tests")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that dynamic form buttons aren't displayed initially": function() {
         return browser.findByCssSelector(".alfresco-forms-DynamicForm .buttons")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The form buttons should not have been displayed initially because no form controls are configured");
            });
      },

      "Check that no text boxes are displayed initially": function() {
         return browser.findAllByCssSelector(".alfresco-forms-controls-TextBox")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "No TextBox widgets should exist before edit");
            });
      },

      "Check edit doesn't open a dialog": function() {
         return browser.findByCssSelector(".action.edit > img")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-dialogs-AlfDialog")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Dialog unexpectedly created");
            });
      },

      "Check that dynamic form buttons are displayed after edit": function() {
         return browser.findByCssSelector(".alfresco-forms-DynamicForm .buttons")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The form buttons should have been displayed after edit operation");
            });
      },

      "Check that 3 text boxes are displayed after editing": function() {
         return browser.findAllByCssSelector(".alfresco-forms-controls-TextBox")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "TextBox widgets should have been created");
            });
      },

      "Edit description": function() {
         return browser.findByCssSelector(".alfresco-forms-DynamicForm .alfresco-forms-controls-TextArea textarea")
            .clearValue()
            .type("Updated description")
         .end()
         .findByCssSelector(".alfresco-forms-DynamicForm .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(".alfresco-dnd-DroppedItemWidgets .alfresco-forms-controls-TextArea .description")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Updated description", "The description was not updated");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});