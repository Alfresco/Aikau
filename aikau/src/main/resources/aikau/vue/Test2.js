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
 * 
 * 
 * @module aikau/vue/Test2
 * @extends external:dijit/_WidgetBase
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/vue/Base"], 
        function(declare, Base) {
   
   return declare([Base], {

      getComponent: function aikau_vue_Test1__getComponent() {
         return {
            data: function() {
               return {
                  parentMsg: ""
               };
            },

            created: function() {
               console.info("Handling from 2");
               this.$on("vueEvent", function () {
                 console.info("Test 2");
               });
            },

            methods: {
               onVueEvent: function(evt) {
                  console.info("Test 3 received event");
               }
            }
         };
      },

      getComponentElement: function aikau_vue_Test2__getComponentElement() {
         return "test2";
      },

      // getComponentProps: function aikau_vue_Test2__getComponentProps() {
      //    return [];
      // },

      // getComponentMethods: function aikau_vue_Test2_getComponentMethods() {
      //    return {
      //       onVueEvent: function(evt) {
      //          console.info("Test 2 received event");
      //       }
      //    };
      // },

      // getComponentData: function aikau_vue_Test2__getComponentData() {
      //    return 
      // },

      getComponentTemplate: function aikau_vue_Test2__getComponentTemplate() {
         return "<div @vueEvent='onVueEvent'><span>Hello</span><input v-model='parentMsg'><span>{{ parentMsg }}</span>${widgets_slot}</div>";
      }
   });
});