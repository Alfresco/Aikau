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
 * @author Richard Smith
 */
define(["module",
        "alfresco/TestCommon",
        "intern/chai!assert",
        "alfresco/defineSuite"],
        function(module, TestCommon, assert, defineSuite) {

   defineSuite(module, {
      name: "AlfListViewCaption Tests",
      testPage: "/AlfListViewCaption",

      "Check the AlfListView caption is encoded to avoid xss attacks": function() {
         return this.remote.findByCssSelector("caption")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Caption: <script>alert('XSS');</script>", "XSS caption is wrong: " + text);
            });
      },
   });
});