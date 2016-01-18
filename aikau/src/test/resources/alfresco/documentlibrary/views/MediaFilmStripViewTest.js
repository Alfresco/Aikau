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
define(["alfresco/TestCommon",
        "intern!object",
        "intern/chai!assert"],
       function(TestCommon, registerSuite, assert) {

   registerSuite(function() {
      var browser;

      return {
         name: "Film Strip View Tests (Media Playing)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/MediaFilmStripView?autoPlay=true", "Film Strip View Tests (Media Playing)").end();
         },
         
         beforeEach: function() {
            browser.end();
         },

         // By default autoPlay is disabled, but the test page overrides the plugin configuration...
         "Check that video is playing": function() {
            return browser.findDisplayedByCssSelector("video")
               .execute("return document.querySelector('video').paused")
               .then(function(paused) {
                  assert.isFalse(paused);
               });
         },

         "Check that audio preview has not been created": function() {
            return browser.findAllByCssSelector("audio")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "Show the audio preview, check video is paused": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .next img")
               .click()
            .end()

            .findDisplayedByCssSelector("video")
               .execute("return document.querySelector('video').paused")
               .then(function(paused) {
                  assert.isTrue(paused);
               });
         },

         "Audio should be playing": function() {
            return browser.findDisplayedByCssSelector("audio")
               .execute("return document.querySelector('audio').paused")
               .then(function(paused) {
                  assert.isFalse(paused);
               });
         },

         "Go back to the video preview, check the audio stops": function() {
            return browser.findByCssSelector("#FILMSTRIP_VIEW_PREVIEWS .prev img")
               .click()
            .end()

            .findDisplayedByCssSelector("audio")
               .execute("return document.querySelector('audio').paused")
               .then(function(paused) {
                  assert.isTrue(paused);
               });
         },

         "Video should be playing": function() {
            return browser.findDisplayedByCssSelector("video")
               .execute("return document.querySelector('video').paused")
               .then(function(paused) {
                  assert.isFalse(paused);
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
         name: "Film Strip View Tests (Media Playing - no auto play)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/MediaFilmStripView?autoPlay=false", "Film Strip View Tests (Media Playing)").end();
         },
         
         beforeEach: function() {
            browser.end();
         },

         "Check that video is NOT playing": function() {
            return browser.findDisplayedByCssSelector("video")
               .execute("return document.querySelector('video').paused")
               .then(function(paused) {
                  assert.isTrue(paused);
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});