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
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "SemanticWrapperMixin Test",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/SemanticWrapperMixin", "SemanticWrapperMixin Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },


         "Test NO_WRAPPER is correct": function () {
            return browser.findByCssSelector("#NO_WRAPPER > span.copyright > span.licenseHolder")
               .getVisibleText()
               .then(function (text) {
                  assert.equal(text, "Licensed To: NO_WRAPPER licenseLabel", "The NO_WRAPPER dom must be incorrect");
               });
         },

         "Test GOOD_WRAPPER is correct": function() {
            return browser.findByCssSelector("#GOOD_WRAPPER > footer > span.copyright > span.licenseHolder")
               .getVisibleText()
               .then(function (text) {
                  assert.equal(text, "Licensed To: GOOD_WRAPPER licenseLabel", "The GOOD_WRAPPER dom must be incorrect");
               });
         },

         "Test BAD_WRAPPER is correct": function() {
            return browser.findByCssSelector("#BAD_WRAPPER > span.copyright > span.licenseHolder")
               .getVisibleText()
               .then(function (text) {
                  assert.equal(text, "Licensed To: BAD_WRAPPER licenseLabel", "The BAD_WRAPPER dom must be incorrect");
               });
         },

         "Test LEFT_AND_RIGHT_WRAPPER is correct": function() {
            return browser.findByCssSelector("#LEFT_AND_RIGHT_WRAPPER > header > div > div.alfresco-layout-LeftAndRight__left")
               .getVisibleText()
               .then(function (text) {
                  assert.equal(text, "This is a title with a semantic wrapper", "The LEFT_AND_RIGHT_WRAPPER dom must be incorrect");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});