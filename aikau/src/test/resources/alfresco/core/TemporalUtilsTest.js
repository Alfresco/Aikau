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
 * @author Richard Smith
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!assert", 
        "require", 
        "alfresco/TestCommon"], 
        function(registerSuite, assert, require, TestCommon) {

   registerSuite(function() {

      // Setup the variables
      var browser,
         results = [
            "over 20 years ago",
            "over 10 years ago",
            "12 months ago",
            "6 months ago",
            "3 months ago",
            "2 months ago",
            "about a month ago",
            "3 days ago",
            "2 days ago",
            "about a day ago",
            "3 hours ago",
            "2 hours ago",
            "about an hour ago",
            "30 minutes ago",
            "20 minutes ago",
            "10 minutes ago",
            "just now",
            "2015-01-04T11:52:58",
            "Thu Dec 04 2014",
            "04 December, 2014",
            "11:00:00",
            "11:23:00",
            "08:00:00"
         ],
         suite = {
            name: "TemporalUtils Tests",
            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/TemporalUtils", "TemporalUtils Tests").end();
            },
            beforeEach: function() {
               browser.end();
            },
            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            },
            "TEMPORALUTILS_TEST24": function() {

               // Setup variables
               var getOffsetHours = function() {
                     return (new Date()).getTimezoneOffset() / 60;
                  },
                  result;

               // Run the test
               return browser.execute(getOffsetHours)
                  .then(function(offset) {

                     // Construct date-time part of ISO timestamp
                     var dateTime = "2014-12-04T09:30:10";

                     // Construct timezone suffix
                     var timezone = (offset < 0 ? "-" : "+") + Math.abs(offset);
                     if (timezone.length === 2) {
                        timezone = timezone[0] + "0" + timezone.substr(1);
                     }
                     timezone += ":00";

                     // Parse date and build result
                     var date = new Date(dateTime + timezone),
                        dateHours = "" + date.getHours();
                     if (dateHours.length === 1) {
                        dateHours = "0" + dateHours;
                     }
                     result = "Thu 4 Dec 2014 " + dateHours + ":30:10";
                  })
                  .getLastPublish("TEMPORALUTILS_TEST24")
                  .then(function(payload) {
                     assert.include(payload.result, result);
                  });
            }
         };

      // Add a publish-check for each publication
      results.forEach(function(result, index) {
         var topic = "TEMPORALUTILS_TEST" + (index + 1);
         suite["Check publish of " + topic] = function() {
            return browser.findByCssSelector("body")
               .getLastPublish(topic)
               .then(function(payload) {
                  assert.include(payload.result, result);
               });
         };
      });

      // Pass back the suite
      return suite;
   });
});
