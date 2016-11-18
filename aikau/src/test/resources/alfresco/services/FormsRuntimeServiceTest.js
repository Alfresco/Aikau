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
 * @since 1.0.84
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var multiSelectInputSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/MultiSelectInput");
   var dialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");
   

   var selectors = {
      buttons: {
         editNode: TestCommon.getTestSelector(buttonSelectors, "button.label", ["EDIT_NODE"]),
         viewNode: TestCommon.getTestSelector(buttonSelectors, "button.label", ["VIEW_NODE"]),
         createWorkflow: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CREATE_WORKFLOW"]),
         editDataListItem: TestCommon.getTestSelector(buttonSelectors, "button.label", ["EDIT_DATA_LIST_ITEM"])
      },
      authoritySelector: {
         control: TestCommon.getTestSelector(multiSelectInputSelectors, "control", ["ASSOC_BPM_ASSIGNEE"]),
         loaded: TestCommon.getTestSelector(multiSelectInputSelectors, "options.loaded.state", ["ASSOC_BPM_ASSIGNEE"]),
         choice: TestCommon.getTestSelector(multiSelectInputSelectors, "choice", ["ASSOC_BPM_ASSIGNEE"]),
         firstChoice: {
            element: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice", ["MULTISELECT_1", "1"]),
            content: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice.content", ["MULTISELECT_1", "1"]),
            delete: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.choice.delete", ["MULTISELECT_1", "1"])
         },
         result: TestCommon.getTestSelector(multiSelectInputSelectors, "result", ["ASSOC_BPM_ASSIGNEE"]),
         loading: TestCommon.getTestSelector(multiSelectInputSelectors, "results.loading.message", ["ASSOC_BPM_ASSIGNEE"]),
         firstResult: TestCommon.getTestSelector(multiSelectInputSelectors, "nth.result", ["ASSOC_BPM_ASSIGNEE", "1"]),
         searchbox: TestCommon.getTestSelector(multiSelectInputSelectors, "searchbox", ["ASSOC_BPM_ASSIGNEE"]),
         noresults: TestCommon.getTestSelector(multiSelectInputSelectors, "no.results.message", ["ASSOC_BPM_ASSIGNEE"])
      },
      forms: {
         createWorkflow: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["CREATE_WORKFLOW_FORM"])
         }
      },
      dialogs: {
         editDataListItem: {
            confirmationButton: TestCommon.getTestSelector(dialogSelectors, "form.dialog.confirmation.button", ["EDIT_DLI_FORM"]),
            disabledConfirmationButton: TestCommon.getTestSelector(dialogSelectors, "disabled.form.dialog.confirmation.button", ["EDIT_DLI_FORM"]),
            displayed: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["EDIT_DLI_FORM"]),
         }
      }
   };

   defineSuite(module, {
      name: "Forms Runtime Service Tests",
      testPage: "/FormsRuntimeService",

      "Form submissions payload can contain additional data": function() {
         // Request the form for creating an adhoc workflow...
         return this.remote.findByCssSelector(selectors.buttons.createWorkflow)
            .click()
         .end()

         // Wait for the authority MultiSelectInput control to be displayed (this is the only required field)...
         .findDisplayedByCssSelector(selectors.authoritySelector.control)
            .click()
         .end()

         // Select the first result ("Alice Beecher")...
         .findDisplayedByCssSelector(selectors.authoritySelector.firstResult)
            .click()
         .end()

         // Submit the form...
         .findByCssSelector(selectors.forms.createWorkflow.confirmationButton)
            .click()
         .end()

         // Check the response scope was included...
         .getLastPublish("ALF_CRUD_CREATE")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "CREATE_WORKFLOW_SCOPE_");
            })

         // ...which should result in the scoped reload request
         .getLastPublish("CREATE_WORKFLOW_SCOPE_ALF_DOCLIST_RELOAD_DATA");
      },

      "Mandatory file association with initial value provided does not disable form": function() {
         return this.remote.findByCssSelector(selectors.buttons.editDataListItem)
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.editDataListItem.displayed)
         .end()

         .findDisplayedByCssSelector(selectors.dialogs.editDataListItem.confirmationButton)
         .end()

         .findAllByCssSelector(selectors.dialogs.editDataListItem.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      }
   });
});