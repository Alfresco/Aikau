/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(registerSuite, expect, assert, require, TestCommon) {
   var browser;
   registerSuite({
      name: "Simple Picker Tests",
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SimplePicker", "Simple Picker Tests").end();
      },
      beforeEach: function() {
         browser.end();
      },
      teardown: function() {
         browser.end().alfPostCoverageResults(browser);
      }

   });
});