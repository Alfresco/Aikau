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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var formControlSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/BaseFormControl");
   var checkBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/CheckBox");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");

   var selectors = {
      checkBoxes: {
         default: {
            checkBox: TestCommon.getTestSelector(checkBoxSelectors, "checkbox", ["DEFAULT_CHECKBOX"]),
            label: TestCommon.getTestSelector(formControlSelectors, "label", ["DEFAULT_CHECKBOX"])
         },
         o1: {
            checkBox: TestCommon.getTestSelector(checkBoxSelectors, "checkbox", ["O1_CHECKBOX"]),
            label: TestCommon.getTestSelector(formControlSelectors, "label", ["O1_CHECKBOX"])
         },
         offon: {
            checkBox: TestCommon.getTestSelector(checkBoxSelectors, "checkbox", ["OFFON_CHECKBOX"]),
            label: TestCommon.getTestSelector(formControlSelectors, "label", ["OFFON_CHECKBOX"])
         }
      },
      buttons: {
         updateCheckboxes: TestCommon.getTestSelector(buttonSelectors, "button.label", ["UPDATE_CHECKBOXES"])
      },
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["CHECKBOX_FORM"])
      }
   };

   defineSuite(module, {
      name: "CheckBox Tests",
      testPage: "/CheckBox",

      "Initial values are set correctly": function() {
         return this.remote.findByCssSelector(selectors.checkBoxes.default.checkBox)
            .isSelected()
            .then(function(isSelected) {
               assert.isTrue(isSelected, "Default checkbox not selected at startup");
            })
            .end()

         .findByCssSelector(selectors.checkBoxes.o1.checkBox)
            .isSelected()
            .then(function(isSelected) {
               assert.isFalse(isSelected, "0/1 checkbox selected at startup");
            })
            .end()

         .findByCssSelector(selectors.checkBoxes.offon.checkBox)
            .isSelected()
            .then(function(isSelected) {
               assert.isTrue(isSelected, "on/off checkbox not selected at startup");
            });
      },

      "Values are correctly updated by publish": function() {
         return this.remote.findByCssSelector(selectors.buttons.updateCheckboxes)
            .click()
            .end()

         .findByCssSelector(selectors.checkBoxes.default.checkBox)
            .isSelected()
            .then(function(isSelected) {
               assert.isFalse(isSelected, "Default checkbox not deselected by publish");
            })
            .end()

         .findByCssSelector(selectors.checkBoxes.o1.checkBox)
            .isSelected()
            .then(function(isSelected) {
               assert.isTrue(isSelected, "0/1 checkbox not selected by publish");
            })
            .end()

         .findByCssSelector(selectors.checkBoxes.offon.checkBox)
            .isSelected()
            .then(function(isSelected) {
               assert.isTrue(isSelected, "on/off checkbox incorrectly modified by publish");
            });
      },

      "Keyboard navigation and selection is supported": function() {
         return this.remote.findByCssSelector(selectors.buttons.updateCheckboxes)
            .click()
            .tabToElement({
               selector: selectors.checkBoxes.default.checkBox
            })
            .pressKeys(keys.SPACE)
            .end()

         .findByCssSelector(selectors.checkBoxes.default.checkBox)
            .isSelected()
            .then(function(isSelected) {
               assert.isTrue(isSelected, "Checkbox value not changed by keyboard");
            });
      },

      "Can modify checkbox value with mouse": function() {
         return this.remote.findByCssSelector(selectors.checkBoxes.default.label)
            .click()
            .end()

         .findByCssSelector(selectors.checkBoxes.default.checkBox)
            .isSelected()
            .then(function(isSelected) {
               assert.isFalse(isSelected, "Checkbox value not changed by mouse");
            });
      },

      "Form correctly posts value": function() {
         return this.remote.findByCssSelector(selectors.form.confirmationButton)
            .click()
            .end()

         .getLastPublish("POST_FORM")
            .then(function(payload) {
               assert.propertyVal(payload, "defaultCheckbox", false);
               assert.propertyVal(payload, "o1", 1);
               assert.propertyVal(payload, "offon", "on");
            });
      }
   });
});