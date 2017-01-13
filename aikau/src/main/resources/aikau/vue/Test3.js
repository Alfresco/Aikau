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
 * @module aikau/vue/Test3
 * @extends module:aikau/vue/Base
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/vue/Base"], 
        function(declare, Base) {
   
   return declare([Base], {

      getComponentElement: function() {
         return "test3";
      },

      getComponentProps: function aikau_vue_Test3__getComponentProps() {
         return ["message","dynamic"];
      },

      getComponentTemplate: function aikau_vue_Test3__getComponentTemplate() {
         return "<div><span>Static: {{ message }}</span><span> Dynamic: {{ dynamic }}</div>";
      }
   });
});