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
 * @module alfresco/documentlibrary/AlfTagFilters
 * @extends module:alfresco/documentlibrary/AlfDocumentFilters
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/AlfDocumentFilters", 
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/on",
        "dijit/registry",
        "alfresco/documentlibrary/AlfDocumentFilter"], // Referenced in this.createWidget call, so must be explicitly included here
        function(declare, AlfDocumentFilters, _AlfDocumentListTopicMixin, ObjectTypeUtils, topics, lang, array, domConstruct, domClass, on, registry) {

   return declare([AlfDocumentFilters, _AlfDocumentListTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfDocumentFilters.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfTagFilters.properties"}],
      
      /**
       * @instance
       * @type {string}
       * @default
       */
      filterPrefsName: "docListTagFilterPref",
      
      /**
       * Overrides the inherited hash parameter name to use for the filter to make it "tag"
       *
       * @instance
       * @type {string}
       * @default
       */
      paramName: "tag",

      /**
       * The ID of the site to use on tag query requests. This should be provided in conjunction 
       * with [containerId]{@link module:alfresco/documentlibrary/AlfTagFilters#containerId} as
       * an alternative to [rootNode]{@link module:alfresco/documentlibrary/AlfTagFilters#rootNode}
       *
       * @instance
       * @type {string}
       * @default
       */
      siteId: null,

      /**
       * The ID of the container to use on tag query requests (e.g. "documentlibrary"). This
       * is the name of the folder that is being queried within a specific site. This should be provided 
       * in conjunction with [siteId]{@link module:alfresco/documentlibrary/AlfTagFilters#siteId} as
       * an alternative to [rootNode]{@link module:alfresco/documentlibrary/AlfTagFilters#rootNode}
       *
       * @instance
       * @type {string}
       * @default
       */
      containerId: null,

      /**
       * The root node to base tag queries on. This should be provided as an alternative to 
       * [siteId]{@link module:alfresco/documentlibrary/AlfTagFilters#siteId} and 
       * [containerId]{@link module:alfresco/documentlibrary/AlfTagFilters#containerId}
       *
       * @instance
       * @type {string}
       * @default
       */
      rootNode: null,

      /**
       * Overrides the mixed-in value so that a tag specific topic is published
       *
       * @instance
       * @type {string}
       * @default
       */
      filterSelectionTopic: topics.DOCUMENTLIST_TAG_CHANGED,

      /**
       * This topic is used to request that a node should be rated (the details should be supplied
       * as the publication payload).
       *
       * @instance
       * @type {string}
       * @default
       * @listens module:alfresco/core/topics#TAG_QUERY
       * @event
       */
      tagQueryTopic: topics.TAG_QUERY,

      /**
       * Called immediately after instantiation and before any processing
       * 
       * @instance
       * @listens module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#documentTaggedTopic
       */
      postMixInProperties: function alfresco_documentlibrary_AlfTagFilters__postMixInProperties() {
         this.inherited(arguments);
         
         // Subscribe to publications about documents being tagged/untagged...
         this.alfSubscribe(this.documentTaggedTopic, lang.hitch(this, this.onDocumentTagged));

         // Make a request to get the initial set of tags for the current location...
         this.requestTags();
      },
      
      /**
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      onTagQueryResults: function alfresco_documentlibrary_AlfTagFilters__onTagQueryResults(response, originalRequestConfig) {
         // Create the tags...
         if (response && ObjectTypeUtils.isArray(response.tags))
         {
            this.clearAllTags();
            array.forEach(response.tags, this.createTagFilter, this);
         }
         else
         {
            this.alfLog("warn", "A request was made to generate filter tag links, but no 'tags' array attribute was provided", response, originalRequestConfig);
         }
      },

      /**
       * Request the tags for this tags list
       *
       * @instance
       * @fires module:alfresco/documentlibrary/AlfTagFilters#tagQueryTopic
       */
      requestTags: function alfresco_documentlibrary_AlfTagFilters__requestTags(){
         this.alfServicePublish(this.tagQueryTopic, {
            callback: this.onTagQueryResults,
            callbackScope: this,
            siteId: this.siteId,
            containerId: this.containerId,
            rootNode: this.rootNode
         });
      },

      /**
       * Destroys the supplied tag widget.
       *
       * @instance
       * @param {object} widget The widget to destroy
       * @param {number} index The index of the widget
       * @deprecated Since 1.0.38 - use [clearAllTags]{@link module:alfresco/documentlibrary/AlfTagFilters#clearAllTags} instead.
       */
      clearTags: function alfresco_documentlibrary_AlfTagFilters__clearTags(widget, /*jshint unused:false*/ index) {
         if (typeof widget.destroy === "function") {
            widget.destroy();
         }
      },
      
      /**
       * Clears the current tags
       * 
       * @instance
       */
      clearAllTags: function alfresco_documentlibrary_AlfTagFilters__clearAllTags() {
         var oldTags = registry.findWidgets(this.contentNode);
         array.forEach(oldTags, function(tagWidget) {
            tagWidget.destroy();
         });
      },

      /**
       * Creates a new [filter widget]{@link module:alfresco/documentlibrary/AlfDocumentFilter} and then calls the
       * [addFilter function]{@link module:alfresco/documentlibrary/AlfDocumentFilters#addFilter} to add it.
       *  
       * @instance
       * @param {{name: string, count: number}} tagData The data to create the tag with.
       */
      createTagFilter: function alfresco_documentlibrary_AlfTagFilters__createTagFilter(tagData) {
         if (tagData && 
             tagData.name &&
             tagData.count)
         {
            var tagFilter = this.createWidget({
               name: "alfresco/documentlibrary/AlfDocumentFilter",
               config: {
                  filterSelectionTopic: this.filterSelectionTopic,
                  label: this.message("filter.tag.label", {"0": tagData.name, "1": tagData.count}),
                  filter: tagData.name,
                  description: this.message("filter.tagged.label", {"0": tagData.name})
               }
            });
            this.addFilter(tagFilter);
         }
         else
         {
            this.alfLog("warn", "It is not possible to create a filter tag without 'name' and 'count' attributes", tagData);
         }
      },

      /**
       * Used to keep track of the current set of filter tags.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      currentTagFilters: null,
      
      /**
       * Handles documents being tagged and recreates the tags list
       * 
       * @instance
       * @param {object} payload The publish payload
       */
      onDocumentTagged: function alfresco_documentlibrary_AlfTagFilters__onDocumentTagged(/*jshint unused:false*/ payload) {
         this.clearAllTags();
         this.requestTags();
      },
      
      /**
       * @instance
       * @param {string} tag The tag to check against
       * @param {object} tagFilter One of the existing filters to compare against
       * @param {number} index The index of the tag filter being compared.
       */
      compareTags: function alfresco_documentlibrary_AlfTagFilters__compareTags(tag, tagFilter, /*jshint unused:false*/ index) {
         return tagFilter.filterData === tag;
      }
   });
});