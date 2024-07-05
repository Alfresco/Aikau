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
 *
 * @author Dave Draper
 * @since 1.0.91
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "DateRange Tests",
      testPage: "/DateRange",

      "Test initial values": function() {
         return this.remote.findDisplayedByCssSelector("#DATE_RANGE_1_CONTROL")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "10/11/2016");
            })
         .end()

         .findDisplayedByCssSelector("#DATE_RANGE_1_TO_DATE_CONTROL")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "10/22/2016");
            });
      },

      "Range with no dates is valid": function() {
         return this.remote.findByCssSelector("#DATE_RANGE_2 .alfresco-forms-controls-BaseFormControl__validation-error")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      },

      "Range with one date is invalid": function() {
         return this.remote.findByCssSelector("#DATE_RANGE_3 .alfresco-forms-controls-BaseFormControl__validation-error")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed);
            });
      },

      "Range with from date after to date is invalid": function() {
         return this.remote.findByCssSelector("#DATE_RANGE_4 .alfresco-forms-controls-BaseFormControl__validation-error")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed);
            });
      }
   });
});