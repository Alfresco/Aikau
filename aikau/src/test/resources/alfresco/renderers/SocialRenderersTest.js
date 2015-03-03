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
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   var toggleSelector = function(id, status) {
      return "#" + id + " ." + status;
   };

   var browser;
   registerSuite({
      name: "Social Renderers Test (Likes)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SocialRenderers", "Social Renderers Test (Likes)").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Like Test": function () {
         return browser.findByCssSelector(toggleSelector("LIKES", "processing"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #1a - like PROCESSING image displayed incorrectly");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #1b - like ON image displayed incorrectly");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "Test #1c - like OFF image was not displayed");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "warning"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #1d - like WARNING image displayed incorrectly");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "count"))
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "4", "Test #1e - like COUNT is incorrect: " + resultText);
            })
            .end()

         // Click on LIKE and check the response...
         .findByCssSelector("#LIKES")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_RATING_ADD", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Test #2a - Add rating request not published");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "Test #2b - like ON image not displayed following like");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #2c - like OFF image displayed despite liking");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "count"))
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "5", "Test #2d - like COUNT is incorrect following liking: " + resultText);
            })
            .end()

         // Click on LIKE again and check the response...
         .findByCssSelector("#LIKES")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_RATING_REMOVE", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Test #3a - Add rating request not published");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #3b - like ON image displayed despite removing like");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "Test #3c - like OFF image not displayed despite removing like");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "count"))
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "4", "Test #3d - like COUNT is incorrect following liking: " + resultText);
            })
            .end()

         // Click on the LIKE again to check the simulated failure request...
         .findByCssSelector("#LIKES")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_RATING_ADD", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 2, "Test #4a - Add rating request not published");
            })
            .end()
         .findByCssSelector(toggleSelector("LIKES", "warning"))
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "Test #4b - like WARNING image not displayed following simulated failure");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Social Renderers Test (Favourites)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SocialRenderers", "Social Renderers Test (Favourites)").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Favourite Test": function () {
         return browser.findByCssSelector(toggleSelector("FAVOURITES", "processing"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #1a - favourite PROCESSING image displayed incorrectly");
            })
            .end()
         .findByCssSelector(toggleSelector("FAVOURITES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #1b - favourite ON image displayed incorrectly");
            })
            .end()
         .findByCssSelector(toggleSelector("FAVOURITES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "Test #1c - favourite OFF image was not displayed");
            })
            .end()
         .findByCssSelector(toggleSelector("FAVOURITES", "warning"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #1d - favourite WARNING image displayed incorrectly");
            })
            .end()
         
         // Click on FAVOURITE and check the response...
         .findByCssSelector("#FAVOURITES")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Test #2a - Add favourite request not published");
            })
            .end()
         .findByCssSelector(toggleSelector("FAVOURITES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "Test #2b - favourite ON image not displayed following favourite");
            })
            .end()
         .findByCssSelector(toggleSelector("FAVOURITES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #2c - favourite OFF image displayed despite liking");
            })
            .end()

         // Click on FAVOURITE again and check the response...
         .findByCssSelector("#FAVOURITES")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Test #3a - Remove favourite request not published");
            })
            .end()
         .findByCssSelector(toggleSelector("FAVOURITES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #3b - favourite ON image displayed despite removing favourite");
            })
            .end()
         .findByCssSelector(toggleSelector("FAVOURITES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "Test #3c - favourite OFF image not displayed despite removing favourite");
            })
            .end()

         // Click on the FAVOURITE again to check the simulated failure request...
         .findByCssSelector("#FAVOURITES")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 2, "Test #4a - Add favourite request not published");
            })
            .end()
         .findByCssSelector(toggleSelector("FAVOURITES", "warning"))
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "Test #4b - favourite WARNING image not displayed following simulated failure");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });


   registerSuite({
      name: "Social Renderers Test (Comments)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SocialRenderers", "Social Renderers Test (Comments)").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Comments Test": function () {
        return browser.findByCssSelector(toggleSelector("COMMENTS", "count"))
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "6", "Test #1a - comments COUNT is incorrect: " + resultText);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});