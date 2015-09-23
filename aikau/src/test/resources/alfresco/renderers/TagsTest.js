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
 * This test renders examples of Tags.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "Tags Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Tags", "Tags Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Check there are the expected number of tag controls successfully rendered": function () {
         return browser.findAllByCssSelector("span.alfresco-renderers-InlineEditProperty.alfresco-renderers-Property")
            .then(function (tagcontrols){
               assert.lengthOf(tagcontrols, 4, "There should be 4 tag controls successfully rendered");
            });
      },

      "Check there are the expected number of readonlytags successfully rendered": function() {
         return browser.findAllByCssSelector("#TAGS_4 span.alfresco-renderers-ReadOnlyTag")
            .then(function (readonlytags){
               assert.lengthOf(readonlytags, 3, "There should be 3 readonlytags successfully rendered");
            });
      },

      "Check there are no edittags shown": function() {
         return browser.findAllByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag")
            .then(function (edittags){
               assert.lengthOf(edittags, 0, "There should be 0 edittags shown");
            });
      },

      "Check the link click published as expected": function() {
         return browser.findByCssSelector("#TAGS_4 span.alfresco-renderers-ReadOnlyTag:first-of-type a")
            .click()
         .end()
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "type", "HASH", "The link did not publish the payload with 'type' as 'HASH'");
               assert.propertyVal(payload, "url", "tag=Test1", "The link did not publish the payload with 'url' as 'tag=Test1'");
            });
      },

      "Check there are 3 edit tags now shown": function() {
         return browser.findByCssSelector("#TAGS_4 > img.editIcon")
            .click()
         .end()

         .findAllByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag")
            .then(function (edittags){
               assert.lengthOf(edittags, 3, "There should be 3 edittags now shown");
            });
      },

      "Check the first edit tag reads 'Test1'": function() {
         return browser.findByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag:first-of-type")
            .getVisibleText()
            .then(function (edittagtext){
               assert.include(edittagtext, "Test1", "Edit tag 1 should read 'Test1'");
            });
      },

      "Check there are 2 edit tags now shown": function() {
         return browser.findByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag:first-of-type span.tagDelete")
            .click()
         .end()

         .findAllByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag")
            .then(function (edittags){
               assert.lengthOf(edittags, 2, "There should be 2 edittags now shown");
            });
      },

      "Check the first edit tag now reads 'Test2'": function() {
         return browser.findByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag:first-of-type")
            .getVisibleText()
            .then(function (edittagtext){
               assert.include(edittagtext, "Test2", "Edit tag 1 should now read 'Test2'");
            })
         .end()

         // Click the cancel button
         .findByCssSelector("#TAGS_4 span.action:nth-of-type(2)")
            .click()
         .end();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

registerSuite(function(){
   var browser;

   return {
      name: "Tags Tests (inline creation and save)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Tags", "Tags Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "There should be no read only tags initially": function() {
         return browser.findAllByCssSelector("#TAGS_3 .alfresco-renderers-ReadOnlyTag")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "There should be no tags initially");
            });
      },

      "Navigate to a node with no tags and edit it": function() {
         // Tab to the third Tags renderer and use the keyboard shortcut to edit it...
         // An immediate request for existing tags should be made
         return browser.pressKeys([keys.TAB])
            .pressKeys([keys.TAB])
            .pressKeys([keys.TAB])
            .pressKeys([keys.CONTROL, "e"])
            .pressKeys(keys.NULL)
            .end()
            .getLastPublish("ALF_RETRIEVE_CURRENT_TAGS", "No request made for existing tag data");
      },

      "Type a new tag name and hit enter to create it": function() {
         return browser.pressKeys("tag1")
            .pressKeys(keys.ENTER)
            .findByCssSelector(".mx-row:last-child .mx-payload")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "{\"name\":\"tag1\"}", "Request to create new tag not made");
               });
      },

      "New tag should be displayed": function() {
         return browser.findAllByCssSelector("#TAGS_3 .alfresco-renderers-EditTag")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Should be displaying the tag just created");
            });
      },

      "Hit return to save the node with the new tag": function() {
         return browser.pressKeys([keys.ENTER])
            .findByCssSelector(".mx-row:last-child .mx-url")
               .getVisibleText()
               .then(function(url) {
                  assert.include(url, "proxy/alfresco/api/node/workspace/SpacesStore/d91128af-3b99-4710-95b6-a858eb090418/formprocessor", "A request was not made to save the node");
               });
      },

      "The updated tag should be displayed in read-only mode": function() {
         return browser.findAllByCssSelector("#TAGS_3 .alfresco-renderers-ReadOnlyTag")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Should be displaying the tag just created");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});