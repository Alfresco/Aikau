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
 * @module aikau/layout/Drawer
 * @extends module:aikau/mdl/BaseMdlWidget
 * @author Dave Draper
 * @since 1.0.NEXT
 */
define(["dojo/_base/declare",
        "aikau/mdl/BaseMdlWidget", 
        "dojo/text!./templates/Drawer.html", 
        "dojo/text!./templates/FixedDrawer.html"], 
        function(declare, BaseMdlWidget, drawerTemplate, fixedDrawerTemplate) {
   
   return declare([BaseMdlWidget], {

      /**
       * Indicates whether or not the drawer is fixed into position (i.e. it is always visible)
       * or whether it flies out when an icon is clicked.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      fixed: false,

      /**
       * 
       * @instance
       */
      postMixInProperties: function aikau_layout_Drawer__postMixInProperties() {
         this.inherited(arguments);
         
         if (this.fixed)
         {
            this.templateString = fixedDrawerTemplate;
         }
         else
         {
            this.templateString  = drawerTemplate;
         }
      },

      /**
       * 
       * @instance
       */
      postCreate: function aikau_layout_Drawer__postCreate() {
         this._targetNode = this.nodeForChildren;
         this.inherited(arguments);
      }
   });
});