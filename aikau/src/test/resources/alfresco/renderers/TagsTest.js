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
 * This test renders examples of Tags.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, expect, require, TestCommon) {

   registerSuite({
      name: 'Tags Test',
      'alfresco/renderers/Tags': function () {

         var browser = this.remote;
         var testname = "TagsTest";
         return TestCommon.loadTestWebScript(this.remote, "/Tags", testname)

         .findAllByCssSelector("span.alfresco-renderers-InlineEditProperty.alfresco-renderers-Property")
            .then(function (tagcontrols){
               TestCommon.log(testname,"Check there are the expected number of tag controls successfully rendered");
               expect(tagcontrols).to.have.length(4, "Test #1a - There should be 4 tag controls successfully rendered");
            })
            .end()

         .findAllByCssSelector("#TAGS_4 span.alfresco-renderers-ReadOnlyTag")
            .then(function (readonlytags){
               TestCommon.log(testname,"Check there are the expected number of readonlytags successfully rendered");
               expect(readonlytags).to.have.length(3, "Test #1b - There should be 3 readonlytags successfully rendered");
            })
            .end()

         .findAllByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag")
            .then(function (edittags){
               TestCommon.log(testname,"Check there are no edittags shown");
               expect(edittags).to.have.length(0, "Test #1c - There should be 0 edittags shown");
            })
            .end()

         // Click the first tag
         .findByCssSelector("#TAGS_4 span.alfresco-renderers-ReadOnlyTag:first-of-type a")
            .click()
            .end()

         .findByCssSelector(TestCommon.pubDataCssSelector("ALF_NAVIGATE_TO_PAGE", "alfTopic", "ALF_NAVIGATE_TO_PAGE"))
            .then(
               function(){TestCommon.log(testname,"Check the link click published as expected");},
               function(){assert(false, "Test #1d - The link did not publish on 'ALF_NAVIGATE_TO_PAGE' after mouse clicks");}
            )
            .end()

         .findByCssSelector(TestCommon.pubDataCssSelector("ALF_NAVIGATE_TO_PAGE", "type", "HASH"))
            .then(
               function(){TestCommon.log(testname,"Check the link click published the payload as expected");},
               function(){assert(false, "Test #1e - The link did not publish the payload with 'type' as 'HASH'");}
            )
            .end()

         .findByCssSelector(TestCommon.pubDataCssSelector("ALF_NAVIGATE_TO_PAGE", "url", "filter=tag|Test1"))
            .then(
               function(){TestCommon.log(testname,"Check the link click published the payload as expected");},
               function(){assert(false, "Test #1f - The link did not publish the payload with 'url' as 'filter=tag|Test1'");}
            )
            .end()

         // Click the edit icon of the 4th tag control
         .findByCssSelector("#TAGS_4 > img.editIcon")
            .click()
            .end()

         .findAllByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag")
            .then(function (edittags){
               TestCommon.log(testname,"Check there are the expected number of edittags now shown");
               expect(edittags).to.have.length(3, "Test #1g - There should be 3 edittags now shown");
            })
            .end()

         .findByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag:first-of-type")
            .getVisibleText()
            .then(function (edittagtext){
               TestCommon.log(testname,"Check the first edit tag reads 'Test1'");
               expect(edittagtext).to.contain("Test1", "Test #1h - Edit tag 1 should read 'Test1'");
            })
            .end()

         // Click the first tag delete
         .findByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag:first-of-type span.tagDelete")
            .click()
            .end()

         .findAllByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag")
            .then(function (edittags){
               TestCommon.log(testname,"Check there are the expected number of edittags now shown");
               expect(edittags).to.have.length(2, "Test #1i - There should be 2 edittags now shown");
            })
            .end()

         .findByCssSelector("#TAGS_4 span.alfresco-renderers-EditTag:first-of-type")
            .getVisibleText()
            .then(function (edittagtext){
               TestCommon.log(testname,"Check the first edit tag now reads 'Test2'");
               expect(edittagtext).to.contain("Test2", "Test #1j - Edit tag 1 should now read 'Test2'");
            })
            .end()

         // Click the cancel button
         .findByCssSelector("#TAGS_4 span.action:nth-of-type(2)")
            .click()
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});