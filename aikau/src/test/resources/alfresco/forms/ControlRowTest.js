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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "ControlRow Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ControlRow", "ControlRow Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test child form controls publish values": function() {
         return browser.findByCssSelector("#DB1_label")
            .click()
         .end()
         .getLastPublish("FORM1__valueChangeOf_SELECT1")
            .then(function(payload) {
               assert.equal(payload.value, "ONE", "The initial value of the select field wasn't published");
            })
         .getLastPublish("FORM1__valueChangeOf_TEXTBOX1")
         .then(function(payload) {
            assert.equal(payload.value, "Initial Value", "The initial value of the text box field wasn't published");
         })
         .getLastPublish("FORM1_TEST")
            .then(function(payload) {
               assert.equal(payload.selected, "ONE", "The dynamic payload button didn't get the published update");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});