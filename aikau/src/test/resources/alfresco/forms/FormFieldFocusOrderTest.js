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
        "alfresco/defineSuite"],
        function(module, defineSuite) {

   defineSuite(module, {
      name: "Form Field Focus Order Tests",
      testPage: "/FormFieldFocusOrder",

      "Check first form field is focused": function() {
         return this.remote.findById("CREATE_DIALOG_FORM_label")
            .click()
         .end()

         .findByCssSelector("#FD1.dialogDisplayed")
         .end()

         .findByCssSelector("#SELECT_CONTROL.dijitSelectFocused");
      }
   });
});