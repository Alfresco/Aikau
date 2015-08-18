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
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon"
   ],
   function(registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {

         name: "Service Filtering Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ServiceFiltering", "Service Filtering Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "There should be a LoggingService": function() {
            return browser.findAllByCssSelector(TestCommon.topicSelector("ALF_LOGGING_STATUS_CHANGE", "subscribe", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "LoggingService subscriptions not found");
               });
         },

         "There should only be one DialogService": function() {
            return browser.findAllByCssSelector(TestCommon.topicSelector("ALF_CREATE_FORM_DIALOG_REQUEST", "subscribe", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "DialogService subscriptions count wrong");
               });
         },

         "There should only be one NavigationService": function() {
            return browser.findAllByCssSelector(TestCommon.topicSelector("ALF_NAVIGATE_TO_PAGE", "subscribe", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "NavigationService subscriptions count wrong");
               });
         },

         "There should two differently scoped NotificationServices": function() {
            return browser.findAllByCssSelector(TestCommon.topicSelector("SCOPED_SERVICE_ALF_DISPLAY_NOTIFICATION", "subscribe", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Original scoped NotificationService subscriptions not found");
               })
            .end()
            .findAllByCssSelector(TestCommon.topicSelector("DIFFERENT_SCOPED_SERVICE_ALF_DISPLAY_NOTIFICATION", "subscribe", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Differently scoped NotificationService subscriptions not found");
               })
            .end;
         },

         "The CrudService should have been added": function() {
            return browser.findAllByCssSelector(TestCommon.topicSelector("ALF_CRUD_GET_ALL", "subscribe", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "CrudService not added");
               });
         },

         "The ContentService should have been added": function() {
            return browser.findAllByCssSelector(TestCommon.topicSelector("ALF_CREATE_CONTENT_REQUEST", "subscribe", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "ContentService not added");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
      });
   });