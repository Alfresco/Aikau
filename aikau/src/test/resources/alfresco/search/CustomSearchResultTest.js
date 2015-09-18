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
        "alfresco/TestCommon"],
        function(registerSuite, assert, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Custom Search Result Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/CustomSearchResult", "Custom Search Result Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that MoreInfo widget is not displayed": function() {
         // The test page configures the "showMoreInfo" to be false so the MoreInfo renderer should
         // not be displayed...
         return browser.findAllByCssSelector(".alfresco-renderers-MoreInfo")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The MoreInfo widget should not have been rendered");
            });
      },

      "Check that widgets are rendered above": function() {
         return browser.findAllByCssSelector(".alfresco-search-AlfSearchResult .aboveCell .alfresco-renderers-Banner")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Additional widget was NOT rendered above the main result properties");
            });
      },

      "Check that widgets are rendered below": function() {
         return browser.findAllByCssSelector(".alfresco-search-AlfSearchResult .belowCell .alfresco-renderers-Banner")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Additional widget was NOT rendered below the main result properties");
            });
      },

      "Check that right-click actions are enabled": function() {
         return browser.findByCssSelector(".alfresco-search-AlfSearchResult .aboveCell .alfresco-renderers-Banner")
            .moveMouseTo()
            .clickMouseButton(2)
         .end()
         .findAllByCssSelector(".alfresco-menus-AlfContextMenu")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Right-click context actions menu not displayed");
            });
      },

      "Check that the additional action filter is applied": function() {
         return browser.findAllByCssSelector(".alfresco-menus-AlfContextMenu .alfresco-menus-AlfMenuItem")
            .then(function(elements) {
               assert.lengthOf(elements, 9, "Not enough actions were displayed");
            })
         .end()
         .findByCssSelector(".alfresco-menus-AlfContextMenu .alfresco-menus-AlfMenuItem:last-child .dijitMenuItemLabel")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Test Action");
            });
      },
      
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});