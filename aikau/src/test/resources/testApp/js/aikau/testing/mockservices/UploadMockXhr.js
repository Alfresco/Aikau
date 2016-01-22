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
 *
 * @module aikauTesting/UploadMockXhr
 * @author Richard Smith
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
        "dojo/_base/lang", 
        "alfresco/testing/MockXhr"], 
        function(declare, lang, MockXhr) {

   return declare([MockXhr], {

      /**
       * How long the average upload takes to complete
       *
       * @instance
       * @type {number}
       * @default
       */
      averageUploadTimeSecs: 1,

      /**
       * The response code to return. Default to 200 but can be overridden to test failures
       *
       * @instance
       * @type {number}
       * @default
       */
      responseCode: 200,

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_MockXhr__setupServer() {
         try {
            this.server.respondWith(lang.hitch(this, function(request) {

               // Setup headers/body for response                  
               var headers = {
                     "Content-Type": "application/json;charset=UTF-8"
                  },
                  body = "{\"nodeRef\":\"bob\",\"fileName\":\"moomin\"}";

               // If response code isn't 200, respond immediately
               if (this.responseCode !== 200) {
                  request.respond(this.responseCode, headers, body);
                  return;
               }

               // Randomly increment the progress every few moments until it's at 100 percent
               var delay = (this.averageUploadTimeSecs * 1000) / 100;
               request.readyState = 4; // Set the response to pretend to be completed, so Sinon doesn't send its own responses and close it before we finish
               for (var i = 1; i < 100; i += Math.round(Math.random() * 10)) {
                  this.sendProgress(request, i, i * delay);
               }

               // After progress has finished, send the final response
               setTimeout(function() {
                  request.readyState = 1; // Sinon won't send response unless it thinks the response is clean and only just opened
                  request.respond(this.responseCode, headers, body);
               }, i * delay);

            }));
         } catch (e) {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      },

      /**
       * Send a progress response asynchronously.
       *
       * @instance
       * @param {object} request The request object
       * @param {number} percent The percentage progress to send
       * @param {number} delay The delay, in milliseconds, until the progress is sent
       */
      sendProgress: function(request, percent, delay) {
         setTimeout(function() {
            request.uploadProgress({
               total: 100,
               loaded: percent
            });
         }, delay);
      }
   });
});