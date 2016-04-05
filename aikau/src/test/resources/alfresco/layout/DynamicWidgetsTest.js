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
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Dynamic Widgets Tests",
      testPage: "/DynamicWidgets",

      "Ensure logo and label not rendered on load": function() {
         return this.remote.findAllByCssSelector(".alfresco-logo-Logo")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Logo should not have been rendered on load");
            })
            .end()
            .findAllByCssSelector(".alfresco-html-Label")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Label should not have been rendered on load");
            });
      },

      "Render the logo": function() {
         return this.remote.findById("BUTTON1_label")
            .click()
            .end()
            .findByCssSelector(".alfresco-layout-ClassicWindow .alfresco-logo-Logo");
      },

      "Render the label": function() {
         return this.remote.findById("BUTTON2_label")
            .click()
            .end()
            .findByCssSelector(".alfresco-layout-ClassicWindow .alfresco-html-Label")
            .end()
            .findAllByCssSelector(".alfresco-logo-Logo")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Logo should not have been rendered on load");
            });
      }
   });
});