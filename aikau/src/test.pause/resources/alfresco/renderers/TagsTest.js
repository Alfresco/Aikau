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
 * This test renders examples of Tags.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   defineSuite(module, {
      name: "Tags Tests",
      testPage: "/Tags",

      "Check there are the expected number of tag controls successfully rendered": function() {
         return this.remote.findAllByCssSelector("span.alfresco-renderers-InlineEditProperty.alfresco-renderers-Property")
            .then(function(tagcontrols) {
               assert.lengthOf(tagcontrols, 4, "There should be 4 tag controls successfully rendered");
            });
      },

      "Check there are the expected number of readonlytags successfully rendered": function() {
         return this.remote.findAllByCssSelector("#TAGS_4 span.alfresco-renderers-ReadOnlyTag")
            .then(function(readonlytags) {
               assert.lengthOf(readonlytags, 3, "There should be 3 readonlytags successfully rendered");
            });
      },

      "Check there are no edittags shown": function() {
         return this.remote.findAllByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag")
            .then(function(edittags) {
               assert.lengthOf(edittags, 0, "There should be 0 edittags shown");
            });
      },

      "Check the link click published as expected": function() {
         return this.remote.findByCssSelector("#TAGS_4 span.alfresco-renderers-ReadOnlyTag:first-of-type a")
            .click()
         .end()
         
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "type", "HASH", "The link did not publish the payload with 'type' as 'HASH'");
               assert.propertyVal(payload, "url", "tag=Test1", "The link did not publish the payload with 'url' as 'tag=Test1'");
            });
      },

      "Check there are 3 edit tags now shown": function() {
         return this.remote.findByCssSelector("#TAGS_4 > img.editIcon")
            .click()
         .end()

         .findAllByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag")
            .then(function(edittags) {
               assert.lengthOf(edittags, 3, "There should be 3 edittags now shown");
            });
      },

      "Check the first edit tag reads 'Test1'": function() {
         return this.remote.findByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag:first-of-type")
            .getVisibleText()
            .then(function(edittagtext) {
               assert.include(edittagtext, "Test1", "Edit tag 1 should read 'Test1'");
            });
      },

      "Check there are 2 edit tags now shown": function() {
         return this.remote.findByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag:first-of-type span.tagDelete")
            .click()
         .end()

         .findAllByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag")
            .then(function(edittags) {
               assert.lengthOf(edittags, 2, "There should be 2 edittags now shown");
            });
      },

      "Check the first edit tag now reads 'Test2'": function() {
         return this.remote.findByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag:first-of-type")
            .getVisibleText()
            .then(function(edittagtext) {
               assert.include(edittagtext, "Test2", "Edit tag 1 should now read 'Test2'");
            })
         .end()

         // Click the cancel button
         .findByCssSelector("#TAGS_4 .editor .alfresco-forms-Form .cancelButton .dijitButtonText")
            .click();
      }
   });

   defineSuite(module, {
      name: "Tags Tests (inline creation and save)",
      testPage: "/Tags",

      "There should be no read only tags initially": function() {
         return this.remote.findAllByCssSelector("#TAGS_3 .alfresco-renderers-ReadOnlyTag")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "There should be no tags initially");
            })
            .clearLog();
      },

      "Navigate to a node with no tags and edit it": function() {
         // Tab to the third Tags renderer and use the keyboard shortcut to edit it...
         // An immediate request for existing tags should be made
         return this.remote.findByCssSelector("body")
            .tabToElement({
               selector: "#TAGS_3 .inlineEditValue"
            })
            .pressKeys([keys.CONTROL, "e"])
            .pressKeys(keys.NULL)
            .pressKeys(keys.SPACE)
            .pressKeys(keys.BACKSPACE)
         .end()
         
         .getLastPublish("ALF_RETRIEVE_CURRENT_TAGS", "No request made for existing tag data");
      },

      "Type a new tag name and hit enter to create it": function() {
         return this.remote.pressKeys("tag1")
            .pressKeys(keys.ENTER)
            .getLastXhr("aikau/proxy/alfresco/api/tag/workspace/SpacesStore")
            .then(function(xhr) {
               assert.propertyVal(xhr.request.body, "name", "tag1");
            });
      },

      "New tag should be displayed": function() {
         return this.remote.findAllByCssSelector("#TAGS_3 .alfresco-renderers-EditTag")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Should be displaying the tag just created");
            });
      },

      "Hit return to save the node with the new tag": function() {
         return this.remote.pressKeys([keys.ENTER])
            .getLastXhr("aikau/proxy/alfresco/api/node/workspace/SpacesStore/d91128af-3b99-4710-95b6-a858eb090418/formprocessor")
            .then(function(xhr) {
               assert.propertyVal(xhr.request.body, "node.properties.cm:taggable", "workspace://SpacesStore/6619a771-5e35-40be-8c08-2f4791d9a056");
            });
      },

      "The updated tag should be displayed in read-only mode": function() {
         return this.remote.findAllByCssSelector("#TAGS_3 .alfresco-renderers-ReadOnlyTag")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Should be displaying the tag just created");
            });
      },

      "The document-tagged event should have fired": function() {
         return this.remote.findByCssSelector("body")
            .getLastPublish("ALF_DOCUMENT_TAGGED");
      }
   });

   defineSuite(module, {
      name: "Tags Tests (hidden actions)",
      testPage: "/Tags",

      "Navigate to a node with no tags and edit it": function() {
         // Tab to the third Tags renderer and use the keyboard shortcut to edit it...
         // An immediate request for existing tags should be made
         return this.remote.findByCssSelector("body")
            .tabToElement({
               selector: "#TAGS_2 .inlineEditValue"
            })
            .pressKeys([keys.CONTROL, "e"])
            .pressKeys(keys.NULL)
         .end()

         .findDisplayedById("TAGS_2_EDIT_TAGS_CONTROL");
      },

      "Check that actions are not displayed": function() {
         return this.remote.findAllByCssSelector("#TAGS_2 .editor .alfresco-forms-Form .confirmationButton .dijitButtonText")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            })
         .end()

         .findAllByCssSelector("#TAGS_2  .editor .alfresco-forms-Form .cancelButton .dijitButtonText")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      }
   });
});