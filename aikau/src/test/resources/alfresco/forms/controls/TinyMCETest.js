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
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "TinyMCE",
      testPage: "/TinyMCE",

      "Can enter content into control and publish it": function() {
         return this.remote.findByCssSelector(".alfresco-editors-TinyMCE iframe")
            .execute("tinymce.get(0).setContent('<p><strong>a</strong></p>');")
            .execute("tinymce.get(0).save();")
            .screenie()
            .screenie()
            .end()

         .findByCssSelector(".confirmationButton .dijitButtonNode")
            .click()
            .end()

         .getLastPublish("FORM_POST")
            .then(function(payload) {
               assert.include(payload.RichText, "<p><strong>a</strong></p>", "Publish did not include created content");
            }).clearLog();
      },

      // Review point 2: "Is the formatting maintained?" - set content that mixes several formatting
      // styles (bold/italic/underline plus a list) and confirm every tag survives the
      // getContent()/save() round-trip in the published payload.
      "Formatting is maintained when content is saved": function() {
         var richContent = "<p><strong>bold</strong> <em>italic</em> <u>underline</u></p><ul><li>item</li></ul>";
         return this.remote.findByCssSelector(".alfresco-editors-TinyMCE iframe")
            .execute("tinymce.get(0).setContent('" + richContent + "');")
            .execute("tinymce.get(0).save();")
            .end()

         .findByCssSelector(".confirmationButton .dijitButtonNode")
            .click()
            .end()

         .getLastPublish("FORM_POST")
            .then(function(payload) {
               assert.include(payload.RichText, "<strong>bold</strong>", "Bold formatting was not maintained");
               assert.include(payload.RichText, "<em>italic</em>", "Italic formatting was not maintained");
               assert.include(payload.RichText, "<u>underline</u>", "Underline formatting was not maintained");
               assert.include(payload.RichText, "<ul>", "List formatting was not maintained");
            }).clearLog();
      },

      // Review point 3: "Are there any issues with existing comments, where you edit the comment?"
      // The TINY_MCE_3 editor is pre-populated (see TinyMCE.get.js) to simulate an existing comment.
      // First confirm the existing content is loaded into the editor for editing...
      "Existing comment content is loaded for editing": function() {
         return this.remote.execute("return tinymce.get('RichText3') && tinymce.get('RichText3').getContent();")
            .then(function(content) {
               assert.include(content, "<strong>Bold</strong>", "Existing comment content was not loaded for editing");
               assert.include(content, "<ul>", "Existing comment list content was not loaded for editing");
            });
      },

      // ...then confirm an edit to that existing content is saved correctly and keeps its formatting.
      "Edited existing comment is saved correctly": function() {
         return this.remote.execute("tinymce.get('RichText3').setContent('<p><strong>Bold</strong> edited</p>');")
            .execute("tinymce.get('RichText3').save();")
            .end()

         .findByCssSelector(".confirmationButton .dijitButtonNode")
            .click()
            .end()

         .getLastPublish("FORM_POST")
            .then(function(payload) {
               assert.include(payload.RichText3, "edited", "Edited comment content was not saved");
               assert.include(payload.RichText3, "<strong>Bold</strong>", "Formatting of edited comment was not maintained");
            }).clearLog();
      },

      // See AKU-952
      "Custom editor can be used": function() {
         return this.remote.findByCssSelector(".custom-tiny-mce-editor");
      },

      "Custom toolbar and plugins can be configured": function() {
         // NOTE: TinyMCE 8 no longer uses the v4 ".mce-i-*" icon classes. The custom editor
         //       (TINY_MCE_2) is configured with a single "visualchars" toolbar button, which in
         //       the v8 "oxide" skin is rendered as a ".tox-tbtn" with the "Show invisible
         //       characters" aria-label.
         return this.remote.findByCssSelector("#TINY_MCE_2 .tox-tbtn[aria-label=\"Show invisible characters\"]");
      },

      // See AKU-711...
      "Focus is set in dialog form": function() {
         return this.remote.findById("CREATE_FORM_DIALOG_label")
            .click()
            .end()

         // NOTE: It's not possible to type into the TinyMCE editor has it is rendered in an iframe
         //       and Selenium will not process the characters. Therefore we are relying on a topic
         //       published when the editor gets focused to determine that the focus function has
         //       at least been called.
         .getLastPublish("ALF_TINYMCE_EDITOR_FOCUSED", "Editor was not given focus");
      }
   });
});