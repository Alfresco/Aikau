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
 * @author Martin Doyle
 */
define(["intern!object",
      "intern/chai!assert",
      "alfresco/TestCommon",
      "intern/dojo/node!leadfoot/keys"
   ],
   function(registerSuite, assert, TestCommon, keys) {

      registerSuite(function() {
         var browser;

         return {
            name: "PushButtons Tests",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/PushButtons", "PushButtons Control Tests");
            },

            beforeEach: function() {
               browser.end();
            },

            "Initial value is set correctly": function() {
               return browser.findByCssSelector("#TEST_FORM .confirmationButton .dijitButtonNode")
                  .clearLog()
                  .click()
                  .end()

               .getLastPublish("SCOPED_POST_FORM", true)
                  .then(function(payload) {
                     assert.propertyVal(payload, "canbuild", true);
                     assert.lengthOf(payload.properfootball, 2);
                     assert.deepPropertyVal(payload, "properfootball[0]", "rugby_football");
                     assert.deepPropertyVal(payload, "properfootball[1]", "union_football");
                     assert.propertyVal(payload, "bestlanguage", "javascript");
                  });
            },

            "Value can be updated by publish": function() {
               return browser.findById("CANT_BUILD_VALUE")
                  .click()
                  .end()

               .findById("RUGBY_UNION_VALUE")
                  .click()
                  .end()

               .findById("VB_VALUE")
                  .click()
                  .end()

               .findByCssSelector("#TEST_FORM .confirmationButton .dijitButtonNode")
                  .clearLog()
                  .click()
                  .end()

               .getLastPublish("SCOPED_POST_FORM", true)
                  .then(function(payload) {
                     assert.propertyVal(payload, "canbuild", false);
                     assert.lengthOf(payload.properfootball, 1);
                     assert.deepPropertyVal(payload, "properfootball[0]", "rugby_union");
                     assert.propertyVal(payload, "bestlanguage", "vb");
                  });
            },

            "Keyboard navigation and selection is supported on single-value controls": function() {
               return browser.findById("VB_VALUE") // Focus on last button at top
                  .click()
                  .end()

               .pressKeys(keys.TAB) // Tab to "canbuild" control
                  .pressKeys(keys.ARROW_LEFT)
                  .pressKeys(keys.SPACE)
                  .end()

               .pressKeys(keys.TAB) // Tab to "properfootball" control, first value
                  .pressKeys(keys.SPACE)
                  .end()

               .pressKeys(keys.TAB) // Tab to "properfootball" control, second value
                  .pressKeys(keys.SPACE)
                  .end()

               .findByCssSelector("#TEST_FORM .confirmationButton .dijitButtonNode")
                  .clearLog()
                  .click()
                  .end()

               .getLastPublish("SCOPED_POST_FORM", true)
                  .then(function(payload) {
                     assert.propertyVal(payload, "canbuild", true);
                     assert.lengthOf(payload.properfootball, 1);
                     assert.deepPropertyVal(payload, "properfootball[0]", "rugby_football");
                  });
            },

            "Can select push button with mouse": function() {
               return browser.findByCssSelector("#BEST_LANGUAGE_CONTROL label:nth-of-type(2)")
                  .click()
                  .end()

               .findByCssSelector("#TEST_FORM .confirmationButton .dijitButtonNode")
                  .clearLog()
                  .click()
                  .end()

               .getLastPublish("SCOPED_POST_FORM", true)
                  .then(function(payload) {
                     assert.propertyVal(payload, "bestlanguage", "javascript");
                  });
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });
   });