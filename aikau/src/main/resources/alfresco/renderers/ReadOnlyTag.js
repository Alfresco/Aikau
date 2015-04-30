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
 * This is the default tag used by the [Tags renderer]{@link module:alfresco/renderers/Tags} and is used to represent a read only
 * representation of a previously added tag.
 *  
 * @module alfresco/renderers/ReadOnlyTag
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/services/_NavigationServiceTopicMixin",
        "dojo/text!./templates/ReadOnlyTag.html",
        "alfresco/core/Core",
        "alfresco/navigation/Link"], 
        function(declare, _WidgetBase, _TemplatedMixin, _NavigationServiceTopicMixin, template, AlfCore, Link) {

   return declare([_WidgetBase, _TemplatedMixin, _NavigationServiceTopicMixin, AlfCore], {
      
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
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
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
       * @default null
       */
      tagValue: null,
      
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
               type: this.hashPath,
               url: "tag=" + this.tagName
            }
         });
         link.placeAt(this.tagNode, "last");
      }
   });
});