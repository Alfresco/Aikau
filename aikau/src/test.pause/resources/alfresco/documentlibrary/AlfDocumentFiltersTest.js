/*jshint browser:true*/
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
      name: "AlfDocumentFilters Tests",
      testPage: "/AlfDocumentFilters",

      "Filters label is displayed correctly": function() {
         return this.remote.findByCssSelector("#FILTERS > .label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "TestSök<img src=\"1\" onerror=\"window.hacked=true\">", "Not the expected text");
            });
      },

      "Filter label is displayed correctly": function() {
         return this.remote.findByCssSelector("#FILTERS .alfresco-documentlibrary-AlfDocumentFilter span")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "TestSök<img src=\"1\" onerror=\"window.hacked=true\">", "Not the expected text");
            });
      },

      "Initial subscribing label is correct": function() {
         return this.remote.findById("FILTER_DESCRIPTION")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Filter Not SetSök<img src=\"1\" onerror=\"window.hacked=true\">", "Not the expected text");
            });
      },

      "Click on filter to publish": function() {
         return this.remote.findByCssSelector("#FILTERS .alfresco-documentlibrary-AlfDocumentFilter span")
            .click()
            .end()

         .getLastPublish("ALF_DOCLIST_FILTER_SELECTION")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "all", "Payload not published correctly");
            });
      },

      "Subscribing label has been updated": function() {
         return this.remote.findById("FILTER_DESCRIPTION")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "TestSök<img src=\"1\" onerror=\"window.hacked=true\">", "Not the expected text");
            });
      },

      "No XSS attacks were successful": function() {
         return this.remote.execute(function() {
               return window.hacked;
            })
            .then(function(hacked) {
               assert.isFalse(!!hacked);
            });
      }
   });
});