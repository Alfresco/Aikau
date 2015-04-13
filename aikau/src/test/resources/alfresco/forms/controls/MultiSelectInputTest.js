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
define([
      "intern!object",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon",
      "intern/dojo/node!leadfoot/keys",
      "intern/dojo/node!leadfoot/helpers/pollUntil"
   ],
   function(registerSuite, assert, require, TestCommon, keys, pollUntil) {

      var browser;
      registerSuite({
         name: "Multi Select Input Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/MultiSelectInput", "Multi Select Input Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Preset values are rendered by control": function() {
            return browser.findAllByCssSelector(".alfresco-forms-controls-MultiSelect__choice")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "Did not render two preset values for control");
               })
               .end()

            .findByCssSelector(".alfresco-forms-controls-MultiSelect__choice:nth-child(1) .alfresco-forms-controls-MultiSelect__choice__content")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "tag1", "Did not display first tag label correctly");
               })
               .end()

            .findByCssSelector(".alfresco-forms-controls-MultiSelect__choice:nth-child(2) .alfresco-forms-controls-MultiSelect__choice__content")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "tag11", "Did not display second tag label correctly");
               });
         },

         "Focusing on control brings up initial results": function() {
            return browser.findById("FOCUS_HELPER_BUTTON")
               .click()
               .pressKeys(keys.TAB)
               .end()

            .findAllByCssSelector(".alfresco-forms-controls-MultiSelect__result")
               .then(function(elements) {
                  assert.lengthOf(elements, 4, "Did not bring up initial results");
               });
         },

         "Selecting item in dropdown chooses that item": function() {
            return browser.findByCssSelector(".alfresco-forms-controls-MultiSelect__result:nth-child(5)")
               .click()
               .end()

            .findAllByCssSelector(".alfresco-forms-controls-MultiSelect__choice")
               .then(function(elements) {
                  assert.lengthOf(elements, 3, "Did not add new choice to control");
               })
               .end()

            .findByCssSelector(".alfresco-forms-controls-MultiSelect__choice:nth-child(3) .alfresco-forms-controls-MultiSelect__choice__content")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "tag2", "Did not add selected tag at end of choices");
               })
         },

         "Typing into search box filters results": function() {
            return browser.findByCssSelector(".alfresco-forms-controls-MultiSelect__search-box")
               .type("tag2")
               .waitForDeletedByCssSelector(".alfresco-forms-controls-MultiSelect__result:nth-child(5)")
               .end()

            .findAllByCssSelector(".alfresco-forms-controls-MultiSelect__result")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Did not filter results");
               });
         },

         "Clicking cross on a chosen item removes it": function() {
            return browser.findByCssSelector(".alfresco-forms-controls-MultiSelect__choice:nth-child(2) .alfresco-forms-controls-MultiSelect__choice__close-button")
               .click()
               .waitForDeletedByCssSelector(".alfresco-forms-controls-MultiSelect__choice:nth-child(3)")
               .end()

            .findAllByCssSelector(".alfresco-forms-controls-MultiSelect__choice")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "Did not remove choice");
               });
         },

         "Submitting form submits correct values from control": function() {
            return browser.findByCssSelector("#FORM1 .confirmationButton .dijitButtonNode")
               .click()
               .end()

            .then(pollUntil(function() {
                  /*jshint browser:true*/
                  var topicData = document.querySelectorAll(".sl-topic[data-publish-topic=FORM_POST] + td.sl-data"),
                     lastTopic = topicData && topicData[topicData.length - 1],
                     dataContent = lastTopic && (lastTopic.textContent || lastTopic.innerText);
                  return dataContent || null;
               }, 5000))
               .then(function(dataContent) {
                  assert.include(dataContent, "labeltag1valueworkspace", "Failed to submit control value of tag1");
                  assert.include(dataContent, "labeltag2valueworkspace", "Failed to submit control value of tag2");
               }, function(err) {
                  assert.fail(null, null, "Failed to submit control values [" + err.name + "]: " + err);
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   }
);