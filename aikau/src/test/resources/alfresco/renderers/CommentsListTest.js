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
 * @author Martin Doyle
 */
define(["intern!object",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon",
      "intern/dojo/node!leadfoot/keys"
   ],
   function(registerSuite, assert, require, TestCommon, keys) {

      var browser;

      registerSuite({
         name: "CommentsList Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/CommentsList", "CommentsList Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "No comments loaded initially": function() {
            return browser.findByCssSelector("#COMMENT_LIST .alfresco-lists-AlfList")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "No comments", "Did not display no-comments message at startup");
               });
         },

         "Can add comment": function() {
            return browser.findByCssSelector("#COMMENT_LIST .dijitButtonNode")
               .click()
               .end()

            .findAllByCssSelector(".alfresco-editors-TinyMCE iframe") // Wait for control
               .end()

            .findAllByCssSelector(".alfresco-editors-TinyMCE iframe")
               .execute("tinymce.get(0).setContent('<p><strong>Hello tester!</strong></p>');")
               .execute("tinymce.get(0).save();")
               .end()

            .findByCssSelector(".alfresco-dialog-AlfDialog .dijitButtonNode")
               .click()
               .end()

            .findByCssSelector("#COMMENT_LIST .alfresco-lists-AlfList")
               .getVisibleText()
               .then(function(text) {
                  assert.include(text, "Hello tester!", "Did not add new comment");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   });