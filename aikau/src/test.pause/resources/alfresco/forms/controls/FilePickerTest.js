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
 * @since 1.0.81
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var DialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");
   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   
   var selectors = {
      buttons: {
         singlePicker: {
            openDialog: TestCommon.getTestSelector(buttonSelectors, "button.label",   ["SINGLE_ITEM_FILE_PICKER_SHOW_FILE_PICKER_DIALOG"]),
            confirmation: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SINGLE_ITEM_FILE_PICKER_CONFIRMATION_BUTTON"]),
            cancellation: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SINGLE_ITEM_FILE_PICKER_CANCELLATION_BUTTON"])
         },
         multiPicker: {
            openDialog: TestCommon.getTestSelector(buttonSelectors, "button.label",   ["MULTI_ITEM_FILE_PICKER_PRE_SELECTED_SHOW_FILE_PICKER_DIALOG"]),
            confirmation: TestCommon.getTestSelector(buttonSelectors, "button.label", ["MULTI_ITEM_FILE_PICKER_PRE_SELECTED_CONFIRMATION_BUTTON"])
         },
         delimitedValuePicker: {
            openDialog: TestCommon.getTestSelector(buttonSelectors, "button.label",   ["MULTI_ITEM_DELIMITED_VALUE_SHOW_FILE_PICKER_DIALOG"]),
            confirmation: TestCommon.getTestSelector(buttonSelectors, "button.label", ["MULTI_ITEM_DELIMITED_VALUE_SHOW_FILE_PICKER_CONFIRMATION_BUTTON"])
         },
         addedAndRemovedValuesPicker: {
            openDialog: TestCommon.getTestSelector(buttonSelectors, "button.label",   ["DELIMITED_ADDED_REMOVED_VALUES_SHOW_FILE_PICKER_DIALOG"]),
            confirmation: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DELIMITED_ADDED_REMOVED_VALUES_CONFIRMATION_BUTTON"])
         }
      },
      dialogs: {
         singlePicker: {
            displayed: TestCommon.getTestSelector(DialogSelectors, "visible.dialog", ["SINGLE_ITEM_FILE_PICKER_FILE_PICKER_DIALOG"]),
            hidden: TestCommon.getTestSelector(DialogSelectors, "hidden.dialog", ["SINGLE_ITEM_FILE_PICKER_FILE_PICKER_DIALOG"]),
         },
         multiPicker: {
            displayed: TestCommon.getTestSelector(DialogSelectors, "visible.dialog", ["MULTI_ITEM_FILE_PICKER_PRE_SELECTED_FILE_PICKER_DIALOG"]),
            hidden: TestCommon.getTestSelector(DialogSelectors, "hidden.dialog", ["MULTI_ITEM_FILE_PICKER_PRE_SELECTED_FILE_PICKER_DIALOG"]),
         },
         delimitedValuePicker: {
            displayed: TestCommon.getTestSelector(DialogSelectors, "visible.dialog", ["MULTI_ITEM_DELIMITED_VALUE_SHOW_FILE_PICKER_DIALOG"]),
            hidden: TestCommon.getTestSelector(DialogSelectors, "hidden.dialog", ["MULTI_ITEM_DELIMITED_VALUE_SHOW_FILE_PICKER_DIALOG"]),
         },
         addedAndRemovedValuesPicker: {
            displayed: TestCommon.getTestSelector(DialogSelectors, "visible.dialog", ["DELIMITED_ADDED_REMOVED_VALUES_FILE_PICKER_DIALOG"]),
            hidden: TestCommon.getTestSelector(DialogSelectors, "hidden.dialog", ["DELIMITED_ADDED_REMOVED_VALUES_FILE_PICKER_DIALOG"]),
         }
      },
      forms: {
         main: {
            confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM"])
         }
      }
   };

   defineSuite(module, {
      name: "File Picker Tests",
      testPage: "/FilePicker",

      "Initial form value is as expected": function() {
         return this.remote.findByCssSelector(selectors.forms.main.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_SCOPE_SAVE")
            .then(function(payload) {
               assert.isArray(payload.singleFile);
               assert.lengthOf(payload.singleFile, 0);
               assert.isArray(payload.multiFile);
               assert.include(payload.multiFile[0], "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4");
               assert.include(payload.multiFile[1], "workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5");
               assert.equal(payload.delimitedValue, "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4,workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5");
               assert.equal(payload.delimited_added, "");
               assert.equal(payload.delimited_removed, "");
            });
      },

      "Open picker dialog": function() {
         return this.remote.findByCssSelector(selectors.buttons.singlePicker.openDialog)
            .click()
         .end()

         .findDisplayedByCssSelector(selectors.dialogs.singlePicker.displayed);
      },

      "No files are initially selected": function() {
         return this.remote.findByCssSelector("#SINGLE_ITEM_FILE_PICKER_SELECTED_FILES_VIEW .alfresco-lists-views-AlfListView__no-data")
            .getVisibleText()
            .then(function(noDataMessage) {
               assert.equal(noDataMessage, "No files have been selected");
            });
      },

      "Repository tab is hidden (for single item picker)": function() {
         return this.remote.findAllByCssSelector("#SINGLE_ITEM_FILE_PICKER_TABCONTAINER_TABCONTAINER_tablist_SINGLE_ITEM_FILE_PICKER_TABCONTAINER_SINGLE_ITEM_FILE_PICKER_REPOSITORY_TAB")
            .then(function(repoTabs) {
               assert.lengthOf(repoTabs, 0);
            });
      },

      // This test checks that we are including the datatype query parameter in the search XHR request
      // that will ensure that only files are returned...
      "Search for file (check query parameter)": function() {
         return this.remote.findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_SEARCH_FIELD .dijitInputContainer input")
            .clearValue()
            .type("search")
            .pressKeys(keys.RETURN)
         .end()

         .getLastXhr()
            .then(function(xhr) {
               assert.include(xhr.request.url, "query=%7B%22datatype%22%3A%22cm%3Acontent%22%7D");
            });
      },

      "Add file from search results": function() {
         return this.remote.findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_SEARCH_ADD_ITEM_0")
            .click()
         .end()

         .findDisplayedByCssSelector(selectors.dialogs.singlePicker.displayed + " #SINGLE_ITEM_FILE_PICKER_SELECTED_FILES_NAME_ITEM_0");
      },

      // The default is single item selection, but this is double checking that you can't select the same item twice anyway...
      "Cannot select the same file twice": function() {
          return this.remote.findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_SEARCH_ADD_ITEM_0")
            .click()
         .end()

         .findAllByCssSelector(selectors.dialogs.singlePicker.displayed + " #SINGLE_ITEM_FILE_PICKER_SELECTED_FILES_VIEW_ITEMS tr")
            .then(function(selectedFiles) {
               assert.lengthOf(selectedFiles, 1);
            });
      },

      "Cannot select two items when multipleItemSelection is false": function() {
         return this.remote.findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_SEARCH_ADD_ITEM_1")
            .click()
         .end()

         .findAllByCssSelector(selectors.dialogs.singlePicker.displayed + " #SINGLE_ITEM_FILE_PICKER_SELECTED_FILES_VIEW_ITEMS tr")
            .then(function(selectedFiles) {
               assert.lengthOf(selectedFiles, 1);
            });
      },

      "Last selected item replaced original selected item": function() {
         return this.remote.findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_SELECTED_FILES_NAME_ITEM_1")
            .getVisibleText()
            .then(function(selectedFileName) {
               assert.equal(selectedFileName, "test_readCompositeData.js");
            });
      },

      "Remove selected file (within dialog)": function() {
         return this.remote.findByCssSelector("#SINGLE_ITEM_FILE_PICKER_SELECTED_FILES_REMOVE_ITEM_1 .alfresco-renderers-PublishAction__image")
            .click()
         .end()

         .findAllByCssSelector(selectors.dialogs.singlePicker.displayed + " #SINGLE_ITEM_FILE_PICKER_SELECTED_FILES_VIEW_ITEMS tr")
            .then(function(selectedFiles) {
               assert.lengthOf(selectedFiles, 0);
            });
      },

      "Select recent sites tab": function() {
         return this.remote.findByCssSelector("#SINGLE_ITEM_FILE_PICKER_TABCONTAINER_TABCONTAINER_tablist_SINGLE_ITEM_FILE_PICKER_TABCONTAINER_SINGLE_ITEM_FILE_PICKER_RECENT_SITES_TAB")
            .clearXhrLog()
            .click()
         .end()

         .findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_SELECT_RECENT_SITE")
         .end()

         .getLastXhr("aikau/proxy/alfresco/api/people/guest/sites/recent")

         .findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_BROWSE_NAME_ITEM_0");
      },

      "Folder cannot be added": function() {
         return this.remote.findAllByCssSelector("#SINGLE_ITEM_FILE_PICKER_BROWSE_ADD_ITEM_0")
            .then(function(folderAdd) {
               assert.lengthOf(folderAdd, 0);
            });
      },

      "Add recent sites file": function() {
         return this.remote.findByCssSelector("#SINGLE_ITEM_FILE_PICKER_BROWSE_ADD_ITEM_4")
            .click()
         .end()

         .findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_SELECTED_FILES_NAME_ITEM_4")
            .getVisibleText()
            .then(function(selectedFileName) {
               assert.equal(selectedFileName, "Aikau Development Demo.ogv");
            });
      },

      "Confirm file selection": function() {
         return this.remote.findByCssSelector(selectors.buttons.singlePicker.confirmation)
            .clearLog()
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.singlePicker.hidden)
         .end()

         .getLastPublish("FORM_SCOPE__valueChangeOf_SINGLE_FILE")
            .then(function(payload) {
               assert.include(payload.value, "workspace://SpacesStore/89366ee4-824d-4d3a-859a-d81a25d9bff3");
            });
      },

      "Save form": function() {
         return this.remote.findByCssSelector(selectors.forms.main.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_SCOPE_SAVE")
            .then(function(payload) {
               assert.include(payload.singleFile, "workspace://SpacesStore/89366ee4-824d-4d3a-859a-d81a25d9bff3");
            });
      },

      "Re-open picker dialog and find previously selected files": function() {
          return this.remote.findByCssSelector(selectors.buttons.singlePicker.openDialog)
            .click()
         .end()

         .findAllByCssSelector(selectors.dialogs.singlePicker.displayed + " #SINGLE_ITEM_FILE_PICKER_SELECTED_FILES_VIEW_ITEMS tr")
            .then(function(selectedFiles) {
               assert.lengthOf(selectedFiles, 1);
            });
      },

      // Check that a recent site is immediately shown for browsing...
      "Select recent sites tab and browse sites": function() {
         return this.remote.findByCssSelector("#SINGLE_ITEM_FILE_PICKER_TABCONTAINER_TABCONTAINER_tablist_SINGLE_ITEM_FILE_PICKER_TABCONTAINER_SINGLE_ITEM_FILE_PICKER_RECENT_SITES_TAB")
            .clearXhrLog()
            .click()
         .end()

         .findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_SELECT_RECENT_SITE")
         .end()

         .getLastXhr("aikau/proxy/alfresco/api/people/guest/sites/recent")

         .findDisplayedByCssSelector("#SINGLE_ITEM_FILE_PICKER_BROWSE_NAME_ITEM_0");
      },

      "Close single picker dialog": function() {
         return this.remote.findByCssSelector(selectors.buttons.singlePicker.cancellation)
            .clearLog()
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.singlePicker.hidden);
      },

      "Preset values are rendered when form first displayed": function() {
         return this.remote.findAllByCssSelector("#MULTI_ITEM_FILE_PICKER_PRE_SELECTED_SELECTED_FILES_VIEW_ITEMS tr")
            .then(function(preselectedFiles) {
               assert.lengthOf(preselectedFiles, 2);
            })
         .end()

         // Check the name for good measure...
         .findByCssSelector("#MULTI_ITEM_FILE_PICKER_PRE_SELECTED_SELECTED_FILES_NAME_ITEM_1")
            .getVisibleText()
            .then(function(fileName) {
               assert.equal(fileName, "Video Test Binary.mp4");
            });
      },

      "Preset values are shown when opening the dialog": function() {
         return this.remote.findByCssSelector(selectors.buttons.multiPicker.openDialog)
            .click()
         .end()

         .findDisplayedByCssSelector(selectors.dialogs.multiPicker.displayed)
         .end()

         .findAllByCssSelector(selectors.dialogs.multiPicker.displayed + " #MULTI_ITEM_FILE_PICKER_PRE_SELECTED_SELECTED_FILES_VIEW tr")
            .then(function(selectedFiles) {
               assert.lengthOf(selectedFiles, 2);
            });
      },

      "Can add to preset values": function() {
         return this.remote.findDisplayedByCssSelector("#MULTI_ITEM_FILE_PICKER_PRE_SELECTED_SEARCH_FIELD .dijitInputContainer input")
            .clearValue()
            .type("search")
            .pressKeys(keys.RETURN)
         .end()

         .findDisplayedByCssSelector("#MULTI_ITEM_FILE_PICKER_PRE_SELECTED_SEARCH_ADD_ITEM_0")
            .click()
         .end()

         .findAllByCssSelector(selectors.dialogs.multiPicker.displayed + " #MULTI_ITEM_FILE_PICKER_PRE_SELECTED_SELECTED_FILES_VIEW tr")
            .then(function(selectedFiles) {
               assert.lengthOf(selectedFiles, 3);
            });
      },

      "Confirm file selection with additional files": function() {
         return this.remote.findByCssSelector(selectors.buttons.multiPicker.confirmation)
            .clearLog()
            .click()
         .end()

         .findByCssSelector(selectors.dialogs.multiPicker.hidden)
         .end()

         .getLastPublish("FORM_SCOPE__valueChangeOf_MULTI_FILE")
            .then(function(payload) {
               assert.include(payload.value, "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4");
               assert.include(payload.value, "workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5");
               assert.include(payload.value, "workspace://SpacesStore/90a1879a-4902-40b2-b006-e386cbb1b75c");
            });
      },

      "Remove file from delimited value without opening dialog": function() {
         return this.remote.findByCssSelector("#MULTI_ITEM_DELIMITED_VALUE_SELECTED_FILES_REMOVE_ITEM_1 .alfresco-renderers-PublishAction__image")
            .click()
         .end()

         .findByCssSelector(selectors.forms.main.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_SCOPE_SAVE")
            .then(function(payload) {
               assert.equal(payload.delimitedValue, "workspace://SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4");
            });
      },

      "Remove file and save to see just the removed files in the payload": function() {
         return this.remote.findByCssSelector("#DELIMITED_ADDED_REMOVED_VALUES_SELECTED_FILES_REMOVE_ITEM_1 .alfresco-renderers-PublishAction__image")
            .click()
         .end()

         .findByCssSelector(selectors.forms.main.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_SCOPE_SAVE")
            .then(function(payload) {
               assert.equal(payload.delimited_added, "");
               assert.equal(payload.delimited_removed, "workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5");
            }); 
      },

      "Add a file and save to see added and removed files in the payload": function() {
         // Open dialog...
         return this.remote.findByCssSelector(selectors.buttons.addedAndRemovedValuesPicker.openDialog)
            .click()
         .end()

         // Wait for dialog to be displayed...
         .findByCssSelector(selectors.dialogs.addedAndRemovedValuesPicker.displayed)
         .end()

         // The recent sites tab will be initially displayed because search is hidden, click to add the document...
         .findDisplayedByCssSelector("#DELIMITED_ADDED_REMOVED_VALUES_BROWSE_ADD_ITEM_4 .alfresco-renderers-PublishAction__image")
            .click()
         .end()

         // Confirm selection...
         .findByCssSelector(selectors.buttons.addedAndRemovedValuesPicker.confirmation)
            .click()
         .end()

         // Wait for the dialog to be hidden...
         .findByCssSelector(selectors.dialogs.addedAndRemovedValuesPicker.hidden)
         .end()

         // Save the form...
         .findByCssSelector(selectors.forms.main.confirmationButton)
            .clearLog()
            .click()
         .end()

         .getLastPublish("FORM_SCOPE_SAVE")
            .then(function(payload) {
               assert.equal(payload.delimited_added, "workspace://SpacesStore/89366ee4-824d-4d3a-859a-d81a25d9bff3");
               assert.equal(payload.delimited_removed, "workspace://SpacesStore/a4fc4392-27f6-49fd-8b6e-20b953c59ff5");
            });
      }
   });
});