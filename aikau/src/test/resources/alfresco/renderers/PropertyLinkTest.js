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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the 
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   registerSuite({
      name: 'PropertyLink Test',
      'alfresco/renderers/PropertyLink': function () {

         var browser = this.remote;
         var testname = "PropertyLinkTest";
         return TestCommon.loadTestWebScript(this.remote, "/PropertyLink", testname)

         .findByCssSelector("#LIST_WITH_HEADER_ITEMS tr:first-child td span.inner")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "name", "Site1"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that currentItem is published");
               assert(elements.length == 1, "'name' not included in currentItem data");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "urlname", "site1"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that currentItem is published");
               assert(elements.length == 1, "'urlname' not included in currentItem data");
            })
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("publishTopic", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that topic is published");
               assert(elements.length == 1, "topic not published correctly");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});