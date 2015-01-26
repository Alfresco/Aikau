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
 * @module alfresco/header/AlfMenuBar
 * @extends module:alfresco/menus/AlfMenuBar
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBar"], 
        function(declare, AlfMenuBar) {
   
   /**
    * Extend the default alfresco/menus/AlfMenuBar implementation to set specific CSS for the menus.
    * TODO: This will actually affect ALL of the menus unless we add an additional CSS classes to the nodes - check the CSS selectors
    */
   return declare([AlfMenuBar], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfMenuBar.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfMenuBar.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfMenuBar.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfMenuBar.properties"}]
   });
});