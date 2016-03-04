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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var selectSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/Select");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");

   var selectors = {
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM"])
      },
      select: {
         firstOption: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["SOURCE","1"]),
         openIcon: TestCommon.getTestSelector(selectSelectors, "open.menu.icon", ["SOURCE"]),
         secondOption: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["SOURCE","2"]),
         thirdOption: TestCommon.getTestSelector(selectSelectors, "nth.option.label", ["SOURCE","3"])
      },
      button: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_FORM_VALUE"])
   };

   registerSuite(function(){
      var browser;

      return {
         name: "Auto Set Form Rules Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AutoSet", "Auto Set Form Rules Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check the initial post (source field)": function () {
            return browser.findByCssSelector(selectors.form.confirmationButton)
               .click()
            .end()

            .getLastPublish("POST_FORM")
               .then(function(payload) {
                  assert.propertyVal(payload, "source", "1", "Source field not posted correctly");
                  assert.propertyVal(payload, "target", "", "Target field not posted correctly");
                  assert.propertyVal(payload, "hidden", "", "Hidden field not posted correctly");
                  assert.propertyVal(payload, "hidden2", "initial value", "Second hidden field not posted correctly");
               });
         },

         "Check the updated post (source field)": function () {
            return browser.findByCssSelector(selectors.select.openIcon)
               .click()
            .end()

            .findByCssSelector(selectors.select.secondOption)
               .click()
            .end()

            .clearLog()

            // Post the form, check the hidden field is set and the visible field isn't
            .findByCssSelector(selectors.form.confirmationButton)
               .click()
            .end()

            .getLastPublish("POST_FORM")
               .then(function(payload) {
                  assert.propertyVal(payload, "source", "2", "Source field not posted correctly");
                  assert.propertyVal(payload, "target", "", "Target field not posted correctly");
                  assert.deepPropertyVal(payload, "hidden.something.quite", "complex", "Couldn't find complex data in initial form value publication");
               });
         },

         "Check the hidden field is not set and the visible field is": function() {
            // Set the drop-down to 2...
            return browser.findByCssSelector(selectors.select.openIcon)
               .click()
            .end()

            .findByCssSelector(selectors.select.secondOption)
               .click()
            .end()

            // Set the drop-down to 3...
            .findByCssSelector(selectors.select.openIcon)
               .click()
            .end()

            .findByCssSelector(selectors.select.thirdOption)
               .click()
            .end()

            .clearLog()

            // Post the form, check the hidden field is not set and the visible field is...
            .findByCssSelector(selectors.form.confirmationButton)
               .click()
            .end()

            .getLastPublish("POST_FORM")
               .then(function(payload) {
                  assert.propertyVal(payload, "source", "3", "Source field not posted correctly");
                  assert.propertyVal(payload, "target", "Updated", "Target field not posted correctly");
                  assert.propertyVal(payload, "hidden", "", "Hidden field not posted correctly");
               });
         },

         "Check that hidden field value can be set by form value update": function() {
            return browser.findByCssSelector(selectors.button)
               .click()
            .end()

            .clearLog()

            .findByCssSelector(selectors.form.confirmationButton)
               .click()
            .end()

            .getLastPublish("POST_FORM")
               .then(function(payload) {
                  assert.propertyVal(payload, "hidden2", "Value Set", "Second hidden field not posted correctly");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});