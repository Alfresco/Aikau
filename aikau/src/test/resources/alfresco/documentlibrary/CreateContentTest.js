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

   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");
   var dialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");
   var selectors = {
      textBoxes: {
         createContent: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["NAME_TEXT_BOX"]),
         }
      },
      createContentDialog: {
         confirmationButton: TestCommon.getTestSelector(dialogSelectors, "form.dialog.confirmation.button", ["ALF_CREATE_CONTENT_DIALOG"]),
         disabledConfirmationButton: TestCommon.getTestSelector(dialogSelectors, "disabled.form.dialog.confirmation.button", ["ALF_CREATE_CONTENT_DIALOG"]),
         displayed: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["ALF_CREATE_CONTENT_DIALOG"]),
         hidden: TestCommon.getTestSelector(dialogSelectors, "hidden.dialog", ["ALF_CREATE_CONTENT_DIALOG"]),
      }
   };

   defineSuite(module, {
      name: "Create Content Tests",
      testPage: "/CreateContent",

      "Checking for create content item in create content menu": function() {
         // Check everything is initialised correctly...
         return this.remote.findByCssSelector("#CREATE_CONTENT_MENU_text")
            .click()
            .end()
            .findByCssSelector("#CREATE_XML_DOC_1")
            .then(null, function() {
               assert(false, "Couldn't find content item in create content menu");
            });
      },

      "Checking create content item in create content menu is NOT disabled": function() {
         return this.remote.findAllByCssSelector("#CREATE_XML_DOC_1.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content item in create content menu was unexpectedly disabled");
            }, null);
      },

      "Checking for create content item in standard menu": function() {
         return this.remote.findByCssSelector("#POPUP_MENU_text")
            .click()
            .end()
            .findByCssSelector("#CREATE_XML_DOC_2")
            .then(null, function() {
               assert(false, "Couldn't find content item in standard popup menu");
            });
      },

      "Checking for create template cascade": function() {
         return this.remote.findByCssSelector("#CREATE_TEMPLATES")
            .then(null, function() {
               assert(false, "Couldn't find create templates cascade in standard popup menu");
            });
      },

      "Check for create content menu bar item": function() {
         return this.remote.findByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM")
            .then(null, function() {
               assert(false, "Test #1e - Couldn't find content menu bar item");
            });
      },

      "Checking create content menu bar item is not disabled": function() {
         return this.remote.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content menu bar item was unexpectedly disabled");
            }, null);
      },

      "Check content failure handling": function() {
         return this.remote.findById("CREATE_CONTENT_MENUBAR_ITEM_text")
            .click()
         .end()

         .clearLog()

         .findByCssSelector(selectors.createContentDialog.displayed)
         .end()

         // Setting the naem to "fail" will result in the mock XHR returning a failure response
         .findByCssSelector(selectors.textBoxes.createContent.input)
            .clearValue()
            .type("fail")
         .end()

         .findByCssSelector(selectors.createContentDialog.confirmationButton)
            .click()
         .end()

         // An error prompt should be displayed
         .getLastPublish("ALF_DISPLAY_PROMPT")

         // Dialog should still be displayed...
         .findByCssSelector(selectors.createContentDialog.displayed);
      },

      "Check content success handling": function() {
         // Dialog should still be displayed at the end of the last test...
         return this.remote.findByCssSelector(selectors.textBoxes.createContent.input)
            .clearValue()
            .type("succeed")
         .end()

         .clearLog()

         .findByCssSelector(selectors.createContentDialog.confirmationButton)
            .click()
         .end()

         // An error prompt should be displayed
         .getLastPublish("ALF_CONTENT_CREATED")

         // Dialog should still be displayed...
         .findByCssSelector(selectors.createContentDialog.hidden);
      }
   });

   // defineSuite(module, {
   //    name: "Create Content (Denied Permission) Tests",
   //    testPage: "/CreateContent",

   //    "Checking create content menu is now disabled": function() {
   //       return this.remote.findByCssSelector("#DENY_CREATE_PERMISSION_label")
   //          .click()
   //          .end()

   //       // Check the content menu is disabled...
   //       .findAllByCssSelector("#CREATE_CONTENT_MENU.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Content menu was not disabled");
   //          }, null);
   //    },

   //    "Checking create content item in standard menu is now disabled": function() {
   //       // Check the create content menu item in the standard popup menu is disabled...
   //       return this.remote.findByCssSelector("#POPUP_MENU_text")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Content item in standard popup menu was not disabled");
   //          });
   //    },

   //    "Checking create template cascade is now disabled": function() {
   //       return this.remote.findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Create templates in standard popup menu was not disabled");
   //          });
   //    },

   //    "Checking menu bar item is now disabled": function() {
   //       return this.remote.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Content menu bar item was not disabled");
   //          }, null);
   //    },

   //    "Checking create content menu item in content menu has been re-enabled": function() {
   //       // Allow permissions...
   //       return this.remote.findByCssSelector("#GRANT_CREATE_PERMISSION_label")
   //          .click()
   //          .end()

   //       // Check the content menu is re-enabled...
   //       .findByCssSelector("#CREATE_CONTENT_MENU_text")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#CREATE_XML_DOC_1.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 0, "Content item in create content menu was not re-enabled");
   //          }, null);
   //    },

   //    "Checking create content item in standard popup is re-enabled": function() {
   //       // Check the create content menu item in the standard popup menu is disabled...
   //       return this.remote.findByCssSelector("#POPUP_MENU_text")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 0, "Content item in standard popup menu was not re-enabled");
   //          });
   //    },

   //    "Check create template cascade has been re-enabled": function() {
   //       return this.remote.findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 0, "Create templates in standard popup menu was not re-enabled");
   //          });
   //    },

   //    "Checking that content menu bar item has been re-enabled": function() {
   //       return this.remote.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 0, "Content menu bar item was not re-enabled");
   //          }, null);
   //    }
   // });

   // defineSuite(module, {
   //    name: "Create Content (Change Path) Tests",
   //    testPage: "/CreateContent",

   //    "Check content menu has been disabled again": function() {
   //       return this.remote.findByCssSelector("#SET_OTHER_FILTER_label")
   //          .click()
   //          .end()

   //       // Check the content menu is disabled...
   //       .findAllByCssSelector("#CREATE_CONTENT_MENU.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Content menu was not disabled");
   //          }, null);
   //    },

   //    "Check that content menu item in standard menu is disabled again": function() {
   //       // Check the create content menu item in the standard popup menu is disabled...
   //       return this.remote.findByCssSelector("#POPUP_MENU_text")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Content item in standard popup menu was not disabled");
   //          });
   //    },

   //    "Check that create template cascade has been disabled again": function() {
   //       return this.remote.findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Create templates in standard popup menu was not disabled");
   //          });
   //    },

   //    "Check that content menu bar item has been disabled again": function() {
   //       return this.remote.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Content menu bar item was not disabled");
   //          }, null);
   //    },

   //    "Check that create content menu has been re-enabled": function() {
   //       // Allow permissions...
   //       return this.remote.findByCssSelector("#SET_PATH_label")
   //          .click()
   //          .end()

   //       // Check the content menu is re-enabled...
   //       .findByCssSelector("#CREATE_CONTENT_MENU_text")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#CREATE_XML_DOC_1.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 0, "Content item in create content menu was not re-enabled");
   //          }, null);
   //    },

   //    "Check that create content menu item in standard menu has been re-enabled": function() {
   //       // Check the create content menu item in the standard popup menu is disabled...
   //       return this.remote.findByCssSelector("#POPUP_MENU_text")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 0, "Content item in standard popup menu was not re-enabled");
   //          });
   //    },

   //    "Check that create template cascade has been re-enabled": function() {
   //       return this.remote.findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 0, "Create templates in standard popup menu was not re-enabled");
   //          });
   //    },

   //    "Check that create content menu bar item has been re-enabled": function() {
   //       return this.remote.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 0, "Content menu bar item was not re-enabled");
   //          }, null);
   //    }
   // });

   // defineSuite(module, {
   //    name: "Create Templates Tests",
   //    testPage: "/CreateContent",

   //    "Check create template node has rendered correctly": function() {
   //       return this.remote.findByCssSelector("#POPUP_MENU_text")
   //          .click()
   //          .end()
   //          .findByCssSelector("#CREATE_TEMPLATES_text")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#CREATE_TEMPLATES_dropdown tbody tr:first-child td:nth-child(2)")
   //          .end()
   //          .findByCssSelector("#CREATE_TEMPLATES_dropdown tbody tr:first-child td:nth-child(2)")
   //          .getVisibleText()
   //          .then(function(text) {
   //             assert.equal(text, "Node 1", "Node wasn't rendered correctly");
   //          });
   //    },

   //    "Check that create template topic was published correctly": function() {
   //       return this.remote.findByCssSelector("#CREATE_TEMPLATES_dropdown tbody tr:first-child td:nth-child(2)")
   //          .click()
   //          .end()
   //          .getLastPublish("ALF_CREATE_CONTENT")
   //          .then(function(payload) {
   //             assert.deepPropertyVal(payload, "action.params.sourceNodeRef", "workspace://SpacesStore/0e56c7a3-67d0-4a35-b2ce-4c2038897a66", "Create template topic not published correctly");
   //          });
   //    },

   //    "Check folder template creation label": function() {
   //       return this.remote.findByCssSelector("#POPUP_MENU_text")
   //          .click()
   //          .end()
   //          .findByCssSelector("#CREATE_FOLDER_TEMPLATES_text")
   //          .getVisibleText()
   //          .then(function(text) {
   //             assert.equal(text, "Create content from folder template", "Menu item label was not correct");
   //          });
   //    },

   //    "Check folder templates loaded": function() {
   //       return this.remote.findByCssSelector("#CREATE_FOLDER_TEMPLATES_text")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#CREATE_FOLDER_TEMPLATES_dropdown .alf-menu-group-items tr")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Unexpected number of folder templates found");
   //          });
   //    },

   //    "Check folder override dialog is displayed when template selected": function() {
   //       return this.remote.findByCssSelector("#CREATE_FOLDER_TEMPLATES_text")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#CREATE_FOLDER_TEMPLATES_dropdown tr:first-child td:nth-child(2)")
   //          .click()
   //          .end()
   //          .findAllByCssSelector("#ALF_CREATE_FOLDER_TEMPLATE_NODE")
   //          .then(function(elements) {
   //             assert.lengthOf(elements, 1, "Folder template overrides dialog was not displayed");
   //          });
   //    },

   //    "Override folder template settings": function() {
   //       return this.remote.findByCssSelector("#FOLDER_TEMPLATE_NAME  .dijitInputContainer input")
   //          .clearValue()
   //          .type("Name")
   //          .end()
   //          .findByCssSelector("#FOLDER_TEMPLATE_TITLE  .dijitInputContainer input")
   //          .clearValue()
   //          .type("Title")
   //          .end()
   //          .findByCssSelector("#FOLDER_TEMPLATE_DESCRIPTION textarea")
   //          .clearValue()
   //          .type("Description")
   //          .end()
   //          .findByCssSelector("#ALF_CREATE_FOLDER_TEMPLATE_NODE .confirmationButton > span")
   //          .click()
   //          .end()
   //          .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogHidden")
   //          .end()
   //          .getXhrEntries({
   //             url: "folder-templates",
   //             method: "POST",
   //             pos: "last"
   //          })
   //          .then(function(xhr) {
   //             assert.propertyVal(xhr.request.body, "parentNodeRef", "some://dummy/node");
   //             assert.propertyVal(xhr.request.body, "sourceNodeRef", "workspace://SpacesStore/c90aa137-2c57-4a36-8681-b0b207cbee91");
   //             assert.propertyVal(xhr.request.body, "prop_cm_name", "Name");
   //             assert.propertyVal(xhr.request.body, "prop_cm_title", "Title");
   //             assert.propertyVal(xhr.request.body, "prop_cm_description", "Description");
   //          });
   //    }
   // });
});