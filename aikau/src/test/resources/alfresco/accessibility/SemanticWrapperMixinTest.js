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
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, require, TestCommon, keys) {

   registerSuite({
      name: 'SemanticWrapperMixin Test',
      'alfresco/accessibility/_SemanticWrapperMixin': function () {

         var browser = this.remote;
         var testname = "SemanticWrapperMixinTest";
         return TestCommon.loadTestWebScript(this.remote, "/SemanticWrapperMixin", testname)

         .findByCssSelector("#NO_WRAPPER > span.copyright > span.licenseHolder")
         .getVisibleText()
            .then(function (text) {
               TestCommon.log(testname,"Check NO_WRAPPER dom is correct");
               expect(text).to.equal("Licensed To: NO_WRAPPER licenseLabel", "The NO_WRAPPER dom must be incorrect");
            })
         .end()

         .findByCssSelector("#GOOD_WRAPPER > footer > span.copyright > span.licenseHolder")
            .getVisibleText()
            .then(function (text) {
               TestCommon.log(testname,"Check GOOD_WRAPPER dom is correct");
               expect(text).to.equal("Licensed To: GOOD_WRAPPER licenseLabel", "The GOOD_WRAPPER dom must be incorrect");
            })
         .end()

         .findByCssSelector("#BAD_WRAPPER > span.copyright > span.licenseHolder")
            .getVisibleText()
            .then(function (text) {
               TestCommon.log(testname,"Check BAD_WRAPPER dom is correct");
               expect(text).to.equal("Licensed To: BAD_WRAPPER licenseLabel", "The BAD_WRAPPER dom must be incorrect");
            })
         .end()

         .findByCssSelector("#LEFT_AND_RIGHT_WRAPPER > header > div > div.left-widgets")
            .getVisibleText()
            .then(function (text) {
               TestCommon.log(testname,"Check LEFT_AND_RIGHT_WRAPPER dom is correct");
               expect(text).to.equal("This is a title with a semantic wrapper", "The LEFT_AND_RIGHT_WRAPPER dom must be incorrect");
            })
         .end()
         .alfPostCoverageResults(browser);
      }
   });
});