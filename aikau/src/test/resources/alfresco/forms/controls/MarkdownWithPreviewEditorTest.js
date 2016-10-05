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
 * @since 1.0.89
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Markdown with Preview Tests",
      testPage: "/MarkDownWithPreviewEditor",

      "Initial preview displayed": function() {
         return this.remote.findByCssSelector(".alfresco-forms-controls-MarkdownWithPreviewEditor .alfresco-html-Markdown h1")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Heading");
            });
      },

      "Updates to editor are shown in preview": function() {
         this.remote.findByCssSelector("#MDWPE1 .CodeMirror")
            .click()
            .executeAsync(function(callback) {
               require(["dijit/registry"], function(registry) {
                  registry.byId("MDWPE1").setValue("* item");
                  callback();
               });
            })

            .findByCssSelector(".alfresco-forms-controls-MarkdownWithPreviewEditor .alfresco-html-Markdown li")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "item");
            });
      }
   });
});