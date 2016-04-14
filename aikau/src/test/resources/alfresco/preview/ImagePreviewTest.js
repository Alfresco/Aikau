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
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Image Preview Tests",
      testPage: "/ImagePreview",

      "Find image preview node": function() {
         return this.remote.findByCssSelector(".alfresco-preview-AlfDocumentPreview > div.previewer");
      },

      "Find image source request": function() {
         return this.remote.getXhrEntries({
               method: "GET"
            })
            .then(function(entries) {
               assert.lengthOf(entries, 1, "Expected just one XHR request");
            })

         .getXhrEntries({
               method: "GET",
               pos: "last"
            })
            .then(function(entry) {
               assert.deepProperty(entry, "request.url");
               assert.include(entry.request.url, "/aikau/service/components/documentlibrary/data/node/workspace/SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4?view=browse&noCache", "Invalid URL for node request");
            });
      }
   });

   defineSuite(module, {
      name: "Image Preview Tests (plugin removal)",
      testPage: "/ImagePreview?removeCondition=true",

      "Image cannot be previewed": function() {
         return this.remote.findByCssSelector(".alfresco-preview-AlfDocumentPreview .previewer .message")
            .getVisibleText()
            .then(function(text) {
               assert.include(text, "This document can't be previewed.");
            });
      }
   });
});