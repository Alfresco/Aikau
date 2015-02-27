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
 * This test renders examples of Thumbnails.
 * 
 * The test is simple and much of its validity is in the use of slightly damaged or incomplete models to inspect edge cases.
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Thumbnail Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Thumbnail", "Thumbnail Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Check there are the expected number of thumbnails successfully rendered": function () {
         return browser.findAllByCssSelector("span.alfresco-renderers-Thumbnail")
            .then(function (thumbnails){
               expect(thumbnails).to.have.length(12, "There should be 12 thumbnails successfully rendered");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});