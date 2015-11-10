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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, TestCommon, keys) {

   registerSuite(function(){
      var browser;

      return {
         name: "Gallery View (focus) Tests",
         
         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/GalleryViewFocus", "Gallery View (focus) Tests").end();
         },
         
         beforeEach: function() {
            browser.end();
         },

         "Keyboard focus works": function() {
            return browser.findDisplayedByCssSelector("#PROPERTY_ITEM_0")
               .click()
            .end()

            .pressKeys(keys.ARROW_RIGHT)

            .getActiveElement()
               .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "Telford and Wrekin Council", "Focus not moved");
                  });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});