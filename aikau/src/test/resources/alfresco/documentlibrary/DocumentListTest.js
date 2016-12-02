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
      name: "DocumentList Tests",
      testPage: "/DocumentList",

      "Test initial data request": function() {
         return this.remote.findByCssSelector("body").end()
            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST", "No load data request published")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "filter.path", "/", "Path wrong for intial load request");
               assert.propertyVal(payload, "type", "all", "Type wrong for intial load request");
               assert.propertyVal(payload, "site", "fake-site", "Site wrong for intial load request");
               assert.propertyVal(payload, "container", "documentlibrary", "Container wrong for intial load request");
               assert.propertyVal(payload, "sortAscending", false, "Sort direction wrong for intial load request");
               assert.propertyVal(payload, "sortField", "cm:title", "Sort field wrong for intial load request");
               assert.propertyVal(payload, "page", 1, "Page wrong for intial load request");
               assert.propertyVal(payload, "pageSize", 3, "Page size wrong for intial load request");
            });
      },

      "Test sort order toggles": function() {
         return this.remote.findById("PUBLISH_DATA_label")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Fake data not provided")
         .clearLog()

         .findById("SORT_ASC_REQUEST_label")
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "sortAscending", true, "Sort direction not updated");
               assert.propertyVal(payload, "sortField", "cm:name", "Sort field not updated");
            });
      },

      "Test sort field selection doesn't change sort order": function() {
         return this.remote.findById("PUBLISH_DATA_label")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Fake data not provided")
         .clearLog()

         .findById("SORT_FIELD_SELECTION_label")
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "sortField", "cm:title", "Sort field not updated");

               // Sort order should remain the same
               assert.propertyVal(payload, "sortAscending", true, "Sort direction not updated");
            });
      },

      "Test sort order toggle (to descending)": function() {
         return this.remote.findById("PUBLISH_DATA_label")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Fake data not provided")
         .clearLog()

         .findById("SORT_DESC_REQUEST_label")
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "sortAscending", false, "Sort direction not updated");

               // Sort field should remain the same
               assert.propertyVal(payload, "sortField", "cm:title", "Sort field not updated");
            });
      },

      "Test hide folder toggle": function() {
         return this.remote.findById("PUBLISH_DATA_label")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Fake data not provided")
         .clearLog()

         .findByCssSelector("#HIDE_FOLDERS_label")
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "type", "documents", "Type not updated");
            });
      },

      "Test show folder toggle": function() {
         return this.remote.findById("PUBLISH_DATA_label")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Fake data not provided")
         .clearLog()

         .findByCssSelector("#SHOW_FOLDERS_label")
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "type", "all", "Type not updated");
            });
      },

      "Test set page number": function() {
         return this.remote.findById("PUBLISH_DATA_label")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Fake data not provided")
         .clearLog()

         .findByCssSelector("#SET_PAGE_label")
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "page", 2, "Page not updated");
            });
      },

      "Test data update renders current view": function() {
         return this.remote.findByCssSelector("#PUBLISH_DATA_label")
            .click()
         .end()
         
         .findAllByCssSelector(".alfresco-lists-views-AlfListView .alfresco-lists-views-layouts-Cell span.alfresco-renderers-Property:nth-child(2)")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "'VIEW1' was not displayed");
            });
      },

      "Test update does not render hidden views": function() {
         return this.remote.findAllByCssSelector(".alfresco-lists-views-AlfListView .alfresco-lists-views-layouts-Cell span.alfresco-renderers-Property:nth-child(3)")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "'VIEW2' was displayed unexpectedly");
            });
      },

      "Test changing view renders current data": function() {
         return this.remote.findByCssSelector("#CHANGE_VIEW_label")
            .click()
         .end()
         
         .findAllByCssSelector(".alfresco-lists-views-AlfListView .alfresco-lists-views-layouts-Cell span.alfresco-renderers-Property:nth-child(3)")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "'VIEW2' was not displayed");
            });
      },

      "Check PublishingDropDownMenu options": function() {
         // See AKU-289
         return this.remote.findAllByCssSelector(".alfresco-forms-controls-Select")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Couldn't find select controls in PublishingDropDownMenu widgets");
            })
         .end()

         .waitForDeletedByCssSelector(".alfresco-lists-AlfList--loading")
         .end()

         .findDisplayedById("PDM_ITEM_0_SELECT_CONTROL")
            .click()
         .end()

         .findAllByCssSelector(".dijitPopup tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "No options provided available");
            });
      }
   });
});