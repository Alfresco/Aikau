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
 * This is the default tag used by the [Tags renderer]{@link module:alfresco/renderers/Tags} and is used to represent a read only
 * representation of a previously added tag.
 *  
 * @module alfresco/renderers/ReadOnlyTag
 * @extends module:aikau/core/BaseWidget
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/services/_NavigationServiceTopicMixin",
        "alfresco/enums/urlTypes",
        "alfresco/navigation/Link"], 
        function(declare, BaseWidget, _NavigationServiceTopicMixin, urlTypes, Link) {

   return declare([BaseWidget, _NavigationServiceTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/ReadOnlyTag.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/ReadOnlyTag.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/ReadOnlyTag.css"}]
       */
      cssRequirements: [{cssFile:"./css/ReadOnlyTag.css"}],
      
      /**
       * The display name for the tag.
       * 
       * @instance
       * @type {string}
       * @default 
       */
      tagName: null,
      
      /**
       * The value of the tag (typically this will be a nodeRef)
       * 
       * @instance
       * @type {string}
       * @default
       */
      tagValue: null,
      
      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_ReadOnlyTag__createWidgetDom() {
         this.tagNode = this.domNode = document.createElement("span");
         this.domNode.classList.add("alfresco-renderers-ReadOnlyTag");
      },

      /**
       * Determines whether or not the property should only be displayed when the item is hovered over.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_ReadOnlyTag__postCreate() {
         var link = new Link({
            label: this.tagName,
            title: this.message("tag.filter.title", {"0": this.tagName}),
            publishTopic: this.navigateToPageTopic,
            publishPayload: {
               type: urlTypes.HASH,
               url: "tag=" + this.tagName
            }
         });
         link.placeAt(this.tagNode, "last");
      }
   });
});