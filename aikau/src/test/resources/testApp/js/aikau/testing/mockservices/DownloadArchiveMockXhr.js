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
 *
 * @module aikauTesting/DownloadArchiveMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/io-query",
        "alfresco/testing/MockXhr"], 
        function(declare, lang, array, ioQuery, MockXhr) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_DownloadArchiveMockXhr__setupServer() {
         try
         {
            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/api/internal/downloads",
                                    lang.hitch(this, this.createArchive));
            this.server.respondWith("GET",
                                    /\/proxy\/alfresco\/api\/internal\/downloads\/workspace\/(.*)/,
                                    lang.hitch(this, this.reportProgress));
            this.server.respondWith("DELETE",
                                    /\/proxy\/alfresco\/api\/internal\/downloads\/workspace\/(.*)/,
                                    lang.hitch(this, this.deleteArchive));
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
         this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
      },

      /**
       * Simulates the initialization of archive generation.
       *
       * @instance
       */
      createArchive: function alfresco_testing_DownloadArchiveMockXhr__createArchive(request) {
         var body = JSON.parse(request.requestBody);

         // This widget is only intended to service a single request at a time, so we're just going
         // to store the number of nodes as an instance variable...
         this.bodyCount = body.length;

         this.startTime = new Date().getTime();

         var response = {
            status: "success",
            nodeRef: "workspace://SpacesStore/39027595-cf27-4ffa-b22d-00ba156c0c8e"
         };
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      },

      /**
       * Simulates getting a progress report on archive generation.
       *
       * @instance
       */
      reportProgress: function alfresco_testing_DownloadArchiveMockXhr__reportProgress(request) {
         var response;
         var delayToCompletion = 1000;
         var finishTime = this.startTime + delayToCompletion;
         var timeNow = new Date().getTime();
         if (timeNow > this.startTime + delayToCompletion)
         {
            response = {
               status: "DONE",
               done: finishTime,
               total: finishTime,
               filesAdded: this.bodyCount,
               totalFiles: this.bodyCount
            };
         }
         else
         {
            var filesAdded = Math.floor((timeNow / finishTime) * this.bodyCount);
            response = {
               status: "IN_PROGRESS",
               done: timeNow,
               total: this.startTime + delayToCompletion,
               filesAdded: filesAdded,
               totalFiles: this.bodyCount
            };
         }

         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      },

      /**
       * Simulates the response when requesting that the archive is deleted
       *
       * @instance
       */
      deleteArchive: function alfresco_testing_DownloadArchiveMockXhr__deleteArchive(request) {
         var response = {
             status: "success",
             nodeRef: "workspace://SpacesStore/39027595-cf27-4ffa-b22d-00ba156c0c8e"
         };
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      }
   });
});
