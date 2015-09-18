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
         name: "Site Picker Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/SitePicker", "Site Picker Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Can choose single site": function() {
            return browser.findByCssSelector("#SITE_PICKER .alfresco-forms-controls-Picker__add-button .dijitButtonNode")
               .click()
               .end()

            .findByCssSelector(".dijitMenuItem[aria-label^=\"Recent Sites\"]")
               .click()
               .end()

            .findByCssSelector(".alfresco-lists-AlfList tr:nth-child(2) .alfresco-renderers-PublishAction")
               .click()
               .end()

            .findByCssSelector(".alfresco-lists-AlfList tr:nth-child(1) .alfresco-renderers-PublishAction")
               .click()
               .end()

            .findByCssSelector(".footer .alfresco-buttons-AlfButton:nth-child(1) .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("ALF_ITEMS_SELECTED") // Helps ensure dialog has closed
               .end()

            .findByCssSelector("#SITE_PICKER_FORM .buttons .confirmationButton .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("SITE_PICKED")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "site[0]", "site1", "Did not pick and publish correct site");
                  assert.notDeepProperty(payload, "site[1]", "Second site exists when it should not");
               })
               .clearLog();
         },

         "Can choose multiple sites": function() {
            return browser.findByCssSelector("#SITES_PICKER .alfresco-forms-controls-Picker__add-button .dijitButtonNode")
               .click()
               .end()

            .findByCssSelector(".dijitMenuItem[aria-label^=\"Favorite Sites\"]")
               .click()
               .end()

            .findByCssSelector(".alfresco-lists-AlfList tr:nth-child(1) .alfresco-renderers-PublishAction")
               .click()
               .end()

            .findByCssSelector(".alfresco-lists-AlfList tr:nth-child(2) .alfresco-renderers-PublishAction")
               .click()
               .end()

            .findByCssSelector(".footer .alfresco-buttons-AlfButton:nth-child(1) .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("ALF_ITEMS_SELECTED") // Helps ensure dialog has closed
               .end()

            .findByCssSelector("#SITES_PICKER_FORM .buttons .confirmationButton .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("SITES_PICKED")
               .then(function(payload) {
                  assert.deepPropertyVal(payload, "sites[0]", "site1", "Did not pick and publish correct sites");
                  assert.deepPropertyVal(payload, "sites[1]", "site-2", "Did not pick and publish correct sites");
               })
               .clearLog();
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
      });
   });