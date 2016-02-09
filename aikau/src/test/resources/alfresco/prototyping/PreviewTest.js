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
         name: "Model Preview Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/Preview", "Model Preview Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Initial preview is rendered": function() {
            return browser.findByCssSelector("body")
            .end()

            .getLastPublish("ALF_PREVIEW_MODEL_RENDERED")
            .clearLog()

            .findDisplayedById("LOGO");
         },

         "Request stringified model preview": function() {
            return browser.findById("UPDATE_PREVIEW_label")
               .click()
            .end()

            .getLastPublish("ALF_PREVIEW_MODEL_RENDERED")

            .findDisplayedById("PREVIEW_BUTTON");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});