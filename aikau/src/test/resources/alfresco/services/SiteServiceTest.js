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
 * This test uses a MockXhr service to test the site service responds as required.
 * 
 * @author Martin Doyle
 */
define(["alfresco/TestCommon", 
        "intern!object", 
        "intern/chai!assert"], 
        function(TestCommon, registerSuite, assert) {

   registerSuite(function() {
      var browser;

      return {
         name: "SiteService Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/SiteService", "SiteService Tests");
         },

         beforeEach: function() {
            browser.end();
         },

         "Leave site and confirm landing page override works": function(){
            return browser.findById("LEAVE_SITE")
               .click()
               .end()

            .findByCssSelector("#ALF_SITE_SERVICE_DIALOG.dialogDisplayed .dijitButton:first-child .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload){
                  assert.propertyVal(payload, "url", "user/admin/dashboard", "Did not generate URL with correct landing page");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});