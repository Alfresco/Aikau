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
 * This test renders examples of Category.
 *
 * The test renders examples of Category renderer and clicks resulting Links to make sure publishing proceeds as expected.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, expect, require, TestCommon) {

   defineSuite(module, {
      name: "Category Tests",
      testPage: "/Category",

      "Check there are the expected number of categories successfully rendered": function() {
         return this.remote.findAllByCssSelector("span.alfresco-renderers-Category")
            .then(function(categories) {
               expect(categories).to.have.length(6, "There should be 6 categories successfully rendered");
            });
      },

      "Check the link click published as expected (1)": function() {
         return this.remote.findByCssSelector("#CATEGORY_6 a.alfresco-navigation-Link:first-of-type")
            .click()
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "ALF_NAVIGATE_TO_PAGE"))
            .then(
               function() {},
               function() {
                  assert(false, "The link did not publish on 'ALF_NAVIGATE_TO_PAGE' after mouse clicks");
               }
            );
      },

      "Check the link click published the payload as expected (type)": function() {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "HASH"))
            .then(
               function() {},
               function() {
                  assert(false, "The link did not publish the payload with 'type' as 'HASH'");
               }
            );
      },

      "Check the link click published the payload as expected (url)": function() {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "filter=category|english/English"))
            .then(
               function() {},
               function() {
                  assert(false, "The link did not publish the payload with 'url' as 'filter=category|english/English'");
               }
            );
      },

      "Check the link click published as expected (2)": function() {
         return this.remote.findByCssSelector("#CATEGORY_6 a.alfresco-navigation-Link:last-of-type")
            .click()
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "ALF_NAVIGATE_TO_PAGE"))
            .then(
               function() {},
               function() {
                  assert(false, "The link did not publish on 'ALF_NAVIGATE_TO_PAGE' after mouse clicks");
               }
            );
      },

      "Check the link click published the payload as expected (type 2)": function() {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "HASH"))
            .then(
               function() {},
               function() {
                  assert(false, "The link did not publish the payload with 'type' as 'HASH'");
               }
            );
      },

      "Check the link click published the payload as expected (url 2)": function() {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "filter=category|spanish/Spanish"))
            .then(
               function() {},
               function() {
                  assert(false, "The link did not publish the payload with 'url' as 'filter=category|spanish/Spanish'");
               }
            );
      }
   });
});