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
 * Extends the [LeftAndRight]{@link module:alfresco/layout/LeftAndRight} widget to ensure that specific CSS selectors
 * are included on the page. This widget was created to support the 
 * [AlfGalleryView]{@link module:alfresco/documentlibrary/views/AlfGalleryView} which publishes a request to 
 * render an [AlfGalleryViewSlider]{@link module:alfresco/documentlibrary/AlfGalleryViewSlider} and this widget can be
 * included on the page as a place for it to be displayed.
 * 
 * @module alfresco/documentlibrary/AlfToolbar
 * @extends module:alfresco/layout/LeftAndRight
 * @mixes module:alfresco/core/DynamicWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/layout/LeftAndRight",
        "alfresco/core/DynamicWidgetProcessing",
        "dojo/dom-class",
        "dojo/dom-construct"], 
        function(declare, LeftAndRight, DynamicWidgetProcessing, domClass, domConstruct) {
   
   return declare([LeftAndRight, DynamicWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfToolbar.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfToolbar.css"}],
      
      /**
       * Adds the "alfresco-documentlibrary-AlfToolbar" CSS class to the DOM node.
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfToolbar__postCreate() {
         this.inherited(arguments);
         domClass.add(this.domNode, "alfresco-documentlibrary-AlfToolbar");
      },

      /**
       * This has been added to provide support for dynamically adding widgets into the toolbar.
       * 
       * @instance
       * @param {object} widget The widget to add
       * @param {number} insertIndex The index at which to add the widget.
       */
      addChild: function alfresco_documentlibrary_AlfToolbar__addChild(widget, /*jshint unused:false*/ insertIndex) {
         domConstruct.place(widget.domNode, this.rightWidgets, "last");
      }
   });
});