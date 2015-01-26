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
 * This test renders examples of FileTypes.
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

   registerSuite({
      name: 'FileType Test',
      'alfresco/renderers/FileType': function () {

         var browser = this.remote;
         var testname = "FileTypeTest";
         return TestCommon.loadTestWebScript(this.remote, "/FileType", testname)

         .findAllByCssSelector("div.alfresco-renderers-FileType")
            .then(function (filetypes){
               TestCommon.log(testname,"Check there are the expected number of filetypes");
               expect(filetypes).to.have.length(6, "There should be 6 filetypes rendered");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});