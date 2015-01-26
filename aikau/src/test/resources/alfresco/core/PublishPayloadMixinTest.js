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
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   registerSuite({
      name: 'PublishPayloadMixinTest',
      'publishPayloadMixins': function () {

         var browser = this.remote;
         var testname = "PublishPayloadMixinTest";
         return TestCommon.loadTestWebScript(this.remote, "/PublishPayloadMixin", testname)

         // Check that with minimal configuration we still get a payload published
         .findByCssSelector("#PA_NO_TYPE")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC1", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that no search request is used when 'useHash' is enabled");
               assert(elements.length == 1, "Minimal configuration publish failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data1", "value1"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that minimal configuration works");
               assert(elements.length == 1, "Minimal config payload failure");
            })
            .end()

         // Check that setting the CONFIGURED type works and that the current item is NOT mixed into the payload...
         .findByCssSelector("#PA_CONFIGURED")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC2", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that CONFIGURED type payload is published");
               assert(elements.length == 1, "CONFIGURED type publish failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data2", "value2"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that minimal configuration works");
               assert(elements.length == 1, "CONFIGURED type payload failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "mixinData1", "mixinValue1"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that CONFIGURED type doesn't mixin current item without explicit config");
               assert(elements.length === 0, "CONFIGURED type payload failure mixed in current item unexpectedly");
            })
            .end()

         // Check that setting the CONFIGURED type works and that the current item IS mixed into the payload...
         .findByCssSelector("#PA_CONFIGURED_WITH_ITEM_MIXIN")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC3", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that CONFIGURED type payload is published");
               assert(elements.length == 1, "CONFIGURED type publish failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data3", "value3"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that minimal configuration works");
               assert(elements.length == 1, "CONFIGURED type payload failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "mixinData2", "mixinValue2"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that CONFIGURED type doesn't mixin current item without explicit config");
               assert(elements.length == 1, "CONFIGURED type payload didn't mixin in current item");
            })
            .end()

         // Check that setting the CURRENT_ITEM type works...
         .findByCssSelector("#PA_CURRENT_ITEM")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC4", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that CURRENT_ITEM type payload is published");
               assert(elements.length == 1, "CURRENT_ITEM type publish failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data4", "value4"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that CURRENT_ITEM type doesn't include configured payload");
               assert(elements.length === 0, "CURRENT_ITEM type payload failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "mixinData3", "mixinValue3"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that CURRENT_ITEM type payload is correct");
               assert(elements.length == 1, "CURRENT_ITEM type was not correct");
            })
            .end()

         // Check that setting the PROCESS type works...
         .findByCssSelector("#PA_PROCESS")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC5", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that PROCESS type payload is published");
               assert(elements.length == 1, "PROCESS type publish failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "data5", "prefix_mixinValue4_postfix"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that PROCESS is generated correctly");
               assert(elements.length == 1, "PROCESS type payload failure");
            })
            .end()

         // Check that setting the BUILD type works...
         .findByCssSelector("#PA_BUILD")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("TOPIC6", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that BUILD type payload is published");
               assert(elements.length == 1, "BUILD type publish failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "itemData", "mixinValue5"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that BUILD type payload was correct");
               assert(elements.length == 1, "BUILD type payload failure");
            })
            .end()

         // Check the PropertyLink widget implements the mixin correctly
         .findByCssSelector("#PROPERTYLINK span.inner")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("PROPERTY_LINK", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that PROPERTYLINK payload is published");
               assert(elements.length == 1, "PROPERTYLINK publish failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "SHARE_PAGE_RELATIVE"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that PROPERTYLINK type payload was correct");
               assert(elements.length == 1, "PROPERTYLINK type payload failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "site/abcdefg/dashboard"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that PROPERTYLINK url payload was correct");
               assert(elements.length == 1, "PROPERTYLINK url payload failure");
            })
            .end()

         // Check the DateLink widget implements the mixin correctly
         .findByCssSelector("#DATELINK span.inner")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("DATE_LINK", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that DATELINK payload is published");
               assert(elements.length == 1, "DATELINK publish failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "SHARE_PAGE_RELATIVE"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that DATELINK type payload was correct");
               assert(elements.length == 1, "DATELINK type payload failure");
            })
            .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "user/bgriffin/profile"))
            .then(function(elements) {
               TestCommon.log(testname,"Check that DATELINK url payload was correct");
               assert(elements.length == 1, "DATELINK url payload failure");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});