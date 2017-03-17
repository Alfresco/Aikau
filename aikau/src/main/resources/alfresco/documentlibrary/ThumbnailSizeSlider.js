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
 * 
 * @module alfresco/documentlibrary/ThumbnailSizeSlider
 * @extends external:dijit/form/HorizontalSlider
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/lists/views/_AlfAdditionalViewControlMixin
 * @mixes module:alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 * @since 1.0.40
 */
define(["dojo/_base/declare",
        "dijit/form/HorizontalSlider",
        "alfresco/core/Core",
        "alfresco/lists/views/_AlfAdditionalViewControlMixin",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "alfresco/core/topics",
        "dojo/dom-class"], 
        function(declare, HorizontalSlider, AlfCore, _AlfAdditionalViewControlMixin, _PreferenceServiceTopicMixin, 
                 topics, domClass) {
   
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
       * The preference property to use for retrieving and setting the users preferred 
       * thumbnail size
       *
       * @instance
       * @type {string}
       * @default
       */
      preferenceProperty: "org.alfresco.share.documentList.thumbnailSize",

      /**
       * The number of steps (including the beginning and end positions) on the slider
       * 
       * @instance
       * @type {integer}
       * @default
       */
      discreteValues: 16,
         
      /**
       * The minimum value on the slider (this will represent the smallest size in pixels that a thumbnail
       * can be decreased to).
       * 
       * @instance
       * @type {number} 
       * @default
       */
      minimum: 100,
      
      /**
       * The maximum value on the slider (this will represent the largest size in pixels that a thumbnail
       * can be increased to).
       * 
       * @instance
       * @type {integer}
       * @default
       */
      maximum: 800,
      
      /**
       * Indicates whether or not to show the bigger/smaller buttons at either end of the slider
       * @instance
       * @type {boolean}
       * @default
       */
      showButtons: true,
      
      /**
       * The initial thumbnail size (in pixels).
       * 
       * @instance
       * @type {number}
       * @default
       */
      value: 100,

      /**
       * 
       * @instance
       * @fires module:alfresco/services/_PreferenceServiceTopicMixin#getPreferenceTopic
       */
      postCreate: function alfresco_documentlibrary_ThumbnailSizeSlider__postCreate() {
         this.inherited(arguments);
         this.set("value", this.value);
         domClass.add(this.domNode, "alfresco-documentlibrary-AlfGalleryViewSlider");
         this.alfServicePublish(this.getPreferenceTopic, {
            preference: this.preferenceProperty,
            callback: this.onPreferences,
            callbackScope: this
         });
      },
      
      /**
       * This is called when user preferences are provided. 
       * 
       * @instance
       * @param {number} value The size of thumbnails to use
       * @fires module:alfresco/core/topics#SET_THUMBNAIL_SIZE
       */
      onPreferences: function alfresco_documentlibrary_ThumbnailSizeSlider__onPreferences(value) {
         this.set("value", value);
         this.alfPublish(topics.SET_THUMBNAIL_SIZE, {
            value: this.value
         });
      },

      /**
       *
       * @instance
       * @param {number} value The value provided from the change to the slider.
       * @fires module:alfresco/services/_PreferenceServiceTopicMixin#setPreferenceTopic
       * @fires module:alfresco/core/topics#SET_THUMBNAIL_SIZE
       */
      onChange: function alfresco_documentlibrary_ThumbnailSizeSlider__onChange(value) {
         this.alfPublish(topics.SET_THUMBNAIL_SIZE, {
            value: value
         });
         this.alfServicePublish(this.setPreferenceTopic, {
            preference: this.preferenceProperty,
            value: value
         });
         this.value = value;
      },
      
      /**
       * This method is required in order for the slider to "behave" itself without causing errors when 
       * placed as an item in a menu.
       * 
       * @instance
       * @param {boolean} selected
       */
      _setSelected: function alfresco_documentlibrary_ThumbnailSizeSlider___setSelected(selected) {
         domClass.toggle(this.domNode, "dijitMenuItemSelected", selected);
      },
      
      /**
       * This is called whenever the control is displayed to ensure that sizes are initialised.
       *  
       * @instance
       * @fires module:alfresco/core/topics#SET_THUMBNAIL_SIZE
       */
      onControlDisplayed: function alfresco_documentlibrary_ThumbnailSizeSlider__onControlDisplayed() {
         this.alfPublish(topics.SET_THUMBNAIL_SIZE, {
            value: this.value
         });
      }
   });
});