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
 * 
 * @author Erik Winlöf
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "DateTextBox Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DateTextBox", "DateTextBox Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
     "Test initial values": function () {
         return browser.findByCssSelector("#DOJODATETEXTBOX_CONTROL")
            .getProperty("value")
            .then(function(value) {
               assert(value === "12/12/2012", "Unexpected date value found in control");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }

      // TODO: Can't get this to pass...
      // TEST 2
      // .findByCssSelector("#DOJODATETEXTBOX .control .dijitArrowButton input.dijitArrowButtonInner")
      //    .click()
      //    .end()
      // .findByCssSelector("#DOJODATETEXTBOX_CONTROL_popup tbody tr:nth-of-type(3) td:nth-of-type(5) span")
      //    .click()
      //    .end()
      // .findByCssSelector("#DOJODATETEXTBOX_CONTROL")
      //    .getProperty('value')
      //    .then(function(value) {
      //       assert(value == "14/12/2012", "Unexpected date value found in control after date change");
      //    })
      //    .end()

      // // TEST 3
      // .findByCssSelector("#FORM > .buttons > span:nth-of-type(1) > span > span > span:nth-of-type(3)")
      //    .click()
      //    .end()
      // .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "someDate", "2012-12-14"))
      //    .then(null, function() {
      //       assert(false, "Form submission did not publish the expected event");
      //    })
      //    .end()
   });
});