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
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");
   var selectors = {
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM1"])
      },
      textBoxes: {
         tb1: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["TB1"])
         }
      }
   };

   defineSuite(module, {
      name: "CollapsibleSection Tests",
      testPage: "/CollapsibleSection",

      "Initial text box value is set": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.tb1.input)
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "Some value");
            });
      },

      "Updated text value is saved": function() {
         return this.remote.findByCssSelector(selectors.textBoxes.tb1.input)
            .clearValue()
            .type("Updated Value")
         .end()

         .findByCssSelector(selectors.form.confirmationButton)
            .click()
         .end()

         .getLastPublish("FORM1_SAVE")
            .then(function(payload) {
               assert.propertyVal(payload, "textbox", "Updated Value");
            });
      }
   });
});