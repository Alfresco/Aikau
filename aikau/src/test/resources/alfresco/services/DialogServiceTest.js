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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/helpers/pollUntil"],
        function(registerSuite, assert, require, TestCommon, pollUntil) {

   var browser;

   function closeAllDialogs() {
      // Todo: this fails to close multiple dialogs in Chrome
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

   registerSuite({
      name: "Dialog Service Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DialogService", "Dialog Service Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test that dialog with no ID can be created": function() {
         return browser.findByCssSelector("#CREATE_FORM_DIALOG_NO_ID")
            .click()
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "The Dialog did not appear");
            });
      },

      "Test publication on dialog show": function() {
         return browser.findAllByCssSelector(TestCommon.topicSelector("DISPLAYED_FD1", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find topic published when displayed dialog");
            });
      },

      "Test recreating dialog with no ID": function() {
         return closeAllDialogs()
            .then(function() {
               return browser.findById("CREATE_FORM_DIALOG_NO_ID")
                  .click()
                  .end()

               .findAllByCssSelector(".alfresco-dialog-AlfDialog")
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "The previous dialog without an ID was not destroyed");
                  });
            });
      },

      "Test creating dialog with an ID": function() {
         return closeAllDialogs()
            .then(function() {
               return browser.findById("CREATE_FORM_DIALOG")
                  .click()
                  .end()

               .findAllByCssSelector(".alfresco-dialog-AlfDialog")
                  .then(function(elements) {
                     assert.lengthOf(elements, 2, "The previous dialog (without an ID) was destroyed");
                  });
            });
      },

      "Test recreating dialog with an ID": function() {
         return closeAllDialogs()
            .then(function() {
               return browser.findById("CREATE_FORM_DIALOG")
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
         return browser.findByCssSelector("#TB2 .dijitInputContainer input")
            .clearValue()
            .type("Some value")
            .end()

         // Post the form...
         .findByCssSelector("#FD2 .confirmationButton > span")
            .click()
            .end()

         // Check the values have been set
         .findAllByCssSelector(TestCommon.pubDataCssSelector("POST_DIALOG_2", "text", "Some value"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Textbox value was not posted");
            });
      },

      "Test that additional data is included in post": function() {
         // Type a value into the field...
         return browser.findAllByCssSelector(TestCommon.pubDataCssSelector("POST_DIALOG_2", "bonusData", "test"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Additional data was not posted");
            });
      },

      "Check that form dialog dimensions can be set": function() {
         return closeAllDialogs()
            .then(function() {
               return browser.findById("CREATE_FORM_DIALOG")
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

      "Dialog is closed when dialogCloseTopic is set": function() {
         return closeAllDialogs()
            .then(function() {
               return browser.findById("LAUNCH_FAILURE_DIALOG")
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
         return closeAllDialogs()
            .then(function() {
               return browser.findById("LAUNCH_FAILURE_DIALOG")
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
         return closeAllDialogs()
            .then(function() {
               return browser.findById("LAUNCH_OUTER_DIALOG_BUTTON")
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

      "Check form dialog has customised IDs for buttons": function () {
         return closeAllDialogs()
            .then(function () {
               return browser.findById("LAUNCH_CUSTOM_BUTTON_ID_DIALOG")
                  .click()
                  .end()

                  .findAllByCssSelector("#CUSTOM_OK_BUTTON_ID")
                  .then(function (elements) {
                     assert.lengthOf(elements, 1, "OK Button missing custom id");
                  })
                  .end()

                  .findAllByCssSelector("#CUSTOM_DIALOG_CANCEL")
                  .then(function (elements) {
                     assert.lengthOf(elements, 1, "CANCEL Button missing default id");
                  });

            });
      },

      "Can launch dialog within dialog": function() {
         return closeAllDialogs()
            .then(function() {
               return browser.findById("LAUNCH_OUTER_DIALOG_BUTTON")
                  .click()
                  .end()

               .findById("LAUNCH_INNER_DIALOG_BUTTON")
                  .click()
                  .end()

               .findAllByCssSelector(TestCommon.topicSelector("DISPLAYED_INNER_DIALOG", "publish", "any"))
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "Inner dialog not displayed");
                  });
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});
