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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the 
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Boolean Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Boolean", "Boolean Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Tests": function () {
         var testname = "BooleanTest";
         return browser.findAllByCssSelector("span.alfresco-renderers-Property")
            .then(function (booleans) {
               TestCommon.log(testname,"Check there are 60 cells as described in the model");
               expect(booleans).to.have.length(60, "There should be 60 cells rendered");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(1) td:first-of-type")
            .getVisibleText()
            .then(function (result1) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result1).to.equal("Yes", "Row one, column one should say 'Yes'");
            })
            .end()

         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(1) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result2) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result2).to.equal("True", "Row one, column two should say 'True'");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(2) td:first-of-type")
            .getVisibleText()
            .then(function (result3) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result3).to.equal("Yes", "Row two, column one should say 'Yes'");
            })
            .end()
         
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(2) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result4) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result4).to.equal("True", "Row two, column two should say 'True'");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(3) td:first-of-type")
            .getVisibleText()
            .then(function (result5) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result5).to.equal("Yes", "Row three, column one should say 'Yes'");
            })
            .end()
         
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(3) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result6) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result6).to.equal("True", "Row three, column two should say 'True'");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(4) td:first-of-type")
            .getVisibleText()
            .then(function (result7) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result7).to.equal("Yes", "Row four, column one should say 'Yes'");
            })
            .end()
         
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(4) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result8) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result8).to.equal("True", "Row four, column two should say 'True'");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(5) td:first-of-type")
            .getVisibleText()
            .then(function (result9) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result9).to.equal("No", "Row five, column one should say 'No'");
            })
            .end()
         
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(5) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result10) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result10).to.equal("False", "Row five, column two should say 'False'");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(6) td:first-of-type")
            .getVisibleText()
            .then(function (result11) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result11).to.equal("No", "Row six, column one should say 'No'");
            })
            .end()
         
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(6) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result12) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result12).to.equal("False", "Row six, column two should say 'False'");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(7) td:first-of-type")
            .getVisibleText()
            .then(function (result13) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result13).to.equal("No", "Row seven, column one should say 'No'");
            })
            .end()
         
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(7) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result14) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result14).to.equal("False", "Row seven, column two should say 'False'");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(8) td:first-of-type")
            .getVisibleText()
            .then(function (result15) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result15).to.equal("No", "Row eight, column one should say 'No'");
            })
            .end()
         
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(8) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result16) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result16).to.equal("False", "Row eight, column two should say 'False'");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(9) td:first-of-type")
            .getVisibleText()
            .then(function (result17) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result17).to.equal("Unknown", "Row nine, column one should say 'Unknown'");
            })
            .end()
         
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(9) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result18) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result18).to.equal("Unknown", "Row nine, column two should say 'Unknown'");
            })
            .end()

         // Check each row
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(10) td:first-of-type")
            .getVisibleText()
            .then(function (result19) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result19).to.equal("Unknown", "Row ten, column one should say 'Unknown'");
            })
         .end()
         
         .findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(10) td:nth-of-type(2)")
            .getVisibleText()
            .then(function (result20) {
               TestCommon.log(testname,"Check the value of a boolean");
               expect(result20).to.equal("Unknown", "Row ten, column two should say 'Unknown'");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});