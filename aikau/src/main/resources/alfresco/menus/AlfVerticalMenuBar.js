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
 * <p><b>PLEASE NOTE: This widget is still in BETA</b></p>
 * <p>This extends the [horizontal menu bar]{@link module:alfresco/menus/AlfMenuBar} to alter the CSS
 * so that [menu bar items]{@link module:alfresco/menus/AlfMenuBarItem} are rendered in a vertical stack.</p>
 * <p>Although the rendering is implemented the keyboard navigation has not been updated so that the up/down
 * rather then left/right cursor keys are connected for use</p>
 *
 * @module alfresco/menus/AlfVerticalMenuBar
 * @extends module:alfresco/menus/AlfMenuBar
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBar",
        "dojo/_base/array",
        "dojo/dom-class"], 
        function(declare, AlfMenuBar, array, domClass) {

   // TODO: Change the keys connection so that up/down cursor keys move between menu items

   return declare([AlfMenuBar], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/AlfVerticalMenuBar.css"}],
      
      /**
       * Instantiates the MenuBar (a custom declared implementation) and processes the widgets assigned to ensure
       * that the labels are localized before being sent for processing.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuBar__postCreate() {
         this.inherited(arguments);

         domClass.add(this.domNode, "alfresco-menus-AlfVerticalMenuBar");
      },
      
      /**
       * Implements the callback to add all of the widgets into the MenuBar.
       * 
       * @instance
       * @param widgets The widgets that have been successfully instantiated.
       */
      allWidgetsProcessed: function alfresco_menus_AlfMenuBar__allWidgetsProcessed(widgets) {
         var _this = this;
         array.forEach(widgets, function(entry, i) {
            _this._menuBar.addChild(entry);
         });
         this._menuBar.placeAt(this.containerNode);
      }
   });
});