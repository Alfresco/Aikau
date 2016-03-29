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
      "alfresco/TestCommon"], 
      function(registerSuite, assert, TestCommon) {

   registerSuite(function() {
      var browser;

      return {
         name: "PublishAction Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/PublishAction", "PublishAction Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Validate initial page state": function() {
            return browser.execute(function() {
               return window.bodyClicked;
            }).then(function(bodyClicked) {
               assert.isFalse(bodyClicked);
            });
         },

         "Clicking on action publishes correctly": function() {
            return browser.findById("EDIT_ME")
               .clearLog()
               .click()
            .end()

            .getLastPublish("EDIT_ME")
               .then(function(payload) {
                  assert.propertyVal(payload, "editMode", true);
               });
         },

         "Action clicks do not bubble upwards": function() {
            return browser.execute(function() {
                  return window.bodyClicked;
               })
               .then(function(bodyClicked) {
                  assert.isFalse(bodyClicked);
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});