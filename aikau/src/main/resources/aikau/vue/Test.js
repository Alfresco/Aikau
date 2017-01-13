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
 * @module aikau/vue/Test
 * @extends module:aikau/vue/Base
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/vue/Base"], 
        function(declare, Base) {
   
   return declare([Base], {

      getComponent: function aikau_vue_Test1__getComponent() {
         return {
            mounted: function() {
               console.info("Handling from 1");
               this.$on("vueEvent", function () {
                 console.info("Test 1");
               });

               this.$el.addEventListener("navigate", function() {
                  console.info("Gone native");
               });
            },

            methods: {
               onVueEvent: function(evt) {
                  console.info("Test 1 received event");
               }
            }
         };
      },

      getComponentElement: function() {
         return "test";
      },

      // getComponentProps: function aikau_vue_Test1__getComponentProps() {
      //    return [];
      // },

      // getComponentMethods: function aikau_vue_Test1_getComponentMethods() {
      //    return {
      //       onVueEvent: function(evt) {
      //          console.info("Test 1 received event");
      //       }
      //    };
      // },

      getComponentTemplate: function aikau_vue_Test1__getComponentTemplate() {
         return "<div @vueEvent='onVueEvent'><span>Test1</span>${widgets_slot}</div>";
      }
   });
});