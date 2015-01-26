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
 * Provides a "Response Web Design" solution for widgets. This can be mixed in to widget definitions
 * to allow minimum and maximum browser window widths that the widget will be displayed for. The 
 * idea is that different widgets providing the same function are declared in different places within
 * the page model that all have different [minRwdWidth]{@link module:alfresco/core/CoreRwd#minRwdWidth}
 * and [maxRwdWidth]{@link module:alfresco/core/CoreRwd#maxRwdWidth} values configured so that the user
 * is able to use different controls in different functions. For example; a line of menu bar items
 * may have an alternative rendering as a single popup menu bar item.
 * 
 * @module alfresco/core/CoreRwd
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/on",
        "dojo/dom-geometry",
        "dojo/window",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, on, domGeom, win, lang, domClass) {
   
   return declare(null, {
      
      /**
       * The minimum width (in pixels) that the browser window needs to be for the widgets
       * root DOM node to be displayed.
       * 
       * @instance
       * @type {number}
       * @default null
       */
      minRwdWidth: null,
      
      /**
       * The maximum width (in pixels) that the browser window needs to be for the widgets
       * root DOM node to be displayed.
       * 
       * @instance
       * @type {number}
       * @default null
       */
      maxRwdWidth: null,
      
      /**
       * Extends the super class implementation to set up an event handler for changes to the browser
       * window size. The [applyRwd]{@link module:alfresco/core/CoreRwd#applyRwd} function will be
       * called on window resize events and is also called immediately to initialise the visibility
       * of the widget.
       * 
       * @instance
       */
      postCreate: function alfresco_core_CoreRwd__postCreate() {
         this.inherited(arguments);
         
         if (this.domNode != null && (this.minRwdWidth != null || this.maxRwdWidth != null))
         {
            // Keep track of the overall browser window changing in size...
            on(window, "resize", lang.hitch(this, "applyRwd"));
            this.applyRwd();
         }
      },
      
      /**
       * Gets the current size of the browser window and either hides or shows the widgets root
       * DOM element depending upon the configured [minRwdWidth]{@link module:alfresco/core/CoreRwd#minRwdWidth}
       * and [maxRwdWidth]{@link module:alfresco/core/CoreRwd#maxRwdWidth} values. If the current
       * window width is bigger than the minimum allowed and less that the maximum allowed then
       * the widget will be displayed.
       * 
       * @instance
       */
      applyRwd: function alfresco_core_CoreRwd__applyRwd() {
         var winBox = win.getBox();
         if ((this.minRwdWidth == null && winBox.w < this.maxRwdWidth) ||
             (this.maxRwdWidth == null && winBox.w > this.minRwdWidth) ||
             (winBox.w > this.minRwdWidth && winBox.w < this.maxRwdWidth))
         {
            domClass.remove(this.domNode, "hidden");
         }
         else
         {
            domClass.add(this.domNode, "hidden");
         }
      }
   });
});