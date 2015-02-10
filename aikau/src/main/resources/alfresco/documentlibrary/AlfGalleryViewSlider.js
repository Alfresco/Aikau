/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This module was created to support the [Gallery View]{@link module:alfresco/documentlibrary/views/AlfGalleryView}
 * to allow thumbnails to be resized.
 * 
 * @module alfresco/documentlibrary/AlfGalleryViewSlider
 * @extends external:dijit/form/HorizontalSlider
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/lists/views/_AlfAdditionalViewControlMixin
 * @mixed module:alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/form/HorizontalSlider",
        "alfresco/core/Core",
        "alfresco/lists/views/_AlfAdditionalViewControlMixin",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "dojo/dom-class",
        "dojo/dom-style"], 
        function(declare, HorizontalSlider, AlfCore, _AlfAdditionalViewControlMixin, _PreferenceServiceTopicMixin, domClass, domStyle) {
   
   return declare([HorizontalSlider, AlfCore, _AlfAdditionalViewControlMixin, _PreferenceServiceTopicMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfGalleryViewSlider.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfGalleryViewSlider.css"}],
      
      /**
       * Indicates whether or not to show the bigger/smaller buttons at either end of the slider
       * @instance
       * @type {boolean}
       * @default true
       */
      showButtons: true,
      
      /**
       * The minimum value on the slider
       * @instance
       * @type {number} 
       * @default 0
       */
      minimum: 0,
      
      /**
       * The maximum value on the slider.
       * @instance
       * @type {integer}
       * @default 60 
       */
      maximum: 60,
      
      /**
       * The number of steps (including the beginning and end positions) on the slider
       * @instance
       * @type {integer}
       * @default 4 
       */
      discreteValues: 4,
         
      /**
       * 
       * @instance
       * @fires getPreferenceTopic
       */
      postCreate: function alfresco_documentlibrary_AlfGalleryViewSlider__postCreate() {
         this.inherited(arguments);
         domClass.add(this.domNode, "alfresco-documentlibrary-AlfGalleryViewSlider");
         this.set("value", this.getSliderValueFromColumns(this.columns));
         this.alfPublish(this.getPreferenceTopic, {
            preference: "org.alfresco.share.documentList.galleryColumns",
            callback: this.setColumns,
            callbackScope: this
         });
      },
      
      /**
       * The number of columns to be represented by the slider.
       *
       * @instance
       * @type {number}
       * @default 4
       */
      columns: 4,

      /**
       * @instance
       * @param {number} value The number of columns to set.
       */
      setColumns: function(value) {
         if (value == null)
         {
            value = 4;
         }
         this.columns = value;
         this.set("value", this.getSliderValueFromColumns(this.columns));
      },
      
      /**
       * Maps the value provided by the slider to the number of columns that the gallery view should display.
       * 
       * @instance
       * @return {number} The number of columns to display.
       */
      getColumnsFromSliderValue: function alfresco_documentlibrary_AlfGalleryViewSlider__getColumnsFromSliderValue(input) {
         switch(input)
         {
            case 0:
              return 10;
            case 20:
              return 7;
            case 40:
               return 4;
            case 60:
               return 3;
         } 
      },
      
      /**
       * Maps the columns provided to the value for the slider.
       */
      getSliderValueFromColumns: function alfresco_documentlibrary_AlfGalleryViewSlider__getSliderValueFromColumns(input) {
         switch(input)
         {
            case 10:
              return 0;
            case 7:
              return 20;
            case 4:
               return 40;
            case 3:
               return 60;
         } 
      },
      
      /**
       *
       * @instance
       * @param {number} value The value provided from the change to the slider.
       * @fires ALF_DOCLIST_SET_GALLERY_COLUMNS
       * @fires setPreferenceTopic
       */
      onChange: function alfresco_documentlibrary_AlfGalleryViewSlider__onChange(value) {
         var columns = this.getColumnsFromSliderValue(value);
         this.alfPublish("ALF_DOCLIST_SET_GALLERY_COLUMNS", {
            value: columns
         });
         this.alfPublish(this.setPreferenceTopic, {
            preference: "org.alfresco.share.documentList.galleryColumns",
            value: columns
         });
         this.columns = columns;
      },
      
      /**
       * This method is required in order for the slider to "behave" itself without causing errors when 
       * placed as an item in a menu.
       * 
       * @instance
       * @param {boolean} selected
       */
      _setSelected: function alfresco_documentlibrary_AlfGalleryViewSlider___setSelected(selected) {
         domClass.toggle(this.domNode, "dijitMenuItemSelected", selected);
      },
      
      /**
       * This is called whenever the control is displayed to ensure that sizes are initialised.
       *  
       * @instance
       * @fires ALF_DOCLIST_SET_GALLERY_COLUMNS
       */
      onControlDisplayed: function alfresco_documentlibrary_AlfGalleryViewSlider__onControlDisplayed() {
         this.alfPublish("ALF_DOCLIST_SET_GALLERY_COLUMNS", {
            value: this.getColumnsFromSliderValue(this.value)
         });
      }
   });
});