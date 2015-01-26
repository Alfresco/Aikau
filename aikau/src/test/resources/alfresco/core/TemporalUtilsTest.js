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
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   registerSuite({
      name: 'TemporalUtils Test',
      'TemporalUtils': function () {
         var browser = this.remote;
         var testname = "TemporalUtilsTest";
         return TestCommon.loadTestWebScript(this.remote, "/TemporalUtils", testname)

         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST1", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST1'");
                  expect(txt).to.contain("over 20 years ago", "Txt should contain 'over 20 years ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST2", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST2'");
                  expect(txt).to.contain("over 10 years ago", "Txt should contain 'over 10 years ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST3", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST3'");
                  expect(txt).to.contain("12 months ago", "Txt should contain '12 months ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST4", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST4'");
                  expect(txt).to.contain("6 months ago", "Txt should contain '6 months ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST5", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST5'");
                  expect(txt).to.contain("3 months ago", "Txt should contain '3 months ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST6", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST6'");
                  expect(txt).to.contain("2 months ago", "Txt should contain '2 months ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST7", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST7'");
                  expect(txt).to.contain("about a month ago", "Txt should contain 'about a month ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST8", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST8'");
                  expect(txt).to.contain("3 days ago", "Txt should contain '3 days ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST9", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST9'");
                  expect(txt).to.contain("2 days ago", "Txt should contain '2 days ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST10", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST10'");
                  expect(txt).to.contain("about a day ago", "Txt should contain 'about a day ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST11", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST11'");
                  expect(txt).to.contain("3 hours ago", "Txt should contain '3 hours ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST12", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST12'");
                  expect(txt).to.contain("2 hours ago", "Txt should contain '2 hours ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST13", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST13'");
                  expect(txt).to.contain("about an hour ago", "Txt should contain 'about an hour ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST14", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST14'");
                  expect(txt).to.contain("30 minutes ago", "Txt should contain '30 minutes ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST15", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST15'");
                  expect(txt).to.contain("20 minutes ago", "Txt should contain '20 minutes ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST16", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST16'");
                  expect(txt).to.contain("10 minutes ago", "Txt should contain '10 minutes ago'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST17", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST17'");
                  expect(txt).to.contain("just now", "Txt should contain 'just now'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST18", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST18'");
                  expect(txt).to.contain("2015-01-04T11:52:58+00:00", "Txt should contain '2015-01-04T11:52:58+00:00'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST19", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST19'");
                  expect(txt).to.contain("Thu Dec 04 2014", "Txt should contain 'Thu Dec 04 2014'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST20", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST20'");
                  expect(txt).to.contain("Thu 4 Dec 2014 09:30:10", "Txt should contain 'Thu 4 Dec 2014 09:30:10'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST21", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST21'");
                  expect(txt).to.contain("04 December, 2014", "Txt should contain '04 December, 2014'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST22", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST22'");
                  expect(txt).to.contain("11:00:00 GMT+0000 (UTC)", "Txt should contain '11:00:00 GMT+0000 (UTC)'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST23", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST23'");
                  expect(txt).to.contain("11:23:00 GMT+0000 (UTC)", "Txt should contain '11:23:00 GMT+0000 (UTC)'");
               }
            )
         .end()

         .findByCssSelector(TestCommon.topicDataSelector("TEMPORALUTILS_TEST24", "publish", "any"))
            .getVisibleText()
            .then(
               function(txt){
                  TestCommon.log(testname,"Check publish on 'TEMPORALUTILS_TEST24'");
                  expect(txt).to.contain("08:00:00 GMT+0000 (UTC)", "Txt should contain '08:00:00 GMT+0000 (UTC)'");
               }
            )
         .end()

         .alfPostCoverageResults(browser);
      }
   });
});