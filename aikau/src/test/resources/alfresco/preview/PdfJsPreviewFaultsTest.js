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
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'PdfJs Previewer Fault Tests',


      'Test PdfJs with a missing PDF hides the interface and shows a notification': function () {
         var testname = "PdfJs missing PDF test";
         var browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/PdfJsPreviewMissing", testname)

            // A delay because the viewer does actually take a moment to reconfigure when the PDF is missing
            .sleep(500)

            .findByCssSelector(".previewer > .controls")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking controls are hidden");
                  expect(displayed).to.equal(false, "Controls should be hidden");
               })
            .end()

            .findByCssSelector(".previewer > .sidebar")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking sidebar is hidden");
                  expect(displayed).to.equal(false, "Sidebar should be hidden");
               })
            .end()

            .findByCssSelector(".previewer > .viewer")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking viewer is hidden");
                  expect(displayed).to.equal(false, "Viewer should be hidden");
               })
            .end()

            .findByCssSelector(".notification")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking notification is shown");
                  expect(displayed).to.equal(true, "Notification should be shown");
               })
            .end()

            .findByCssSelector(".notification")
               .getVisibleText()
               .then(function(text) {
                  TestCommon.log(testname,"Checking notification has text in it");
                  expect(text).to.have.length.above(0, "There should be a notification message");
               })
            .end()

            .alfPostCoverageResults(browser);
      },


      'Test PdfJs with a faulty PDF hides the interface and shows a notification': function () {
         var testname = "PdfJs faulty PDF test";
         var browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/PdfJsPreviewFaulty", testname)

            // A delay because the viewer does actually take a moment to reconfigure when the PDF is faulty
            .sleep(500)

            .findByCssSelector(".previewer > .controls")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking controls are hidden");
                  expect(displayed).to.equal(false, "Controls should be hidden");
               })
            .end()

            .findByCssSelector(".previewer > .sidebar")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking sidebar is hidden");
                  expect(displayed).to.equal(false, "Sidebar should be hidden");
               })
            .end()

            .findByCssSelector(".previewer > .viewer")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking viewer is hidden");
                  expect(displayed).to.equal(false, "Viewer should be hidden");
               })
            .end()

            .findByCssSelector(".notification")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking notification is shown");
                  expect(displayed).to.equal(true, "Notification should be shown");
               })
            .end()

            .findByCssSelector(".notification")
               .getVisibleText()
               .then(function(text) {
                  TestCommon.log(testname,"Checking notification has text in it");
                  expect(text).to.have.length.above(0, "There should be a notification message");
               })
            .end()

            .alfPostCoverageResults(browser);
      },


      'Test PdfJs with a password protected PDF hides the interface and shows a notification': function () {
         var testname = "PdfJs password protected PDF test";
         var browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/PdfJsPreviewPassword", testname)

            // A delay because the viewer does actually take a moment to reconfigure when the PDF is password protected
            .sleep(500)

            .findByCssSelector(".previewer > .controls")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking controls are hidden");
                  expect(displayed).to.equal(false, "Controls should be hidden");
               })
            .end()

            .findByCssSelector(".previewer > .sidebar")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking sidebar is hidden");
                  expect(displayed).to.equal(false, "Sidebar should be hidden");
               })
            .end()

            .findByCssSelector(".previewer > .viewer")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking viewer is hidden");
                  expect(displayed).to.equal(false, "Viewer should be hidden");
               })
            .end()

            .findByCssSelector(".notification")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking notification is shown");
                  expect(displayed).to.equal(true, "Notification should be shown");
               })
            .end()

            .findByCssSelector(".notification")
               .getVisibleText()
               .then(function(text) {
                  TestCommon.log(testname,"Checking notification has text in it");
                  expect(text).to.have.length.above(0, "There should be a notification message");
               })
            .end()

      },


      'Test PdfJs with a password protected PDF displays a password request': function () {
         var testname = "PdfJs password protected PDF dialog test";
         var browser = this.remote;
         return this.remote

            .findByCssSelector(".alfresco-dialog-AlfDialog")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking dialog is displayed");
                  expect(displayed).to.equal(true, "Dialog should be displayed");
               })
            .end()

            .alfPostCoverageResults(browser);

      },


      'Test PdfJs with a password protected PDF displays a new password challenge with a password error': function () {
         var testname = "PdfJs password protected PDF bad password test";
         var browser = this.remote;
         return this.remote

            .findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
               .then(null, function() {
                  assert(false, "No password field found");
               })
            .end()

            .findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
               .type('abc')
            .end()

            .findByCssSelector(".alfresco-dialog-AlfDialog .footer > span:first-child > span")
               .click()
            .end()

            .sleep(500)

            .findByCssSelector(".alfresco-dialog-AlfDialog")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking dialog is displayed");
                  expect(displayed).to.equal(true, "Dialog should be displayed");
               })
            .end()

      },


      'Test PdfJs with a password protected PDF displays a new password challenge with another password error': function () {
         var testname = "PdfJs password protected PDF bad password test again";
         var browser = this.remote;
         return this.remote

            .findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
               .then(null, function() {
                  assert(false, "No password field found");
               })
            .end()

            .findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
               .type('def')
            .end()

            .findByCssSelector(".alfresco-dialog-AlfDialog .footer > span:first-child > span")
               .click()
            .end()

            .sleep(500)

            .findByCssSelector(".alfresco-dialog-AlfDialog")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking dialog is displayed");
                  expect(displayed).to.equal(true, "Dialog should be displayed");
               })
            .end()

      },


      'Test PdfJs with a password protected PDF displays the PDF with a correct password': function () {
         var testname = "PdfJs password protected PDF correct password test";
         var browser = this.remote;
         return this.remote

            .findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
               .then(null, function() {
                  assert(false, "No password field found");
               })
            .end()

            .findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
               .type('alfresco')
            .end()

            .findByCssSelector(".alfresco-dialog-AlfDialog .footer > span:first-child > span")
               .click()
            .end()

            .sleep(500)

            .findByCssSelector(".previewer > .controls")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking controls are visible");
                  expect(displayed).to.equal(true, "Controls should be visible");
               })
            .end()

            .findByCssSelector(".previewer > .sidebar")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking sidebar is visible");
                  expect(displayed).to.equal(true, "Sidebar should be visible");
               })
            .end()

            .findByCssSelector(".previewer > .viewer")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking viewer is visible");
                  expect(displayed).to.equal(true, "Viewer should be visible");
               })
            .end()

            .findByCssSelector(".notification")
               .isDisplayed()
               .then(function(displayed) {
                  TestCommon.log(testname,"Checking notification is not shown");
                  expect(displayed).to.equal(false, "Notification should not be shown");
               })
            .end()

            .alfPostCoverageResults(browser);

      }
   });
});