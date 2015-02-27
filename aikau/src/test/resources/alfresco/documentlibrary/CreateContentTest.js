/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Create Content Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/CreateContent", "Create Content Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },

      "Checking for create content item in create content menu": function () {
         // Check everything is initialised correctly...
         return browser.findByCssSelector("#CREATE_CONTENT_MENU_text")
            .click()
         .end()
         .findByCssSelector("#CREATE_XML_DOC_1")
            .then(null, function() {
               assert(false, "Couldn't find content item in create content menu");
            });
      },

      "Checking create content item in create content menu is NOT disabled": function() {
         return browser.findAllByCssSelector("#CREATE_XML_DOC_1.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content item in create content menu was unexpectedly disabled");
            }, null);
      },

      "Checking for create content item in standard menu": function() {
         return browser.findByCssSelector("#POPUP_MENU_text")
            .click()
         .end()
         .findByCssSelector("#CREATE_XML_DOC_2")
            .then(null, function() {
               assert(false, "Couldn't find content item in standard popup menu");
            });
      },

      "Checking for create template cascade": function() {
         return browser.findByCssSelector("#CREATE_TEMPLATES")
            .then(null, function() {
               assert(false, "Couldn't find create templates cascade in standard popup menu");
            });
      },

      "Check for create content menu bar item": function() {
         return browser.findByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM")
            .then(null, function() {
               assert(false, "Test #1e - Couldn't find content menu bar item");
            });
      },

      "Checking create content menu bar item is not disabled": function() {
         return browser.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content menu bar item was unexpectedly disabled");
            }, null);
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Create Content (Denied Permission) Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/CreateContent", "Create Content (Denied Permission) Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },

      "Checking create content menu is now disabled": function () {
         return browser.findByCssSelector("#DENY_CREATE_PERMISSION_label")
            .click()
         .end()

         // Check the content menu is disabled...
         .findAllByCssSelector("#CREATE_CONTENT_MENU.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Content menu was not disabled");
            }, null);
      },

      "Checking create content item in standard menu is now disabled": function() {
         // Check the create content menu item in the standard popup menu is disabled...
         return browser.findByCssSelector("#POPUP_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Content item in standard popup menu was not disabled");
            });
      },

      "Checking create template cascade is now disabled": function() {
         return browser.findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Create templates in standard popup menu was not disabled");
            });
      },

      "Checking menu bar item is now disabled": function() {
         return browser.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Content menu bar item was not disabled");
            }, null);
      },

      "Checking create content menu item in content menu has been re-enabled": function() {
         // Allow permissions...
         return browser.findByCssSelector("#GRANT_CREATE_PERMISSION_label")
            .click()
         .end()

         // Check the content menu is re-enabled...
         .findByCssSelector("#CREATE_CONTENT_MENU_text")
            .click()
            .end()
         .findAllByCssSelector("#CREATE_XML_DOC_1.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content item in create content menu was not re-enabled");
            }, null);
      },

      "Checking create content item in standard popup is re-enabled": function() {
         // Check the create content menu item in the standard popup menu is disabled...
         return browser.findByCssSelector("#POPUP_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content item in standard popup menu was not re-enabled");
            });
      },

      "Check create template cascade has been re-enabled": function() {
         return browser.findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Create templates in standard popup menu was not re-enabled");
            });
      },

      "Checking that content menu bar item has been re-enabled": function() {
         return browser.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content menu bar item was not re-enabled");
            }, null);
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Create Content (Change Path) Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/CreateContent", "Create Content (Change Path) Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },

      "Check content menu has been disabled again": function () {
         return browser.findByCssSelector("#SET_OTHER_FILTER_label")
            .click()
         .end()

         // Check the content menu is disabled...
         .findAllByCssSelector("#CREATE_CONTENT_MENU.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Content menu was not disabled");
            }, null);
      },

      "Check that content menu item in standard menu is disabled again": function() {
         // Check the create content menu item in the standard popup menu is disabled...
         return browser.findByCssSelector("#POPUP_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Content item in standard popup menu was not disabled");
            });
      },

      "Check that create template cascade has been disabled again": function() {
         return browser.findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Create templates in standard popup menu was not disabled");
            });
      },

      "Check that content menu bar item has been disabled again": function() {
         return browser.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Content menu bar item was not disabled");
            }, null);
      },

      "Check that create content menu has been re-enabled": function() {
         // Allow permissions...
         return browser.findByCssSelector("#SET_PATH_label")
            .click()
         .end()

         // Check the content menu is re-enabled...
         .findByCssSelector("#CREATE_CONTENT_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#CREATE_XML_DOC_1.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content item in create content menu was not re-enabled");
            }, null);
      },

      "Check that create content menu item in standard menu has been re-enabled": function() {
         // Check the create content menu item in the standard popup menu is disabled...
         return browser.findByCssSelector("#POPUP_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content item in standard popup menu was not re-enabled");
            });
      },

      "Check that create template cascade has been re-enabled": function() {
         return browser.findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Create templates in standard popup menu was not re-enabled");
            });
      },

      "Check that create content menu bar item has been re-enabled": function() {
         return browser.findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Content menu bar item was not re-enabled");
            }, null);
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Create Templates Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/CreateContent", "Create Templates Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },

      "Check create template node has rendered correctly": function () {
         return browser.findByCssSelector("#POPUP_MENU_text")
            .click()
         .end()
         .findByCssSelector("#CREATE_TEMPLATES_text")
            .click()
         .end()
         .findAllByCssSelector("#CREATE_TEMPLATES_dropdown tbody tr:first-child td:nth-child(2)")
         .end()
         .findByCssSelector("#CREATE_TEMPLATES_dropdown tbody tr:first-child td:nth-child(2)")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Node 1", "Node wasn't rendered correctly");
            })
            .click();
      },

      "Check that create template topic was published correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("ALF_CREATE_CONTENT", "params", "nodeRef", "workspace://SpacesStore/0e56c7a3-67d0-4a35-b2ce-4c2038897a66"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Create template topic not published correctly");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});