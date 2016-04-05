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
 * This is a unit test for the disabling-submit functionality of the alfresco/forms/Form control
 *
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, TestCommon, defineSuite, assert) {

   defineSuite(module, {
      name: "Disabling-submit Form control Tests",
      testPage: "/DisablingSubmitForm",

      "OK button disables and label changes, and both are re-enabled by publication": function() {
         return this.remote.findByCssSelector("#NAME_TEXTBOX .dijitInputField input")
            .type("Fred")
            .end()

         .findByCssSelector("#FORM_WITH_REENABLE_TOPICS .confirmationButton .dijitButtonNode")
            .click()
            .end()

         .getLastPublish("MY_NAME_IS", true)

         .findByCssSelector("#FORM_WITH_REENABLE_TOPICS .confirmationButton .dijitButtonContents")
            .getAttribute("aria-disabled")
            .then(function(isDisabled) {
               assert.equal(isDisabled, "true", "OK button not disabled");
            })
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Submitted", "OK button label not changed");
            })
            .end()

         .getLastPublish("ENABLE_OK_BUTTON", 5000)

         .findByCssSelector("#FORM_WITH_REENABLE_TOPICS .confirmationButton .dijitButtonContents")
            .getAttribute("aria-disabled")
            .then(function(isDisabled) {
               assert.equal(isDisabled, "false", "OK button not re-enabled");
            })
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "OK", "OK button label not reset");
            });
      },

      "Forcing a publication which fails a conditional check will NOT re-enable the OK button": function() {
         return this.remote.findByCssSelector("#FORM_WITH_CONDITIONAL_REENABLEMENT .confirmationButton .dijitButtonNode")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ODD_OR_EVEN", true)

         .findByCssSelector("#FORM_WITH_CONDITIONAL_REENABLEMENT .confirmationButton .dijitButtonContents")
            .getAttribute("aria-disabled")
            .then(function(isDisabled) {
               assert.equal(isDisabled, "true", "OK button not disabled");
            })
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Submitted", "OK button label not changed");
            })
            .end()

         .getLastPublish("ENABLE_OK_BUTTON_IF", 5000)

         .findByCssSelector("#FORM_WITH_CONDITIONAL_REENABLEMENT .confirmationButton .dijitButtonContents")
            .getAttribute("aria-disabled")
            .then(function(isDisabled) {
               assert.equal(isDisabled, "true", "OK button incorrectly re-enabled");
            })
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Submitted", "OK button label incorrectly reset");
            })
            .end()

         .findById("REENABLE_OK_BUTTON_BUTTON")
            .click();
      },

      "Forcing a publication which passes a conditional check WILL re-enable the OK button": function() {
         // Function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
         // Returns a random integer between min (included) and max (excluded)
         // Using Math.round() will give you a non-uniform distribution!
         function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
         }

         return this.remote.findByCssSelector("#CONDITIONAL_REENABLE_INPUT .dijitInputField input")
            .clearLog()
            .type("" + (getRandomInt(0, 100) * 2))
            .end()

         .findByCssSelector("#FORM_WITH_CONDITIONAL_REENABLEMENT .confirmationButton .dijitButtonNode")
            .click()
            .end()

         .getLastPublish("ODD_OR_EVEN", true)

         .findByCssSelector("#FORM_WITH_CONDITIONAL_REENABLEMENT .confirmationButton .dijitButtonContents")
            .getAttribute("aria-disabled")
            .then(function(isDisabled) {
               assert.equal(isDisabled, "true", "OK button not disabled");
            })
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Submitted", "OK button label not changed");
            })
            .end()

         .getLastPublish("ENABLE_OK_BUTTON_IF", 5000)

         .findByCssSelector("#FORM_WITH_CONDITIONAL_REENABLEMENT .confirmationButton .dijitButtonContents")
            .getAttribute("aria-disabled")
            .then(function(isDisabled) {
               assert.equal(isDisabled, "false", "OK button not re-enabled");
            })
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "OK", "OK button label not reset");
            })
            .end();
      },

      "OK button can just change label on submit and reverts automatically": function() {
         return this.remote.findByCssSelector("#DEFAULT_FORM .confirmationButton .dijitButtonNode")
            .click()
            .end()

         .getLastPublish("HERES_A_SECRET")

         .findByCssSelector("#DEFAULT_FORM .confirmationButton .dijitButtonContents")
            .getAttribute("aria-disabled")
            .then(function(isDisabled) {
               assert.equal(isDisabled, "false", "OK button incorrectly disabled");
            })
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Submitted", "OK button label not changed");
            })
            .end()

         .sleep(3000)

         .findByCssSelector("#DEFAULT_FORM .confirmationButton .dijitButtonContents")
            .getAttribute("aria-disabled")
            .then(function(isDisabled) {
               assert.equal(isDisabled, "false", "OK button incorrectly disabled");
            })
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "OK", "OK button label not reset");
            });
      }
   });
});