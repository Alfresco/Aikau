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
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, require, TestCommon, keys) {

   defineSuite(module, {
      name: "Form Warnings Tests",
      testPage: "/FormWarnings",

      "Test initial warning visibility": function() {
         return this.remote.findAllByCssSelector(".alfresco-forms-Form__warnings-top .alfresco-header-Warning")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The form warnings were not displayed at the top of the form");
            })
            .end()
            .findByCssSelector("#BANNER_FORM_WARNINGS .alfresco-header-Warning__info:nth-child(1)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The first warning should have been displayed on page load");
            })
            .end()
            .findByCssSelector("#BANNER_FORM_WARNINGS .alfresco-header-Warning__info:nth-child(2)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The second warning should NOT have been displayed on page load");
            })
            .end()
            .findByCssSelector("#BANNER_FORM_WARNINGS .alfresco-header-Warning__info:nth-child(3)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The second warning should NOT have been displayed on page load");
            });
      },

      "Clear the text in field one and check that the first warning gets hidden": function() {
         return this.remote.findByCssSelector("#FIELD1 .dijitInputContainer input")
            .clearValue()
            .type("a")
            .pressKeys(keys.BACKSPACE)
            .end()
            .findByCssSelector("#BANNER_FORM_WARNINGS .alfresco-header-Warning__info:nth-child(1)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The first warning should have been hidden when field 1 was cleared");
            });
      },

      "Add some text to field two and check that a second warning is displayed": function() {
         return this.remote.findByCssSelector("#FIELD2 .dijitInputContainer input")
            .type("warn")
            .end()
            .findByCssSelector("#BANNER_FORM_WARNINGS .alfresco-header-Warning__info:nth-child(2)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The second warning should have been displayed when field 2 was set to 'warn'");
            });
      },

      "Set field three to be 'blank' and check that third warning is NOT displayed": function() {
         return this.remote.findByCssSelector("#FIELD3 .dijitInputContainer input")
            .type("blank")
            .end()
            .findByCssSelector("#BANNER_FORM_WARNINGS .alfresco-header-Warning__info:nth-child(3)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The third warning should NOT have been displayed when field 3 was set to 'blank'");
            });
      },

      "Add some text to field three and check that the third warning is NOW displayed": function() {
         return this.remote.findByCssSelector("#FIELD4 .dijitInputContainer input")
            .type("test")
            .end()
            .findByCssSelector("#BANNER_FORM_WARNINGS .alfresco-header-Warning__info:nth-child(3)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The third warning should have NOW been displayed when field 4 was set to a value");
            });
      },

      "Create a form dialog with warnings": function() {
         return this.remote.findById("CREATE_FORM_DIALOG_label")
            .click()
            .end()
            .findAllByCssSelector("#FORM_WARNING_DIALOG .dialogDisplayed")
            .end()
            .findAllByCssSelector("#FORM_WARNING_DIALOG .alfresco-forms-Form__warnings-bottom .alfresco-header-Warning")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The form dialog warnings were not displayed at the bottom of the form");
            });
      }
   });
});