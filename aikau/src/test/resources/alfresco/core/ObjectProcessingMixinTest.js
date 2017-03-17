/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
      name: "ObjectProcessingMixin Tests",
      testPage: "/ObjectProcessingMixin",

      "Trying to process a recursive object succeeds and can be used as payload": function() {
         return this.remote.findById("PROCESS_RECURSIVE")
            .click()
            .end()

         .getLastPublish("GENERATED", true)
            .then(function(payload) {
               assert.deepPropertyVal(payload, "obj1.obj2", "[recursive object]");
            });
      }
   });
});