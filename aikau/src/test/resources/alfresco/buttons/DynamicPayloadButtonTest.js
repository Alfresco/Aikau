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
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var selectors = {
      buttons: {
         dynamicWithNonTruthy: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DYNAMIC_WITH_NON_TRUTHY"]),
         setTruthy: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_TRUTHY"]),
         setNonTruthy: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_NON_TRUTHY"])
      }
   };

   defineSuite(module, {
      name: "Dynamic Payload Button Tests",
      testPage: "/dynamicPayloadButton#initial=test",

      "Check the original payload": function() {
         return this.remote.findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()

         .getLastPublish("DYNAMIC_BUTTON_TOPIC")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "Original Value");
            });
      },

      "Check the original hash based payload": function() {
         return this.remote.findByCssSelector("#DYNAMIC_BUTTON_2_label")
            .click()
         .end()

         .getLastPublish("DYNAMIC_BUTTON_TOPIC_2")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "Another Value");
            });
      },

      "Override the complete payload": function() {
         return this.remote.findByCssSelector("#FULL_OVERRIDE_label")
            .click()
         .end()

         .clearLog()
         
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()

         .getLastPublish("DYNAMIC_BUTTON_TOPIC")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "Override 1");
            });
      },

      "Mixin in values and override": function() {
         return this.remote.findByCssSelector("#MIXIN_WITH_OVERRIDES_label")
            .click()
         .end()

         .clearLog()
         
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()

         .getLastPublish("DYNAMIC_BUTTON_TOPIC")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "Override 2");
               assert.deepPropertyVal(payload, "additional.data", "extra data");
            });
      },

      "Mixin in values without an override": function() {
         return this.remote.findByCssSelector("#MIXIN_NO_OVERRIDES_label")
            .click()
         .end()

         .clearLog()
         
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()

         .getLastPublish("DYNAMIC_BUTTON_TOPIC")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "Override 2");
               assert.deepPropertyVal(payload, "additional.data", "bonus data");
            });
      },

      "Override via has update": function() {
         return this.remote.findByCssSelector("#HASH_OVERRIDE_label")
            .click()
         .end()

         .clearLog()
         
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()

         .getLastPublish("DYNAMIC_BUTTON_TOPIC")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "Override3");
            });
      },

      "Add extra data via has update": function() {
         return this.remote.findByCssSelector("#HASH_OVERRIDE_EXTRA_label")
            .click()
         .end()

         .clearLog()
         
         .findByCssSelector("#DYNAMIC_BUTTON_label")
            .click()
         .end()

         .getLastPublish("DYNAMIC_BUTTON_TOPIC")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "additional.hash", "hashData");
            });
      },

      "Global scoped data is set": function() {
         return this.remote.findByCssSelector("#GLOBAL_DATA_label")
            .click()
         .end()

         .clearLog()

         .findByCssSelector("#DYNAMIC_BUTTON_3_label")
            .click()
         .end()

         .getLastPublish("SCOPE_DYNAMIC_BUTTON_TOPIC_3")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "data.global", "global");
            });
      },

      "Parent scoped data is set": function() {
         return this.remote.findByCssSelector("#PARENT_SCOPE_DATA_label")
            .click()
         .end()

         .clearLog()

         .findByCssSelector("#DYNAMIC_BUTTON_3_label")
            .click()
         .end()

         .getLastPublish("SCOPE_DYNAMIC_BUTTON_TOPIC_3")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "data.parent", "parent");
            });
      },

      "Custom scoped data is set": function() {
         return this.remote.findByCssSelector("#CUSTOM_SCOPE_DATA_label")
            .click()
         .end()

         .clearLog()

         .findByCssSelector("#DYNAMIC_BUTTON_3_label")
            .click()
         .end()

         .getLastPublish("SCOPE_DYNAMIC_BUTTON_TOPIC_3")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "data.custom", "custom");
            });
      },

      "Default scoped data is set": function() {
         return this.remote.findByCssSelector("#DEFAULT_SCOPE_DATA_label")
            .click()
         .end()

         .clearLog()

         .findByCssSelector("#DYNAMIC_BUTTON_3_label")
            .click()
         .end()

         .getLastPublish("SCOPE_DYNAMIC_BUTTON_TOPIC_3")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "data.default", "default");
            });
      },

      "Non-truthy values can be set": function() {
         return this.remote.findByCssSelector(selectors.buttons.setTruthy)
            .click()
         .end()

         .findByCssSelector(selectors.buttons.dynamicWithNonTruthy)
            .clearLog()
            .click()
         .end()

         .getLastPublish("NON_TRUTHY_EXECUTE_JS")
            .then(function(payload) {
               assert.propertyVal(payload, "selectedJavaScriptSource", "print(10);");
            })

         .findByCssSelector(selectors.buttons.setNonTruthy)
            .click()
         .end()

         .findByCssSelector(selectors.buttons.dynamicWithNonTruthy)
            .clearLog()
            .click()
         .end()

         .getLastPublish("NON_TRUTHY_EXECUTE_JS")
            .then(function(payload) {
               assert.propertyVal(payload, "selectedJavaScriptSource", null);
            });
      }
   });
});