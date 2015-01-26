/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @module aikauTesting/mockservices/MockCrudService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang"],
   function(declare, AlfCore, lang) {

      return declare([AlfCore], {

         /**
          *
          *
          * @instance
          * @param {array} args The constructor arguments.
          */
         constructor: function alfresco_testing_mockservices_MockCrudService__constructor(args) {
            lang.mixin(this, args);
            this.alfSubscribe("ALF_CRUD_UPDATE", lang.hitch(this, this.onUpdate));
         },

         /**
          * @instance
          */
         onUpdate: function alfresco_testing_mockservices_MockCrudService__onUpdate(payload) {
            var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : "NO_ALF_RESPONSE_TOPIC",
                response = {};

            var suffix = (payload.succeed != null && payload.succeed === false) ? "_FAILURE" : "_SUCCESS"
            // Publish the response
            this.alfPublish(alfTopic + suffix, {
               response: response
            });
         }
      });
   });
