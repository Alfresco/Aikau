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
 * Singleton providing class for a common data model.
 *  
 * @module alfresco/core/CoreData
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/ObjectTypeUtils",
        "dojox/uuid/generateRandomUuid"], 
        function(declare, ObjectTypeUtils, uuid) {

   // This is a simple singleton pattern. Technically there it is still possible to instantiate a new data model,
   // but as the core will always use the singleton and it is expected that all calls will go through the core
   // then this shouldn't be a problem...
   var DataModel = declare(null, {
      
      /**
       * @instance
       */
      root: {},
      
      /**
       * @instance
       */
      callbacks: {},
      
      /**
       * @instance
       * @returns {object[]}
       */
      getDataStoreFriendlyData: function alfresco_core_CoreData__getDataStoreFriendlyData() {
         var data = [{
            root: true,
            id: "ROOT",
            children: this.getDataItems(this.root)
         }];
         return data;
      },
      
      /**
       * Recursing function that converts an object into an array where the value assigned to
       * each key in the object becomes an element in the array. The "_alfValue" and "_alfCallbacks"
       * keys are ignored.  
       * 
       * @instance
       * @param {object} obj The object to convert to an array
       * @returns {object[]} An array of objects
       */
      getDataItems: function alfresco_core_CoreData__getDataItems(obj) {
         var items = [];
         if (ObjectTypeUtils.isObject(obj))
         {
            for (var key in obj)
            {
                  var procData = { id: uuid(), 
                                   label: key, 
                                   type: "path" };
                  var rawData = obj[key];
                  procData.children = this.getDataItems(rawData._alfValue);
                  items.push(procData);
            }
         }
         else
         {
            items.push({id: uuid(), 
                        label: obj + "",
                        type: "value"});
         }
         return items;
      }
   });
   
   var instance; 
   DataModel.getSingleton = function() {
      if (instance == null)
      {
         instance = new DataModel(); 
      }
      return instance;
   };
   return DataModel;
});