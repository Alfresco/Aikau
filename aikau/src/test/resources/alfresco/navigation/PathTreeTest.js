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
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Path Tree Tests",
      testPage: "/PathTree",

      "Test root is shown on TREE1": function() {
         return this.remote.findByCssSelector("#TREE1 .dijitTreeIsRoot > div.dijitTreeRow .dijitTreeLabel")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Custom Root", "The root node of TREE1 was not as expected");
            });
      },

      "Test that root is NOT shown on TREE2": function() {
         return this.remote.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeRow .dijitTreeLabel")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The root node of TREE2 was displayed unexpectedly");
            });
      },

      "Test that first node of TREE2 is Document Library": function() {
         return this.remote.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow .dijitTreeLabel")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Document Library", "The root node of TREE2 was not as expected");
            });
      },

      "Test that clicking on TREE1 publishes path": function() {
         return this.remote.findByCssSelector("#TREE1 .dijitTreeIsRoot > div.dijitTreeRow .dijitTreeLabel")
            .click()
            .end()
            .getLastPublish("ALF_DOCUMENTLIST_PATH_CHANGED")
            .then(function(payload) {
               assert.propertyVal(payload, "path", "/", "Clicking on the root of TREE1 did not publish the expected path");
            });
      },

      "Test that clicking on TREE2 publishes custom topic": function() {
         return this.remote.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow .dijitTreeLabel")
            .click()
            .end()
            .getLastPublish("ALF_ITEM_SELECTED", "The topic published by clicking on TREE2 nodes is not requested custom topic");
      },

      "Test that TREE1 has NOT filtered site containers": function() {
         return this.remote.findAllByCssSelector("#TREE1 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "TREE1 did not have the expected number of nodes under the root");
            });
      },

      "Test that TREE2 has filtered site containers": function() {
         return this.remote.findAllByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "TREE2 did not have the expected number of nodes under the root");
            });
      },

      "Test that TREE2 Document Library is NOT expanded": function() {
         return this.remote.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeNodeContainer")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The child nodes of the Document Library in TREE2 were initially displayed");
            });
      },

      "Test that child nodes of TREE2 Document Library are not loaded": function() {
         return this.remote.findAllByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeNodeContainer > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The child nodes of the Document Library in TREE2 were loaded before being requested");
            });
      },

      "Test that opening a node loads its children": function() {
         return this.remote.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow .dijitTreeExpando")
            .click()
            .end()
            .findAllByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeNodeContainer > *")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "The child nodes of the Document Library in TREE2 were not loaded when requested");
            });
      },

      "Test that paths are correct for child nodes": function() {
         return this.remote.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeNodeContainer > div:first-child div.dijitTreeRow .dijitTreeLabel")
            .click()
            .end()
            .getLastPublish("ALF_ITEM_SELECTED")
            .then(function(payload) {
               assert.propertyVal(payload, "path", "/documentLibrary/Agency Files/", "Clicking on a child node of TREE2 did not publish the expected path");
            });
      },

      "Publish hash change": function() {
         return this.remote.findById("SET_HASH_label")
            .click()
            .end()
            .findAllByCssSelector("#TREE1 .dijitTreeNode .dijitTreeNode .dijitTreeNode .dijitTreeNode")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Setting the hash did not expand the first tree");
            })
            .end()
            .findAllByCssSelector("#TREE2 .dijitTreeNode .dijitTreeNode .dijitTreeNode .dijitTreeNode")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Setting the hash should not have expanded the second tree");
            });
      },

      "Publish path change": function() {
         return this.remote.findById("SET_PATH_label")
            .click()
            .end()
            .findAllByCssSelector("#TREE2 .dijitTreeNode .dijitTreeNode .dijitTreeNode .dijitTreeNode")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Setting the path did not expand the second tree");
            });
      },

      "Check that expanded node is selected": function() {
         return this.remote.findByCssSelector("#TREE2_TREE_workspace_SpacesStore_d56afdc3-0174-4f8c-bce8-977cafd712ab > .dijitTreeRowSelected");
      },

      // See AKU-739 - Updates have been made to ensure that tree nodes can be refreshed on folder creation/deletion
      //               The thing is to check that XHR requests are made to get the latest data
      "Check tree node refresh on folder add": function() {
         return this.remote.findById("ADD_FOLDER_label")
            .clearXhrLog()
            .click()
            .end()

         .getLastXhr()
            .then(function(xhr) {
               /* jshint maxlen:500*/
               assert.include(xhr.request.url, "/slingshot/doclib/treenode/node/alfresco/company/home/documentLibrary/Budget Files/?perms=false&children=false&max=500&libraryRoot=workspace%3A%2F%2FSpacesStore%2Fb4cff62a-664d-4d45-9302-98723eac1319");
            });
      },

      "Check tree node refresh on folder delete": function() {
         return this.remote.findById("DELETE_FOLDER_label")
            .clearXhrLog()
            .click()
            .end()

         .getLastXhr()
            .then(function(xhr) {
               /* jshint maxlen:500*/
               assert.include(xhr.request.url, "/slingshot/doclib/treenode/node/alfresco/company/home/documentLibrary/Budget Files/?perms=false&children=false&max=500&libraryRoot=workspace%3A%2F%2FSpacesStore%2Fb4cff62a-664d-4d45-9302-98723eac1319");
            });
      },

      // See AKU-770 - As with previous two tests, but in this case checking at the root node which wasn't previously working
      "Check root node refresh on folder add": function() {
         return this.remote.findById("ADD_FOLDER_AT_ROOT_label")
            .clearXhrLog()
            .click()
            .end()

         .getLastXhr()
            .then(function(xhr) {
               /* jshint maxlen:500*/
               assert.include(xhr.request.url, "/slingshot/doclib/treenode/node/alfresco/company/home/documentLibrary/?perms=false&children=false&max=500&libraryRoot=workspace%3A%2F%2FSpacesStore%2Fb4cff62a-664d-4d45-9302-98723eac1319");
            });
      },

      "Check root node refresh on folder delete": function() {
         return this.remote.findById("DELETE_FOLDER_AT_ROOT_label")
            .clearXhrLog()
            .click()
            .end()

         .getLastXhr()
            .then(function(xhr) {
               /* jshint maxlen:500*/
               assert.include(xhr.request.url, "/slingshot/doclib/treenode/node/alfresco/company/home/?perms=false&children=false&max=500&libraryRoot=workspace%3A%2F%2FSpacesStore%2Fb4cff62a-664d-4d45-9302-98723eac1319");
            });
      }
   });
});