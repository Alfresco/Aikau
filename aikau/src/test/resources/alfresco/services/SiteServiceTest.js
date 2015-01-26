/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This test uses a MockXhr service to test the site service responds as required.
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, require, TestCommon) {

   registerSuite({
      name: 'Site Service Test',
      'SiteServiceTest - Site details': function () {

         var browser = this.remote;
         var testname = "SiteServiceTest - Site details";
         return TestCommon.loadTestWebScript(this.remote, "/SiteService", testname)

         .end()

         // Site details
         .findById("GET_SITE_DETAILS")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_SITE_DETAILS");
            })
            .end()

         .findById("GET_SITE_DETAILS_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_SITE_DETAILS with a faulty payload 1");
            })
            .end()

         .findById("GET_SITE_DETAILS_BAD2")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_SITE_DETAILS with a faulty payload 2");
            })
            .end()

         .findById("GET_SITE_DETAILS_BAD3")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_SITE_DETAILS with a faulty payload 3");
            })
            .end()

         .alfPostCoverageResults(browser);
      },

      'SiteServiceTest - Favourite and recent sites': function () {

         var browser = this.remote;
         var testname = "SiteServiceTest - Favourite and recent sites";
         return TestCommon.loadTestWebScript(this.remote, "/SiteService", testname)

         .end()

         // Recent sites
         .findById("GET_RECENT_SITES")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_RECENT_SITES");
            })
            .end()

         .findById("GET_RECENT_SITES_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_RECENT_SITES with a faulty payload 1");
            })
            .end()

         // Favourite sites
         .findById("GET_FAVOURITE_SITES")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_FAVOURITE_SITES");
            })
            .end()

         .findById("GET_FAVOURITE_SITES_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_FAVOURITE_SITES with a faulty payload 1");
            })
            .end()

         // Add favourite site
         .findById("ADD_FAVOURITE_SITE")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_ADD_FAVOURITE_SITE");
            })
            .end()

         .findById("ADD_FAVOURITE_SITE_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_ADD_FAVOURITE_SITE with a faulty payload 1");
            })
            .end()

         .findById("ADD_FAVOURITE_SITE_BAD2")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_ADD_FAVOURITE_SITE with a faulty payload 2");
            })
            .end()

         // Remove favourite site
         .findById("REMOVE_FAVOURITE_SITE")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_REMOVE_FAVOURITE_SITE");
            })
            .end()

         .findById("REMOVE_FAVOURITE_SITE_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_REMOVE_FAVOURITE_SITE with a faulty payload 1");
            })
            .end()

         .findById("REMOVE_FAVOURITE_SITE_BAD2")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_REMOVE_FAVOURITE_SITE with a faulty payload 2");
            })
            .end()

         .alfPostCoverageResults(browser);
      },

      'SiteServiceTest - Site memberships': function () {

         var dialogDelay = 250;
         var browser = this.remote;
         var testname = "SiteServiceTest - Site memberships";
         return TestCommon.loadTestWebScript(this.remote, "/SiteService", testname)

         .end()

         // Get site memberships
         .findById("GET_SITE_MEMBERSHIPS")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_SITE_MEMBERSHIPS");
            })
            .end()

         .findById("GET_SITE_MEMBERSHIPS_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_SITE_MEMBERSHIPS with a faulty payload 1");
            })
            .end()

         .findById("GET_SITE_MEMBERSHIPS_BAD2")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_SITE_MEMBERSHIPS with a faulty payload 2");
            })
            .end()

         .findById("GET_SITE_MEMBERSHIPS_BAD3")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_GET_SITE_MEMBERSHIPS with a faulty payload 3");
            })
            .end()

         // Become site manager
         .findById("BECOME_SITE_MANAGER")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_BECOME_SITE_MANAGER");
            })
            .end()

         .findById("BECOME_SITE_MANAGER_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_BECOME_SITE_MANAGER with a faulty payload 1");
            })
            .end()

         .findById("BECOME_SITE_MANAGER_BAD2")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_BECOME_SITE_MANAGER with a faulty payload 2");
            })
            .end()

         .findById("BECOME_SITE_MANAGER_BAD3")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_BECOME_SITE_MANAGER with a faulty payload 3");
            })
            .end()

         // Request site membership
         .findById("REQUEST_SITE_MEMBERSHIP")
            .click()
            .sleep(dialogDelay)
            .then(function () {
               TestCommon.log(testname,"Test ALF_REQUEST_SITE_MEMBERSHIP");
            })
            .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog div.footer span.dijitReset.dijitInline.dijitButtonNode")
            .click()
            .sleep(dialogDelay)
            .end()

         .findById("REQUEST_SITE_MEMBERSHIP_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_REQUEST_SITE_MEMBERSHIP with a faulty payload 1");
            })
            .end()

         .findById("REQUEST_SITE_MEMBERSHIP_BAD2")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_REQUEST_SITE_MEMBERSHIP with a faulty payload 2");
            })
            .end()

         .findById("REQUEST_SITE_MEMBERSHIP_BAD3")
            .click()
            .sleep(dialogDelay)
            .then(function () {
               TestCommon.log(testname,"Test ALF_REQUEST_SITE_MEMBERSHIP with a faulty payload 3");
            })
            .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog:last-of-type div.footer span.dijitReset.dijitInline.dijitButtonNode")
            .click()
            .sleep(dialogDelay)
            .end()

         .findById("REQUEST_SITE_MEMBERSHIP_BAD4")
            .click()
            .sleep(dialogDelay)
            .then(function () {
               TestCommon.log(testname,"Test ALF_REQUEST_SITE_MEMBERSHIP with a faulty payload 4");
            })
            .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog:last-of-type div.footer span.dijitReset.dijitInline.dijitButtonNode")
            .click()
            .sleep(dialogDelay)
            .end()

         // Join site
         .findById("JOIN_SITE")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_JOIN_SITE");
            })
            .end()

         .findById("JOIN_SITE_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_JOIN_SITE with a faulty payload 1");
            })
            .end()

         .findById("JOIN_SITE_BAD2")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_JOIN_SITE with a faulty payload 2");
            })
            .end()

         .findById("JOIN_SITE_BAD3")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_JOIN_SITE with a faulty payload 3");
            })
            .end()

         // Leave site
         .findById("LEAVE_SITE")
            .click()
            .sleep(dialogDelay)
            .then(function () {
               TestCommon.log(testname,"Test ALF_LEAVE_SITE");
            })
            .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog:last-of-type div.footer span.dijitReset.dijitInline.dijitButtonNode:last-of-type")
            .click()
            .sleep(dialogDelay)
            .end()

         .findById("LEAVE_SITE")
            .click()
            .sleep(dialogDelay)
            .then(function () {
               TestCommon.log(testname,"Test ALF_LEAVE_SITE");
            })
            .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog:last-of-type div.footer span.dijitReset.dijitInline.dijitButtonNode:first-of-type")
            .click()
            .sleep(dialogDelay)
            .end()

         .findById("LEAVE_SITE_BAD1")
            .click()
            .sleep(dialogDelay)
            .then(function () {
               TestCommon.log(testname,"Test ALF_LEAVE_SITE with a faulty payload 1");
            })
            .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog:last-of-type div.footer span.dijitReset.dijitInline.dijitButtonNode:last-of-type")
            .click()
            .sleep(dialogDelay)
            .end()

         .findById("LEAVE_SITE_BAD2")
            .click()
            .sleep(dialogDelay)
            .then(function () {
               TestCommon.log(testname,"Test ALF_LEAVE_SITE with a faulty payload 2");
            })
            .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog:last-of-type div.footer span.dijitReset.dijitInline.dijitButtonNode:last-of-type")
            .click()
            .sleep(dialogDelay)
            .end()

         .alfPostCoverageResults(browser);
      },

      'SiteServiceTest - Update and delete site': function () {

         var browser = this.remote;
         var testname = "SiteServiceTest - Update and delete site";
         return TestCommon.loadTestWebScript(this.remote, "/SiteService", testname)

         .end()

         // Update site
         .findById("UPDATE_SITE_DETAILS")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_UPDATE_SITE_DETAILS");
            })
            .end()

         .findById("UPDATE_SITE_DETAILS_BAD1")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_UPDATE_SITE_DETAILS with a faulty payload 1");
            })
            .end()

         // Delete site
         .findById("DELETE_SITE")
            .click()
            .then(function () {
               TestCommon.log(testname,"Test ALF_DELETE_SITE");
            })
            .end()

         .findByCssSelector("div.alfresco-dialog-AlfDialog div.footer span.dijitReset.dijitInline.dijitButtonNode:first-of-type")
            .click()
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});