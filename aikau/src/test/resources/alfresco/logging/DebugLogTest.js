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
      "alfresco/TestCommon"
   ],
   function(registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
         name: "DebugLog Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/DebugLog", "DebugLog Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Log displayed on button click": function() {
            return browser.findById("SHOW_LOG_BUTTON")
               .click()
               .end()

            .findAllByCssSelector(".alfresco_logging_DebugLog__log__entry[data-aikau-log-type=\"PUBLISH\"][data-aikau-log-topic=\"ALF_SHOW_PUBSUB_LOG\"]")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Did not show show pub-sub log in pub-sub log");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
      });
   });