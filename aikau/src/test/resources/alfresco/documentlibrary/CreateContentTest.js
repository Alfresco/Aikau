/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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

   registerSuite({
      name: 'Create Content Test',
      'Create Content': function () {

         var browser = this.remote;
         var testname = "Create Content Test";
         return TestCommon.loadTestWebScript(this.remote, "/CreateContent", testname)

         // Check everything is initialised correctly...
         .findByCssSelector("#CREATE_CONTENT_MENU_text")
            .click()
            .end()

         .findByCssSelector("#CREATE_XML_DOC_1")
            .then(null, function() {
               TestCommon.log(testname, "Checking for create content item in create content menu");
               assert(false, "Test #1a - Couldn't find content item in create content menu");
            })
            .end()
         .findAllByCssSelector("#CREATE_XML_DOC_1.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking create content item in create content menu is NOT disabled");
               assert(elements.length === 0, "Test #1b - Content item in create content menu was unexpectedly disabled");
            }, null)
            .end()

         .findByCssSelector("#POPUP_MENU_text")
            .click()
            .end()

         .findByCssSelector("#CREATE_XML_DOC_2")
            .then(null, function() {
               TestCommon.log(testname, "Checking for create content item in standard menu");
               assert(false, "Test #1c - Couldn't find content item in standard popup menu");
            })
            .end()

         .findByCssSelector("#CREATE_TEMPLATES")
            .then(null, function() {
               TestCommon.log(testname, "Checking for create template cascade");
               assert(false, "Test #1d - Couldn't find create templates cascade in standard popup menu");
            })
            .end()

         .findByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM")
            .then(null, function() {
               assert(false, "Test #1e - Couldn't find content menu bar item");
            })
            .end()
         .findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking create content menu bar item is not disabled");
               assert(elements.length === 0, "Test #1e - Content menu bar item was unexpectedly disabled");
            }, null)
            .end()

         .alfPostCoverageResults(browser);
      },
      'Create Content (deny permission)': function () {

         var browser = this.remote;
         var testname = "Create Content Test (Deny Permission)";
         return TestCommon.loadTestWebScript(this.remote, "/CreateContent", testname)

         // Deny permissions...
         .findByCssSelector("#DENY_CREATE_PERMISSION_label")
            .click()
            .end()

         // Check the content menu is disabled...
         .findAllByCssSelector("#CREATE_CONTENT_MENU.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking create content menu is now disabled");
               assert(elements.length === 1, "Test #2a - Content menu was not disabled");
            }, null)
            .end()

         // Check the create content menu item in the standard popup menu is disabled...
         .findByCssSelector("#POPUP_MENU_text")
            .click()
            .end()
         .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking create content item in standard menu is now disabled");
               assert(elements.length === 1, "Test #2b - Content item in standard popup menu was not disabled");
            })
            .end()
         .findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking create template cascade is now disabled");
               assert(elements.length === 1, "Test #2c - Create templates in standard popup menu was not disabled");
            })
            .end()

         .findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking menu bar item is now disabled");
               assert(elements.length === 1, "Test #2d - Content menu bar item was not disabled");
            }, null)
            .end()
            
         // Allow permissions...
         .findByCssSelector("#GRANT_CREATE_PERMISSION_label")
            .click()
            .end()

         // Check the content menu is re-enabled...
         .findByCssSelector("#CREATE_CONTENT_MENU_text")
            .click()
            .end()
         .findAllByCssSelector("#CREATE_XML_DOC_1.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking create content menu item in content menu has been re-enabled");
               assert(elements.length === 0, "Test #3a - Content item in create content menu was not re-enabled");
            }, null)
            .end()

         // Check the create content menu item in the standard popup menu is disabled...
         .findByCssSelector("#POPUP_MENU_text")
            .click()
            .end()
         .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking create content item in standard popup is re-enabled");
               assert(elements.length === 0, "Test #3b - Content item in standard popup menu was not re-enabled");
            })
            .end()
         .findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Check create template cascade has been re-enabled");
               assert(elements.length === 0, "Test #3c - Create templates in standard popup menu was not re-enabled");
            })
            .end()

         .findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Checking that content menu bar item has been re-enabled");
               assert(elements.length === 0, "Test #3d - Content menu bar item was not re-enabled");
            }, null)
            .end()

         .alfPostCoverageResults(browser);
      },
      'Create Content (change path)': function () {

         var browser = this.remote;
         var testname = "Create Content Test (Change Path)";
         return TestCommon.loadTestWebScript(this.remote, "/CreateContent", testname)

         // Set tag filter...
         .findByCssSelector("#SET_OTHER_FILTER_label")
            .click()
            .end()

         // Check the content menu is disabled...
         .findAllByCssSelector("#CREATE_CONTENT_MENU.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Check content menu has been disabled again");
               assert(elements.length === 1, "Test #4a - Content menu was not disabled");
            }, null)
            .end()

         // Check the create content menu item in the standard popup menu is disabled...
         .findByCssSelector("#POPUP_MENU_text")
            .click()
            .end()
         .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Check that content menu item in standard menu is disabled again");
               assert(elements.length === 1, "Test #4b - Content item in standard popup menu was not disabled");
            })
            .end()
         .findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Check that create template cascade has been disabled again");
               assert(elements.length === 1, "Test #4c - Create templates in standard popup menu was not disabled");
            })
            .end()

         .findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Check that content menu bar item has been disabled again");
               assert(elements.length === 1, "Test #4d - Content menu bar item was not disabled");
            }, null)
            .end()

         // Allow permissions...
         .findByCssSelector("#SET_PATH_label")
            .click()
            .end()

         // Check the content menu is re-enabled...
         .findByCssSelector("#CREATE_CONTENT_MENU_text")
            .click()
            .end()
         .findAllByCssSelector("#CREATE_XML_DOC_1.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Check that create content menu has been re-enabled");
               assert(elements.length === 0, "Test #5a - Content item in create content menu was not re-enabled");
            }, null)
            .end()

         // Check the create content menu item in the standard popup menu is disabled...
         .findByCssSelector("#POPUP_MENU_text")
            .click()
            .end()
         .findAllByCssSelector("#CREATE_XML_DOC_2.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Check that create content menu item in standard menu has been re-enabled");
               assert(elements.length === 0, "Test #5b - Content item in standard popup menu was not re-enabled");
            })
            .end()
         .findAllByCssSelector("#CREATE_TEMPLATES.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Check that create template cascade has been re-enabled");
               assert(elements.length === 0, "Test #5c - Create templates in standard popup menu was not re-enabled");
            })
            .end()

         .findAllByCssSelector("#CREATE_CONTENT_MENUBAR_ITEM.dijitMenuItemDisabled")
            .then(function(elements) {
               TestCommon.log(testname, "Check that create content menu bar item has been re-enabled");
               assert(elements.length === 0, "Test #5d - Content menu bar item was not re-enabled");
            }, null)
            .end()

         .alfPostCoverageResults(browser);
      },
      'Create Templates': function () {

         var browser = this.remote;
         var testname = "Create Templates Test";
         return TestCommon.loadTestWebScript(this.remote, "/CreateContent", testname)

         .end()

         .findByCssSelector("#POPUP_MENU_text")
            .click()
            .end()

         .findByCssSelector("#CREATE_TEMPLATES_text")
            .click()
            .end()

         .findByCssSelector("#CREATE_TEMPLATES_dropdown tbody tr:first-child td:nth-child(2)")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Check create template node has rendered correctly");
               assert(text === "Node 1", "Test #1a - Node wasn't rendered correctly");
            })
            .click()
            .end()

         .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("ALF_CREATE_CONTENT", "params", "nodeRef", "workspace://SpacesStore/0e56c7a3-67d0-4a35-b2ce-4c2038897a66"))
            .then(function(elements) {
               TestCommon.log(testname, "Check that create template topic was published correctly");
               assert(elements.length == 1, "Test #1b - Create template topic not published correctly");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});