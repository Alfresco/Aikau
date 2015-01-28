/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * @module aikauTesting/mockservices/DojoSelectTestOptions
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
      constructor: function alfresco_testing_mockservices_DojoSelectTestOptions__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("GET_OPTIONS_FOR_SELECT_2", lang.hitch(this, "getOptionsForSelect2"));
         this.alfSubscribe("GET_OPTIONS_FOR_SELECT_4", lang.hitch(this, "getOptionsForSelect4"));

         this.select2Count = 0;
         this.select4Count = 0;
      },
      
      /**
       * 
       * @instance
       * @param {object} payload
       */
      getOptionsForSelect2: function alfresco_testing_mockservices_DojoSelectTestOptions__getOptionsForSelect2(payload) {
         this.select2Count++;
         this.alfPublish(payload.responseTopic, {
            options: [
               {
                  "label": "Update1_" + this.select2Count,
                  "value": "Value1_" + this.select2Count
               },
               {
                  "label": "Update2_" + this.select2Count,
                  "value": "Value2_" + this.select2Count
               }
            ]
         })
      },

      /**
       * 
       * @instance
       * @param {object} payload
       */
      getOptionsForSelect4: function alfresco_testing_mockservices_DojoSelectTestOptions__getOptionsForSelect4(payload) {
         this.select4Count++;
         this.alfPublish(payload.responseTopic, {
            options: [
               {
                  "label": "Update1_" + this.select4Count,
                  "value": "Value1_" + this.select4Count
               },
               {
                  "label": "Update2_" + this.select4Count,
                  "value": "Value2_" + this.select4Count
               }
            ]
         })
      }
   });
});
