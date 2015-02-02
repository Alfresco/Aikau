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
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Page Creation Widgets Test",
      "Test Drag From Palette To Drop Zone": function () {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/WidgetConfig", "Page Creation Widgets Test").findByCssSelector("#dojoUnique1 > .title")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
         .end()
         .findByCssSelector(".alfresco-creation-DropZone > div")
            .then(function(element) {
               browser.moveMouseTo(element);
            })
            .sleep(500) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
            .releaseMouseButton()
         .end()
         .findByCssSelector(".dojoDndHandle")
            .click()
         .end()
         .findByCssSelector(".alfresco-forms-controls-TextBox .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "Value1", "The initial value was not set correctly: " + resultText);
            })
         .end().alfPostCoverageResults(browser);

         // // 5. Save the config...
         // .findByCssSelector(".alfresco-creation-WidgetConfig .confirmationButton > span")
         //    .click()
         //    .end()

         // // 6. Save the form...
         // .findByCssSelector("#FORM .confirmationButton > span")
         //    .click()
         //    .end()

         // .alfPostCoverageResults(browser);
      }
   });
});