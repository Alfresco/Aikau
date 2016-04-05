/*jshint browser:true*/
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
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "PublishAction Tests",
      testPage: "/PublishAction",

      "Validate initial page state": function() {
         return this.remote.execute(function() {
            return window.bodyClicked;
         }).then(function(bodyClicked) {
            assert.isFalse(bodyClicked);
         });
      },

      "Clicking on action publishes correctly": function() {
         return this.remote.findById("EDIT_ME")
            .clearLog()
            .click()
            .end()

         .getLastPublish("EDIT_ME")
            .then(function(payload) {
               assert.propertyVal(payload, "editMode", true);
            });
      },

      "Action clicks do not bubble upwards": function() {
         return this.remote.execute(function() {
               return window.bodyClicked;
            })
            .then(function(bodyClicked) {
               assert.isFalse(bodyClicked);
            });
      }
   });
});