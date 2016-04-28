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

      // See AKU-952
      "Custom editor can be used": function() {
         return this.remote.findByCssSelector(".custom-tiny-mce-editor");
      },

      "Custom toolbar and plugins can be configured": function() {
         return this.remote.findByCssSelector("#TINY_MCE_2 .mce-i-spellchecker");
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