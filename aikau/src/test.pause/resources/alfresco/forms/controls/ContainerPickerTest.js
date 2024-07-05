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
      name: "ContainerPicker Tests",
      testPage: "/ContainerPicker",

      "Test picker dialog can be displayed": function() {
         return this.remote.findByCssSelector("#FOLDER_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
         .end()
       
         .findDisplayedByCssSelector(".alfresco-pickers-Picker");
      },

      "Test Recent Sites sub-picker is shown": function() {
         // Select "Recent Sites" (the results for this are mocked)
         return this.remote.findDisplayedByCssSelector(".alfresco-pickers-SingleItemPicker");
      },

      "Test Recent Sites result count": function() {
         // Count the mocked results...
         return this.remote.findAllByCssSelector(".alfresco-pickers-SingleItemPicker .alfresco-menus-_AlfMenuItemMixin")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Unexpected number of Recent Sites shown");
            });
      },

      "Test selecting Recent site shows sub-picker": function() {
         // Count the mocked results...
         return this.remote.findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:nth-child(2) .alfresco-menus-AlfMenuBar .dijitMenuItem:first-child")
            .click()
         .end()
         
         .findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "The tree sub-picker was not shown");
            });
      },

      "Test selecting a container": function() {
         // Using implicit wait of findAll... here...
         return this.remote.getLastPublish("ALF_RESIZE_SIDEBAR").findDisplayedByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:nth-child(3) .dijitTreeNodeContainer .dijitTreeRow .dijitTreeLabel")
            .click()
         .end()

         
         
         .findAllByCssSelector(".alfresco-pickers-Picker .picked-items tr")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The container was not picked");
            });
      }
   });
});