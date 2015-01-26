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
 * This is a unit test for AlfTabContainer
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, require, TestCommon, keys) {

   registerSuite({
      name: 'Base Form Control Test',

      'BaseFormControl set value over pubsub': function () {
         var testname = "BaseFormControl set value over pubsub";
         var browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/BaseForm", testname)

            .end()

            .findByCssSelector('div#FORM_FIELD div.control input[name="control"]')
               .getProperty("value")
               .then(function(val){
                  TestCommon.log(testname, "Checking the form field is empty");
                  expect(val).to.equal("", "The form field should be empty");
               })
            .end()

            .findById("SET_FORM_VALUE_1")
               .click()
            .end()

            .findByCssSelector('div#FORM_FIELD div.control input[name="control"]')
               .getProperty("value")
               .then(function(val){
                  TestCommon.log(testname, "Checking the form field is empty");
                  expect(val).to.equal("", "The form field should be empty");
               })
            .end()

            .findById("SET_FORM_VALUE_2")
               .click()
            .end()

            .findByCssSelector('div#FORM_FIELD div.control input[name="control"]')
               .getProperty("value")
               .then(function(val){
                  TestCommon.log(testname, "Checking the form field is empty");
                  expect(val).to.equal("", "The form field should be empty");
               })
            .end()

            .findById("SET_FORM_VALUE_3")
               .click()
            .end()

            .findByCssSelector('div#FORM_FIELD div.control input[name="control"]')
               .getProperty("value")
               .then(function(val){
                  TestCommon.log(testname, "Checking the form field now contains 'this is the new value'");
                  expect(val).to.equal("this is the new value", "The form field should now contain 'this is the new value'");
               })
            .end()

            .findById("SET_FORM_VALUE_4")
               .click()
            .end()

            .findByCssSelector('div#FORM_FIELD div.control input[name="control"]')
               .getProperty("value")
               .then(function(val){
                  TestCommon.log(testname, "Checking the form field now contains '3.14159265'");
                  expect(val).to.equal("3.14159265", "The form field should now contain '3.14159265'");
               })
            .end()

            .findById("SET_FORM_VALUE_5")
               .click()
            .end()

            .findByCssSelector('div#FORM_FIELD div.control input[name="control"]')
               .getProperty("value")
               .then(function(val){
                  TestCommon.log(testname, "Checking the form field now contains 'true'");
                  expect(val).to.equal("true", "The form field should now contain 'true'");
               })
            .end()

            .alfPostCoverageResults(browser)

      }
      
   });
});