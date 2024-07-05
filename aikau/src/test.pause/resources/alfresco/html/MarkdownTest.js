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
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Markdown Tests",
      testPage: "/Markdown",

      "Check intial rendering": function() {
         return this.remote.findDisplayedByCssSelector("#MARKDOWN h1");
      },

      "Update rendering": function() {
         return this.remote.findByCssSelector("#TEXTAREA textarea")
            .clearValue()
            .type("* bullet")
            .end()

         .findByCssSelector("#FORM .confirmationButton > span")
            .click()
            .end()

         .findDisplayedByCssSelector("#MARKDOWN ul li");
      },

      "Prevent XSS attack": function() {
         /*jshint scripturl:true*/

         // Use an XSS attack described here: https://github.com/showdownjs/showdown/wiki/Markdown's-XSS-Vulnerability-(and-how-to-mitigate-it)
         return this.remote.findByCssSelector("#TEXTAREA textarea")
            .clearValue()
            .type("[some text](javascript:alert('xss'))")
            .end()

         .findByCssSelector("#FORM .confirmationButton > span")
            .click()
            .end()

         // A link should be generated... click it...
         .findDisplayedByCssSelector("#MARKDOWN a")
            .getAttribute("href")
            .then(function(href) {
               assert.notEqual(href, "javascript:alert('xss')");
            });
      }
   });
});