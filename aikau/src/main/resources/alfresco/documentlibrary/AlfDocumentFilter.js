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
 * Represents an individual filter link. Should be added to a JSON model as a child widget of a
 * [AlfDocumentFilters widget]{@link module:alfresco/documentlibrary/AlfDocumentFilters}.
 * 
 * @module alfresco/documentlibrary/AlfDocumentFilter
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/AlfDocumentFilter.html",
        "alfresco/core/Core",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/on"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, template,  AlfCore, _AlfDocumentListTopicMixin, lang, array, domConstruct, domClass, on) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, AlfCore, _AlfDocumentListTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfDocumentFilter.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfDocumentFilter.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfDocumentFilter.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfDocumentFilter.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * Indicates that the filter should be hidden. This will be set to "true" if any required data is missing
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      hide: false,
      
      /**
       * The filter (or more accurately the filterId) for this filter
       * 
       * @instance
       * @type {string}
       * @default null
       */
      filter: null,
      
      /**
       * Additional data for the filter (appended after the filter with a bar, e.g. tag|sometag)
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      filterData: "",
      
      /**
       * Sets up the attributes required for the HTML template.
       * @instance
       */
      postMixInProperties: function alfresco_documentlibrary_AlfDocumentFilter__postMixInProperties() {
         if (this.label != null && this.filter != null)
         {
            this.label = this.encodeHTML(this.message(this.label));
            if (this.description != null)
            {
               this.description = this.encodeHTML(this.message(this.description));
            }
         }
         else
         {
            // Hide the filter if there is no label or no link...
            this.alfLog("warn", "Not enough information provided for filter. It will not be displayed", this);
            this.hide = true;
         }
      },
      
      /**
       * @instance
       * @listens hashChangeTopic
       */
      postCreate: function alfresco_documentlibrary_AlfDocumentFilter__postCreate() {
         if (this.hide == true)
         {
            domClass.add(this.domNode, "hidden");
         }
         // Listen to changes in the filter so that the widget can provide additional information...
         // Only do this when useHash is set to true. This means that when hashing is used the 
         // description will be published (this is done for the benefit of breadcrumb trails or other
         // widgets that indicate currently selected filters)...
         if (this.description != null && this.useHash === true)
         {
            this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, "onClick"));
         }
      },

      /**
       *
       *
       * @instance
       * @param {object} evt The click event
       */
      onClick: function alfresco_documentlibrary_AlfDocumentFilter__onClick(evt) {
         this.alfPublish(this.filterSelectionTopic, {
            value: this.filter,
            description: this.description
         });
      }
   });
});