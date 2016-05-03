/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * This is a custom wrapper for the "intern!object" registerSuite function.
 * 
 * @author Martin Doyle
 * @since 1.0.62
 */
define(["safe-json-serialiser", 
        "intern!object", 
        "intern/chai!assert", 
        "alfresco/TestCommon"], 
        function(safeJson, registerSuite, assert, TestCommon) {

   // Pass back a function which will augment the suite and then register it
   return function(module, suiteDefinition) {

      // Validate new arguments
      if (arguments.length !== 2 || typeof module.setExports !== "function") {
         throw new Error("Invalid call to alfresco/defineSuite. Must supply module and suite.");
      }

      // Setup variables
      var suiteToRegister = typeof suiteDefinition === "function" ? suiteDefinition() : suiteDefinition;

      // Transfer config variables to a config object
      var suiteConfig = {};
      ["name", "testPage"].forEach(key => {
         suiteConfig[key] = suiteToRegister[key];
         delete suiteToRegister[key];
      });

      // Setup the suite name
      var suiteName = `${module.id}: "${suiteConfig.name}"`;

      // Define the "base" suite
      var baseSuite = {

         name: suiteName,

         setup: function() {
            return TestCommon.loadTestWebScript(this.remote, suiteConfig.testPage, suiteName);
         },

         beforeEach: function() {
            this.remote.end();
         },

         afterEach: function(test) {
            if (test.error !== null) {
               this.remote.screenie({
                  testName: test.name,
                  desc: "ERROR: " + (test.error.message || safeJson.stringify(test.error))
               });
            }
         }
      };

      // Cannot use Object.assign as it can re-order the properties
      Object.keys(baseSuite).forEach(key => {
         if (typeof suiteToRegister[key] === "undefined") {
            suiteToRegister[key] = baseSuite[key];
         }
      });

      // Perform the "real" registerSuite
      registerSuite(suiteToRegister);
   };
});