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
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");
   var selectors = {
      actions: {
         first: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", "0"])
         }
      }
   };

   defineSuite(module, {
      name: "PublishPayloadMixinOnActions Tests",
      testPage: "/PublishPayloadMixinOnActions",

      "There should be 3 action menus rendered": function() {
         return this.remote.findAllByCssSelector(".alfresco-renderers-Actions")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "There should be 3 action menus rendered");
            });
      },

      "Click delete action": function() {
         return this.remote.findByCssSelector(selectors.actions.first.label)
            .click()
            .end()

         .findDisplayedById("ACTIONS_ITEM_0_DELETE_text")
            .click()
            .end()

         .getLastPublish("DELETE_ACTION_TOPIC")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "document.variable1", "red", "The action menu did not publish the payload with 'variable1' as 'red' after mouse clicks");
               assert.deepPropertyVal(payload, "document.variable2", "orange", "The action menu did not publish the payload with 'variable2' as 'orange' after mouse clicks");
            });
      },

      "Click manage action": function() {
         return this.remote.findByCssSelector(selectors.actions.first.label)
            .click()
            .end()

         .findDisplayedById("ACTIONS_ITEM_0_MANAGE_text")
            .click()
            .end()

         .getLastPublish("MANAGE_ACTION_TOPIC")
            .then(function(payload) {
               assert.propertyVal(payload, "payloadVariable2", "red", "The action menu did not publish the payload with 'payloadVariable2' as 'red' after mouse clicks");
               assert.propertyVal(payload, "payloadVariable1", "orange", "The action menu did not publish the payload with 'payloadVariable1' as 'orange' after mouse clicks");
            });
      }
   });
});