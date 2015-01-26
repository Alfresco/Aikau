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
 * This test uses a MockXhr service to test the user service responds as required.
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   registerSuite({
      name: 'User Service Test',
      'UserService - success': function () {

         var browser = this.remote;
         var testname = "UserServiceTest - Success";
         return TestCommon.loadTestWebScript(this.remote, "/UserServiceSuccess", testname)

         .findByCssSelector("#HEADER_USER_STATUS > div.lastUpdate")
            .getVisibleText()
            .then(function (text){
               TestCommon.log(testname,"Check the starting 'last updated' copy");
               expect(text).to.equal("Last updated: over 3 years ago", "The 'last updated' should read 'Last updated: over 3 years ago' to begin with");
            })
         .end()

         .findByCssSelector("#HEADER_USER_STATUS > div.status")
            .getVisibleText()
            .then(function (text){
               TestCommon.log(testname,"Check the starting status copy");
               expect(text).to.equal("I'm so very happy", "The status should read 'I'm so very happy' to begin with");
            })
            .click()
         .end()

         .findById("HEADER_USER_STATUS_STATUS_TEXTAREA")
            .click()
            .type("testing")
         .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog div.footer span.alfresco-buttons-AlfButton:first-of-type span.dijitButtonNode")
            .click()
         .end()

         .findByCssSelector("#HEADER_USER_STATUS > div.lastUpdate")
            .getVisibleText()
            .then(function (text){
               TestCommon.log(testname,"Check the finishing 'last updated' copy");
               expect(text).to.equal("Last updated: just now", "The 'last updated' should read 'Last updated: just now' to finish");
            })
         .end()

         .alfPostCoverageResults(browser);
      },

      'UserService - failure': function () {

         var browser = this.remote;
         var testname = "UserServiceTest - Failure";
         return TestCommon.loadTestWebScript(this.remote, "/UserServiceFailure", testname)

         .end()

         .findByCssSelector("#HEADER_USER_STATUS > div.lastUpdate")
            .getVisibleText()
            .then(function (text){
               TestCommon.log(testname,"Check the starting 'last updated' copy");
               expect(text).to.equal("Last updated: over 3 years ago", "The 'last updated' should read 'Last updated: over 3 years ago' to begin with");
            })
         .end()

         .findByCssSelector("#HEADER_USER_STATUS > div.status")
            .getVisibleText()
            .then(function (text){
               TestCommon.log(testname,"Check the starting status copy");
               expect(text).to.equal("I'm not so very happy", "The status should read 'I'm not so very happy' to begin with");
            })
            .click()
         .end()

         .findById("HEADER_USER_STATUS_STATUS_TEXTAREA")
            .click()
            .type("testing")
         .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog div.footer span.alfresco-buttons-AlfButton:first-of-type span.dijitButtonNode")
            .click()
         .end()

         .findByCssSelector("#HEADER_USER_STATUS > div.lastUpdate")
            .getVisibleText()
            .then(function (text){
               TestCommon.log(testname,"Check the finishing 'last updated' copy");
               expect(text).to.equal("Last updated: over 3 years ago", "The 'last updated' should read 'Last updated: over 3 years ago' to finish");
            })
         .end()

         .alfPostCoverageResults(browser);
      }
   });
});