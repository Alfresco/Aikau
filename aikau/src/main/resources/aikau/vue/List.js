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
 * @module aikau/vue/List
 * @extends module:aikau/vue/Base
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/vue/Base",
        "dojo/text!./templates/List.html",
        "dojo/_base/lang",
        "dojo/request/xhr"], 
        function(declare, Base, template, lang, xhr) {
   
   return declare([Base], {

      getComponentElement: function aikau_vue_List__getComponentElement() {
         return "list";
      },

      getComponent: function aikau_vue_List__getComponent() {
         return {

            template: template,

            data: function() {
               return {
                  skipCount: 0,
                  maxItems: 3,
                  relativePath: "/",
                  list: {
                     pagination: {
                        skipCount: 0,
                        maxItems: 3
                     }
                  }
               };
            },

            beforeMount: function() {
               this.getData();
            },
      
            methods: {
               
               pageBack: function() {
                  if (this.list.pagination.skipCount)
                  {
                     this.skipCount -= this.maxItems;
                     this.getData();
                  }
               },
               pageForward: function() {
                  if (this.list.pagination.hasMoreItems)
                  {
                     this.skipCount += this.maxItems;
                     this.getData();
                  }
               },

               getData: function() {
                  xhr("/share/proxy/alfresco-api/-default-/public/alfresco/versions/1/nodes/-root-/children" +
                      "?include=path" + 
                      "&skipCount=" + this.skipCount + 
                      "&maxItems=" + this.maxItems + 
                      "&relativePath=" + this.relativePath,
                      {
                        handleAs: "json"
                      })

                     .then(lang.hitch(this, function(response) {
                        this.list = response.list;
                     }));
               },

               navigate: function(evt) {
                  var item = evt.detail;
                  this.skipCount = 0;
                  this.relativePath += (item.entry.name + "/");
                  this.getData();
               },

               setRelativePath: function(evt) {
                  var relativePath = evt.detail;
                  this.skipCount = 0;
                  this.relativePath = relativePath;
                  this.getData();
               }
            }
         };
      }
   });
});