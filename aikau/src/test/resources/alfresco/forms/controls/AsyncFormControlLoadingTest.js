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
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Asynchronous Form Control Loading Test",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AsyncFormControlLoading", "Asynchronous Form Control Loading Test").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check that controls all load": function() {
            // Open the dialog...
            return browser.findById("CREATE_DILAOG_BUTTON_label")
               .click()
            .end()

            // ...wait for it to be displayed...
            .findByCssSelector("#DIALOG1.dialogDisplayed")
            .end()

            // Select the "DYNAMIC" tab...
            .findById("TABS_TABCONTAINER_tablist_TABS_DYNAMIC")
               .click()
            .end()

            .findByCssSelector("#DIALOG1 #DYNAMIC .alfresco-forms-controls-CheckBox .label")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The form control label should have been displayed");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});