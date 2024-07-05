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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Video Previewer Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/VideoPreview", "Video Previewer Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

        "Tests": function () {
            return browser.findByCssSelector(".alfresco-preview-AlfDocumentPreview > div.previewer.Video")
               .then(null, function() {
                  assert(false, "Couldn't find video previewer node");
               })
            .end()
            .findByCssSelector(".alfresco-preview-AlfDocumentPreview > div.previewer.Video video")
               .then(null, function() {
                  assert(false, "Couldn't find video element");
               });
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Video Preview Tests (unsupported MIME type)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/VideoPreviewConditions", "Image Preview Tests (unsupported MIME type)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Video cannot be previewed": function () {
            return browser.findByCssSelector(".alfresco-preview-AlfDocumentPreview .previewer .message")
               .getVisibleText()
               .then(function(text) {
                  assert.include(text, "This document can't be previewed.");
               });
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Video Preview Tests (add condition)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/VideoPreviewConditions?addCondition=true", "Image Preview Tests (add condition)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Video cannot be previewed": function () {
            return browser.findByCssSelector(".alfresco-preview-AlfDocumentPreview video");
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Audio Previewer Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AudioPreview", "Audio Previewer Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

        "Tests": function () {
            return browser.findByCssSelector(".alfresco-preview-AlfDocumentPreview > div.previewer.Audio")
               .then(null, function() {
                  assert(false, "Couldn't find video previewer node");
               })
            .end()
            .findByCssSelector(".alfresco-preview-AlfDocumentPreview > div.previewer.Audio audio")
               .then(null, function() {
                  assert(false, "Couldn't find audio element");
               });
         }
      };
   });
});