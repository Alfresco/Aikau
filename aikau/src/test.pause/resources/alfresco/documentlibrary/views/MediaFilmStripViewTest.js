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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 *
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, TestCommon, defineSuite, assert) {

   defineSuite(module, {
      name: "Film Strip View Tests (Media Playing)",
      testPage: "/MediaFilmStripView?autoPlay=true",

      // By default autoPlay is disabled, but the test page overrides the plugin configuration...
      "Check that video is playing": function() {
         return this.remote.findDisplayedByCssSelector("video")
            .execute("return document.querySelector('video').paused")
            .then(function(paused) {
               assert.isFalse(paused);
            });
      },

      "Check that audio preview has not been created": function() {
         return this.remote.findAllByCssSelector("audio")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "Show the audio preview, check video is paused": function() {
         return this.remote.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .next img")
            .click()
         .end()

         .findByCssSelector("video")
            .execute("return document.querySelector('video').paused")
            .then(function(paused) {
               assert.isTrue(paused);
            });
      },

      "Audio should be playing": function() {
         return this.remote.findDisplayedByCssSelector("audio")
            .execute("return document.querySelector('audio').paused")
            .then(function(paused) {
               assert.isFalse(paused);
            });
      },

      "Go back to the video preview, check the audio stops": function() {
         return this.remote.findDisplayedByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .prev img")
            .click()
         .end()

         .findDisplayedByCssSelector("audio")
            .execute("return document.querySelector('audio').paused")
            .then(function(paused) {
               assert.isTrue(paused);
            });
      },

      "Video should be playing": function() {
         return this.remote.findDisplayedByCssSelector("video")
            .execute("return document.querySelector('video').paused")
            .then(function(paused) {
               assert.isFalse(paused);
            });
      }
   });

   defineSuite(module, {
      name: "Film Strip View Tests (Media Playing - no auto play)",
      testPage: "/MediaFilmStripView?autoPlay=false",

      "Check that video is NOT playing": function() {
         return this.remote.findDisplayedByCssSelector("video")
            .execute("return document.querySelector('video').paused")
            .then(function(paused) {
               assert.isTrue(paused);
            });
      }
   });
});