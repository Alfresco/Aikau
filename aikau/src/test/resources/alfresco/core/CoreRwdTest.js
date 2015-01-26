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
 * This test assesses the CoreRwd mixin as applied to AlfMenuBarPopup
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   registerSuite({
      name: 'CoreRwd Test',
      'alfresco/core/CoreRwd': function () {

         var browser = this.remote;
         var testname = "CoreRwdTest";
         return TestCommon.loadTestWebScript(this.remote, "/CoreRwd", testname)

         .end()

         .findById("DROP_DOWN_MENU_1")
            .getAttribute("class")
            .then(function (classes1){
               TestCommon.log(testname,"Check the dropdown is not 'hidden'");
               expect(classes1).to.not.contain("hidden", "Test #1a - The dropdown should not have class 'hidden'");
            })

            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check the dropdown is visible");
               expect(displayed).to.equal(true, "Test #1b - The dropdown should be visible");
            })

            .setWindowSize(null, 700, 400)

            .getAttribute("class")
            .then(function (classes2){
               TestCommon.log(testname,"Check the dropdown is 'hidden'");
               expect(classes2).to.contain("hidden", "Test #1c - The dropdown should have class 'hidden'");
            })

            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check the dropdown is not visible");
               expect(displayed).to.equal(false, "Test #1d - The dropdown should not be visible");
            })

            .setWindowSize(null, 1024, 768)

            .getAttribute("class")
            .then(function (classes3){
               TestCommon.log(testname,"Check the dropdown is not 'hidden' again");
               expect(classes3).to.not.contain("hidden", "Test #1e - The dropdown should not have class 'hidden'");
            })

            .isDisplayed()
            .then(function (displayed){
               TestCommon.log(testname,"Check the dropdown is visible again");
               expect(displayed).to.equal(true, "Test #1f - The dropdown should be visible again");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});