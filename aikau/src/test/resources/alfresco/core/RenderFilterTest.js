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
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'RenderFilter Test',
      'RenderFilter': function () {
         var browser = this.remote;
         var testname = "RenderFilterTest";
         return TestCommon.loadTestWebScript(this.remote, "/RenderFilter", testname)

         // The IDs that should be displayed are...
         // MBI1 - successful filter rule
         // MBI3 - negated rule
         // MBI4 - absent property
         // MBI5 - successful AND condition
         // MI1 - successful filter rule following inherited currentItem change

         // The IDs that should not be displayed are...
         // MBI2 - failed filter rule
         // MBI6 - failed AND condition
         // MI2 - failed filter rule following inherited currentItem change

         .findById("MBI1")
            .then(function (el) {
               expect(el).to.be.an("object", "A single render filter rule failed unexpectedly");
            })
         .end()

         .findById("MBI3")
            .then(function (el) {
               expect(el).to.be.an("object", "A single negated render filter rule failed unexpectedly");
            })
         .end()

         .findAllByCssSelector("MBI3a")
            .then(function (els) {
               assert(els.length === 0, "A single negated render filter rule failed unexpectedly");
            })
         .end()

         .findById("MBI4")
            .then(function (el) {
               expect(el).to.be.an("object", "A single absent property render filter rule failed unexpectedly");
            })
         .end()

         .findById("MBI5")
            .then(function (el) {
               expect(el).to.be.an("object", "An AND condition property render filter rule failed unexpectedly");
            })
         .end()

         .findById("MBI7")
            .then(function (el) {
               TestCommon.log(testname,"Test OR property rule");
               expect(el).to.be.an("object", "An OR condition property render filter rule failed unexpectedly");
            })
         .end()

         .findAllByCssSelector("#MBI8")
            .then(function (els) {
               assert(els.length === 0, "An OR condition property render filter rule passed unexpectedly");
            })
         .end()

         .findAllByCssSelector("#MBI2")
            .then(function (els) {
               assert(els.length === 0, "An inherited currentItem change render filter rule passed unexpectedly");
            })
         .end()

         .findByCssSelector("#DD1_text")
            .sleep(250)
            .click()
         .end()

         .sleep(250)

         .findById("MI1")
            .then(function (el) {
               expect(el).to.be.an("object", "An inherited currentItem change render filter rule failed unexpectedly");
            })
         .end()

         .findAllByCssSelector("#MI2")
            .then(function (els) {
               assert(els.length === 0, "An inherited currentItem change render filter rule passed unexpectedly");
            })
         .end()

         .alfPostCoverageResults(browser);
      }
   });
});