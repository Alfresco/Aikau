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
 * This layout widget can be wrapped around any [paginated list]{@link module:alfresco/lists/AlfSortablePaginatedList}
 * configured to use [infinite scrolling]{@link module:alfresco/lists/AlfList#useInfiniteScroll] 
 * that is expected to grow taller than the height of its containing widget. It will automatically update its parent
 * widget to publish events as the bottom of the scrolling area is reached which will in turn cause the list to request
 * the next page of data. If the list is only constrained by the height of the browser then the
 * [InfiniteScrollService]{@link module:alfresco/services/InfiniteScrollService} should be used instead.
 *
 * @example <caption>List inside a [FixedHeaderFooter]{@link module:alfresco/layout/FixedHeaderFooter} widget</caption>
 * {
 *   name: "alfresco/layout/FixedHeaderFooter",
 *   config: {
 *     height: "200px",
 *     widgets: [
 *       {
 *         name: "alfresco/layout/InfiniteScrollArea",
 *         config: {
 *           widgets: [
 *             {
 *               name: "alfresco/lists/AlfSortablePaginatedList"
 *               config: {
 *                 useInfiniteScroll: true,
 *                 widgets: [
 *                   // Declare view here
 *                 ]
 *               }
 *             }
 *           ]
 *         }
 *       }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/layout/InfiniteScrollArea
 * @extends module:alfresco/core/ProcessWidgets
 * @mixes module:alfresco/services/InfiniteScrollService
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/ProcessWidgets",
        "alfresco/services/InfiniteScrollService"], 
        function(declare, ProcessWidgets, InfiniteScrollService) {
   
   return declare([ProcessWidgets, InfiniteScrollService], {
      
      /**
       * The CSS class (or a space separated list of classes) to include in the DOM node.
       * 
       * @instance
       * @type {string}
       * @default "alfresco-layout-InfiniteScrollArea"
       */
      baseClass: "alfresco-layout-InfiniteScrollArea",

      /**
       * This overrides the [inherited default]{@link module:alfresco/services/InfiniteScrollService#_deferEventListenerRegistration}
       * to ensure that the [registerEventListeners function]{@link module:alfresco/core/Events#registerEventListeners} is not called.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      _deferEventListenerRegistration: true,

      /**
       * Extends the [inherited function]{@link module:alfresco/core/ProcessWidgets#postCreate} to
       * set the mixed in [element]{@link module:alfresco/core/Events#scrollElement}
       * to detect scroll position on
       *
       * @instance
       */
      postCreate: function alfresco_layout_InfiniteScrollArea__postCreate() {
         this.inherited(arguments);

         // Set the scrollElement to be the element containing this widget (this is expect to have the scroll
         // bars)...
         this.scrollElement = this.domNode.parentNode;
         this.registerEventListeners();
      }
   });
});