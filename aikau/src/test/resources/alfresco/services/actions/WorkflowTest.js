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
        "require",
        "alfresco/TestCommon"],
           function(registerSuite, assert, require, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Assign Workflow Test",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/WorkflowActions", "Assign Workflow Test").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Assign a workflow": function() {
            return browser.findByCssSelector("#ASSIGN_label")
               .click()
            .end()
            .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_POST_TO_PAGE", "url", "/aikau/page/dp/ws/start-workflow"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Workflow not assigned");
               })
            .end()
            .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_POST_TO_PAGE", "type", "FULL_PATH"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Workflow URL type incorrect");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Simple Workflow Actions Tests (Successes)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/WorkflowActions?responseCode=200", "Simple Workflow Actions Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Approve a workflow": function() {
            return browser.findByCssSelector("#APPROVE_SUCCESS_label")
               .click()
            .end()
            .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_NOTIFICATION", "message", "File marked as approved"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Simple approval success notification not found");
               });
         },

         "Reject a workflow": function() {
            return browser.findByCssSelector("#REJECT_SUCCESS_label")
               .click()
            .end()
            .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_NOTIFICATION", "message", "File marked as rejected"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Simple rejection success notification not found");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Simple Workflow Actions Tests (Failures)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/WorkflowActions?responseCode=500", "Simple Workflow Actions Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Approve a workflow": function() {
            return browser.findByCssSelector("#APPROVE_FAILURE_label")
               .click()
            .end()
            .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_NOTIFICATION", "message", "Workflow action couldn't be completed."))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Simple approval failure notification not found");
               });
         },

         "Reject a workflow": function() {
            return browser.findByCssSelector("#REJECT_FAILURE_label")
               .click()
            .end()
            .findAllByCssSelector(TestCommon.topicSelector("ALF_DOCLIST_RELOAD_DATA", "publish", "last"))
            .end()
            .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_NOTIFICATION", "message", "Workflow action couldn't be completed."))
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "Simple rejection failure notification not found");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Start Workflow Action Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/StartWorkflow", "Start Workflow Action Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Test single item download": function() {
            // This test simulates the payload that would be generated from legacy document library action 
            // configuration to check that the appropriate publications occur...
            return browser.findById("SINGLE_VIA_ACTION_SERVICE_label")
                  .click()
               .end()
               .getLastPublish("ALF_POST_TO_PAGE", "Start workflow navigation not found")
                  .then(function(payload) {
                     assert.deepPropertyVal(payload, "parameters.selectedItems", "workspace://SpacesStore/node1", "Incorrect nodeRef");
                     assert.propertyVal(payload, "target", "CURRENT", "Incorrect navigation target");
                  })
                  .clearLog();
         },

         "Test multiple item download": function() {
            // This test simulates the payload that would be generated from a multiple item selection action 
            // based on the legacy Share document library action configuration...
            return browser.findById("MULTIPLE_VIA_ACTION_SERVICE_label")
                  .click()
               .end()
               .getLastPublish("ALF_POST_TO_PAGE", "Start workflow navigation not found")
                  .then(function(payload) {
                     assert.deepPropertyVal(payload, "parameters.selectedItems", "workspace://SpacesStore/node2,workspace://SpacesStore/node3", "Incorrect nodeRef");
                     assert.propertyVal(payload, "target", "CURRENT", "Incorrect navigation target");
                  })
                  .clearLog();
         },

         "Test non-legacy action version": function() {
            return browser.findByCssSelector("#ACTIONS_ITEM_0_MENU_text")
               .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_0_START-WORKFLOW_text")
               .click()
            .end()
            .getLastPublish("ALF_POST_TO_PAGE", "Start workflow navigation post not found")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "parameters.selectedItems", "workspace://SpacesStore/node4", "Incorrect nodeRef");
                  assert.propertyVal(payload, "target", "CURRENT", "Incorrect navigation target");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});