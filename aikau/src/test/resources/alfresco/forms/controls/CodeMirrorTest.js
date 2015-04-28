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
        "intern/dojo/node!leadfoot/helpers/pollUntil"], 
        function(registerSuite, assert, require, TestCommon, pollUntil) {

   var browser;

   registerSuite({
      name: "CodeMirror",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/CodeMirror", "CodeMirror")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Can enter content into control and publish it": function() {
         return browser.findByCssSelector("#CODE_MIRROR_1 .CodeMirror")
            .click()
            .executeAsync(function(callback) {
               require(["dijit/registry"], function(registry) {
                  registry.byId("CODE_MIRROR_1").setValue("<node>value</node>");
                  callback();
               });
            })
            .screenie()
            .end()

         .findByCssSelector("#FORM1 .confirmationButton .dijitButtonNode")
            .click()
            .then(pollUntil(function() {
               /*jshint browser:true*/
               var topicData = document.querySelectorAll(".sl-topic[data-publish-topic=FORM_POST] + td.sl-data"),
                  lastTopic = topicData && topicData[topicData.length - 1],
                  dataContent = lastTopic && (lastTopic.textContent || lastTopic.innerText);
               return dataContent || null;
            }, 5000))
            .then(function(dataContent) {
               assert.include(dataContent, "codeMirrorValue", "Publish did not include editor Form ID");
               assert.include(dataContent, "<node>value</node>", "Publish did not include created content");
            }, function(err) {
               assert.fail(null, null, "Unable to enter content and publish it: " + err);
            });
      },

      "Can still use control within dialog": function() {
         return browser.findById("DIALOG_BUTTON")
            .click()
            .executeAsync(function(callback) {
               require(["dijit/registry"], function(registry) {
                  registry.byId("CODE_MIRROR_2").setValue("<node2>value2</node2>");
                  callback();
               });
            })
            .screenie()
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog .confirmationButton .dijitButtonNode")
            .click()
            .then(pollUntil(function() {
               /*jshint browser:true*/
               var topicData = document.querySelectorAll(".sl-topic[data-publish-topic=POST_FORM_DIALOG] + td.sl-data"),
                  lastTopic = topicData && topicData[topicData.length - 1],
                  dataContent = lastTopic && (lastTopic.textContent || lastTopic.innerText);
               return dataContent || null;
            }, 5000))
            .then(function(dataContent) {
               assert.include(dataContent, "codeMirrorValue2", "Publish did not include editor Form ID");
               assert.include(dataContent, "<node2>value2</node2>", "Publish did not include created content");
            }, function(err) {
               assert.fail(null, null, "Unable to enter content in Dialog and publish it: " + err);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});