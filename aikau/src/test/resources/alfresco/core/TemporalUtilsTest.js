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
 * @author Richard Smith
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "TemporalUtils Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/TemporalUtils", "TemporalUtils Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
      "Check publish on 'TEMPORALUTILS_TEST1'": function () {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST1", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("over 20 years ago", "Txt should contain 'over 20 years ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST2'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST2", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("over 10 years ago", "Txt should contain 'over 10 years ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST3'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST3", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("12 months ago", "Txt should contain '12 months ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST4'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST4", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("6 months ago", "Txt should contain '6 months ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST5'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST5", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("3 months ago", "Txt should contain '3 months ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST6'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST6", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("2 months ago", "Txt should contain '2 months ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST7'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST7", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("about a month ago", "Txt should contain 'about a month ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST8'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST8", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("3 days ago", "Txt should contain '3 days ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST9'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST9", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("2 days ago", "Txt should contain '2 days ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST10'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST10", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("about a day ago", "Txt should contain 'about a day ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST11'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST11", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("3 hours ago", "Txt should contain '3 hours ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST12'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST12", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("2 hours ago", "Txt should contain '2 hours ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST13'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST13", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("about an hour ago", "Txt should contain 'about an hour ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST14'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST14", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("30 minutes ago", "Txt should contain '30 minutes ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST15'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST15", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("20 minutes ago", "Txt should contain '20 minutes ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST16'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST16", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("10 minutes ago", "Txt should contain '10 minutes ago'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST17'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST17", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("just now", "Txt should contain 'just now'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST18'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST18", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("2015-01-04T11:52:58+00:00", "Txt should contain '2015-01-04T11:52:58+00:00'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST19'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST19", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("Thu Dec 04 2014", "Txt should contain 'Thu Dec 04 2014'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST20'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST20", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("Thu 4 Dec 2014 09:30:10", "Txt should contain 'Thu 4 Dec 2014 09:30:10'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST21'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST21", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("04 December, 2014", "Txt should contain '04 December, 2014'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST22'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST22", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("11:00:00 GMT+0000 (UTC)", "Txt should contain '11:00:00 GMT+0000 (UTC)'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST23'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST23", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("11:23:00 GMT+0000 (UTC)", "Txt should contain '11:23:00 GMT+0000 (UTC)'");
               }
            );
      },

      "Check publish on 'TEMPORALUTILS_TEST24'": function() {
         return browser.findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST24", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  expect(txt).to.contain("08:00:00 GMT+0000 (UTC)", "Txt should contain '08:00:00 GMT+0000 (UTC)'");
               }
            );
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});