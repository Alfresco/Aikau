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
 * This test renders examples of FileTypes.
 *
 * The test is simple and much of its validity is in the use of slightly damaged or incomplete models to inspect edge cases.
 *
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function (registerSuite, expect, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "FileType Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FileType", "FileType Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Check there are the expected number of filetypes": function () {
         return browser.findAllByCssSelector("div.alfresco-renderers-FileType")
            .then(function (filetypes){
               expect(filetypes).to.have.length(8, "There should be 8 filetypes rendered");
            });
      },

      // Tests the imgUrl config attribute.
      "Check custom image has loaded": function () {
         return browser.findByCssSelector("#ITEM7 img[alt=logo]")
            .getAttribute("src")
            .then(function (imgUrl){
               assert.include(imgUrl, "alfresco/logo/css/images/AlfrescoLogoOnly.PNG", "Expected Alfresco logo, but got: "+imgUrl);
            });
      },

      "Check non-custom image has loaded": function () {
         return browser.findByCssSelector("#ITEM8 img[alt=notLogo]")
            .getAttribute("src")
            .then(function (imgUrl){
               assert.include(imgUrl, "ppt-file-48.png", "Expected ppt-file-48, but got: "+imgUrl);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});