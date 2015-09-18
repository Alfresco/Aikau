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
 * Test class for the Dashlet widget.
 * 
 * @author Martin Doyle
 */
define(["alfresco/TestCommon",
      "intern/chai!assert",
      "intern!object"
   ],
   function(TestCommon, assert, registerSuite) {

registerSuite(function(){
   var browser;

   return {
         name: "Dashlet Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/Dashlet", "Dashlet Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Toolbars and body display when widgets provided": function() {
            return browser.findByCssSelector("#NO_ID_DASHLET .alfresco-dashlets-Dashlet__toolbar")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Toolbar not visible when widgets provided");
               })
               .end()

            .findByCssSelector("#NO_ID_DASHLET .alfresco-dashlets-Dashlet__toolbar2")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Toolbar2 not visible when widgets provided");
               })
               .end()

            .findByCssSelector("#NO_ID_DASHLET .alfresco-dashlets-Dashlet__body")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Body not visible when widgets provided");
               })
               .end()

            .findByCssSelector("#VALID_ID_DASHLET .alfresco-dashlets-Dashlet__toolbar")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "Toolbar visible when widgets not provided");
               })
               .end()

            .findByCssSelector("#VALID_ID_DASHLET .alfresco-dashlets-Dashlet__toolbar2")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "Toolbar2 visible when widgets not provided");
               });
         },

         "Dashlet only resizable with ID": function() {
            return browser.findByCssSelector("#NO_ID_DASHLET .alfresco-dashlets-Dashlet__resize-bar")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "Resize bar visible when ID not provided");
               })
               .end()

            .findByCssSelector("#VALID_ID_DASHLET .alfresco-dashlets-Dashlet__resize-bar")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Resize bar not visible when ID provided");
               });
         },

         "Dashlet with pre-configured height is set appropriately": function() {
            return browser.findByCssSelector("#VALID_ID_DASHLET .alfresco-dashlets-Dashlet__body__widgets")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 300, "Body not equal to set height");
               });
         },

         // This does not work in Chrome currently, however we expect the FF test to pass, so this provides some level of regression testability
         "Resizing dashlet stores height": function() {
            TestCommon.skipIf(this, "environment", "chrome");

            return browser.findByCssSelector("#VALID_ID_DASHLET .alfresco-dashlets-Dashlet__resize-bar__icon")
               .moveMouseTo(0, 0)
               .pressMouseButton()
               .moveMouseTo(0, -50)
               .releaseMouseButton()
               .end()

            .getLastPublish("VALID_ID_ALF_STORE_DASHLET_HEIGHT_SUCCESS")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "requestConfig.data.height", 250, "Did not publish new height");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
      });
   });