/*jshint browser:true*/
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
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function(module, defineSuite, assert, TestCommon) {

   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton"),
      notificationSelectors = TestCommon.getTestSelectors("alfresco/notifications/AlfNotification");

   var selectors = {
      buttons: {
         nonClosingWithWidgets: TestCommon.getTestSelector(buttonSelectors, "button.label", ["NOTIFICATION_WIDGETS_BUTTON"]),
         publishWithinNotification: TestCommon.getTestSelector(buttonSelectors, "button.label", ["IN_NOTIFICATION_BUTTON"]),
         inlineLinkNotification: TestCommon.getTestSelector(buttonSelectors, "button.label", ["NOTIFICATION_INLINE_LINK_BUTTON"]),
         longNotification: TestCommon.getTestSelector(buttonSelectors, "button.label", ["NOTIFICATION_BUTTON_LARGE"]),
         closeNotification: TestCommon.getTestSelector(buttonSelectors, "button.label", ["CLOSE_NOTIFICATION_BUTTON"]),
         addActivity: TestCommon.getTestSelector(buttonSelectors, "button.label", ["ADD_ACTIVITY_BUTTON"]),
         removeActivity: TestCommon.getTestSelector(buttonSelectors, "button.label", ["REMOVE_ACTIVITY_BUTTON"])
      },
      notifications: {
         closeButton: TestCommon.getTestSelector(notificationSelectors, "button.close")
      }
   };

   defineSuite(module, {
      name: "NotificationService",
      testPage: "/NotificationService",

      "Notification displays on button click": function() {
         return this.remote.findByCssSelector("#NOTIFICATION_BUTTON_SMALL")
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
         return this.remote.setFindTimeout(5000)
            .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification__message")

         .getLastPublish("ALF_NOTIFICATION_DESTROYED", "Post-notification topic not published");
      },

      "Can close notification early": function() {
         return this.remote.findByCssSelector(selectors.buttons.longNotification)
            .clearLog()
            .click()
            .end()

         .findByCssSelector(".alfresco-notifications-AlfNotification__close")
            .click()
            .end()

         .waitForDeletedByCssSelector(".alfresco-notifications-AlfNotification__message");
      },

      "Can display sticky panel": function() {
         return this.remote.findById("STICKY_PANEL_BUTTON")
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
         return this.remote.findByCssSelector(".alfresco-layout-StickyPanel__title-bar__minimise")
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
         return this.remote.findById("STICKY_PANEL_BUTTON")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-layout-StickyPanel")
            .then(function(elements) {
               assert.lengthOf(elements, 1);
            });
      },

      "Can close panel": function() {
         return this.remote.findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
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
         return this.remote.findById("STICKY_PANEL_BUTTON")
            .click()
            .end()

         .findByCssSelector(".alfresco-layout-StickyPanel__widgets")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "This is some text to go inside the sticky panel");
            });
      },

      "Changing panel title does not allow XSS injection": function() {
         return this.remote.findById("UPDATE_PANEL_TITLE_BUTTON")
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

      "Notification does not prevent clicking to sides": function() {
         return this.remote.findByCssSelector("[widgetid=\"NOTIFICATION_BUTTON_LARGE\"] .dijitButtonNode")
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

      "Notification can contain widgets and have auto-close disabled": function() {
         return this.remote.findByCssSelector(selectors.buttons.nonClosingWithWidgets)
            .clearLog()
            .click()
            .sleep(5000) // That actions can continue after this point proves notification still open
            .end()

         .findByCssSelector(selectors.buttons.publishWithinNotification)
            .click()
            .end()

         .findByCssSelector(selectors.notifications.closeButton)
            .click()
            .end()

         .getLastPublish("ALF_NOTIFICATION_DESTROYED")

         .getLastPublish("PUBLISH_FROM_NOTIFICATION");
      },

      "Notification can have inline-link": function() {
         return this.remote.findByCssSelector(selectors.buttons.inlineLinkNotification)
            .clearLog()
            .click()
            .end()

         .findByCssSelector(".alfresco-notifications-AlfNotification .alfresco-navigation-Link")
            .click()
            .end()

         .getLastPublish("ALF_NOTIFICATION_DESTROYED", 5000)

         .getLastPublish("PUBLISH_BY_NOTIFICATION_LINK")
            .then(function(payload) {
               assert.propertyVal(payload, "sampleValue", "foo");
            });
      },

      "Can close notification by publishing on specified topic": function() {
         return this.remote.findByCssSelector(selectors.buttons.longNotification)
            .clearLog()
            .click()
            .end()

         .findByCssSelector(".alfresco-notifications-AlfNotification")
            .end()

         .findByCssSelector(selectors.buttons.closeNotification)
            .click()
            .end()

         .getLastPublish("ALF_NOTIFICATION_DESTROYED");
      },

      "Can cause progress indicator to appear": function() {
         return this.remote.findByCssSelector(selectors.buttons.addActivity)
            .clearLog()
            .click()
            .end()

         .findByCssSelector(".alfresco-notifications-ProgressIndicator");
      },

      "Can cause progress indicator to disappear again": function() {
         return this.remote.execute(function(buttonSelector) {
            document.querySelector(buttonSelector).click();
         }, [selectors.buttons.removeActivity])

         .waitForDeletedByCssSelector(".alfresco-notifications-ProgressIndicator");
      },

      "Can manually force progress indicator to disappear": function() {
         return this.remote.findByCssSelector(selectors.buttons.addActivity)
            .clearLog()
            .click()
            .end()

         .findByCssSelector(".alfresco-notifications-ProgressIndicator__close-button")
            .click()
            .end()

         .waitForDeletedByCssSelector(".alfresco-notifications-ProgressIndicator");
      }
   });
});