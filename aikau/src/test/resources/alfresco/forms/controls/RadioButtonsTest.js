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
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   defineSuite(module, {
      name: "RadioButtons Tests",
      testPage: "/RadioButtons",

      "Initial value is set correctly": function() {
         return this.remote.findByCssSelector("#RADIO_FORM .confirmationButton .dijitButtonNode")
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
         return this.remote.findById("CANT_BUILD_VALUE")
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
         return this.remote.pressKeys([keys.SHIFT, keys.TAB])
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
         return this.remote.findByCssSelector("input[value=\"union_football\"]")
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
      }
   });
});