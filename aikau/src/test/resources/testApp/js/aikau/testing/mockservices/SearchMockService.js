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

define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/text!./responseTemplates/SearchService/alternative.json",
        "dojo/text!./responseTemplates/SearchService/original.json",
        "dojo/text!./responseTemplates/SearchService/default.json"],
        function(declare, AlfCore, lang, alternative, original, base) {
   
   return declare([AlfCore], {
      
      /**
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_testing_mockservices_SearchService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_SEARCH_REQUEST", lang.hitch(this, this.onSearchRequest));
         this.alfSubscribe("ALF_AUTO_SUGGEST_SEARCH", lang.hitch(this, this.onAutoSuggest));
      },

      /**
       *
       * @instance
       * @param {object} payload The payload defining the document to retrieve the details for.
       */
      onSearchRequest: function alfresco_testing_mockservices_SearchService__onSearchRequest(payload) {
         if (payload.term === "hame" && payload.spellcheck === true)
         {
            this.alfPublish("SEARCH_RESULTS_SUCCESS", {
               response: JSON.parse(alternative)
            });
         }
         else if (payload.term === "hame" && payload.spellcheck === false)
         {
            this.alfPublish("SEARCH_RESULTS_SUCCESS", {
               response: JSON.parse(original)
            });
         }
         else
         {
            this.alfPublish("SEARCH_RESULTS_SUCCESS", {
               response: JSON.parse(base)
            });
         }
      }
   });
});