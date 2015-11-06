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
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Download Action Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/Download", "Download Action Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Test that action does appear for document": function() {
            return browser.findById("ACTIONS_ITEM_0_MENU_text")
               .click()
            .end()
            .findById("ACTIONS_ITEM_0_DOWNLOAD");
         },

         "Test that action does NOT appear for folder": function() {
            return browser.findById("ACTIONS_ITEM_1_MENU_text")
               .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_1_DOWNLOAD")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Download action should not be present for folder");
               });
         },

         "Test download action": function() {
            return browser.findById("ACTIONS_ITEM_0_MENU_text")
               .click()
            .end()
            
            .findById("ACTIONS_ITEM_0_DOWNLOAD_text")
               .click()
            .end()

            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.property(payload, "url", "No 'url' attribute");
                  assert.include(payload.url, "/proxy/alfresco/slingshot/node/content/workspace/SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4/2013-12-29%2009.58.43.jpg?a=true", "Incorrect URL");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});