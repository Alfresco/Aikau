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
 * @module aikau/vue/Breadcrumb
 * @extends module:aikau/vue/Base
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/vue/Base",
        "dojo/text!./templates/Breadcrumb.html"], 
        function(declare, Base, template) {
   
   function createBreadcrumbs(input) {
      var lastPathElement = "/";
      var breadcrumbs = [{
         label: "Home",
         relativePath: lastPathElement
      }];
      input.relativePath
         .split("/")
         .filter(function(name) {
            return name.trim() !== "";
         })
         .forEach(function(pathElement) {
            var currRelativePath = lastPathElement + pathElement + "/";
            breadcrumbs.push({
               label: pathElement,
               relativePath: currRelativePath
            });
            lastPathElement = currRelativePath;
         });
      return {
         lastPathElement: lastPathElement,
         breadcrumbs: breadcrumbs
      };
   }

   return declare([Base], {

      getComponentElement: function() {
         return "breadcrumb";
      },

      getComponent: function aikau_vue_Breadcrumb__getComponent() {
         return {

            template: template,

            props: ["relativePath"],

            watch: {
               relativePath: function() {
                  var breadcrumbData = createBreadcrumbs({
                     relativePath: this.relativePath
                  });
                  this.breadcrumbs = breadcrumbData.breadcrumbs;
               }
            },

            methods: {
               navigate: function(breadcrumb) {
                  var changeEvent = new CustomEvent("setRelativePath", {
                     detail: breadcrumb.relativePath,
                     bubbles: true
                  });
                  this.$el.dispatchEvent(changeEvent);
               }
            }
         };
      }
   });
});