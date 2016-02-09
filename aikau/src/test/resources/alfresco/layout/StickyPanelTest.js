
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
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   registerSuite(function() {
      var browser;

      return {
         name: "StickyPanel Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/StickyPanel", "StickyPanel Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Panel scrolls when content too great for window size": function() {
            return browser.setWindowSize(null, 1024, 300)
               .hasScrollbars(".alfresco-layout-StickyPanel__widgets")
               .then(function(hasScrollbars) {
                  assert.isTrue(hasScrollbars.vertical, "Should have scrollbar after resize");
               })
               .setWindowSize(null, 1024, 768)
               .hasScrollbars(".alfresco-layout-StickyPanel__widgets")
               .then(function(hasScrollbars) {
                  assert.isFalse(hasScrollbars.vertical, "Scrollbar should disappear after resize to original size");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});