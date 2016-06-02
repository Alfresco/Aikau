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
        "dojo/text!./templates/Alfresco.html",
        "dojo/_base/lang"], 
        function(declare, BaseMdlWidget, template, lang) {
   
   return declare([BaseMdlWidget], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Alfresco.css"}]
       */
      cssRequirements: [{cssFile:"./css/Alfresco.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * 
       * @instance
       */
      postCreate: function aikau_layout_Alfresco__postCreate() {
         this.inherited(arguments);

         this.createChildren({
            widgets: this.widgetsForHeaderLeft,
            targetNode: this.spacerNode,
            targetPosition: "before"
         });
         this.createChildren({
            widgets: this.widgetsForHeaderRight,
            targetNode: this.headerNode
         });
         this.createChildren({
            widgets: this.widgetsForDrawer,
            targetNode: this.drawerNode
         });
         this.createChildren({
            widgets: this.widgetsForToolbar,
            targetNode: this.toolbarNode
         });
         this.createChildren({
            widgets: this.widgetsForContent,
            targetNode: this.contentNode
         });
         this.createChildren({
            widgets: this.widgetsForFixedSearch,
            targetNode: this.fixedSearchNode
         });
      }
   });
});