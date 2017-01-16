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
 * @module aikau/vue/ListView
 * @extends module:aikau/vue/Base
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/vue/Base",
        "dojo/text!./templates/ListView.html"], 
        function(declare, Base, template) {
   
   return declare([Base], {

      getComponentElement: function() {
         return "list-view";
      },

      getComponent: function aikau_vue_Test1__getComponent() {
         return {

            template: template,

            props: ["list"],

            methods: {
               navigate: function(item) {
                  if (item.entry.isFolder)
                  {
                     var changeEvent = new CustomEvent("navigate", {
                        detail: item,
                        bubbles: true
                     });
                     this.$el.dispatchEvent(changeEvent);
                  }
               }
            }
         };
      }
   });
});