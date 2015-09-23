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
      name: "AutoSave Forms Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AutoSaveForm", "AutoSave Forms Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check autosave doesn't occur on page load": function() {
         return browser.findByCssSelector("#AUTOSAVE_FORM")
         .end()
         .getAllPublishes("AUTOSAVE_FORM")
         .then(function(payloads) {
            assert.lengthOf(payloads, 0, "There should be no auto save when the page loads");
         });
      },

      "Check that autosave works on control update": function() {
         return browser.findByCssSelector("#FIELD1 .dijitInputContainer input")
            .clearValue()
            .type("updated")
         .end()
         .getLastPublish("AUTOSAVE_FORM")
            .then(function(payload) {
               assert.propertyVal(payload, "field1", "updated", "Form was not auto-saved on field update");
            });
      },

      "Launch autosave form in dialog": function() {
         return browser.findByCssSelector("#LAUNCH_FORM_DIALOG_label")
            .click()
         .end()
         // Wait for dialog to open...
         .findAllByCssSelector("#DIALOG1.dialogDisplayed")
         .end()
         .getAllPublishes("AUTOSAVE_FORM2")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "There should be no auto save when the page loads");
            });
      },

      "Check that form in dialog auto saves on field edit": function() {
         return browser.findByCssSelector("#FIELD2 .dijitInputContainer input")
            .clearValue()
            .type("updated")
         .end()
         .getLastPublish("AUTOSAVE_FORM2")
            .then(function(payload) {
               assert.propertyVal(payload, "field2", "updated", "Dialog form was not auto-saved on field update");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});