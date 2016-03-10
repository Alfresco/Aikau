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
 * This service accepts widget models and asynchronously generates the dependencies for them.
 * 
 * @module alfresco/services/PreviewService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/services/_PreviewServiceTopicMixin
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/services/_PreviewServiceTopicMixin",
        "dojo/request/xhr",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, BaseService, CoreXhr, _PreviewServiceTopicMixin, xhr, lang, AlfConstants) {
   
   return declare([BaseService, CoreXhr, _PreviewServiceTopicMixin], {
      
      /**
       * Sets up the subscriptions for the PreviewService
       * 
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_PreviewService__registerSubscriptions() {
         this.alfSubscribe(this.requestDependenciesTopic, lang.hitch(this, this.generateDependencies));
      },
      
      /**
       * @instance
       */
      generateDependencies: function alfresco_services_PreviewService__generateDependencies(payload) {
         /*jshint eqnull:true*/
         if (payload != null && payload.model != null)
         {
            // This block (and query below) commented out because JSHint said they were unused .... why unused though? Why are they here?
            // var pageDefObject = JSON.parse(payload.model);
            // var data = {
            //    jsonContent: pageDefObject,
            //    widgets: payload.model
            // };
            
            this.serviceXhr({
               url: AlfConstants.URL_SERVICECONTEXT + "/service/surf/dojo/xhr/dependencies",
               method: "POST",
               query: undefined,//query,
               successCallback: this.generateDependenciesSuccess,
               failureCallback: this.generateDependenciesFailure,
               callbackScope: this
            });
         }
         else
         {
            this.alfLog("error", "A request was made to generate the dependencies for a model, but no 'model' attribute was provided in the request", payload);
         }
      },
      
      /**
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      generateDependenciesSuccess: function alfresco_services_PreviewService__generateDependenciesSuccess(response, originalRequestConfig) {
         this.alfPublish(this.requestDependenciesSuccessTopic, {
            response: response,
            originalRequestConfig: originalRequestConfig
         });
      },
      
      /**
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      generateDependenciesFailure: function alfresco_services_PreviewService__generateDependenciesFailure(response, originalRequestConfig) {
         this.availablePagesLoadFailure(this.requestDependenciesFailureTopic, {
            response: response,
            originalRequestConfig: originalRequestConfig
         });
      }
   });
});