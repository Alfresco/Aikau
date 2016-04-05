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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   defineSuite(module, {
      name: "Gallery View (focus) Tests",
      testPage: "/GalleryViewFocus",

      // See AKU-690...
      "Keyboard focus works": function() {
         return this.remote.findDisplayedByCssSelector("#VERTICAL_ITEM_0 .alfresco-renderers-Property")
            .click()
            .end()

         .pressKeys(keys.ARROW_RIGHT)

         .getActiveElement()
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Telford and Wrekin Council", "Focus not moved");
            });
      },

      // See AKU-689...
      // We need to ensure that horizontal widget resize events are correctly handled as the grid cells resize...
      "Test initial sizing": function() {
         return this.remote.findDisplayedByCssSelector("#VERTICAL_ITEM_5 .alfresco-layout-HorizontalWidgets")
            .getSize()
            .then(function(size) {
               assert.equal(size.width, 200, "Width not set correctly");
            });
      }
   });
});