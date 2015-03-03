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
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "PublishPayloadMixinOnActions Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/PublishPayloadMixinOnActions", "PublishPayloadMixinOnActions Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Tests": function () {
         var testname = "PublishPayloadMixinOnActionsTest";
         return browser.findAllByCssSelector("div.alfresco-menus-AlfMenuBar")
            .then(function (actionmenus) {
               TestCommon.log(testname,"Check there are 3 action menus as described in the model");
               expect(actionmenus).to.have.length(3, "There should be 3 action menus rendered");
            })
            .end()

         // Open the first action menu by mouse click
         .findByCssSelector("div.dijitMenuItemLabel:nth-of-type(1)")
            .click()
            .end()
         .findByCssSelector(".dijitPopup")
            .then(
               null,
               function() { assert(false,"The action menu did not appear on mouse clicks");}
            )
            .end()

         //Check the menu has appeared
         .findByCssSelector(".dijitPopup")
            .isDisplayed()
            .then(function(result2) {
               TestCommon.log(testname,"Check the action menu has appeared");
               expect(result2).to.equal(true, "The action menu should be visible on mouse clicks");
            })
            .end()

         // Click the first button in the action menu
         .findByCssSelector(".dijitPopup .dijitMenuItem:nth-of-type(1) .dijitMenuItemLabel")
            .click()
            .end()
         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "DELETE_ACTION_TOPIC"))
            .then(
               function() {},
               function() { assert(false,"The action menu did not publish on 'DELETE_ACTION_TOPIC' after mouse clicks");}
            )
            .end()
         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "variable1", "red"))
            .then(
               function() {},
               function() { assert(false,"The action menu did not publish the payload with 'variable1' as 'red' after mouse clicks"); }
            )
            .end()
         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "variable2", "orange"))
            .then(
               function() {},
               function() { assert(false,"The action menu did not publish the payload with 'variable2' as 'orange' after mouse clicks");}
            )
            .end()

         // Open the first action menu again
         .findByCssSelector("div.dijitMenuItemLabel:nth-of-type(1)")
            .click()
            .end()

         // Click the second button in the action menu
         .findByCssSelector(".dijitPopup .dijitMenuItem:nth-of-type(2) .dijitMenuItemLabel")
            .click()
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "MANAGE_ACTION_TOPIC"))
            .then(
               null,
               function() { 
                  assert(false, "The action menu did not publish the payload with 'payloadVariable1' as 'red' after mouse clicks");
               }
            )
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "payloadVariable1", "orange"))
            .then(
               null,
               function() {
                  assert(false,"The action menu did not publish the payload with 'payloadVariable1' as 'red' after mouse clicks");
               })
               .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "payloadVariable2", "red"))
            .then(null, function() {
               assert(false,"The action menu did not publish the payload with 'payloadVariable2' as 'orange' after mouse clicks");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});