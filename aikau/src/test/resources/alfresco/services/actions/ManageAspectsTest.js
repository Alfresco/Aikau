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
 * This tests the Manage Aspects action in the [ActionService]{@link module:alfresco/services/ActionService}.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Manage Aspects Tests",
      testPage: "/ManageAspects",

      "Test aspects dialog opens (when requesting aspects)": function() {
         // Check that dialog opens when the button simulating the action request is clicked...
         return this.remote.findByCssSelector("#MANAGE_ASPECTS1_label")
            .click()
            .end()
            .findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG.alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "The manage aspects dialog did not appear");
            });
      },

      "Test available aspects count": function() {
         // Count the number of available aspects (the applied aspects should not be shown)...
         // NOTE: elements might exist, but just be hidden
         return this.remote.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 14, "Incorrect number of available aspects");
            });
      },

      "Test selected aspects count": function() {
         // Cound the aspects that are currently applied...
         // NOTE: aspects not in the available list should be hidden
         return this.remote.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .picked-items .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Incorrect number of selected aspects");
            });
      },

      "Test that classifiable aspect is not displayed as available": function() {
         // Classifiable should be the first aspect in the available list and it should not be displayed
         // (because it is already applied!)
         return this.remote.findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers  .alfresco-lists-views-AlfListView tr:nth-child(1)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The classifiable aspect is shown as available");
            });
      },

      "Test that only addable aspects have add icon displayed": function() {
         // cm:effectivity should not be addable because it is not in the addable list
         // It should be the 3rd row in the available list
         // It's PublishAction should not have been rendered
         return this.remote.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers .alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The cm:effectivity aspect should not be addable");
            });
      },

      "Test that only removable aspects have the remove icon displayed": function() {
         // cm:versionable should be pre-selected but not removable because it is not in the removable list
         // It should bee the 2nd row in the available list
         // It's PublishAction should not have been rendered
         return this.remote.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .picked-items .alfresco-lists-views-AlfListView tr:nth-child(2) .alfresco-renderers-PublishAction > img")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The cm:versionable aspect should not be removable");
            });
      },

      "Test adding an aspect": function() {
         return this.remote.findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers .alfresco-lists-views-AlfListView tr:nth-child(2) .alfresco-renderers-PublishAction > img")
            .click()
            .end()
            .findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .picked-items .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Aspect wasn't added");
            });
      },

      "Test removing an aspect": function() {
         // Clicking on the cm:classifiable item should allow it to be removed and display it in the available list
         return this.remote.findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .picked-items .alfresco-lists-views-AlfListView tr:nth-child(1) .alfresco-renderers-PublishAction > img")
            .click()
            .end()
            .findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .sub-pickers  .alfresco-lists-views-AlfListView tr:nth-child(1)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Aspect wasn't removed");
            });
      },

      "Test saving upated aspects": function() {
         // Clicking on the confirmation button in the dialog should post the correct added and remove payload...
         return this.remote.findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .confirmationButton > span")
            .click()
            .end()
            .getLastXhr("aikau/proxy/alfresco/slingshot/doclib/action/aspects/node/workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e")
            .then(function(xhr) {
               assert.lengthOf(xhr.request.body.added, 1, "Wrong number of aspects added");
               assert.lengthOf(xhr.request.body.removed, 1, "Wrong number of aspects removed");
               assert.deepPropertyVal(xhr.request.body, "added[0]", "cm:complianceable");
               assert.deepPropertyVal(xhr.request.body, "removed[0]", "cm:generalclassifiable");
            });
      },

      "Test managing aspects when aspects can't be retrieved": function() {
         // By using a node that the mock service doesn't cater for we can rely on a 404 producing an error...
         return this.remote.findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG.dialogHidden")
            .end()

         .findByCssSelector("#MANAGE_ASPECTS3_label")
            .click()
            .end()

         .getLastPublish("ALF_DISPLAY_PROMPT")
            .then(function(payload) {
               assert.propertyVal(payload, "message", "It was not possible to retrieve the aspects applied to No Data Node", "The error prompt was not requested when failing to retrieve aspects");
            });
      },

      "Test failure to save aspect changes": function() {
         // By using a node that the mock service doesn't cater for we can rely on a 404 producing an error...
         return this.remote.findByCssSelector("#MANAGE_ASPECTS4_label")
            .click()
            .end()

         .findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG.dialogDisplayed")
            .end()

         .findByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG .confirmationButton > span")
            .click()
            .end()

         .findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG.dialogHidden")
            .end()

         .getLastPublish("ALF_DISPLAY_PROMPT")
            .then(function(payload) {
               assert.propertyVal(payload, "message", "It was not possible to update the aspects applied to Save Fail Node", "The error prompt was not requested when failure occurred saving data");
            });
      }
   });
});