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
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(registerSuite, expect, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "NotificationService",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/NotificationService", "NotificationService")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Notification displays on button click": function() {
         return browser.findByCssSelector("#NOTIFICATION_BUTTON_SMALL")
            .click()
            .sleep(1000) // Simulate delay of notification appearing and user focusing on it
            .end()

         .findByCssSelector(".alfresco-notifications-AlfNotification__message")
            .isDisplayed()
            .then(function(notificationDisplayed) {
               assert.isTrue(notificationDisplayed, "Notification not displayed");
            });
      },

      "Topic publishes after notification hidden": function() {
         return browser.setFindTimeout(5000)
            .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification__message")

         .getLastPublish("ALF_NOTIFICATION_DESTROYED", "Post-notification topic not published");
      },

      "Can close notification early": function() {
         return browser.findByCssSelector("#NOTIFICATION_BUTTON_LARGE")
            .clearLog()
            .click()
            .end()

         .findByCssSelector(".alfresco-notifications-AlfNotification__close")
            .click()
            .end()

         .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification__message");
      },

      "Can display sticky panel": function() {
         return browser.findById("STICKY_PANEL_BUTTON")
            .click()
            .end()

         .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__title")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "My sticky panel title", "Did not display correct title in panel");
            })
            .end()

         .findByCssSelector(".alfresco-layout-StickyPanel__widgets")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "This is some text to go inside the sticky panel", "Did not display correct content in panel");
            });
      },

      "Can minimise and restore panel": function() {
         return browser.findByCssSelector(".alfresco-layout-StickyPanel__title-bar__minimise")
            .click()
            .end()

         .findByCssSelector(".alfresco-layout-StickyPanel--minimised .alfresco-layout-StickyPanel__widgets")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "", "Did not minimise panel");
            })
            .end()

         .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__restore")
            .click()
            .end()

         .findByCssSelector(".alfresco-layout-StickyPanel .alfresco-layout-StickyPanel__widgets")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "This is some text to go inside the sticky panel", "Did not restore panel");
            });
      },

      "Cannot open another panel while one already open": function() {
         return browser.findById("STICKY_PANEL_BUTTON")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-layout-StickyPanel")
            .then(function(elements) {
               assert.lengthOf(elements, 1);
            });
      },

      "Can close panel": function() {
         return browser.findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_STICKY_PANEL_CLOSED")

         .findAllByCssSelector(".alfresco-layout-StickyPanel")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "Can open panel again": function() {
         return browser.findById("STICKY_PANEL_BUTTON")
            .click()
            .end()

         .findByCssSelector(".alfresco-layout-StickyPanel__widgets")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "This is some text to go inside the sticky panel");
            });
      },

      "Changing panel title does not allow XSS injection": function() {
         return browser.findById("UPDATE_PANEL_TITLE_BUTTON")
            .click()
            .end()

         .execute(function() {
               return window.hackedPanel ? "injected" : "safe";
            })
            .then(function(result) {
               assert.equal(result, "safe", "XSS injection not prevented");
            })
            .end()

         .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__title")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "<img src=\"1\" onerror=\"window.hackedPanel=true\">");
            })
            .end()

         .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_STICKY_PANEL_CLOSED");
      },

      "Notification does not prevent clicking to sides": function(){
         return browser.findByCssSelector("[widgetid=\"NOTIFICATION_BUTTON_LARGE\"] .dijitButtonNode")
            .click()
            .clearLog()
         .end()

         .findByCssSelector("[widgetid=\"LEFT_BUTTON\"] .dijitButtonNode")
            .click()
         .end()

         .getLastPublish("LEFT_BUTTON_PUSHED")

         .findByCssSelector("[widgetid=\"RIGHT_BUTTON\"] .dijitButtonNode")
            .click()
         .end()

         .getLastPublish("RIGHT_BUTTON_PUSHED")

         .findByCssSelector(".alfresco-notifications-AlfNotification__close")
            .clearLog()
            .click()
         .end()

         .getLastPublish("ALF_NOTIFICATION_CLOSED");
      },
      
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});