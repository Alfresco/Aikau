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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   var browser;

   registerSuite({
      name: "DocumentList Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DocumentList", "DocumentList").end();
      },

      beforeEach: function() {
         browser.end();
      },

      teardown: function() {
         return browser.end().alfPostCoverageResults(browser);
      },

      "Test path initialised correctly": function () {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "path", "/"))
            .then(function(elements) {
               assert(elements.length === 1, "'path' not initialised correctly");
            })
         .end();
      },
      "Test folder display initialised correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "type", "all"))
            .then(function(elements) {
               assert(elements.length === 1, "not initialised to show folders");
            })
         .end();
      },
      "Test site data initialised correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "site", "fake-site"))
            .then(function(elements) {
               assert(elements.length === 1, "'site' not initialised correctly");
            })
         .end();
      },
      "Test container data initialised correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "container", "documentlibrary"))
            .then(function(elements) {
               assert(elements.length === 1, "'container' not initialised correctly");
            })
         .end();
      },
      "Test sort direction initialised correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "sortAscending", "false"))
            .then(function(elements) {
               assert(elements.length === 1, "'sortAscending' not initialised correctly");
            })
         .end();
      },
      "Test sort field initialised correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "sortField", "cm:title"))
            .then(function(elements) {
               assert(elements.length === 1, "'sortField' not initialised correctly");
            })
         .end();
      },
      "Test page initialised correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "page", "1"))
            .then(function(elements) {
               assert(elements.length === 1, "'page' not initialised correctly");
            })
         .end();
      },
      "Test page size initialised correctly": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "pageSize", "3"))
            .then(function(elements) {
               assert(elements.length === 1, "'pageSize' not initialised correctly");
            })
         .end();
      },
      "Test sort order toggles": function() {
         return browser.findByCssSelector("#SORT_ASC_REQUEST")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "sortAscending", "true"))
            .then(function(elements) {
               assert(elements.length === 1, "'sortAscending' not updated correctly");
            })
         .end();
      },
      "Test sort field updates with sort toggle": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "sortField", "cm:name"))
            .then(function(elements) {
               assert(elements.length === 1, "'sortField' not updated correctly");
            })
         .end();
      },
      "Test sort field selection doesn't change sort order": function() {
         return browser.findByCssSelector("#SORT_FIELD_SELECTION")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "sortAscending", "true"))
            .then(function(elements) {
               assert(elements.length === 1, "'sortAscending' changed unexpectedly");
            })
         .end();
      },
      "Test sort field selection updates": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "sortField", "cm:title"))
            .then(function(elements) {
               assert(elements.length === 1, "'sortField' not updated correctly");
            })
         .end();
      },
      "Test sort order toggle (to descending)": function() {
         return browser.findByCssSelector("#SORT_DESC_REQUEST")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "sortAscending", "false"))
            .then(function(elements) {
               assert(elements.length === 1, "'sortAscending' not updated correctly");
            })
         .end();
      },
      "Test sort field doesn't change on sort order": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "sortField", "cm:title"))
            .then(function(elements) {
               assert(elements.length === 1, "'sortField' changed unexpectedly");
            })
         .end();
      },
      "Test hide folder toggle": function() {
         return browser.findByCssSelector("#HIDE_FOLDERS")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "documents"))
            .then(function(elements) {
               assert(elements.length === 1, "'type' not updated correctly");
            })
         .end();
      },
      "Test show folder toggle": function() {
         return browser.findByCssSelector("#SHOW_FOLDERS")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "all"))
            .then(function(elements) {
               assert(elements.length === 1, "'type' not updated correctly");
            })
         .end();
      },
      "Test set page number": function() {
         return browser.findByCssSelector("#SET_PAGE")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "page", "2"))
            .then(function(elements) {
               assert(elements.length === 1, "'page' not updated correctly");
            })
         .end();
      },
      "Test data update renders current view": function() { 
         return browser.findByCssSelector("#PUBLISH_DATA")
            .click()
         .end()
        .findAllByCssSelector(".alfresco-lists-views-AlfListView .alfresco-lists-views-layouts-Cell span.alfresco-renderers-Property:nth-child(2)")
            .then(function(elements) {
               assert(elements.length === 3, "'VIEW1' was not displayed");
            })
         .end();
      },
      "Test update does not render hidden views": function() {
         return browser.findAllByCssSelector(".alfresco-lists-views-AlfListView .alfresco-lists-views-layouts-Cell span.alfresco-renderers-Property:nth-child(3)")
            .then(function(elements) {
               assert(elements.length === 0, "'VIEW2' was displayed unexpectedly");
            })
         .end();
      },
      "Test changing view renders current data": function() {
         return browser.findByCssSelector("#CHANGE_VIEW")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-lists-views-AlfListView .alfresco-lists-views-layouts-Cell span.alfresco-renderers-Property:nth-child(3)")
            .then(function(elements) {
               assert(elements.length === 3, "'VIEW2' was not displayed");
            })
         .end();
      }
   });
});