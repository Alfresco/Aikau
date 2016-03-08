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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   var tabContainerSelectors = TestCommon.getTestSelectors("alfresco/layout/AlfTabContainer");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var selectors = {
      tc1: {
         logo1Tab: TestCommon.getTestSelector(tabContainerSelectors, "identified.tab", ["TC","Logo1"])
      },
      buttons: {
         showIFrame: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SHOW_IFRAME"])
      }
   };

   registerSuite(function(){
      var browser;

      return {
         name: "IFramed Tab Container Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/IFramedTabContainer", "IFramed Tab Container Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         // See AKU-692...
         "Reveal the iframe and check for tab container": function () {
            return browser.findByCssSelector(selectors.buttons.showIFrame)
               .click()
            .end()

            .switchToFrame("IFRAME_IFRAME")

            .findByCssSelector(selectors.tc1.logo1Tab);
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});