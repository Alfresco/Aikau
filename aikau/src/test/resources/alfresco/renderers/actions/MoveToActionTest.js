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
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, TestCommon, defineSuite, assert) {

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");

   function testActionVisibility(browser, actionNames, indexArg) {
      var index = indexArg || 0,
         nextIndex = index + 1,
         actionSelector = TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.actions", ["ACTIONS", index]),
         nodeName = actionNames[index],
         shouldBePresent = nodeName.indexOf("!") === -1;
      if (!shouldBePresent) {
         nodeName = nodeName.substr(1);
      }
      var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", index]);
      return browser.findByCssSelector(actionsSelector)
         .click()
         .end()

      .findDisplayedByCssSelector(actionSelector)
         .end()
         .then(function() {
            if (!shouldBePresent) {
               assert.fail(null, null, "'Move to' action present on " + nodeName + " but should not be");
            } else if (nextIndex < actionNames.length) {
               return testActionVisibility(browser, actionNames, nextIndex);
            }
         }, function() {
            if (shouldBePresent) {
               assert.fail(null, null, "'Move to' action not present on " + nodeName);
            } else if (nextIndex < actionNames.length) {
               return testActionVisibility(browser, actionNames, nextIndex);
            }
         });
   }

   defineSuite(module, {
      name: "MoveTo Action Test",
      testPage: "/MoveTo",

      "Legacy single item copy works": function() {
         return this.remote.findById("SINGLE_MOVE_VIA_ACTION_SERVICE")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG.dialogDisplayed .dijitMenuItem:nth-child(4) .alf-menu-bar-label-node")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG .dijitTreeLabel")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG .dijitButtonNode:first-of-type")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG.dialogHidden")
            .end()

         .getLastPublish("ALF_MOVE_LOCATION_PICKED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "nodes[0]", "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4d");
            });
      },

      "Legacy multiple item copy works": function() {
         return this.remote.findById("MULTIPLE_MOVE_VIA_ACTION_SERVICE")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG.dialogDisplayed .dijitMenuItem:nth-child(4) .alf-menu-bar-label-node")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG .dijitTreeLabel")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG .dijitButtonNode:first-of-type")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG.dialogHidden")
            .end()

         .getLastPublish("ALF_MOVE_LOCATION_PICKED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "nodes[0]", "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e");
               assert.deepPropertyVal(payload, "nodes[1]", "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4f");
            });
      },

      "Context action works": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 0]);
         var actionSelector = TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.actions", ["ACTIONS", 0]);
         return this.remote.findByCssSelector(actionsSelector)
            .clearLog()
            .click()
            .end()

         .findByCssSelector(actionSelector)
            .click()
            .end()

         .getLastPublish("ALF_COPY_OR_MOVE_REQUEST", true)
            .then(function(payload) {
               assert.deepPropertyVal(payload, "documents[0].node.nodeRef", "some://dummy/node");
            })

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG.dialogDisplayed .dijitMenuItem:nth-child(4) .alf-menu-bar-label-node")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG .dijitTreeLabel")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG .dijitButtonNode:first-of-type")
            .click()
            .end()

         .findByCssSelector("#ALF_COPY_MOVE_DIALOG.dialogHidden")
            .end()

         .getLastPublish("ALF_MOVE_LOCATION_PICKED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "nodes[0]", "some://dummy/node");
            });
      },

      "List reload called after move success": function() {
         return this.remote.findByCssSelector("body")
            .getLastPublish("SCOPED_ALF_DOCLIST_RELOAD_DATA", true);
      },

      "Context action appears appropriately": function() {
         return testActionVisibility(this.remote, [
            "Folder node",
            "Document node",
            "User-owned working copy",
            "!Non-owned working copy",
            "User-owned locked node",
            "!Non-owned locked node",
            "!Node-locked node",
            "!No write permission"
         ]);
      }
   });
});