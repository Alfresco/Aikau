/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * This test is designed to simply pull in all the files to balance out the code coverage results.
 * 
 * @author Dave Draper
 */
define(["intern!object",
      "intern/chai!assert",
      "intern",
      "require",
      "alfresco/TestCommon"
   ],
   function(registerSuite, assert, intern, require, TestCommon) {

      registerSuite(function() {
         var browser;

         return {
            name: "Code Coverage Balancer",

            setup: function() {
               browser = this.remote;
            },

            "Balance": function() {
               if (intern.args.doCoverage === "true") {
                  return TestCommon.loadTestWebScript(this.remote, "/RequireEverything", "Coverage Balancer")
                     .end()

                  .findByCssSelector("#LABEL")
                     .getVisibleText()
                     .then(function(text) {
                        assert(text === "Coverage Balanced!", "Code Coverage Balancer Didn't Load - coverage results will be invalid");
                     })
                     .end();
               }
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });
   });