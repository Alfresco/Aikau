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
      name: "Logging Service Tests",
      testPage: "/LoggingService",

      "There should be no preference request for SCOPE1_": function() {
         return this.remote.findByCssSelector("body").end()
            .getLogEntries({
               type: "PUBLISH",
               topic: "SCOPE1_ALF_PREFERENCE_GET",
               pos: "all",
               isGlobal: true
            })
            .then(function(subscriptions) {
               assert.lengthOf(subscriptions, 0, "User preference request should have been suppressed");
            });
      },

      "There should be a preference request for SCOPE2_": function() {
         return this.remote.findByCssSelector("body").end()
            .getLogEntries({
               type: "PUBLISH",
               topic: "SCOPE2_ALF_PREFERENCE_GET",
               pos: "all",
               isGlobal: true
            })
            .then(function(subscriptions) {
               assert.lengthOf(subscriptions, 1, "User preference request not published");
            });
      }
   });
});