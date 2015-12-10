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
 * @author David Webster
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"],
       function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "XHR Actions Renderer Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/XhrActions", "XHR Actions Renderer Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

        "Check Actions menu was rendered": function () {
            // Test spec:
            // 1: Check dropdown element exists
            return browser.findById("XHR_ACTIONS_ITEM_0_MENU_text");
         },

         "Check that document request event was triggered": function() {
            // 2: Click on it. Check event triggered: ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST
            return browser.findById("XHR_ACTIONS_ITEM_0_MENU_text")
               .click()
            .end()
            .getLastPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", "Retrieve single doc request not triggered");
         },

         "Check default behaviour to render 'legacy' document actions": function() {
            return browser.findById("XHR_ACTIONS_ITEM_0_document-download")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-view-content")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-edit-properties")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-upload-new-version")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-edit-offline")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-copy-to")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-move-to")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-delete")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-assign-workflow")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-assign-workflow")
               .end()
               .findById("XHR_ACTIONS_ITEM_0_document-manage-granular-permissions");
         },

         "Check merged and filtered actions": function() {
            return browser.findById("MERGED_XHR_ACTIONS_ITEM_0_MENU_text")
               .click()
            .end()
            .findById("MERGED_XHR_ACTIONS_ITEM_0_document-delete")
            .end()
            .findById("MERGED_XHR_ACTIONS_ITEM_0_CUSTOM3")
            .end()
            .findById("MERGED_XHR_ACTIONS_ITEM_0_MANAGE_ASPECTS");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});