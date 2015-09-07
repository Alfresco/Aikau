/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * This mixin module provides functions for setting the height of a widget based on a configured 
 * [heightMode]{@link module:alfresco/layout/HeightMixin#heightMode} attribute. By default the standard
 * approach is for the height to consume the available space from it's initial position down to the
 * bottom of the screen (assuming the page is initially displayed from the start of the page). However
 * it is also possible to specify that the height should be taken from a 
 * [dialog]{@link module:alfresco/dialogs/AlfDialog} in which the widget is placed or for it to be
 * given a specific height or (if a negative value is provided) for a number of pixels to be deducted
 * from the available height.
 * 
 * @module alfresco/core/HeightMixin
 * @author Dave Draper
 * @since 1.0.34
 */
define(["dojo/_base/declare",
        "dojo/aspect",
        "dojo/_base/lang",
        "dojo/Deferred",
        "dojo/dom-style",
        "dojo/when",
        "dojo/window",
        "dijit/registry",
        "jquery",
        "jqueryui"], 
        function(declare, aspect, lang, Deferred, domStyle, when, win, registry, $) {
   
   return declare([], {
      
      /**
       * This property allows the height of the sidebar to accommodate a "sticky" footer. The height is otherwise calculated as
       * the height of the view port minus the top position of the DOM element having its height set. By setting this property 
       * it is possible to also deduct the height of a sticky footer. 
       * 
       * @instance
       * @type {number} 
       * @default
       */
      footerHeight: 0,
      
      /**
       * <p>This should be configured to indicate how the height of the widget should be calculated.
       *   <ul>
       *     <li>"AUTO" (the default) indicates that the height will be calculated to be the available space from the widgets position
       * to the bottom of the screen (minus any [footerHeight]{@link module:alfresco/layout/HeightMixin#footerHeight}).<li>
       *     <li>"DIALOG" indicates that the height should be taken from the available height of the dialog in which the widget
       * is displayed.</li>
       *     <li>Any negative number indicates that the "AUTO" height minus the supplied value will be used.</li>
       *     <li>Any positive number indicates a fixed height (in pixels) that should be used for the height</li>
       *   </ul>
       * </p>
       * 
       * @instance
       * @type {string|number}
       * @default
       */
      heightMode: "AUTO",

      /**
       * Calculates the height of the supplied element based on the available space using the configured 
       * [heightMode]{@link module:alfresco/layout/HeightMixin#heightMode} setting.
       * 
       * @instance
       * @param {element} domNode The DOM element to calculate the height for.
       * @returns {number|promise} Either an actual height or a promise of the height (when using the "DIALOG" height mode)
       */
      calculateHeight: function alfresco_layout_HeightMixin__calculateHeight(domNode) {
         var calculatedHeight;
         if (domNode)
         {
            // Get the position of the DOM node and the available view port height...
            var winBox = win.getBox();
            
            // We're using JQuery here to get the offset as it has proved more reliable than either the Dojo margin box
            // or native browser offsetTop options...
            var offset = $(domNode).offset().top;
            var availableHeight = winBox.h - offset - this.footerHeight;
            var heightMode = this.heightMode;
            if (heightMode === "DIALOG")
            {
               calculatedHeight = $(domNode).parentsUntil(".alfresco-dialog-AlfDialog").last().innerHeight();
               if (!calculatedHeight)
               {
                  // When using the DIALOG mode it is necessary to return a promise of the height because it won't 
                  // be possible to know the height until the dialog is displayed.
                  var containingDialog = registry.byNode($(domNode).parents(".alfresco-dialog-AlfDialog")[0]);
                  if (containingDialog)
                  {
                     calculatedHeight = new Deferred();
                     this.own(aspect.after(containingDialog, "_onFocus", function() {
                        var dialogHeight = $(domNode).parentsUntil(".alfresco-dialog-AlfDialog").last().innerHeight();
                        calculatedHeight.resolve(dialogHeight);
                     }, true));
                  }
               }
            }
            else if (!heightMode || heightMode === "AUTO" || isNaN(heightMode))
            {
               calculatedHeight =  availableHeight;
            }
            else if (heightMode < 0)
            {
               // If the height mode is a number less than zero, then deduct that height from the available space.
               calculatedHeight = availableHeight + heightMode; // NOTE: Not a mistake, remember adding a negative number substracts! :)
            }
            else
            {
               calculatedHeight = heightMode;
            }
         }
         return calculatedHeight;
      },

      /**
       * This sets the height of the supplied DOM element with the height returned from a call to the
       * [calculateHeight]{@link module:alfresco/layout/HeightMixin#calculateHeight} function.
       * 
       * @instance
       * @param {element} domNode The DOM element to set the height for.
       */
      setHeight: function alfresco_layout_HeightMixin__setHeight(domNode) {
         var height = this.calculateHeight(domNode);
         if (height || height === 0)
         {
            when(height, lang.hitch(this, function(value) {
               domStyle.set(domNode, "height", value + "px");
            }));
         }
      }
   });
});