/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * @module alfresco/lists/views/layouts/HeaderCell
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/HeaderCell.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/query",
        "dojo/dom-attr"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, lang, domClass, query, domAttr) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/HeaderCell.css"}]
       */
      cssRequirements: [{cssFile:"./css/HeaderCell.css"}],

      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Indicates whether or not this header can actually be used to trigger sort requests.
       * 
       * @instance
       * @type boolean
       * @default false
       */
      sortable: false,

      /**
       * Indicate whether or not this cell is currently being used as the sort field.
       *
       * @instance
       * @type boolean
       * @default false
       */
      usedForSort: false,

      /**
       * Indicates whether or not the column headed by this cell is sorted in ascending order or not.
       * This value is only relevant when the [usedForSort]{@link module:alfresco/lists/views/layouts/HeaderCell#usedForSort}
       * attribute is true.
       * 
       * @instance
       * @type boolean
       * @default false
       */
      sortedAscending: false,

      /**
       * The value to publish to sort on.
       *
       * @instance
       * @type {string}
       * @default null
       */
      sortValue: null,

      /**
       * The tool tip to display.
       *
       * @instance
       * @type {string}
       * @default null
       */
      toolTipMsg: null,

      /**
       * Optional accessibility scope.
       *
       * @instance
       * @type {string}
       * @default null
       */
      a11yScope: null,

      /**
       * Optional alt text for the sort ascending icon
       *
       * @instance
       * @type {string}
       * @default null
       */
      sortAscAlt: null,

      /**
       * Optional alt text for the sort descending icon
       *
       * @instance
       * @type {string}
       * @default null
       */
      sortDescAlt: null,

      /**
       * @instance
       */
      postMixInProperties: function alfresco_lists_views_layouts_HeaderCell__postMixInProperties() {
         if (this.label !== null)
         {
            this.label = this.message(this.label);
         }
         this.currentItem = {};
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_HeaderCell__postCreate() {

         this.alfSubscribe("ALF_DOCLIST_SORT", lang.hitch(this, this.onExternalSortRequest));
         this.alfSubscribe("ALF_DOCLIST_SORT_FIELD_SELECTION", lang.hitch(this, this.onExternalSortRequest));

         domAttr.set(this.ascendingSortNode, "alt", this.sortAscAlt ? this.sortAscAlt : "");
         domAttr.set(this.descendingSortNode, "alt", this.sortDescAlt ? this.sortDescAlt : "");

         if (this.sortable === false || this.usedForSort === false)
         {
            this.sortIcon("nil");
         }
         else
         {
            this.sortIcon(this.sortedAscending === false ? "desc" : "asc");
         }

         if(this.additionalCssClasses)
         {
            domClass.add(this.domNode, this.additionalCssClasses);
         }

         if(this.a11yScope)
         {
            this.addA11yScope(this.a11yScope);
         }
      },

      /**
       * Focuses the domNode. This has been added to support the dijit/_KeyNavContainer functions mixed into 
       * the [document library views]{@link module:alfresco/lists/views/AlfListView} to 
       * allow easier keyboard navigation.
       * 
       * @instance
       */
      focus: function alfresco_lists_views_layouts_HeaderCell__focus() {
         this.domNode.focus();
      },

      /**
       * This function is called whenever the header cell is clicked. It publishes a request to 
       * resort the current data and updates its display
       *
       * @instance
       * @param {object} evt The click event
       */
      onSortClick: function alfresco_lists_views_layouts_HeaderCell__onSortClick(evt) {
         if (this.sortable === true)
         {
            this.alfLog("log", "Sort request received");

            // If currently NOT being used for sort then we start with ascending
            if (this.usedForSort === false)
            {
               this.usedForSort = true;
               this.sortedAscending = true;
               this.sortIcon("asc");
            }

            // If we are already sorting on this column and direction is ascending then we want descending
            else if (this.sortedAscending === true)
            {
               this.sortIcon("desc");
               this.sortedAscending = false;
            }

            // Otherwise we want sort by ascending
            else
            {
               this.sortIcon("asc");
               this.sortedAscending = true;
            }
            this.publishSortRequest();
         }
      },

      /**
       * @instance
       */
      publishSortRequest: function alfresco_lists_views_layouts_HeaderCell__publishSortRequest() {
         this.alfPublish("ALF_DOCLIST_SORT", {
            direction: (this.sortedAscending) ? "ascending" : "descending",
            value: this.sortValue,
            requester: this
         });
      },

      /**
       * This handles external sort requests so that the header cell can match the current 
       * status.
       *
       * @instance
       * @param {object} payload
       */
      onExternalSortRequest: function alfresco_lists_views_layouts_HeaderCell__onExternalSortRequest(payload) {
         var requester = lang.getObject("requester", false, payload);
         if (requester !== this)
         {
            var value = lang.getObject("value", false, payload);
            if (value !== null)
            {
               if (value === this.sortValue)
               {
                  this.usedForSort = true;
                  this.sortIcon(this.sortedAscending === true ? "asc" : "desc");
               }
               else
               {
                  // A different field has been used for sorting, hide the sort icons and update the status...
                  this.usedForSort = false;
                  this.sortIcon("nil");
               }
            }

            var direction = lang.getObject("direction", false, payload);
            if (direction !== null)
            {
               this.sortedAscending = direction === "ascending";
               if (this.usedForSort === true)
               {
                  this.sortIcon(this.sortedAscending === true ? "asc" : "desc");
               }
            }
         }
      },

      /**
       * This controls the display of icons when using sort functionality.
       *
       * @instance
       * @param {string} dir - asc, desc or nil
       */
      sortIcon: function alfresco_lists_views_layouts_HeaderCell__sortIcon(dir) {
         var hideClass = "hidden",
             asn = this.ascendingSortNode,
             dsn = this.descendingSortNode;

         switch(dir)
         {
            case "asc":
               domClass.remove(asn, hideClass);
               domClass.add(dsn, hideClass);
            break;

            case "desc":
               domClass.add(asn, hideClass);
               domClass.remove(dsn, hideClass);
            break;

            default:
               domClass.add(asn, hideClass);
               domClass.add(dsn, hideClass);
            break;
         }
      },

      /**
       * Adds a scope attribute to the header cell if provided.
       *
       * @instance
       */
      addA11yScope: function alfresco_lists_views_layouts_HeaderCell__addA11yScope(scopeStr) {
         if(scopeStr)
         {
            domAttr.set(this.containerNode, "scope", scopeStr);
         }
      }
   });
});