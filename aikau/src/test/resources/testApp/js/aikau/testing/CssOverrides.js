/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This module provides two main functions. Firstly it provides debugging capabilities for publication/subscription 
 * events. Secondly it provides a tool for use in unit testing that Selenium WebDriver can use to capture events
 * that occur to validate correct widget behaviour.
 *
 * @module aikauTesting/CssOverrides
 * @extends external:dijit/_WidgetBase
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase"
        ], 
        function(declare, _Widget) {
   
   return declare([_Widget], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/CssOverrides.css"}]
       */
      cssRequirements: [{cssFile:"./css/CssOverrides.css"}]

   });
});