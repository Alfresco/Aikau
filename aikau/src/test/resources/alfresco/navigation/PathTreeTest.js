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
   function(registerSuite, expect, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Path Tree Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/PathTree", "Path Tree Tests").end();
      },
      
      beforeEach: function() {
         browser.end();
      },
      
      "Test root is shown on TREE1": function() {
         return browser.findByCssSelector("#TREE1 .dijitTreeIsRoot > div.dijitTreeRow .dijitTreeLabel")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Custom Root", "The root node of TREE1 was not as expected");
            });
      },
      
      "Test that root is NOT shown on TREE2": function() {
         return browser.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeRow .dijitTreeLabel")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The root node of TREE2 was displayed unexpectedly");
            });
      },
     
      "Test that first node of TREE2 is Document Library": function() {
         return browser.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow .dijitTreeLabel")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Document Library", "The root node of TREE2 was not as expected");
            });
      },
     
      "Test that clicking on TREE1 publishes path": function() {
         return browser.findByCssSelector("#TREE1 .dijitTreeIsRoot > div.dijitTreeRow .dijitTreeLabel")
            .click()
         .end()
         .getLastPublish("ALF_DOCUMENTLIST_PATH_CHANGED")
            .then(function(payload) {
               assert.propertyVal(payload, "path", "/", "Clicking on the root of TREE1 did not publish the expected path");
            });
      },
   
      "Test that clicking on TREE2 publishes custom topic": function() {
         return browser.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow .dijitTreeLabel")
            .click()
         .end()
         .getLastPublish("ALF_ITEM_SELECTED", "The topic published by clicking on TREE2 nodes is not requested custom topic");
      },
  
      "Test that TREE1 has NOT filtered site containers": function() {
         return browser.findAllByCssSelector("#TREE1 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "TREE1 did not have the expected number of nodes under the root");
            });
      },
  
      "Test that TREE2 has filtered site containers": function() {
         return browser.findAllByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "TREE2 did not have the expected number of nodes under the root");
            });
      },

      "Test that TREE2 Document Library is NOT expanded": function() {
         return browser.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeNodeContainer")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The child nodes of the Document Library in TREE2 were initially displayed");
            });
      },
 
      "Test that child nodes of TREE2 Document Library are not loaded": function() {
         return browser.findAllByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeNodeContainer > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The child nodes of the Document Library in TREE2 were loaded before being requested");
            });
      },

      "Test that opening a node loads its children": function() {
         return browser.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeRow .dijitTreeExpando")
            .click()
         .end()
         .findAllByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeNodeContainer > *")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "The child nodes of the Document Library in TREE2 were not loaded when requested");
            });
      },
 
      "Test that paths are correct for child nodes": function() {
         return browser.findByCssSelector("#TREE2 .dijitTreeIsRoot > div.dijitTreeNodeContainer div.dijitTreeNodeContainer > div:first-child div.dijitTreeRow .dijitTreeLabel")
            .click()
         .end()
         .getLastPublish("ALF_ITEM_SELECTED")
            .then(function(payload) {
               assert.propertyVal(payload, "path", "/documentLibrary/Agency Files/", "Clicking on a child node of TREE2 did not publish the expected path");
            });
      },

      "Publish hash change": function() {
         return browser.findById("SET_HASH_label")
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
         return browser.findById("SET_PATH_label")
            .click()
         .end()
         .findAllByCssSelector("#TREE2 .dijitTreeNode .dijitTreeNode .dijitTreeNode .dijitTreeNode")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Setting the path did not expand the second tree");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});