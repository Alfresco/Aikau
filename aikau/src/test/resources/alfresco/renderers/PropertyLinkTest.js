/*jshint browser:true*/
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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "PropertyLink Tests",
      testPage: "/PropertyLink",

      "Check rendering is not double encoded": function() {
         return this.remote.findDisplayedByCssSelector("#PROPLINK_ITEM_0 .inner .value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "TestSök <img ='><svg onload=\"window.hacked=true\"'>");
            });
      },

      "No XSS attacks were successful": function() {
         return this.remote.execute(function() {
               return window.hacked;
            })
            .then(function(hacked) {
               assert.isFalse(!!hacked);
            });
      },

      "Check that currentItem is published": function() {
         return this.remote.findByCssSelector("#PROPLINK_ITEM_0 .inner .value")
            .click()
         .end()

         .getLastPublish("publishTopic")
            .then(function(payload) {
               assert.propertyVal(payload, "name", "TestSök <img ='><svg onload=\"window.hacked=true\"'>");
               assert.propertyVal(payload, "urlname", "site1");
            });
      }
   });
});