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
 * This widget can be used to dynamically update the rendered value of a [Title]{@link module:alfresco/header/Title}
 * widget. It was created so that it would be possible a title rendered by one Surf Component to be modified
 * from within another Surf Component. It is not expected to be commonly used. Ideally all Aikau widgets should be
 * rendered in a single Surf Component.
 * 
 * @module alfresco/header/SetTitle
 * @extends external:dijit/_WidgetBase
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "alfresco/core/Core",
        "alfresco/core/topics"], 
        function(declare, _WidgetBase, AlfCore, topics) {
   
   /**
    * The purpose of this widget is to allow the page title (controlled by "alfresco/header/Title" to be
    * set after the title has been initially rendered. This is particularly important for pages that are
    * being rendered in "hybrid" mode (where the default header and footer are automatically displayed).
    * Normally a page title is taken from the Surf Page object - however, since both the "hybrid" and "full"
    * page types re-use a generic Page and Template it is not possible set a specific title. Using this
    * widget allows the page title to be easily set.
    */
   return declare([_WidgetBase, AlfCore], {

      /**
       * The title to set.
       * 
       * @instance
       * @type {string}
       * @default
       */
      title: "",

      /**
       * Indicates whether or not the browser title prefix as defined by
       * [browserTitlePrefix]{@link module:alfresco/header/Title#browserTitlePrefix} should be hidden
       * or not.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.73
       */
      hideBrowserTitlePrefix: false,
      
      /**
       * A new prefix to replace the one defined by
       * [browserTitlePrefix]{@link module:alfresco/header/Title#browserTitlePrefix}.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.73
       */
      browserTitlePrefix: null,

      /**
       * Publishes a request to update the title of the page.
       * 
       * @instance
       * @fires module:alfresco/core/topics#UPDATE_PAGE_TITLE
       */
      postCreate: function alfresco_header_SetTitle__postCreate() {
         this.alfPublish(topics.UPDATE_PAGE_TITLE, {
            title: this.message(this.title),
            hideBrowserTitlePrefix: this.hideBrowserTitlePrefix,
            browserTitlePrefix: this.browserTitlePrefix
         });
      }
   });
});