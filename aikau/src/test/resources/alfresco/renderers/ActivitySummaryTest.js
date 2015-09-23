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
 * @author Martin Doyle
 */
define(["intern!object",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon"
   ],
   function(registerSuite, assert, require, TestCommon) {

      var renderedValues = [
            "Andy Healey previewed file P9111608.jpg in alfresco-uk-photo",
            "Tom Page liked file boats.jpg in alfresco-uk-photo",
            "Pete Philips updated wiki page Security_Blog in security",
            "Andy Healey added file black sand beach, iceland.jpg in alfresco-uk-photo",
            "Lambert Nguyen deleted file 401K_InfoSheet_2015.pdf in hr",
            "Paul brodner downloaded file Pentest Secure Code Workshop 2013.pdf in security",
            "David Webster role changed to Contributor in alfresco-uk-photo",
            "David Draper updated file Aikau Code Coverage Test Results Graph.png in aikau",
            "David Webster joined site alfresco-uk-photo with role Consumer",
            "Harpritt Kalsi commented on DSC00347.JPG in alfresco-uk-photo",
            "Ola Phillips added folder Connectivity Test - New Instructions in eng"
         ];

   registerSuite(function(){
   var browser;

   return {
         name: "ActivitySummary Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ActivitySummary", "ActivitySummary Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Correct number of activities are rendered": function() {
            return browser.findAllByCssSelector(".alfresco-renderers-ActivitySummary")
               .then(function(elements) {
                  assert.lengthOf(elements, 11, "Incorrect number of activities found");
               });
         },

         "Rendered text is correct": function() {
            return browser.findAllByCssSelector(".alfresco-renderers-ActivitySummary")
               .getVisibleText()
               .then(function(visibleText) {
                  var visibleTextJson = JSON.stringify(visibleText),
                     expectedValueJson = JSON.stringify(renderedValues);
                  assert.equal(visibleTextJson, expectedValueJson, "Rendered text inaccurate");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
      });
   });