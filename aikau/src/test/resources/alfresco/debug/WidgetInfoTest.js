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
        function(registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Widget Info Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/WidgetInfo", "Widget Info Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },

      "Test that developer mode isn't initally enabled": function() {
         return browser.findAllByCssSelector(".alfresco-developer-mode-Enabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Developer mode should not have been initially enabled");
            });
      },

      "Test that WidgetInfo widgets aren't displayed": function() {
         return browser.findByCssSelector(".alfresco-debug-WidgetInfo")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The WidgetInfo widgets should not be displayed when developer mode is off");
            });
      },

      "Test toggling developer mode on": function() {
         return browser.findByCssSelector("#TOGGLE_DEVELOPER_MODE_label")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-developer-mode-Enabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Developer mode was not enabled");
            });
      },

      "Test that WidgetInfo widgets are now displayed": function() {
         return browser.findByCssSelector(".alfresco-debug-WidgetInfo")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The WidgetInfo widgets were not displayed after enabling developer mode");
            });
      },

      "Test that all widgets have info provided": function() {
         return browser.findAllByCssSelector(".alfresco-debug-WidgetInfo")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "Unexpected number of WidgetInfo widgets found");
            });
      },

      "Test that alt text is generated": function() {
         return browser.findByCssSelector(".alfresco-buttons-AlfButton .alfresco-debug-WidgetInfo img")
            .getAttribute("alt")
            .then(function(alt) {
               assert.equal(alt, "Information about widget TOGGLE_DEVELOPER_MODE", "Alt text was not generated for image");
            });
      },

      "Test that info tooltip can be displayed": function() {
         return browser.findByCssSelector(".alfresco-buttons-AlfButton .alfresco-debug-WidgetInfo img")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-debug-WidgetInfoDialogPopup")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Info tooltip was not generated");
            });
      },

      "Clicking info button does not activate click event on widget": function() {
         return browser.findByCssSelector("#LINK .alfresco-debug-WidgetInfo img")
            .click()
            .end()

         .getAllPublishes("LINK_CLICKED")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Payload published incorrectly when clicking info link");
            });
      },
      
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});