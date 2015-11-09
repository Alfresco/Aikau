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
 * @author Martin Doyle
 */
define([
      "alfresco/TestCommon",
      "intern!object",
      "intern/chai!assert",
      "intern/dojo/node!leadfoot/keys"
   ],
   function(TestCommon, registerSuite, assert, keys) {

      registerSuite(function() {
         var browser;

         return {
            name: "Logo Tests",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/Logo", "Logo Tests");
            },

            beforeEach: function() {
               browser.end();
            },

            "Check CSS logo": function() {
               return browser.findByCssSelector("#LOGO1.alfresco-logo-Logo .alfresco-logo-large")
                  .isDisplayed()
                  .then(function(displayed) {
                     assert.isTrue(displayed, "CSS logo was not displayed");
                  });
            },

            "Check image logo": function() {
               return browser.findByCssSelector("#LOGO2 .alfresco-html-Image__img")
                  .isDisplayed()
                  .then(function(displayed) {
                     assert.isTrue(displayed, "Logo with image source was not displayed");
                  });
            },

            "Check image logo dimensions": function() {
               return browser.findByCssSelector("#LOGO2 .alfresco-html-Image__img")
                  .getComputedStyle("height")
                  .then(function(height) {
                     assert.equal(height, "48px", "The height of the image logo was incorrect");
                  })
                  .getComputedStyle("width")
                  .then(function(width) {
                     assert.equal(width, "172px", "The width of the image logo was incorrect");
                  });
            },

            "Check image logo width": function() {
               // The width of image logo should be set to auto, only CSS logos should have fixed widths
               return browser.findByCssSelector("#LOGO2 img")
                  .getComputedStyle("width")
                  .then(function(width) {
                     assert.equal(width, "auto", "The width of the image should be auto");
                  });
            },

            "Logo will publish topic when configured to do so": function() {
               return browser.findById("LOGO_WITH_TOPIC")
                  .click()
                  .getLastPublish("LOGO_TOPIC_PUBLISHED");
            },

            "Title text of link is correctly substituted": function() {
               return browser.findByCssSelector("#LOGO_WITH_URL .alfresco-navigation-_HtmlAnchorMixin")
                  .getAttribute("title")
                  .then(function(attributeValue) {
                     assert.equal(attributeValue, "Logo image");
                  });
            },

            "Logo will act as link when configured to do so": function() {
               return browser.findByCssSelector("#LOGO_WITH_URL a")
                  .click()
                  .sleep(2000)
                  .end()

               .findByCssSelector("#TDAC .title")
                  .getVisibleText()
                  .then(function(visibleText) {
                     assert.equal(visibleText, "Aikau Unit Tests");
                  });
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });

      registerSuite(function() {
         var browser;

         return {
            name: "Logo Keyboard Tests",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/Logo", "Logo Keyboard Tests");
            },

            beforeEach: function() {
               browser.end();
            },

            "Logo will publish topic when ENTER pressed": function() {
               return browser.findByCssSelector("body")
                  .tabToElement("#LOGO_WITH_TOPIC")
                  .pressKeys(keys.ENTER)
                  .getLastPublish("LOGO_TOPIC_PUBLISHED");
            },

            "Logo will act as link when ENTER pressed": function() {
               return browser.findByCssSelector("body")
                  .tabToElement("#LOGO_WITH_URL a")
                  .pressKeys(keys.ENTER)
                  .end()

               .findByCssSelector("#TDAC .title")
                  .getVisibleText()
                  .then(function(visibleText) {
                     assert.equal(visibleText, "Aikau Unit Tests");
                  });
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });
   });