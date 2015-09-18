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
      return "#" + id + "_ITEM_0 ." + status;
   };

registerSuite(function(){
   var browser;

   return {
      name: "Social Renderers Test (Likes)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SocialRenderers", "Social Renderers Test (Likes)").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Check like PROCESSING image": function () {
         return browser.findByCssSelector(toggleSelector("LIKES", "processing"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Like PROCESSING image should not be displayed initially");
            });
      },

      "Check like ON image": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Like ON image should not be displayed initially");
            });
      },

      "Check like OFF image": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Like OFF image was not displayed");
            });
      },

      "Check like WARNING image": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "warning"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Like WARNING image should not be displayed initially");
            });
      },

      "Check like count": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "count"))
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "4", "Like COUNT is incorrect");
            });
      },

      "Like the document": function() {
         return browser.findByCssSelector("#LIKES_ITEM_0")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_RATING_ADD", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Add rating request not published");
            });
      },

      "Check ON image is toggled": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Like ON image not displayed following like");
            });
      },

      "Check OFF image is toggled": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Like OFF image displayed despite liking");
            });
      },

      "Check the like count is incremented": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "count"))
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "5", "Like COUNT is incorrect following liking");
            });
      },

      "Unlike the document": function() {
         return browser.findByCssSelector("#LIKES_ITEM_0")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_RATING_REMOVE", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Remove rating request not published");
            });
      },

      "Check ON image is toggled (on unlike)": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Like ON image displayed despite removing like");
            });
      },

      "Check OFF image is toggled (on unlike)": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Like OFF image not displayed despite removing like");
            });
      },

      "Check count is decremented (on unlike)": function() {
         return browser.findByCssSelector(toggleSelector("LIKES", "count"))
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "4", "Like COUNT is incorrect after unliking");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

registerSuite(function(){
   var browser;

   return {
      name: "Social Renderers Test (Favourites)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SocialRenderers", "Social Renderers Test (Favourites)").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Check initial PROCESSING image": function () {
         return browser.findByCssSelector(toggleSelector("FAVOURITES", "processing"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Favourite PROCESSING image should not be displayed initially");
            });
      },

      "Check initial ON image": function() {
         return browser.findByCssSelector(toggleSelector("FAVOURITES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Favourite ON image should not be displayed initially");
            });
      },

      "Check initial OFF image": function() {
         return browser.findByCssSelector(toggleSelector("FAVOURITES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Favourite OFF image was not displayed");
            });
      },

      "Check initial WARNING image": function() {
         return browser.findByCssSelector(toggleSelector("FAVOURITES", "warning"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Favourite WARNING image should not be displayed initially");
            });
      },

      "Favourite a document": function() {
         return browser.findByCssSelector("#FAVOURITES_ITEM_0")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Add favourite request not published");
            });
      },

      "Check ON image toggled (add favourite)": function() {
         return browser.findByCssSelector(toggleSelector("FAVOURITES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Favourite ON image not displayed following favourite");
            });
      },

      "Check OFF image toggled (add favourite)": function() {
         return browser.findByCssSelector(toggleSelector("FAVOURITES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Favourite OFF image displayed despite favourite");
            });
      },

      "Remove favourite": function() {
         return browser.findByCssSelector("#FAVOURITES_ITEM_0")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Remove favourite request not published");
            });
      },

      "Check ON image toggled (remove favourite)": function() {
         return browser.findByCssSelector(toggleSelector("FAVOURITES", "on"))
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, false, "Favourite ON image displayed despite removing favourite");
            });
      },

      "Check OFF image toggled (remove favourite)": function() {
         return browser.findByCssSelector(toggleSelector("FAVOURITES", "off"))
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Favourite OFF image not displayed despite removing favourite");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });


registerSuite(function(){
   var browser;

   return {
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
   };
   });
});