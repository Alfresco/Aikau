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
      name: "Paginator Visibility Tests",
      testPage: "/PaginatorVisibility",

      // See AKU-290 for the context behind the following tests...
      "Paginator should be initially hidden": function() {
         // When the page loads the list will make a request for data but no service is included to provide
         // a response, so the paginator should be hidden and remain hidden...
         return this.remote.findById("PAGINATOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The paginator should not be visible whilst awaiting data");
            });
      },

      "Paginator should be visible when data is provided": function() {
         // Click a button to publish list data, this should make the paginator be displayed...
         return this.remote.findById("PROVIDE_DATA_label")
            .click()
            .end()
            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")
            .end()
            .findById("PAGINATOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The paginator should visible once data is displayed");
            });
      },

      "Paginator should be hidden when new data is requested": function() {
         // Click a button to publish a request for the list to reload the data, this should
         // hide the paginator again...
         return this.remote.findById("RELOAD_DATA_label")
            .click()
            .end()
            .findById("PAGINATOR")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The paginator should visible once data is displayed");
            });
      }
   });
});