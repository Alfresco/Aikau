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
 * This test renders examples of Banner and LockedBanner.
 * 
 * The test is simple and much of its validity is in the use of slightly damaged or incomplete models to inspect edge cases.
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   registerSuite({
      name: 'Banner and Locked Banner Test',
      'alfresco/renderers/Banner & alfresco/renderers/LockedBanner': function () {

         var browser = this.remote;
         var testname = "BannerTest";
         return TestCommon.loadTestWebScript(this.remote, "/Banner", testname)

         .findAllByCssSelector("span.alfresco-renderers-Banner")
            .then(function (banners){
               TestCommon.log(testname,"Check there are the expected number of banners successfully rendered");
               expect(banners).to.have.length(7, "There should be 7 banners successfully rendered");
            })
            .end()

         .findById("BANNER")
            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check 'BANNER' is displayed");
               expect(displayed).to.equal(true, "'BANNER' should be displayed");
            })
            .end()

         .findById("BANNER_EMPTY_MESSAGE")
            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check 'BANNER_EMPTY_MESSAGE' is not displayed");
               expect(displayed).to.equal(false, "'BANNER_EMPTY_MESSAGE' should not be displayed");
            })
            .end()

         .findById("BANNER_NULL_MESSAGE")
            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check 'BANNER_NULL_MESSAGE' is not displayed");
               expect(displayed).to.equal(false, "'BANNER_NULL_MESSAGE' should not be displayed");
            })
            .end()

         .findById("BANNER_NO_MESSAGE")
            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check 'BANNER_NO_MESSAGE' is not displayed");
               expect(displayed).to.equal(false, "'BANNER_NO_MESSAGE' should not be displayed");
            })
            .end()

         .findById("LOCKED_BANNER_LOCK_OWNER")
            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check 'LOCKED_BANNER_LOCK_OWNER' is displayed");
               expect(displayed).to.equal(true, "'LOCKED_BANNER_LOCK_OWNER' should be displayed");
            })
            .end()

         .findById("LOCKED_BANNER_WORKING_COPY_OWNER")
            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check 'LOCKED_BANNER_WORKING_COPY_OWNER' is displayed");
               expect(displayed).to.equal(true, "'LOCKED_BANNER_WORKING_COPY_OWNER' should be displayed");
            })
            .end()

         .findById("LOCKED_BANNER_NO_MESSAGE")
            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check 'LOCKED_BANNER_NO_MESSAGE' is not displayed");
               expect(displayed).to.equal(false, "'LOCKED_BANNER_NO_MESSAGE' should not be displayed");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});