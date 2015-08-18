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
 *
 * @author Dave Draper
 */
define(["intern!object",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon",
      "intern/dojo/node!leadfoot/keys"
   ],
   function(registerSuite, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
         name: "CheckBox Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/CheckBox", "CheckBox Control Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Initial value is set correctly": function() {
            return browser.findByCssSelector("#CAN_BUILD .dijitCheckBox input")
               .isSelected()
               .then(function(isSelected) {
                  assert.isTrue(isSelected, "Checkbox not selected at startup");
               });
         },

         "Value can be updated by publish": function() {
            return browser.findById("UNCHECK_CHECKBOX")
               .click()
               .end()

            .findByCssSelector("#CAN_BUILD .dijitCheckBox input")
               .isSelected()
               .then(function(isSelected) {
                  assert.isFalse(isSelected, "Checkbox not deselected by publish");
               });
         },

         "Keyboard navigation and selection is supported": function() {
            return browser.pressKeys(keys.TAB)
               .pressKeys(keys.SPACE)
               .end()

            .findByCssSelector("#CAN_BUILD .dijitCheckBox input")
               .isSelected()
               .then(function(isSelected) {
                  assert.isTrue(isSelected, "Checkbox value not changed by keyboard");
               });
         },

         "Can modify checkbox value with mouse": function() {
            return browser.findByCssSelector("#CAN_BUILD label")
               .click()
               .end()

            .findByCssSelector("#CAN_BUILD .dijitCheckBox input")
               .isSelected()
               .then(function(isSelected) {
                  assert.isFalse(isSelected, "Checkbox value not changed by mouse");
               });
         },

         "Form correctly posts value": function() {
            return browser.findByCssSelector("#CHECKBOX_FORM > .buttons > .confirmationButton .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("POST_FORM")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "canbuild", false, "Failed to submit checkbox value correctly");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
      });
   });