/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @author David Webster
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
       function (registerSuite, expect, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "XHR Actions Renderer Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/XhrActions", "XHR Actions Renderer Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Check Actions menu was rendered": function () {
         // Test spec:
         // 1: Check dropdown element exists
         return browser.findByCssSelector(".alfresco-menus-AlfMenuBar span:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Actions", "Actions should be rendered as a menu: " + resultText);
            });
      },

      "Check that document request event was triggered": function() {
         // 2: Click on it. Check event triggered: ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST
         return browser.findByCssSelector(".alfresco-menus-AlfMenuBar span:first-child")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Retrieve single doc request not triggered");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});