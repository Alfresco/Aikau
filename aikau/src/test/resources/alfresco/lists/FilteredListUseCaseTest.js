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
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "FilteredList Tests (Use Case 1)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FilteredListUseCase1", "FilteredList Tests (Use Case 1").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // See AKU-508 for the context, but we want to make sure that opening a dialog will not trigger the filtered list
      // to request data...
      "Check displaying dialog does not reload list": function() {
         return browser.findByCssSelector("#PDM_ITEM_1_SELECT_CONTROL span")
            .clearLog()
            .click()
         .end()
         .findByCssSelector("#PDM_ITEM_1_SELECT_CONTROL_menu tr[data-value='MODERATED']")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed")
         .end()
         .getAllPublishes("ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS")
         .then(function(payloads) {
            assert.lengthOf(payloads, 0, "A request to load data should not have been made when the dialog opens");
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});