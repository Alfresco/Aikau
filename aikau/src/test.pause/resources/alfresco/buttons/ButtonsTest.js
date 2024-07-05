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
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var selectors = {
      buttons: {
         generatedPayload: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DEFAULT_BUTTON"])
      }
   };

   defineSuite(module, {
      name: "Buttons Tests",
      testPage: "/Buttons",

      "Title attribute is set correctly": function() {
         return this.remote.findById("DEFAULT_BUTTON")
            .getAttribute("title")
            .then(function(title) {
               assert.equal(title, "Custom title");
            });
      },

      "Payloads can be generated": function() {
         return this.remote.findByCssSelector(selectors.buttons.generatedPayload)
            .click()
         .end()

         .getLastPublish("BUTTON_TOPIC_1")
            .then(function(payload) {
               assert.propertyVal(payload, "data", "prefix:mixinValue4:postfix");
            });
      },

      "Check button labels are encoded to avoid xss attacks": function() {
         return this.remote.findByCssSelector("#XSS_LABEL_TEST_BUTTON_1_label")
            .getVisibleText()
            .then(function(text) {
               assert(text === "<script>alert('XSS');</script>", "First XSS button is wrong: " + text);
            })
            .end()

            .findByCssSelector("#XSS_LABEL_TEST_BUTTON_2_label")
            .getVisibleText()
            .then(function(text) {
               assert(text === "<div style='width: expression(alert('XSS'));'>", "Second XSS button is wrong: " + text);
            });
      }
   });
});