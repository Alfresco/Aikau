/**
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
 * This should be used to wrap a set of [AlfDocumentFilters]{@link module:alfresco/documentlibrary/AlfDocumentFilter}
 * in order to achieve the "twisty" and correct look and feel as expected in a document library.
 *
 * @module alfresco/documentlibrary/AlfDocumentFilters
 * @extends module:alfresco/layout/Twister
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/layout/Twister",
        "dijit/_OnDijitClickMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/text!./templates/AlfDocumentFilters.html",
        "alfresco/documentlibrary/AlfDocumentFilter",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/on"],
        function(declare, Twister, _OnDijitClickMixin, _AlfDocumentListTopicMixin, template,
                 AlfDocumentFilter, lang, array, domConstruct, domClass, on) {
   return declare([Twister, _OnDijitClickMixin, _AlfDocumentListTopicMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfDocumentFilters.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfDocumentFilters.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfDocumentFilters.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfDocumentFilters.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * @instance
       * @type {string}
       * @default "docListFilterPref"
       */
      filterPrefsName: "docListFilterPref",

      /**
       * Extends the inherited function to set up the localized labels for the show more
       * and show less links.
       *
       * @instance
       */
      postMixInProperties: function alfresco_documentlibrary_AlfDocumentFilters__postMixInProperties() {
         this.inherited(arguments);
         if (this.showMoreLabel == null)
         {
            this.showMoreLabel = "showMore.label";
         }
         this.showMoreLabel = this.message(this.showMoreLabel);
         if (this.showLessLabel == null)
         {
            this.showLessLabel = "showLess.label";
         }
         this.showLessLabel = this.message(this.showLessLabel);
      },

      /**
       * Overrides the inherited function to iterate over the processed widgets and call
       * the 'addFilter' function passing each one as an argument.
       *
       * @instance
       * @param {object[]} widgets The widgets that were created.
       */
      allWidgetsProcessed: function alfresco_documentlibrary_AlfDocumentFilters__allWidgetsProcessed(widgets) {
         array.forEach(widgets, lang.hitch(this, this.addFilter));
         if (this.moreFiltersList != null)
         {
            domClass.remove(this.showMoreNode, "hidden");
         }
      },

      /**
       * Adds supplied widget to the 'contentNode' if it inherits from 'alfresco/documentlibrary/AlfDocumentFilter'
       *
       * @instance
       * @param {object} widget The widget to be added
       * @param {integer} insertIndex The index to add the widget at
       */
      addFilter: function alfresco_documentlibrary_AlfDocumentFilters__addFilter(widget, insertIndex) {
         if (widget.isInstanceOf(AlfDocumentFilter))
         {
            widget.placeAt(this.contentNode);
         }
         else
         {
            this.alfLog("warn", "Tried to add a widget that does not inherit from 'alfresco/documentlibrary/AlfDocumentFilter'", widget);
         }
      },

      /**
       *
       * @instance
       * @type {array}
       * @default null
       */
      moreFiltersList: null,

      /**
       * Add a filter than will be initially hidden but will be revealed when clicking on the "More Choices"
       * link
       *
       * @instance
       */
      addMoreFilter: function alfresco_documentlibrary_AlfDocumentFilters__addMoreFilter(widget) {
         if (this.moreFiltersList == null)
         {
            this.moreFiltersList = [];
         }

         domClass.add(widget.domNode, "moreOption hidden");
         this.moreFiltersList.push(widget);
      },

      /**
       * @instance
       */
      onShowMoreClick: function alfresco_documentlibrary_AlfDocumentFilters__onShowMoreClick(evt) {
         domClass.add(this.showMoreNode, "hidden");
         domClass.remove(this.showLessNode, "hidden");

         array.forEach(this.moreFiltersList, function(widget, index) {
            domClass.remove(widget.domNode, "hidden");
         }, this);
      },

      /**
       *
       * @instance
       */
       onShowLessClick: function alfresco_documentlibrary_AlfDocumentFilters__onShowMoreClick(evt) {
         domClass.remove(this.showMoreNode, "hidden");
         domClass.add(this.showLessNode, "hidden");
         array.forEach(this.moreFiltersList, function(widget, index) {
            domClass.add(widget.domNode, "hidden");
         }, this);
      },
   });
});