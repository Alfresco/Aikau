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
 * This is a unit test for AlfStackContainer
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Stack Container Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfStackContainer", "Stack Container Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check the stack container is present": function () {
         return browser.findByCssSelector("div.alfresco-layout-AlfStackContainer > div.dijitStackContainer")
            .then(function () {
               
            },
            function () {
               assert(false, "Stack container not rendered");
            });
      },

      "Check the correct number of panes is present": function() {
         return browser.findAllByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper")
            .then(
               function (panes) {
                  assert.lengthOf(panes, 5, "Incorrect number of initial panes");
               }
            );
      },

      "Visible pane not rendered": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper.dijitVisible")
            .then(
               function () {
               },
               function () {
                  assert(false, "Visible pane not rendered");
               });
      },

      "Check the correct number of hidden panes is present (4)": function() {
         return browser.findAllByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper.dijitHidden")
            .then(
               function (panes) {
                  assert.lengthOf(panes, 4, "Incorrect number of hidden panes");
               }
            );
      },

      "Checking 3rd pane is visible": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 3rd pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 3rd pane should not be hidden");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

   // This test reloads the page to clear any previous focus and make keyboard actions more predictable
registerSuite(function(){
   var browser;

   return {
      name: "Stack Container Tests (function)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfStackContainer", "Stack Container Tests (function)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Checking 3rd pane is visible": function () {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 3rd pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 3rd pane should not be hidden");
               });
      },

      "Checking 1st pane is visible after external selection by index": function() {
         return browser.findById("SELECT_PANE_1")
            .click()
            .end()

         .findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 1st pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 1st pane should not be hidden");
               });
      },

      "Checking 3rd pane is hidden after external selection by index": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 3rd pane should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 3rd pane should not be visible");
               });
      },

      "Checking 2nd pane is visible after external selection by index": function() {
         return browser.findById("SELECT_PANE_2")
            .click()
         .end()

         .findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(2)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 2nd pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 2nd pane should not be hidden");
               });
      },

      "Checking 1st pane is hidden after external selection by index": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 1st pane should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 1st pane should not be visible");
               });
      },

      "Checking 3rd pane is visible after external selection by title": function() {
         return browser.findById("SELECT_PANE_3")
            .click()
         .end()

         .findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 3rd pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 3rd pane should not be hidden");
               });
      },

      "Checking 2nd pane is hidden after external selection by title": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(2)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 2nd pane should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 2nd pane should not be visible");
               });
      },


      "Checking 4th pane is visible after external selection by title": function() {
         return browser.findById("SELECT_PANE_4")
            .click()
         .end()

         .findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(4)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 4th pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 4th pane should not be hidden");
               });
      },

      "Checking 3rd pane is hidden after external selection by title": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(3)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 3rd pane should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 3rd pane should not be visible");
               });
      },

      "Checking 5th pane is visible after external selection by id": function() {
         return browser.findById("SELECT_PANE_5")
            .click()
         .end()

         .findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(5)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 5th pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 5th pane should not be hidden");
               });
      },

      "Checking 4th pane is hidden after external selection by id": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(4)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 4th pane should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 4th pane should not be visible");
               });
      },

      "Checking 1st pane is visible after external selection by id": function() {
         return browser.findById("SELECT_PANE_6")
            .click()
         .end()

         .findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 1st pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 1st pane should not be hidden");
               });
      },

      "Checking 5th pane is hidden after external selection by id": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(5)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 5th pane should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 5th pane should not be visible");
               });
      },

      "Checking 2nd pane is visible after external selection by hash": function() {
         return browser.findById("SET_HASH1")
            .click()
         .end()

         .findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(2)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 2nd pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 2nd pane should not be hidden");
               });
      },

      "Checking 1st pane is hidden after external selection by hash": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 1st pane should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 1st pane should not be visible");
               });
      },

      "Checking 1st pane is visible after external selection by hash": function() {
         return browser.findById("SET_HASH2")
            .click()
         .end()

         .findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:first-of-type")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitVisible", "The 1st pane should be visible");
                  assert.notInclude(currClasses, "dijitHidden", "The 1st pane should not be hidden");
               });
      },

      "Checking 2nd pane is hidden after external selection by hash": function() {
         return browser.findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:nth-of-type(2)")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  assert.include(currClasses, "dijitHidden", "The 2nd pane should be hidden");
                  assert.notInclude(currClasses, "dijitVisible", "The 2nd pane should not be visible");
               });
      },

      "Check the correct number of panes is present": function() {
         return browser.findAllByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper")
            .then(
               function (panes) {
                  assert.lengthOf(panes, 5, "Incorrect number of initial panes");
               }
            );
      },

      "Check the correct number of panes is present after deleting pane 5": function() {
         return browser.findById("DELETE_PANE_1")
            .click()
         .end()

         .findAllByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper")
            .then(
               function (panes) {
                  assert.lengthOf(panes, 4, "Incorrect number of panes after deletion");
               }
            );
      },

      "Check the correct number of panes is present after deleting pane titled 'logo3'": function() {
         return browser.findById("DELETE_PANE_2")
            .click()
         .end()

         .findAllByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper")
            .then(
               function (panes) {
                  assert.lengthOf(panes, 3, "Incorrect number of panes after second deletion");
               }
            );
      },

      "Check the correct number of panes is present after deleting pane with id 'dijit_layout_ContentPane_2": function() {
         return browser.findById("DELETE_PANE_3")
            .click()
         .end()

         .findAllByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper")
            .then(
               function (panes) {
                  assert.lengthOf(panes, 2, "Incorrect number of panes after third deletion");
               }
            );
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

   // This test reloads the page to clear any previous focus and make keyboard actions more predictable
registerSuite(function(){
   var browser;

   return {
      name: "Stack Container Tests (add pane)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfStackContainer", "Stack Container Tests (add pane)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check the correct number of panes is present": function() {
         return browser.findAllByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper")
            .then(
               function (panes) {
                  assert.lengthOf(panes, 5, "Incorrect number of initial panes");
               }
            );
      },

      "Add a new pane": function () {
         return browser.findById("ADD_PANE_99")
            .click()
         .end()
         .findAllByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper")
            .then(
               function (panes) {
                  assert.lengthOf(panes, 6, "Incorrect number of panes after addition");
               }
            );
      },

      "Check that the new pane has rendered content correctly": function() {
         return browser.findById("SELECT_PANE_1")
            .click()
         .end()
         .findByCssSelector("div.dijitStackContainer > div.dijitStackContainerChildWrapper:first-of-type .alfresco-html-Label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "logo99", "The new pane content was rendered correctly");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
}); 