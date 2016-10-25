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

   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var radiobuttonSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/RadioButtons");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");

   var selectors = {
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["RADIO_FORM"])
      },
      rbs: {
         canbuild: {
            yesButton: TestCommon.getTestSelector(radiobuttonSelectors, "nth.option.button", ["CAN_BUILD", "1"]),
            noButton: TestCommon.getTestSelector(radiobuttonSelectors, "nth.option.button", ["CAN_BUILD", "2"])
         },
         properfootball: {
            rugbyFootballButton: TestCommon.getTestSelector(radiobuttonSelectors, "nth.option.button", ["PROPER_FOOTBALL", "1"]),
            rugbyUnionButton: TestCommon.getTestSelector(radiobuttonSelectors, "nth.option.button", ["PROPER_FOOTBALL", "2"]),
            unionFootballButton: TestCommon.getTestSelector(radiobuttonSelectors, "nth.option.button", ["PROPER_FOOTBALL", "3"])
         }
      },
      buttons: {
         cannotBuild: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CANT_BUILD_VALUE"]),
         rugbyValue: TestCommon.getTestSelector(buttonSelectors, "button.label", ["RUGBY_UNION_VALUE"])
      }
   };

   defineSuite(module, {
      name: "RadioButtons Tests",
      testPage: "/RadioButtons",

      "Initial value is set correctly": function() {
         return this.remote.findByCssSelector(selectors.form.confirmationButton)
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
         return this.remote.findByCssSelector(selectors.buttons.cannotBuild)
            .click()
         .end()

         .findByCssSelector(selectors.buttons.rugbyValue)
            .click()
         .end()

         .findByCssSelector(selectors.form.confirmationButton)
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

         .findByCssSelector(selectors.form.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("SCOPED_POST_FORM", true)
            .then(function(payload) {
               assert.propertyVal(payload, "properfootball", "rugby_football");
            });
      },

      "Can select radio button with mouse": function() {
         return this.remote.findByCssSelector(selectors.rbs.properfootball.unionFootballButton)
            .click()
         .end()

         .findByCssSelector(selectors.form.confirmationButton)
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