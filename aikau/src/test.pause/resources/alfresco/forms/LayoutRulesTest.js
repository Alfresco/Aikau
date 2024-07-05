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
   var formControlSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/BaseFormControl");
   var checkBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/CheckBox");
   var selectors = {
      checkBoxes: {
         visibility: {
            checkBox: TestCommon.getTestSelector(checkBoxSelectors, "checkbox", ["TOGGLE_VISIBILITY"]),
            label: TestCommon.getTestSelector(formControlSelectors, "label", ["TOGGLE_VISIBILITY"])
         },
         requirement: {
            checkBox: TestCommon.getTestSelector(checkBoxSelectors, "checkbox", ["TOGGLE_REQUIREMENT"]),
            label: TestCommon.getTestSelector(formControlSelectors, "label", ["TOGGLE_REQUIREMENT"])
         },
         disablement: {
            checkBox: TestCommon.getTestSelector(checkBoxSelectors, "checkbox", ["TOGGLE_DISABLEMENT"]),
            label: TestCommon.getTestSelector(formControlSelectors, "label", ["TOGGLE_DISABLEMENT"])
         }
      },
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM"])
      },
      formControls: {
         select: {
            requirementIndicator: TestCommon.getTestSelector(formControlSelectors, "requirement.indicator", ["SELECT1"]),
            disabled: TestCommon.getTestSelector(formControlSelectors, "disabled", ["SELECT1"])
         },
         textBox: {
            requirementIndicator: TestCommon.getTestSelector(formControlSelectors, "requirement.indicator", ["TEXTBOX1"]),
            disabled: TestCommon.getTestSelector(formControlSelectors, "disabled", ["TEXTBOX1"])
         }
      }
   };

   defineSuite(module, {
      name: "Layout Rules Tests",
      testPage: "/LayoutRules",

      "Controls are initially displayed": function() {
         return this.remote.findDisplayedById("SELECT1")
         .end()

         .findDisplayedById("TEXTBOX1");
      },

      "Toggle visibility": function() {
         return this.remote.findByCssSelector(selectors.checkBoxes.visibility.checkBox)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_ALF_FORM_VALIDITY")

         .findById("SELECT1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            })
         .end()

         .findById("TEXTBOX1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            })
         .end()

         .findByCssSelector(selectors.checkBoxes.visibility.checkBox)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_ALF_FORM_VALIDITY")

         .findDisplayedById("SELECT1")
         .end()

         .findDisplayedById("TEXTBOX1");
      },

      "Controls are initially required": function() {
         return this.remote.findDisplayedByCssSelector(selectors.formControls.select.requirementIndicator)
         .end()

         .findDisplayedByCssSelector(selectors.formControls.textBox.requirementIndicator);
      },

      "Toggle requirement": function() {
         return this.remote.findByCssSelector(selectors.checkBoxes.requirement.checkBox)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_ALF_FORM_VALIDITY")

         .findByCssSelector(selectors.formControls.select.requirementIndicator)
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            })
         .end()

         .findByCssSelector(selectors.formControls.textBox.requirementIndicator)
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            })
         .end()

         .findByCssSelector(selectors.checkBoxes.requirement.checkBox)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_ALF_FORM_VALIDITY")

         .findDisplayedByCssSelector(selectors.formControls.select.requirementIndicator)
         .end()

         .findDisplayedByCssSelector(selectors.formControls.textBox.requirementIndicator);
      },

      "Controls are initially disabled": function() {
         return this.remote.findByCssSelector(selectors.formControls.select.disabled)
         .end()

         .findByCssSelector(selectors.formControls.textBox.disabled);
      },

      "Toggle disablement": function() {
         return this.remote.findByCssSelector(selectors.checkBoxes.disablement.checkBox)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_ALF_FORM_VALIDITY")

         .findAllByCssSelector(selectors.formControls.select.disabled)
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            })
         .end()

         .findAllByCssSelector(selectors.formControls.textBox.disabled)
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            })
         .end()

         .findByCssSelector(selectors.checkBoxes.disablement.checkBox)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_ALF_FORM_VALIDITY")

         .findByCssSelector(selectors.formControls.select.disabled)
         .end()

         .findByCssSelector(selectors.formControls.textBox.disabled);
      }
   });
});