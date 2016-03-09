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
   var selectorSelectors = TestCommon.getTestSelectors("alfresco/renderers/Selector");

   var selectors = {
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM"])
      },
      selectors: {
         fourth: {
            element: TestCommon.getTestSelector(selectorSelectors, "nth.selector", ["SELECTOR","3"]),
            checked: TestCommon.getTestSelector(selectorSelectors, "nth.selector.checked", ["SELECTOR","3"])
         },
         fifth: {
            element: TestCommon.getTestSelector(selectorSelectors, "nth.selector", ["SELECTOR","4"]),
            checked: TestCommon.getTestSelector(selectorSelectors, "nth.selector.checked", ["SELECTOR","4"])
         }
      }
   };

   registerSuite(function(){
      var browser;

      return {
         name: "SelectedListItems Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/SelectedListItems", "SelectedListItems Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Fourth item is selected on load": function() {
            return browser.findDisplayedByCssSelector(selectors.selectors.fourth.checked);
         },

         "Publish initial form value": function() {
            return browser.findByCssSelector(selectors.form.confirmationButton)
               .click()
            .end()

            .getLastPublish("FORMSAVE")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "selectedItems[0].nodeRef", "workspace://SpacesStore/d040aa05-ad54-495f-bf4e-3266b96391e9");
               });
         },

         "Check fifth and post form": function() {
            return browser.findByCssSelector(selectors.selectors.fifth.element)
               .click()
            .end()

            .findByCssSelector(selectors.selectors.fifth.checked)
            .end()

            .clearLog()

            .findByCssSelector(selectors.form.confirmationButton)
               .click()
            .end()

            .getLastPublish("FORMSAVE")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "selectedItems[0].nodeRef", "workspace://SpacesStore/d040aa05-ad54-495f-bf4e-3266b96391e9");
                  assert.deepPropertyVal(payload, "selectedItems[1].nodeRef", "workspace://SpacesStore/ee0461e1-daa0-4efc-a142-3f709452fa0b");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});