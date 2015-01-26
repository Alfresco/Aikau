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
 * Handles requests retrieve documents from the repository and publishes the details of them when they're
 * retrieved.
 * 
 * @module alfresco/services/QuaddsService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/json"],
        function(declare, AlfCore, CoreXhr, AlfConstants, lang, array, dojoJson) {
   
   return declare([AlfCore, CoreXhr], {
      
      /**
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_QuaddsService__constructor(args) {
         lang.mixin(this, args);

         this.alfSubscribe("ALF_GET_ALL_QUADDS", lang.hitch(this, "onGetAllQuadds"));
         this.alfSubscribe("ALF_GET_QUADDS_ITEMS", lang.hitch(this, "onGetQuaddsItems"));
         this.alfSubscribe("ALF_GET_QUADDS_ITEM", lang.hitch(this, "onGetQuaddsItem"));
         this.alfSubscribe("ALF_CREATE_QUADDS_ITEM", lang.hitch(this, "onCreateQuaddsItem"));
         this.alfSubscribe("ALF_UPDATE_QUADDS_ITEM", lang.hitch(this, "onUpdateQuaddsItem"));
         this.alfSubscribe("ALF_DELETE_QUADDS_ITEM", lang.hitch(this, "onDeleteQuaddsItem"));
      },
      
      /**
       * Parses the data JSON string back into an object.
       * @instance
       */
      processQuaddItemData: function alfresco_services_QuaddsService__processQuaddItemData(response, originalRequestConfig) {
         var responseTopic = lang.getObject("alfTopic", false, originalRequestConfig);
         if (responseTopic != null)
         {

            this.alfLog("log", "Processing QuADDS data", response, originalRequestConfig, this);

            array.forEach(response.items, function(item, index) {
               try
               {
                  item.data = dojoJson.parse(item.data, true);
               }
               catch (e) 
               {
                  this.alfLog("warn", "Could not process QuADDS data", item.data);
               }
            });

            this.alfPublish(responseTopic + "_SUCCESS", response);
         }
         else
         {
            this.alfLog("error", "It was not possible to publish requested QuADDS data because the 'responseTopic' attribute was not set on the original request", response, originalRequestConfig);
         }
      },

      /**
       * Parses the data JSON string back into an object.
       * @instance
       */
      refreshRequest: function alfresco_services_QuaddsService__refreshRequest(response, originalRequestConfig) {
         var responseTopic = lang.getObject("alfTopic", false, originalRequestConfig);
         if (responseTopic != null)
         {
            this.alfPublish(responseTopic + "_SUCCESS", response);
         }
         else
         {
            this.alfLog("warn", "It was not possible to publish requested QuADDS data because the 'responseTopic' attribute was not set on the original request", response, originalRequestConfig);
         }
         // TODO: Need a context sensitive, localized message...
         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: "Operation Completed Successfully"
         });
         this.alfPublish("ALF_DOCLIST_RELOAD_DATA");
      },

      /**
       * Gets information about all the QuADDS (Quick And Dirty Data Structures) that exist (but not
       * the individual data items in those structures).
       * 
       * @instance
       * @param {object} payload 
       */
      onGetAllQuadds: function alfresco_services_QuaddsService__onGetAllQuadds(payload) {
         var url = AlfConstants.PROXY_URI + "aikau/quadds";
         this.serviceXhr({url : url,
                          method: "GET"});
      },

      /**
       * Gets all the items for a particular QuADDS (Quick And Dirty Data Structure)
       *
       * @instance
       * @param {object} payload 
       */
      onGetQuaddsItems: function alfresco_services_QuaddsService__onGetQuaddsItems(payload) {
         var quadds = lang.getObject("quadds", false, payload);
         if (quadds == null || lang.trim(quadds) === "")
         {
            this.alfLog("warn", "A request was made to retrieve the data items from a QuADDS but no QuADDS was provided", payload, this);
         }
         else
         {
            var url = AlfConstants.PROXY_URI + "aikau/quadds/" + lang.trim(quadds);
            this.serviceXhr({url : url,
                             alfTopic: payload.alfResponseTopic != null ? payload.alfResponseTopic : payload.alfTopic,
                             method: "GET",
                             successCallback: this.processQuaddItemData,
                             callbackScope: this});
         }
      },

      /**
       * Gets a specific item from a QuADDS (Quick And Dirty Data Structure)
       *
       * @instance
       * @param {object} payload 
       */
      onGetQuaddsItem: function alfresco_services_QuaddsService__onGetQuaddsItem(payload) {
         var quadds = lang.getObject("quadds", false, payload);
         var name = lang.getObject("name", false, payload);
         if (quadds == null || quadds === "")
         {
            this.alfLog("warn", "A request was made to retrieve a data item from a QuADDS but no QuADDS was provided", payload, this);
         }
         else if (name == null || lang.trim(name) === "")
         {
            this.alfLog("warn", "A request was made to retrieve a data item from a QuADDS but no item name was provided", payload, this);
         }
         else
         {
            var url = AlfConstants.PROXY_URI + "aikau/quadds/" + lang.trim(quadds) + "/item/" + lang.trim(name);
            this.serviceXhr({url : url,
                             alfTopic: payload.alfResponseTopic != null ? payload.alfResponseTopic : payload.alfTopic,
                             method: "GET",
                             successCallback: this.processQuaddItemData,
                             callbackScope: this});
         }
      },

      /**
       * Creates a new item in a QuADDS (Quick And Dirty Data Structure)
       * 
       * @instance
       * @param {object} payload 
       */
      onCreateQuaddsItem: function alfresco_services_QuaddsService__onCreateQuaddsItem(payload) {
         var quadds = lang.getObject("quadds", false, payload);
         var name = lang.getObject("name", false, payload);
         var data = lang.getObject("data", false, payload);
         if (quadds == null || lang.trim(quadds) === "")
         {
            this.alfLog("warn", "A request was made to create a data item in a QuADDS but no QuADDS was provided", payload, this);
         }
         else if (name == null || lang.trim(name) === "")
         {
            this.alfLog("warn", "A request was made to create a data item in a QuADDS but no item name was provided", payload, this);
         }
         else if (data == null)
         {
            this.alfLog("warn", "A request was made to create a data item in a QuADDS but no data was provided", payload, this);
         }
         else
         {
            var url = AlfConstants.PROXY_URI + "aikau/quadds/" + lang.trim(quadds);
            var config = {
               name: name,
               data: data
            };
            this.serviceXhr({url : url,
                             data: config,
                             method: "POST",
                             alfTopic: payload.alfResponseTopic != null ? payload.alfResponseTopic : payload.alfTopic,
                             successCallback: this.refreshRequest,
                             callbackScope: this});
         }
      },

      /**
       *
       * @instance
       * @param {object} payload 
       */
      onUpdateQuaddsItem: function alfresco_services_QuaddsService__onUpdateQuaddsItem(payload) {
         var quadds = lang.getObject("quadds", false, payload);
         var name = lang.getObject("name", false, payload);
         var data = lang.getObject("data", false, payload);
         if (quadds == null || lang.trim(quadds) === "")
         {
            this.alfLog("warn", "A request was made to update a data item in a QuADDS but no QuADDS was provided", payload, this);
         }
         else if (name == null || lang.trim(name) === "")
         {
            this.alfLog("warn", "A request was made to update a data item in a QuADDS but no item name was provided", payload, this);
         }
         else if (data == null)
         {
            this.alfLog("warn", "A request was made to update a data item in a QuADDS but no data was provided", payload, this);
         }
         else
         {
            var url = AlfConstants.PROXY_URI + "aikau/quadds/" + lang.trim(quadds) + "/item/" + lang.trim(name);
            var config = {
               name: name,
               data: data
            };
            this.serviceXhr({url : url,
                             data: config,
                             method: "PUT",
                             alfTopic: payload.alfResponseTopic != null ? payload.alfResponseTopic : payload.alfTopic,
                             successCallback: this.refreshRequest,
                             callbackScope: this});
         }
      },

      /**
       *
       * @instance
       * @param {object} payload 
       */
      onDeleteQuaddsItem: function alfresco_services_QuaddsService__onDeleteQuaddsItem(payload) {
         var quadds = lang.getObject("quadds", false, payload);
         var name = lang.getObject("name", false, payload);
         if (quadds == null || lang.trim(quadds) === "")
         {
            this.alfLog("warn", "A request was made to delete a data item from a QuADDS but no QuADDS was provided", payload, this);
         }
         else if (name == null || lang.trim(name) === "")
         {
            this.alfLog("warn", "A request was made to delete a data item from a QuADDS but no item name was provided", payload, this);
         }
         else
         {
            var url = AlfConstants.PROXY_URI + "aikau/quadds/" + lang.trim(quadds) + "/item/" + lang.trim(name);
            this.serviceXhr({url : url,
                             method: "DELETE",
                             alfTopic: payload.alfResponseTopic != null ? payload.alfResponseTopic : payload.alfTopic,
                             successCallback: this.refreshRequest,
                             callbackScope: this});
         }
      }
   });
});