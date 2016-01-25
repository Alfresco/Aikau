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
         name: "View With No Data Widgets Tests",
         
         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ViewNoDataWidgets", "View With No Data Widgets Tests").end();
         },
         
         beforeEach: function() {
            browser.end();
         },

         "No data widgets displayed": function() {
            return browser.findDisplayedById("NO_DATA_WARNING");
         },

         "Data failure widgets displayed": function() {
            return browser.findDisplayedById("DATA_FAIL_WARNING");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});