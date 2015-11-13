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
            name: "RadioButtons Tests",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/RadioButtons", "RadioButtons Control Tests");
            },

            beforeEach: function() {
               browser.end();
            },

            "Initial value is set correctly": function() {
               return browser.findByCssSelector("#RADIO_FORM .confirmationButton .dijitButtonNode")
                  .clearLog()
                  .click()
                  .end()

               .getLastPublish("SCOPED_POST_FORM", true)
                  .then(function(payload) {
                     assert.propertyVal(payload, "canbuild", true);
                     assert.propertyVal(payload, "properfootball", "rugby_football");
                  });
            },

            "Value can be updated by publish": function() {
               return browser.findById("CANT_BUILD_VALUE")
                  .click()
                  .end()

               .findById("RUGBY_UNION_VALUE")
                  .click()
                  .end()

               .findByCssSelector("#RADIO_FORM .confirmationButton .dijitButtonNode")
                  .clearLog()
                  .click()
                  .end()

               .getLastPublish("SCOPED_POST_FORM", true)
                  .then(function(payload) {
                     assert.propertyVal(payload, "canbuild", false);
                     assert.propertyVal(payload, "properfootball", "rugby_union");
                  });
            },

            "Keyboard navigation and selection is supported": function() {
               return browser.pressKeys([keys.SHIFT, keys.TAB])
                  .pressKeys(keys.ARROW_UP)
                  .pressKeys(keys.SPACE)
                  .pressKeys(keys.NULL) // Cancel modifiers
                  .end()

               .findByCssSelector("#RADIO_FORM .confirmationButton .dijitButtonNode")
                  .clearLog()
                  .click()
                  .end()

               .getLastPublish("SCOPED_POST_FORM", true)
                  .then(function(payload) {
                     assert.propertyVal(payload, "properfootball", "rugby_football");
                  });
            },

            "Can select radio button with mouse": function() {
               return browser.findByCssSelector("input[value=\"union_football\"]")
                  .click()
                  .end()

               .findByCssSelector("#RADIO_FORM .confirmationButton .dijitButtonNode")
                  .clearLog()
                  .click()
                  .end()

               .getLastPublish("SCOPED_POST_FORM", true)
                  .then(function(payload) {
                     assert.propertyVal(payload, "properfootball", "union_football");
                  });
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });
   });