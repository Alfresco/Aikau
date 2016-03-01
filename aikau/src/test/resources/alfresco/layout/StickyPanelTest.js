
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
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   registerSuite(function() {
      var browser;

      return {
         name: "StickyPanel Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/StickyPanel", "StickyPanel Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Panel opens when requested": function() {
            return browser.findByCssSelector("[widgetid=\"OPEN_STICKY_PANEL\"] .dijitButtonNode")
               .click()
               .end()

            .getLastPublish("ALF_DISPLAY_STICKY_PANEL")

            .findDisplayedByCssSelector(".alfresco-layout-StickyPanel__panel");
         },

         "Panel scrolls when content too great for window size": function() {
            return browser.findByCssSelector("body")
               .hasScrollbars(".alfresco-layout-StickyPanel__widgets")
               .then(function(hasScrollbars) {
                  assert.isFalse(hasScrollbars.vertical, "Scrollbar should not initially be present");
               })

               .setWindowSize(null, 1024, 300)
               .hasScrollbars(".alfresco-layout-StickyPanel__widgets")
               .then(function(hasScrollbars) {
                  assert.isTrue(hasScrollbars.vertical, "Should have scrollbar after resize");
               })

               .setWindowSize(null, 1024, 768)
               .hasScrollbars(".alfresco-layout-StickyPanel__widgets")
               .then(function(hasScrollbars) {
                  assert.isFalse(hasScrollbars.vertical, "Scrollbar should disappear after resize to original size");
               });
         },

         "Panel has no title attribute": function() {
            return browser.findByCssSelector(".alfresco-layout-StickyPanel")
               .getAttribute("title")
               .then(function(title) {
                  assert.equal(title, null);
               });
         },

         "Panel can be minimised": function() {
            return browser.findByCssSelector(".alfresco-layout-StickyPanel__title-bar__minimise")
               .click()
               .end()

            .findByCssSelector(".alfresco-layout-StickyPanel--minimised")
               .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__widgets")
               .isDisplayed()
               .then(function(isDisplayed){
                  assert.isFalse(isDisplayed);
               });
         },

         "Panel can be restored": function() {
            return browser.findByCssSelector(".alfresco-layout-StickyPanel__title-bar__restore")
               .click()
               .end()

            .waitForDeletedByCssSelector(".alfresco-layout-StickyPanel--minimised")

            .findByCssSelector(".alfresco-layout-StickyPanel__widgets")
               .isDisplayed()
               .then(function(isDisplayed){
                  assert.isTrue(isDisplayed);
               });
         },

         "If StickyPanel requested when minimised, it will restore automatically": function(){
            return browser.findByCssSelector(".alfresco-layout-StickyPanel__title-bar__minimise")
               .click()
               .end()

            .findByCssSelector(".alfresco-layout-StickyPanel--minimised")
               .end()

            .findByCssSelector("[widgetid=\"OPEN_STICKY_PANEL\"] .dijitButtonNode")
               .clearLog()
               .click()
               .end()

            .getLastPublish("ALF_DISPLAY_STICKY_PANEL")

            .waitForDeletedByCssSelector(".alfresco-layout-StickyPanel--minimised")

            .findByCssSelector(".alfresco-layout-StickyPanel__widgets")
               .isDisplayed()
               .then(function(isDisplayed){
                  assert.isTrue(isDisplayed);
               });
         },

         "Panel allows clicks either side of it": function(){
            return browser.findByCssSelector("[widgetid=\"LEFT_BUTTON\"] .dijitButtonNode")
               .click()
               .getLastPublish("LEFT_BUTTON_PUSHED")
            .end()  

            .findByCssSelector("[widgetid=\"RIGHT_BUTTON\"] .dijitButtonNode")
               .click()
               .getLastPublish("RIGHT_BUTTON_PUSHED");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});