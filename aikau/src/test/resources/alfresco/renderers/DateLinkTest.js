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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, expect, require, TestCommon) {

   registerSuite({
      name: 'DateLink Test',
      'alfresco/renderers/Date': function () {

         var browser = this.remote;
         var testname = "DateLinkTest";
         return TestCommon.loadTestWebScript(this.remote, "/DateLink", testname)

         // Test that the dates are rendered as expected. The model uses a very old ISO date which should ensure
         // that we get a relative date in the form "Modified over X years ago" so we're going to use a regular
         // expression that should continue to work in the future as the date gets further into the past
         .findByCssSelector("#CUSTOM_PROPS .value")
            .getVisibleText()
            .then(function(resultText) {
               TestCommon.log(testname,"Check the first date is rendered correctly");
               assert(/(Modified over \d+ years ago by Brian Griffin)/g.test(resultText), "Test #1 - Custom property not rendered correctly: " + resultText);
            })
            .end()

         .findByCssSelector("#STANDARD_PROPS .value")
            .getVisibleText()
            .then(function(resultText) {
               TestCommon.log(testname,"Check the second date is rendered correctly");
               assert(/(Modified over \d+ years ago by Chris Griffin)/g.test(resultText), "Test #2 - Standard property not rendered correctly: " + resultText);
            })
            .end()

         // Click the first date
         .findByCssSelector("#CUSTOM_PROPS .value")
            .click()
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "ALF_NAVIGATE_TO_PAGE"))
            .then(
               function(){TestCommon.log(testname,"Check the date click published as expected")},
               function(){assert(false, "The datelink did not publish on 'ALF_NAVIGATE_TO_PAGE' after mouse clicks")}
            )
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "SHARE_PAGE_RELATIVE"))
            .then(
               function(){TestCommon.log(testname,"Check the date click published the payload as expected")},
               function(){assert(false, "The datelink did not publish the payload with 'type' as 'SHARE_PAGE_RELATIVE'")}
            )
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "/1/2/3/4/5"))
            .then(
               function(){TestCommon.log(testname,"Check the date click published the payload as expected")},
               function(){assert(false, "The datelink did not publish the payload with 'url' as '/1/2/3/4/5'")}
            )
            .end()

         // Click the other dates for coverage testing
         .findByCssSelector("#STANDARD_PROPS .value")
            .click()
            .end()

         .findByCssSelector("#BROKEN_1 .value")
            .click()
            .end()

         .findByCssSelector("#BROKEN_2 .value")
            .click()
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});