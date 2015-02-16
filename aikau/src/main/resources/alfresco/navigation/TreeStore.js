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
 * @module alfresco/navigation/TreeStore
 * @extends external:dojo/store/JsonRest
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/store/JsonRest", 
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "dojo/Deferred",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, JsonRest, AlfCore, CoreXhr, Deferred, lang, array) {
   
   return declare([JsonRest, AlfCore, CoreXhr], {
      
      /**
       * This is an array of Regular Expressions that should match pathes to show. At least one of the 
       * Regular Expressions in the array needs to pass true for the tree node to be displayed. To show
       * all paths this should be left as null (the default value).
       *
       * @instance
       * @type {array}
       * @default null
       */
      filterPaths: null,

      /**
       * Makes an asynchronous request to retrieve the children of the supplied parent object. It immediately returns
       * a Deferred object that is also passed as part of the request configuration. The Deferred object is resolved
       * by either the success or failure callback handler depending upon the result of the request.
       * 
       * @instance
       * @param {object} object The parent to retrieve the children for
       * @param {object} options The options for the query (these are currently ignored)
       */
      getChildren: function alfresco_navigation_TreeStore__getChildren(object, options) {
         var deferred = new Deferred();
         var config = {
            url: this.target + object.path,
            query: this.targetQueryObject,
            method: "GET",
            deferred: deferred,
            parent: object,
            successCallback: this.onChildRequestSuccess,
            failureCallback: this.onChildRequestFailure,
            callbackScope: this
         };
         this.serviceXhr(config);
         return deferred;
      },
      
      /**
       * This is the success callback from the [getChildren function]{@link module:alfresco/navigation/TreeStore#getChildren}
       * and iterates over the results calling the [updateChild function]{@link module:alfresco/navigation/TreeStore#updateChild} for 
       * each child. Once the data has been processed the Deferred object included in the original request configuration is
       * resolved to indicate to the original caller that the results are available.
       * 
       * @instance
       * @param {object} response The successful response object containing the child items
       * @param {object} originalRequestConfig The configuration object passed when making the request
       */
      onChildRequestSuccess: function alfresco_navigation_TreeStore__onChildRequestSuccess(response, originalRequestConfig) {

         // Update each item to set it's path...
         array.forEach(response.items, lang.hitch(this, "updateChild", originalRequestConfig.parent));
         
         // If required, filter the items based on their paths...
         var filteredResponse = response.items;
         if (this.filterPaths !== null)
         {
            filteredResponse = array.filter(response.items, lang.hitch(this, this.filterChildren));
         }

         // Resolve the promise...
         originalRequestConfig.deferred.resolve(filteredResponse);
      },

      /**
       * Filters the children based on whether or not their "path" attribute matches any of Regular Expression configured in 
       * the [hidePaths]{@link module:alfresco/navigation/TreeStore#hidePaths} attribute.
       *
       * @instance
       * @param {object} item The current item to check
       * @param {number} index The index of the item in the original array
       * @returns {boolean} true if the item should be kept
       */
      filterChildren: function alfresco_navigation_TreeStore__filterChildren(item, index) {
         var include = array.some(this.filterPaths, function(filter) {
            var matches = true;
            try
            {
               var re = new RegExp(filter);
               matches = re.test(item.path);
            }
            catch (e)
            {
               // Ignore failing Regular Expressions
            }
            return matches;
         });
         return include;
      },
      
      /**
       * This is called from the [onChildRequestSuccess function]{@link module:alfresco/navigation/TreeStore#onChildRequestSuccess] for
       * each child retrieved. It allows the opportunity to update the child. By default this will set the "id" attribute of the child
       * as the "nodeRef", the "value" as the "name" and the "path" as the concatenation of the parent path and the child name. Setting
       * the path information is important as it allows further child queries to be processed accurately. 
       * 
       * @instance
       * @param {object} parent The child objects parent
       * @param {object} child The child object to update
       * @param {number} index The index of the child
       */
      updateChild: function alfresco_navigation_TreeStore__updateChild(parent, child, index) {
         child.id = child.nodeRef;
         child.value = child.name;
         child.path = parent.path + child.name + "/";
         
         // Modify the name to be the description for site containers...
         if (child.description && 
             child.aspects && 
             array.some(child.aspects, function(item) { return item === "st:siteContainer"; }))
         {
            child.name = child.description;
         }
      },
      
      /**
       * @instance
       * @param {object} response The failure response object containing the child items
       * @param {object} originalRequestConfig The configuration object passed when making the request
       */
      onChildRequestFailure: function alfresco_navigation_TreeStore__onChildRequestFailure(response, originalRequestConfig) {
         this.alfLog("error", "Could not load children");
         originalRequestConfig.deferred.resolve([]);
      }
   });
});