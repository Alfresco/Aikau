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

   registerSuite({
      name: 'Page Creator Test',
      'Basic Test': function () {

         var browser = this.remote;
         var testname = "Page Creation Test";
         return TestCommon.loadTestWebScript(this.remote, "/WidgetConfig", testname)

         // 1. Find and pick up the draggable item
         .findByCssSelector("#dojoUnique1 > .title")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
            .end()

         // 2. Move to the drop zone and release
         .findByCssSelector(".alfresco-creation-DropZone > div")
            .then(function(element) {
               TestCommon.log(testname, "Dragging widget to drop zone...");
               browser.moveMouseTo(element);
            })
            .sleep(500) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
            .releaseMouseButton()
            .end()

         // 3. Select the dropped widget by clicking on the drag handle...
         .findByCssSelector(".dojoDndHandle")
            .click()
            .end()

         // 4. Check that the validation text box is displayed...
         .findByCssSelector(".alfresco-forms-controls-DojoValidationTextBox .dijitInputContainer input")
            .getProperty('value')
            .then(function(resultText) {
               TestCommon.log(testname, "Check that widget is displayed in drop zone...");
               assert(resultText == "Value1", "Test #2a - The initial value was not set correctly: " + resultText);
            })
            .end()

         // 5. Save the config...
         .findByCssSelector(".alfresco-creation-WidgetConfig .confirmationButton > span")
            .click()
            .end()

         // 6. Save the form...
         .findByCssSelector("#FORM .confirmationButton > span")
            .click()
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});