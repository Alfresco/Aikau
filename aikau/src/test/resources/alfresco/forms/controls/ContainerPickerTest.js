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
      "intern/chai!expect",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon"],
      function(registerSuite, expect, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "ContainerPicker Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ContainerPicker", "ContainerPicker Tests").end();
      },
      
      beforeEach: function() {
         browser.end();
      },
      
      "Test picker dialog can be displayed": function () {
         return browser.findByCssSelector("#FOLDER_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
         .end()
         .findByCssSelector(".alfresco-pickers-Picker")
            .then(
               function(){}, 
               function() {
                  assert(false, "The dialog has NOT opened with the picker");
               }
            );
      },
      
      "Test Recent Sites sub-picker is shown": function() {
         // Select "Recent Sites" (the results for this are mocked)
         return browser.findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(1)")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The Recent Sites sub-picker was not shown");
            });
      },
      
      "Test Recent Sites result count": function() {
         // Count the mocked results...
         return browser.findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:nth-child(2) .alfresco-menus-AlfMenuBar .dijitMenuItem")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Unexpected number of Recent Sites shown");
            });
      },
      
      "Test selecting Recent site shows sub-picker": function() {
         // Count the mocked results...
         return browser.findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:nth-child(2) .alfresco-menus-AlfMenuBar .dijitMenuItem:first-child")
            .click()
         .end()
          .findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "The tree sub-picker was not shown");
            });
      },
      
      "Test selecting a container": function() {
         // Using implicit wait of findAll... here...
         return browser.findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:nth-child(3) .dijitTreeNodeContainer .dijitTreeRow .dijitTreeLabel").end()
         .findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:nth-child(3) .dijitTreeNodeContainer .dijitTreeRow .dijitTreeLabel")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-pickers-Picker .picked-items tr")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The container was not picked");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});