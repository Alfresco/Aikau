/*jshint browser:true*/
/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/helpers/pollUntil"],
        function(module, defineSuite, assert, TestCommon, pollUntil) {

   var DialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");
   var dialogSelectors = {
      enableTopicDialog: {
         confirmationButton: TestCommon.getTestSelector(DialogSelectors, "form.dialog.confirmation.button", ["FD4"]),
         disabledConfirmationButton: TestCommon.getTestSelector(DialogSelectors, "disabled.form.dialog.confirmation.button", ["FD4"]),
         displayed: TestCommon.getTestSelector(DialogSelectors, "visible.dialog", ["FD4"]),
         hidden: TestCommon.getTestSelector(DialogSelectors, "hidden.dialog", ["FD4"]),
      }
   };

   function closeAllDialogs(browser) {
      // TODO: this fails to close multiple dialogs in Chrome
      return browser.end()
         .findAllByCssSelector(".dijitDialogCloseIcon")
         .then(function(closeButtons) {
            closeButtons.forEach(function(closeButton) {
               if (closeButton.isDisplayed()) {
                  closeButton.click();
               }
            });
            browser.end();
         })
         .then(pollUntil(function() {
            /*globals document*/
            var underlay = document.getElementById("dijit_DialogUnderlay_0"),
               underlayHidden = underlay && underlay.style.display === "none";
            return underlayHidden || null;
         }, 5000));
   }

   defineSuite(module, {
      name: "Dialog Service Tests",
      testPage: "/DialogService",

      "Test that dialog with no ID can be created": function() {
         return this.remote.findByCssSelector("#CREATE_FORM_DIALOG_NO_ID")
            .click()
         .end()

         .findDisplayedByCssSelector(".alfresco-dialog-AlfDialog");
      },

      "Test publication on dialog show": function() {
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog")
            .end()
            .getLastPublish("DISPLAYED_FD1", "Could not find topic published when displayed dialog");
      },

      "Title not double encoded": function() {
         return this.remote.findByCssSelector("#FD1 .dijitDialogTitle")
            .getVisibleText()
            .then(function(text) {
               // NOTE: Only include is used because text is truncated via ellipsis
               assert.include(text, "<img ='><svg onload=\"window");
            });
      },

      "Text content not double encoded": function() {
         return this.remote.findByCssSelector("#FD1 .dialog-body")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "<img ='><svg onload=\"window.bodyHacked=true\"'>");
            });
      },

      "Title XSS attack failed": function() {
         return this.remote.execute(function() {
               return window.titleHacked;
            })
            .then(function(hacked) {
               assert.isFalse(!!hacked);
            });
      },

      "Body XSS attack failed": function() {
         return this.remote.execute(function() {
               return window.bodyHacked;
            })
            .then(function(hacked) {
               assert.isFalse(!!hacked);
            });
      },

      "Test recreating dialog with no ID": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("CREATE_FORM_DIALOG_NO_ID")
                  .click()
                  .end()

               .findAllByCssSelector(".alfresco-dialog-AlfDialog")
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "The previous dialog without an ID was not destroyed");
                  });
            });
      },

      "Check close button title": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("CREATE_FORM_DIALOG")
                  .click()
                  .end()

               .findDisplayedByCssSelector(".dijitDialogCloseIcon")
                  .getAttribute("title")
                  .then(function(title) {
                     assert.equal(title, "Close");
                  });
            });
      },

      // See AKU-904 (the basic form dialog now includes custom form config for a setValueTopic - this should
      // result in a subscription being created)...
      "Custom form config was processed": function() {
         return this.remote.findByCssSelector("body").getLogEntries({
               type: "SUBSCRIBE",
               topic: "CHECK_FOR_MY_SUBSCRIBED_TOPIC",
               pos: "all"
            }, true)
            .then(function(subscriptions) {
               assert.lengthOf(subscriptions, 1, "Subscription not created");
            });
      },

      "Test creating dialog with an ID": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("CREATE_FORM_DIALOG")
                  .click()
                  .end()

               .findAllByCssSelector(".alfresco-dialog-AlfDialog")
                  .then(function(elements) {
                     assert.lengthOf(elements, 2, "The previous dialog (without an ID) was destroyed");
                  });
            });
      },

      "Test recreating dialog with an ID": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("CREATE_FORM_DIALOG")
                  .clearLog()
                  .click()
                  .end()

               .findAllByCssSelector(".alfresco-dialog-AlfDialog")
                  .then(function(elements) {
                     assert.lengthOf(elements, 2, "The previous dialog (without an ID) was destroyed");
                  });
            });
      },

      "Test that updated value is included in post": function() {
         // Type a value into the field...
         return this.remote.findByCssSelector("#FD2.dialogDisplayed").end()

         .findByCssSelector("#TB2 .dijitInputContainer input")
            .clearValue()
            .type("Some value")
            .end()

         // Post the form...
         .findByCssSelector("#FD2 .confirmationButton > span")
            .click()
            .end()

         // Check the values have been set
         .getLastPublish("POST_DIALOG_2")
            .then(function(payload) {
               assert.propertyVal(payload, "text", "Some value", "Textbox value was not posted");
               assert.propertyVal(payload, "bonusData", "test", "Additional data was not posted");
            });
      },

      "Check that form dialog dimensions can be set": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("CREATE_FORM_DIALOG")
                  .click()
                  .end()
                  .findByCssSelector("#FD2 .dialog-body")
                  .getComputedStyle("width")
                  .then(function(width) {
                     assert.equal(width, "700px", "Width was not set correctly");
                  })
                  .getComputedStyle("height")
                  .then(function(height) {
                     assert.equal(height, "300px", "Height was not set correctly");
                  });
            });
      },

      // See AKU-846...
      "Dialog buttons are disabled when enableCloseTopic is set": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("LAUNCH_FAILURE_DIALOG_2")
                  .click()
                  .end()

               .findByCssSelector(dialogSelectors.enableTopicDialog.displayed)
                  .end()

               .findByCssSelector("#TB4 .dijitInputContainer input")
                  .clearValue()
                  .type("fail")
                  .end()

               .findByCssSelector(dialogSelectors.enableTopicDialog.confirmationButton)
                  .click()
                  .end()

               // Check that the confirmation button is now disabled (this also demonstrates that the dialog is still visible)...
               .findByCssSelector(dialogSelectors.enableTopicDialog.disabledConfirmationButton)
                  .end()

               // Wait for the confirmation button to be reanabled (there is a timeout on the failure topic publication)...
               .waitForDeletedByCssSelector(dialogSelectors.enableTopicDialog.disabledConfirmationButton)

               .findByCssSelector("#TB4 .dijitInputContainer input")
                  .clearValue()
                  .type("Succeed")
                  .end()

               .findByCssSelector(dialogSelectors.enableTopicDialog.confirmationButton)
                  .click()
                  .end()

               .findByCssSelector(dialogSelectors.enableTopicDialog.hidden);
            });
      },

      "Dialog is closed when dialogCloseTopic is set": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("LAUNCH_FAILURE_DIALOG")
                  .click()
                  .end()

               .findByCssSelector("#TB3 .dijitInputContainer input")
                  .clearValue()
                  .type("Succeed")
                  .end()

               .findByCssSelector("#FD3 .confirmationButton > span")
                  .click()
                  .end()
                  .sleep(250) // Give the dialog a chance to be hidden
                  .findByCssSelector("#FD3")
                  .isDisplayed()
                  .then(function(displayed) {
                     assert.isFalse(displayed, "The dialog was not hidden");
                  });
            });
      },

      "Dialog remains open when dialogCloseTopic is set": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("LAUNCH_FAILURE_DIALOG")
                  .click()
                  .end()

               .findByCssSelector("#TB3 .dijitInputContainer input")
                  .clearValue()
                  .type("fail")
                  .end()

               .findByCssSelector("#FD3 .confirmationButton > span")
                  .click()
                  .end()
                  .sleep(250) // Give the dialog a chance to be hidden
                  .findByCssSelector("#FD3")
                  .isDisplayed()
                  .then(function(displayed) {
                     assert.isTrue(displayed, "The dialog was not hidden");
                  });
            });
      },

      "Check that non-form dialog dimensions can be set": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("LAUNCH_OUTER_DIALOG_BUTTON")
                  .click()
                  .end()
                  .findByCssSelector("#OUTER_DIALOG .dialog-body")
                  .getComputedStyle("width")
                  .then(function(width) {
                     assert.equal(width, "600px", "Width was not set correctly");
                  })
                  .getComputedStyle("height")
                  .then(function(height) {
                     assert.equal(height, "400px", "Height was not set correctly");
                  });
            });
      },

      "Check form dialog has customised IDs for buttons": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("LAUNCH_CUSTOM_BUTTON_ID_DIALOG")
                  .click()
                  .end()

               .findAllByCssSelector("#CUSTOM_OK_BUTTON_ID")
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "OK Button missing custom id");
                  })
                  .end()

               .findAllByCssSelector("#CUSTOM_DIALOG_CANCEL")
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "CANCEL Button missing default id");
                  });

            });
      },

      "Long form dialog controls are fully displayed": function() {
         var getDimensions = function() {
            var dialogPanel = document.querySelector("#LFD .alfresco-layout-SimplePanel");
            return {
               scrollWidth: dialogPanel.scrollWidth,
               offsetWidth: dialogPanel.offsetWidth
            };
         };

         return closeAllDialogs(this.remote)
            .then(() => {

               return this.remote.findById("CREATE_LONG_FORM_DIALOG")
                  .click()
                  .end()

               .findByCssSelector("#LFD.dialogDisplayed")
                  .end()

               .execute(getDimensions)
                  .then(function(dimensions) {
                     assert.equal(dimensions.scrollWidth, dimensions.offsetWidth);
                  });
            });
      },

      "Count golden path repeating dialog buttons": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("CREATE_AND_CREATE_ANOTHER_1")
                  .click()
                  .end()
                  .findAllByCssSelector("#CUSTOM_DIALOG .footer .alfresco-buttons-AlfButton")
                  .then(function(elements) {
                     assert.lengthOf(elements, 3, "Unexpected number of buttons");
                  });
            });
      },

      "Check that golden path repeating dialog repeats on repeat confirmation": function() {
         return this.remote.findByCssSelector("#GOLDEN_REPEATING_INPUT .dijitInputContainer input")
            .clearValue()
            .type("another")
            .end()

         .findById("CUSTOM_REPEAT_BUTTON_ID")
            .click()
            .end()

         .waitForDeletedByClassName(".dialogDisplayed")
            .getLastPublish("POST_FORM_DIALOG")
            .then(function(payload) {
               assert.propertyVal(payload, "text", "another", "Textbox value was not posted");
            })

         .findAllByCssSelector("#CUSTOM_DIALOG.dialogDisplayed")
            .end()

         .findByCssSelector("#GOLDEN_REPEATING_INPUT .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "", "The form was not reset on repeat");
            });
      },

      "Check that golden path repeating dialog does NOT repeat on basic confirmation": function() {
         return this.remote.findByCssSelector("#GOLDEN_REPEATING_INPUT .dijitInputContainer input")
            .clearValue()
            .type("encore")
            .end()

         .findById("CUSTOM_OK_BUTTON_ID")
            .click()
            .end()

         .waitForDeletedByClassName(".dialogDisplayed")
            .getLastPublish("POST_FORM_DIALOG")
            .then(function(payload) {
               assert.propertyVal(payload, "text", "encore", "Textbox value was not posted");
            })

         .findAllByCssSelector("#CUSTOM_DIALOG.dialogHidden")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Dialog was not hidden");
            });
      },

      "Count error path repeating dialog buttons": function() {
         return this.remote.findById("CREATE_AND_CREATE_ANOTHER_2")
            .click()
            .end()
            .findAllByCssSelector("#ERROR_REPEATING .footer .alfresco-buttons-AlfButton")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Unexpected number of buttons");
            });
      },

      "Check that error path repeating dialog repeats on repeat confirmation with GOOD data": function() {
         return this.remote.findByCssSelector("#ERROR_REPEATING_INPUT .dijitInputContainer input")
            .clearValue()
            .type("more")
            .end()

         .findById("ERROR_REPEATING_OK_AND_REPEAT")
            .click()
            .end()

         .waitForDeletedByClassName(".dialogDisplayed")
            .getLastPublish("POST_FORM_DIALOG")
            .then(function(payload) {
               assert.propertyVal(payload, "text", "more", "Textbox value was not posted");
            })

         .findAllByCssSelector("#ERROR_REPEATING.dialogDisplayed")
            .end()

         .findByCssSelector("#ERROR_REPEATING_INPUT .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "", "The form was not reset on repeat");
            });
      },

      "Check that error path repeating dialog does NOT repeat on basic confirmation": function() {
         return this.remote.findByCssSelector("#ERROR_REPEATING_INPUT .dijitInputContainer input")
            .clearValue()
            .type("repeat")
            .end()

         .findById("DIFFERENT_OK_BUTTON_ID")
            .click()
            .end()

         .getLastPublish("POST_FORM_DIALOG")
            .then(function(payload) {
               assert.propertyVal(payload, "text", "repeat", "Textbox value was not posted");
            })

         .findAllByCssSelector("#ERROR_REPEATING.dialogHidden")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Dialog was not hidden");
            });
      },

      "Check tabs in form dialog": function() {
         return this.remote.findById("CREATE_FORM_DIALOG_WITH_TABBED_LAYOUT")
            .click()
            .end()
            .findAllByCssSelector("#TABBED_FORM_DIALOG.dialogDisplayed")
            .end()
            .findAllByCssSelector("#TABBED_FORM_DIALOG.alfresco-layout-AlfTabContainer--tabsDisplayed")
            .end()
            .findByCssSelector("#TABBED_FORM_DIALOG .dijitTabController")
            .getSize()
            .then(function(size) {
               assert(size.height > 0, "Tabs were not displayed correctly when dialog is initially shown, height = " + size.height);
            });
      },

      "Ensure that all tabbed form values are included in published value": function() {
         return this.remote.findByCssSelector("#TAB1_TB .dijitInputContainer input")
            .type("one")
            .end()
            .findByCssSelector("#TABBED_FORM_DIALOG .dijitTab:nth-child(2) .tabLabel")
            .click()
            .end()
            .findByCssSelector("#TAB2_TB .dijitInputContainer input")
            .type("two")
            .end()
            .findByCssSelector("#TABBED_FORM_DIALOG .alfresco-buttons-AlfButton.confirmationButton > span")
            .click()
            .end()
            .findAllByCssSelector("#TABBED_FORM_DIALOG.dialogHidden")
            .end()
            .getLastPublish("TABBED_FORM")
            .then(function(payload) {
               assert.propertyVal(payload, "tab1tb", "one", "Published form data incorrect (tab1tb)");
               assert.propertyVal(payload, "tab2tb", "two", "Published form data incorrect (tab2tb)");
            });
      },

      "Page does not scroll when dialogs present": function() {
         var documentHasScrollbar = function() {
            return document.documentElement.scrollWidth !== window.innerWidth;
         };

         return this.remote.findById("FULL_SCREEN_DIALOG_label")
            .click()
            .end()

         .findByCssSelector("#FSD1.dialogDisplayed")
            .execute(documentHasScrollbar)
            .then(function(hasScrollbar) {
               assert.isFalse(hasScrollbar);
            })
            .end()

         .findById("FULL_SCREEN_DIALOG_CLOSE_label")
            .click()
            .end()

         .findByCssSelector("#FSD1.dialogHidden");
      },

      "Can launch dialog within dialog": function() {
         return closeAllDialogs(this.remote)
            .then(() => {
               return this.remote.findById("LAUNCH_OUTER_DIALOG_BUTTON")
                  .click()
                  .end()

               .findById("LAUNCH_INNER_DIALOG_BUTTON")
                  .click()
                  .end()

               .getLastPublish("DISPLAYED_INNER_DIALOG", "Inner dialog not displayed")

               .findByCssSelector("#INNER_DIALOG .dijitDialogCloseIcon")
                  .click()
                  .end()

               .findByCssSelector("#INNER_DIALOG.dialogHidden")
                  .end()

               .findByCssSelector("#OUTER_DIALOG .dijitDialogCloseIcon")
                  .click()
                  .end()

               .findByCssSelector("#OUTER_DIALOG.dialogHidden");
            });
      },

      "Can publish form with custom scope information": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton[widgetid=\"CREATE_FORM_DIALOG_CUSTOM_SCOPE\"] .dijitButtonNode")
            .click()
            .end()

         .findByCssSelector("#SCOPED_FORM.dialogDisplayed .confirmationButton .dijitButtonNode")
            .click()
            .end()

         .getLastPublish("CUSTOM_FORM_SCOPE_CUSTOM_FORM_TOPIC", true, "Did not publish correctly scoped topic")
            .then(function(payload) {
               assert.propertyVal(payload, "text", "This is some sample text", "Did not publish correct form value to scoped topic");
            })

         .findByCssSelector("#SCOPED_FORM.dialogHidden");
      },

      "Dialog recentres after its size changes": function() {
         var getDialogHeight = function() {
               return document.getElementById("RESIZING_DIALOG").offsetHeight;
            },
            getWindowHeight = function() {
               return window.innerHeight;
            },
            windowHeight,
            dialogHeight;

         var relevantVerticalCentres = function() {
            var dialogBoundingRect = document.getElementById("RESIZING_DIALOG").getBoundingClientRect();
            return {
               dialogCentre: dialogBoundingRect.top + (dialogBoundingRect.height / 2),
               windowCentre: window.innerHeight / 2
            };
         };

         return this.remote.findById("RESIZING_DIALOG_BUTTON_label")
            .click()
            .end()

         .execute(getWindowHeight)
            .then(function(height) {
               windowHeight = height;
            })

         .findByCssSelector("#RESIZING_DIALOG.dialogDisplayed")
            .execute(getDialogHeight)
            .then(function(height) {
               dialogHeight = height;
            })
            .execute(relevantVerticalCentres)
            .then(function(verticalCentres) {
               assert.closeTo(verticalCentres.dialogCentre, verticalCentres.windowCentre, 20, "Dialog is not initially centred");
            })
            .end()

         .findByCssSelector("#RESIZING_DIALOG .dijitArrowButton")
            .click()
            .end()

         .findByCssSelector(".dijitMenuActive .dijitMenuItem:nth-child(2) .dijitMenuItemLabel")
            .click()
            .end()

         .getLastPublish("ALF_NODE_RESIZED")
            .execute(getDialogHeight)
            .then(function(height) {
               assert.isAbove(height, dialogHeight, "Dialog did not increase in size");
               dialogHeight = height;
            })

         .findByCssSelector("#RESIZING_DIALOG")
            .execute(relevantVerticalCentres)
            .then(function(verticalCentres) {
               assert.closeTo(verticalCentres.dialogCentre, verticalCentres.windowCentre, 20, "Dialog is not initially centred");
            })
            .end()

         .findById("RESIZING_DIALOG_CANCEL")
            .click()
            .end()

         .findByCssSelector("#RESIZING_DIALOG.dialogHidden");
      },

      "Page does not scroll when dialogs opened": function() {
         return this.remote.findById("CREATE_FORM_DIALOG")
            .click()
            .end()

         .findByCssSelector("#FD2.dialogDisplayed")
            .end()

         .execute(function() {
               var firstButton = document.querySelector(".alfresco-buttons-AlfButton"),
                  clientRect = firstButton && firstButton.getBoundingClientRect(),
                  buttonTop = clientRect && clientRect.top,
                  buttonOffScreen = isNaN(buttonTop) || buttonTop < 0;
               return buttonOffScreen;
            })
            .then(buttonOffScreen => {
               assert.isFalse(buttonOffScreen);
            });
      }
   });
});