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
 * @module alfresco/renderers/Like
 * @extends module:alfresco/renderers/Toggle
 * @mixes module:alfresco/services/_RatingsServiceTopicMixin
 * @autor Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Toggle",
        "alfresco/services/_RatingsServiceTopicMixin",
        "dojo/text!./templates/Like.html",
        "dojo/_base/lang",
        "dojo/html"], 
        function(declare, Toggle, _RatingsServiceTopicMixin, template, lang, html) {

   return declare([Toggle, _RatingsServiceTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Like.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Like.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Like.css"}]
       */
      cssRequirements: [{cssFile:"./css/Like.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string}
       * @default ""
       */
      onLabel: "",
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string} 
       * @default "like.add.label"
       */
      offLabel: "like.add.label",
      
      /**
       * The tooltip to show when the toggle is on
       * @instance
       * @type {string}
       * @default "like.remove.tooltip"
       */
      onTooltip: "like.remove.tooltip",
      
      /**
       * The tooltip to show when the toggle is on. Override this to add a specific image for the "on" state.
       * 
       * @instance
       * @type {string} 
       * @default "like.add.tooltip"
       */
      offTooltip: "like.add.tooltip",
      
      /**
       * The CSS class to apply for the on display
       * 
       * @instance
       * @type {string} 
       * @default "like"
       */
      toggleClass: "like",
      
      /**
       * Extends to add the count of all likes.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Like__postMixInProperties() {
         // Set up the toggle topics..
         // If no instantiation overrides have been provided then just default to the standard topics
         // provided by the "alfresco/services/_RatingsServiceTopicMixin" class...
         this.toggleOnTopic = (this.toggleOnTopic != null) ? this.toggleOnTopic : this.addRatingTopic;
         this.toggleOnSuccessTopic = (this.toggleOnSuccessTopic != null) ? this.toggleOnSuccessTopic : this.addRatingSuccessTopic;
         this.toggleOnFailureTopic = (this.toggleOnFailureTopic != null) ? this.toggleOnFailureTopic : this.addRatingFailureTopic;
         this.toggleOffTopic = (this.toggleOffTopic != null) ? this.toggleOffTopic : this.removeRatingTopic;
         this.toggleOffSuccessTopic = (this.toggleOffSuccessTopic != null) ? this.toggleOffSuccessTopic : this.removeRatingSuccessTopic;
         this.toggleOffFailureTopic = (this.toggleOffFailureTopic != null) ? this.toggleOffFailureTopic : this.removeRatingFailureTopic;
         
         // Perform the standard setup...
         this.inherited(arguments);

         // Set the current number of likes...
         this.likeCount = lang.getObject(this.likeCountProperty, false, this.currentItem);
         if (this.likeCount == null)
         {
            this.likeCount = 0;
         }
      },
      
      /**
       * The dot-notation property to use for the count of comments. Can be overridden.
       *
       * @instance
       * @type {string}
       * @default "node.properties.fm:commentCount"
       */
      likeCountProperty: "likes.totalLikes",

      /**
       * Sets a default dot-notation property in the current item to use to render the initial state.
       *
       * @instance
       * @type {string}
       * @default "likes.isLiked"
       */
      propertyToRender: "likes.isLiked",

      /**
       * Called whenever the "toggleOnSuccessTopic" attribute is published on
       * @instance
       */
      onToggleOnSuccess: function alfresco_renderers_Toggle__onToggleOnSuccess(payload) {
         this.inherited(arguments);
         html.set(this.countNode, payload.response.data.ratingsCount.toString());
      },
      
      /**
       * Called whenever the "toggleOffSuccessTopic" attribute is published on
       * @instance
       */
      onToggleOffSuccess: function alfresco_renderers_Toggle__onToggleOffSuccess(payload) {
         this.inherited(arguments);
         html.set(this.countNode, payload.response.data.ratingsCount.toString());
      }
   });
});