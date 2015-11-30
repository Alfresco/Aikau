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
 * @author Martin Doyle
 */
define([
      "alfresco/TestCommon",
      "intern!object",
      "intern/chai!assert",
   ],
   function(TestCommon, registerSuite, assert) {

      function testActionVisibility(browser, actionNames, indexArg) {
         var index = indexArg || 0,
            nextIndex = index + 1,
            actionSelector = "#ACTIONS_ITEM_" + index + "_GROUP .dijitMenuItem",
            nodeName = actionNames[index],
            shouldBePresent = nodeName.indexOf("!") === -1;
         if (!shouldBePresent) {
            nodeName = nodeName.substr(1);
         }
         return browser.findById("ACTIONS_ITEM_" + index + "_MENU_text")
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

      registerSuite(function() {
         var browser;

         return {
            name: "MoveTo Action Test",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/MoveTo", "MoveTo Action Test").end();
            },

            beforeEach: function() {
               browser.end();
            },

            "Legacy single item copy works": function() {
               return browser.findById("SINGLE_MOVE_VIA_ACTION_SERVICE")
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
               return browser.findById("MULTIPLE_MOVE_VIA_ACTION_SERVICE")
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
               return browser.findById("ACTIONS_ITEM_0_MENU_text")
                  .clearLog()
                  .click()
                  .end()

               .findByCssSelector("#ACTIONS_ITEM_0_GROUP .alfresco-menus-AlfMenuItem")
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
               return browser.findByCssSelector("body")
                  .getLastPublish("SCOPED_ALF_DOCLIST_RELOAD_DATA", true);
            },

            "Context action appears appropriately": function() {
               return testActionVisibility(browser, [
                  "Folder node",
                  "Document node",
                  "User-owned working copy",
                  "!Non-owned working copy",
                  "User-owned locked node",
                  "!Non-owned locked node",
                  "!Node-locked node",
                  "!No write permission"
               ]);
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });
   });